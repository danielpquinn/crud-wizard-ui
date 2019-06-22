import { AxiosResponse } from "axios";
import { get, startCase } from "lodash";
import * as React from "react";
import { Alert } from "src/components/Alert";
import { Button } from "src/components/Button";
import { JsonViewer } from "src/components/JsonViewer";
import { Loading } from "src/components/Loading";
import { getProjectManager } from "src/lib/ProjectManager";
import { findOperationObject, IOperationObjectWithPathAndMethod, IOperationParameters, operate } from "src/lib/swagger";
import { getToastManager } from "src/lib/ToastManager";
import { getWindowManager, WindowType } from "src/lib/WindowManager";
import { IBreadcrumb } from "src/types/breadcrumb";
import { IResource } from "src/types/resource";
import { Response, Schema } from "src/types/swagger";

interface IProps {
  breadcrumbs: IBreadcrumb[];
  defaultArgs?: IOperationParameters;
  resourceId: string;
  id: string;
}

interface IState {
  axiosResponse: AxiosResponse | null;
  errorMessage: string | null;
}

export class ResourceDetail extends React.Component<IProps, IState> {
  private resource: IResource | undefined;
  private operation: IOperationObjectWithPathAndMethod | null;
  private schema: Schema | undefined;
  
  constructor(props: IProps) {
    super(props);

    // Initialize state

    const errorMessage = this.initialize();

    this.state = {
      axiosResponse: null,
      errorMessage
    };
  }

  /**
   * Look up the resource, operation and schema necessary to render the detail view. If any are missing display an error message
   */
  public componentDidMount(): void {
    this.load();
  }

  /**
   * Render a resource detail page or an error message if something went wrong
   */
  public render() {
    const { breadcrumbs, id } = this.props;
    const { axiosResponse, errorMessage } = this.state;

    if (!axiosResponse) {
      return <Loading/>;
    }

    if (errorMessage !== null) {
      return <Alert level="danger"><JsonViewer value={errorMessage}/></Alert>;
    }

    if (axiosResponse.status >= 400) {
      return (
        <Alert level="danger"><JsonViewer value={axiosResponse.data}/></Alert>
      );
    }

    const properties = this.schema && this.schema.properties;

    let data = axiosResponse.data;

    if (this.resource && this.resource.getDetailItem) {
      data = this.resource.getDetailItem(axiosResponse);
    }

    // tslint:disable:jsx-no-lambda

    return this.resource && axiosResponse && properties ? (
      <div>
        <h4>{this.resource.name} - {data[this.resource.nameField]}</h4>
        <hr/>
        <div className="row">
          <div className="col">
            <ul className="nav">
              {this.resource.relationships && this.resource.relationships.map((relationship, i) => {
                const relatedResource = getProjectManager().getResource(relationship.resourceId);

                if (!relatedResource) {
                  return null;
                }

                return (
                  <li className="nav-item" key={i}>
                    <a
                      href="javascript:void(0)"
                      className="nav-link"
                      onClick={() => {
                        if (!this.resource) { return; }

                        getWindowManager().addWindow(`list${relatedResource.id}`, WindowType.List, {
                          breadcrumbs: breadcrumbs.concat([{ param: this.resource.parameterName, value: id }]),
                          resourceId: relatedResource.id
                        }, [ "resourceId", "breadcrumbs" ]);
                      }}
                    >
                      {relatedResource.namePlural}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="col text-right">
            {this.resource.deleteOperation && (
              <Button level="link" size="sm" onClick={this.deleteResource}><i className="zmdi zmdi-delete zmdi-hc-lg"/></Button>
            )}
          </div>
        </div>
        <table className="table table-sm">
          <tbody>
            {Object.keys(properties).map((key, i) => {
              const value = data[key];
              const primitive = ["string", "number", "boolean", "undefined"].indexOf(typeof value) >= 0;
              return (
                <tr key={i}>
                  <td><strong>{startCase(key)}</strong></td>
                  <td>{primitive ? value : <JsonViewer value={value}/>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : null;
  }

  private initialize(): string | null {
    const { resourceId } = this.props;

    this.resource = getProjectManager().getResource(resourceId);

    if (!this.resource) {
      return `Could not find resource with id ${resourceId}. Please make sure your resources.ts file is correct`;
    }

    const { getOperation, spec } = this.resource;
    const resolvedSpec = getProjectManager().getResolvedSpec(spec);

    if (!resolvedSpec) {
      return `Could not find spec with id ${spec}. Please make sure your resources.ts file is correct`;
    }

    this.operation = findOperationObject(resolvedSpec, getOperation);
    
    if (!this.operation) {
      return `Resource ${resourceId} does not have a \`getOperation\` field, cannot render detail view. Please make sure your resources.ts file is correct`;
    }

    const responses = this.operation.operation.responses;

    if (this.resource.detailItemSchema) {
      this.schema = get(getProjectManager().getResolvedSpec(spec), this.resource.detailItemSchema.split("/"));
    } else {
      this.schema = ((responses["200"] || responses.default) as Response).schema;
    }
    
    if (!this.schema || !this.schema.properties) {
      return `GET operation for resource ${resourceId} does not have an properties \`schema\` field for it's 200 response, cannot render detail view. Please make sure your resources.ts file is correct`;
    }

    return null;
  }

  private deleteResource = async () => {
    const { breadcrumbs, id } = this.props;

    if (!this.resource || !this.resource.deleteOperation) {
      return;
    }

    const resolvedSpec = getProjectManager().getResolvedSpec(this.resource.spec);
    if (!resolvedSpec) { return; }

    if (this.resource.deleteOperation) {
      const operation = findOperationObject(resolvedSpec, this.resource.deleteOperation);
      if (operation) {
        if (window.confirm("Are you sure you want to delete this resource?")) {
          // tslint:disable
          
          const args = {};

          breadcrumbs.forEach((breadcrumb) => {
            args[breadcrumb.param] = breadcrumb.value;
          });

          args[this.resource.parameterName] = id;

          const axiosResponse = await operate(resolvedSpec, this.resource.deleteOperation, args);

          if (axiosResponse.status >= 400) {
            const message = axiosResponse.data || axiosResponse.statusText || "Could not delete resource";
            this.setState({
              errorMessage: message
            });
          } else {
            getWindowManager().removeWindow(`detail:${this.props.id}`);
            getToastManager().addToast(`Deleted ${this.resource.name}`, "success");
          }
        }
      }
    }
  };

  // tslint:disable:no-console
  private load = async (): Promise<void> => {
    const { breadcrumbs, id } = this.props;

    if (!this.resource || !this.operation) {
      return;
    }
    const resolvedSpec = getProjectManager().getResolvedSpec(this.resource.spec);
    if (!resolvedSpec) { return; }
    
    const args = {};

    breadcrumbs.forEach((breadcrumb) => {
      args[breadcrumb.param] = breadcrumb.value;
    });

    args[this.resource.parameterName] = id;

    this.setState({ axiosResponse: null });

    const axiosResponse = await operate(resolvedSpec, this.resource.getOperation, args);

    this.setState({ axiosResponse });
  }
}
