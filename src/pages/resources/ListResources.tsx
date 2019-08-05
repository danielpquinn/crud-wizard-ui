import { AxiosResponse } from "axios";
import { get, startCase } from "lodash";
import * as React from "react";
import { Alert } from "src/components/Alert";
import { Button } from "src/components/Button";
import { JsonViewer } from "src/components/JsonViewer";
import { Loading } from "src/components/Loading";
import { Pagination } from "src/components/Pagination";
import { ParamForm } from "src/components/ParamForm";
import { maxToggleColumnCheckboxWidth } from "src/constants";
import { getErrorMessage } from "src/lib/error";
import { getNumColumns } from "src/lib/layout";
import { getProjectManager } from "src/lib/ProjectManager";
import { findOperationObject, IOperationObjectWithPathAndMethod, IOperationParameters, operate } from "src/lib/swagger";
import { getWindowManager, WindowType } from "src/lib/WindowManager";
import { ListSettings } from "src/pages/resources/ListResourcesSettings";
import { IBreadcrumb } from "src/types/breadcrumb";
import { IResource } from "src/types/resource";
import { Response, Schema } from "src/types/swagger";

interface IVisibleColumns {
  [column: string]: boolean;
}

interface IProps {
  breadcrumbs: IBreadcrumb[];
  resourceId: string;
}

interface IState {
  axiosResponse: AxiosResponse | null;
  currentPage: number;
  totalResults: number | null;
  errorMessage: string | null;
  defaultFormValues: { [key: string]: string }
  showSettings: boolean;
  visibleColumns: IVisibleColumns;
}

export class ListResources extends React.Component<IProps, IState> {
  private static primativeTypes = new Set(["string", "number", "boolean"]);
  private myRef: React.RefObject<HTMLDivElement>;
  private params: IOperationParameters;
  private resource: IResource | undefined;
  private operation: IOperationObjectWithPathAndMethod | null;
  private schema: Schema | undefined;
  
  constructor(props: IProps) {
    super(props);
    this.myRef = React.createRef();
    const errorMessage = this.initialize();
    const visibleColumns = {};

    if (this.resource) {
      visibleColumns[this.resource.nameField] = true;
      visibleColumns[this.resource.idField] = true;
    }

    const defaultFormValues = {};

    props.breadcrumbs.forEach((breadcrumb) => {
      defaultFormValues[breadcrumb.param] = breadcrumb.value;
    });

    this.params = {};

    props.breadcrumbs.forEach((breadcrumb) => {
      this.params[breadcrumb.param] = breadcrumb.value;
    });

    this.state = {
      axiosResponse: null,
      currentPage: 1,
      totalResults: null,
      defaultFormValues,
      errorMessage,
      showSettings: false,
      visibleColumns
    };
  }

  public componentDidMount(): void {
    this.loadPage(1);
  }

  public render() {
    const {
      axiosResponse,
      defaultFormValues,
      errorMessage,
      showSettings,
      visibleColumns,
      currentPage,
      totalResults
    } = this.state;
    const columns = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    const properties = this.schema && this.schema.properties;

    if (errorMessage) {
      return <Alert level="danger">{errorMessage}</Alert>
    }

    if (!this.resource || !this.schema) {
      return null;
    }

    const idField = this.resource.idField;
    const { getListItems } = this.resource;
    const columnWidth = visibleColumns ? Math.floor(100 / (Object.keys(visibleColumns).length || 1)) : 100;
    let table: React.ReactNode;
    let rows: React.ReactNode[] | null = null;
    let error: React.ReactNode | null = null;

    if (axiosResponse && axiosResponse.status >= 400) {
      error = <Alert level="danger"><JsonViewer value={axiosResponse.data}/></Alert>;
    } else if (axiosResponse && axiosResponse.data) {
      let data: any[] = [];

      if (getListItems) {
        data = getListItems(axiosResponse);
      } else {
        data = axiosResponse.data;
      }

      rows = data.map((item: any, i: number) => {
        return (
          <tr key={i}>{
            columns.map((column: string) => {

              if (!this.resource) {
                return null;
              }
              
              const primitive = ListResources.primativeTypes.has(typeof item[column]);
              const value = primitive ? item[column] : JSON.stringify(item[column]);

              return (
                <td
                  title={value}
                  style={{ width: `${columnWidth}%` }}
                  key={column}
                >
                  {column === this.resource.nameField ? (
                    <a href="javascript:void(0);" onClick={() => this.onClickName(item[idField]) }>{value || <em>None</em>}</a>
                  ) : value}
                </td>
              );
            })
          }</tr>
        );
      });
    }

    const headerCells = columns.map((column: string) => {
      return (
        <th
          title={startCase(column)}
          style={{ width: `${columnWidth}%` }}
          key={column}
        >
          {startCase(column)}
        </th>
      );
    });

    table = (
      <table className="table table-sm list-table">
        <thead>
          <tr>
            {headerCells}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );

    const toggleColumnRows: React.ReactNode[][] = [];

    if (this.myRef && this.myRef.current && properties) {
      const propertyKeys = Object.keys(properties);
      const numProperties = propertyKeys.length;
      const width = this.myRef.current.clientWidth;
      const numCols = getNumColumns(width, maxToggleColumnCheckboxWidth, numProperties);
      const numRows = Math.ceil(numProperties / numCols);

      for (let i = 0; i < numRows; i += 1) {
        toggleColumnRows.push([]);

        for (let j = 0; j < numCols; j += 1) {
          const key = propertyKeys[i * numCols + j];
          if (key) {
            toggleColumnRows[i].push(
              <td key={key}>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="defaultCheck1"
                    checked={visibleColumns[key]}
                    onChange={() => { this.toggleColumnVisibility(key); }}
                  />
                  <label className="form-check-label">
                    {startCase(key)}
                  </label>
                </div>
              </td>
            );
          }
        }
      }
    }

    return (
      <div ref={this.myRef} className="list-component">
        <h3>{this.resource.namePlural}</h3>
        <div className="d-flex">
          <div className="mr-auto">
            {this.resource.createOperation && (
              <Button size="sm" level="primary" onClick={this.onClickCreate}>Create {this.resource.name}</Button>
            )}
          </div>
          <div>
            <Button level="link" onClick={() => this.loadPage(currentPage)}><i className="zmdi zmdi-refresh zmdi-hc-lg"/></Button>
            <Button level="link" onClick={this.onClickSettings}><i className="zmdi zmdi-settings zmdi-hc-lg"/></Button>
          </div>
        </div>
        <div
          style={{
            height: showSettings ? "auto" : "0px",
            overflow: "hidden",
            visibility: showSettings ? "inherit" : "hidden"
          }}
        >
        <div className="card">
          <div className="card-body">
            <ParamForm
              defaults={defaultFormValues}
              onChange={this.onParamFormChange}
              operation={this.resource.listOperation}
              resource={this.resource}
            />
            <table className="table-toggle-columns">
              <tbody>
              {toggleColumnRows.map((row, i) => {
                return <tr key={i}>{row}</tr>;
              })}
              </tbody>
            </table>
            <p className="text-right">
              <Button onClick={() => this.loadPage(currentPage)} level="primary" size="sm">Apply</Button>
            </p>
          </div>
          </div>
        </div>
        {axiosResponse ? table : <Loading />}
        <Pagination
          onClick={this.loadPage}
          currentPage={currentPage}
          totalResults={totalResults}
          numPerPage={rows ? rows.length : null}
        />
        {error}
        {showSettings && <ListSettings
          onSubmit={(_) => null}
          visibleColumns={visibleColumns}
        />}
      </div>
    );
  }


