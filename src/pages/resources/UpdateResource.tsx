import { AxiosResponse } from "axios";
import { get } from "lodash";
import * as React from "react";
import { Alert } from "src/components/Alert";
import { Button } from "src/components/Button";
import { JsonViewer } from "src/components/JsonViewer";
import { Loading } from "src/components/Loading";
import { ParamForm } from "src/components/ParamForm";
import { getProjectManager } from "src/lib/ProjectManager";
import { findOperationObject, IOperationObjectWithPathAndMethod, IOperationParameters, operate } from "src/lib/swagger";
import { getToastManager } from "src/lib/ToastManager";
import { getWindowManager } from "src/lib/WindowManager";
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
  /**
   * Default values for param form
   */
  axiosResponse: AxiosResponse | null;
  errorMessage: string | null;
}

export class UpdateResource extends React.Component<IProps, IState> {
  private args: IOperationParameters;
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

    let defaults = axiosResponse.data;

    if (this.resource && this.resource.getUpdateFormDefaults) {
      defaults = this.resource.getUpdateFormDefaults(axiosResponse);
    }

    // tslint:disable:jsx-no-lambda

    return this.resource && axiosResponse && properties && this.resource.updateOperation ? (
      <div>

        <h4>Update {this.resource.name}</h4>

        <hr/>

        { defaults && (<ParamForm
          defaults={defaults}
          resource={this.resource}
          operation={this.resource.updateOperation}
          onChange={this.onParamFormChange}
        />)}

        {axiosResponse && axiosResponse.status >= 400 && (
          <Alert level="danger"><JsonViewer value={axiosResponse.data}/></Alert>
        )}

        <Button onClick={this.update} level="primary" size="sm">Update</Button>
      </div>
    ) : null;
  }

  /**
   * Handle param form changes
   */
  private onParamFormChange = (args: IOperationParameters) => {
    this.args = args;
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

    if (axiosResponse.data) {
      this.args = axiosResponse.data;
      if (this.resource.getUpdateFormDefaults) {
        this.args = this.resource.getUpdateFormDefaults(axiosResponse);
      }
    }

    this.setState({ axiosResponse });
  }

  /**
   * Create the resource
   */
  private update = async () => {
    const { breadcrumbs, id } = this.props;

    if (this.resource && this.resource.updateOperation) {
      const resolvedSpec = getProjectManager().getResolvedSpec(this.resource.spec);
      if (!resolvedSpec) { return; }
    
      const args = {};
  
      breadcrumbs.forEach((breadcrumb) => {
        args[breadcrumb.param] = breadcrumb.value;
      });

      args[this.resource.parameterName] = id;

      const mergedArgs = { ...args, ...this.args };

      const axiosResponse = await operate(resolvedSpec, this.resource.updateOperation, mergedArgs);
      if (axiosResponse.status >= 400) {
        this.setState({ axiosResponse });
      } else {
        getWindowManager().removeWindow(`update:${id}`);
        getToastManager().addToast(`Updated ${this.resource.name}`, "success");
      }
    }
  }
}