  private initialize(): string | null {
    const { resourceId } = this.props;
    this.resource = getProjectManager().getResource(resourceId);
    if (!this.resource) {
      return `Could not find resource with id ${resourceId}.`;
    }

    const { listItemSchema, listOperation, spec } = this.resource;
    const resolvedSpec = getProjectManager().getResolvedSpec(spec);
    if (!resolvedSpec) {
      return `Could not find spec with id ${spec}. Please make sure your resources.ts file is correct`;
    }

    this.operation = findOperationObject(resolvedSpec, listOperation);
    
    if (!this.operation) {
      return `Resource ${resourceId} does not have a \`listOperation\` field, cannot render detail view.`;
    }

    if (listItemSchema) {
      this.schema = get(getProjectManager().getResolvedSpec(spec), listItemSchema.split("/"));
    } else {
      const responseSchema = (this.operation.operation.responses["200"] as Response).schema as Schema;
      this.schema = responseSchema.items as Schema;
    }
    
    if (!this.schema) {
      return `GET operation for resource ${resourceId} does not have a schema.`;
    }

    return null;
  }

  private onParamFormChange = (args: IOperationParameters) => {
    this.params = args;
  }

  private onClickSettings = (e: any) => {
    this.toggleShowSettings();
  }

  private toggleShowSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  private toggleColumnVisibility(column: string) {
    const { visibleColumns } = this.state;
    visibleColumns[column] = !visibleColumns[column];
    this.setState({ visibleColumns });
  }

  private onClickName = (id: string) => {
    const { resourceId, breadcrumbs } = this.props;
    const resource = getProjectManager().getResource(resourceId);
    if (!resource) { return; }
    getWindowManager().addWindow(
      `detail:${id}`,
      WindowType.Detail,
      { breadcrumbs, resourceId, id },
      [ "breadcrumbs", "resourceId", "id" ]
    );
    getWindowManager().saveWindows();
  };

  private onClickCreate = () => {
    const { breadcrumbs, resourceId } = this.props;
    getWindowManager().addWindow(`create:${resourceId}`, WindowType.Create, { breadcrumbs, resourceId }, [ "breadcrumbs", "resourceId" ]);
  }

  private loadPage = async (page: number) => {
    if (!this.resource) { return; }
    const { listOperation, spec } = this.resource;
    const { axiosResponse } = this.state;

    const resolvedSpec = getProjectManager().getResolvedSpec(spec);
    if (!resolvedSpec) { return; }

    const addPageParams = getProjectManager().getProject().addPageParams;
    const getTotalResults = getProjectManager().getProject().getTotalResults;

    if (addPageParams && axiosResponse) {
      this.params = addPageParams(page, this.params, axiosResponse);
    }

    this.setState({ axiosResponse: null });

    try {
      const newResponse = await operate(resolvedSpec, listOperation, this.params);
      let totalResults = null;
      if (getTotalResults) {
        totalResults = getTotalResults(newResponse);
      }
      this.setState({
        totalResults,
        axiosResponse: newResponse,
        currentPage: page
      });
    } catch (e) {
      console.error(e);
      this.setState({
        errorMessage: getErrorMessage(e)
      });
    }
  }
}
