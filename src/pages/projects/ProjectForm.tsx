import { FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import * as React from "react";
import * as CodeMirror from "react-codemirror";
import { Form as FinalForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { CheckboxInput } from "src/components/inputs/CheckboxInput";
import { CodeInput } from "src/components/inputs/CodeInput";
import { Select } from "src/components/inputs/Select";
import { TextInput } from "src/components/inputs/TextInput";
import { Modal } from "src/components/Modal";
import { getOperationId, getOperations, resolveAllReferences } from "src/lib/swagger";

interface IOption {
  label: string; value: string
}

interface ISpecValue {
  id: string;
  spec: string;
};

interface IProps {
  initialValues: any;
  onSubmit: (values: object) => any;
}

type tabIds = "general" | "specs" | "resources" | "advanced";

interface IState {
  selectedTab: tabIds;
  operationOptions: { [id: string]: IOption[] };
  helpDialog: { title: string, content: React.ReactNode } | null;
}

const getItemsHelpExampleResponse = `{
  data: {
    items: [
      { id: "0", name: "foo" }
    ]
  }
}`;

const getItemsHelpExampleFunction = `function (response) {
  return response.data.items;
}`;

const getItemsHelp = {
  title: "Get List Items Function",
  content: (
    <>
      <p>If you provide a <code>Get List Items</code> function, Your list API response will be passed to this function. The function accepts an <a href="https://github.com/axios/axios#response-schema" target="_blank">Axios response object</a>, and should return an array of items that match the <code>List Item Schema</code> you selected.</p>
      <p>For example, if your API response looks like this:</p>
      <div className="mb-1" style={{ height: "100px" }}>
        <CodeMirror
          value={getItemsHelpExampleResponse}
          options={{
            mode: "text/javascript",
            readOnly: true
          }}
        />
      </div>
      <p>You could provide a function that pulls <code>items</code> out of the response body like this:</p>
      <div className="mb-1" style={{ height: "100px" }}>
        <CodeMirror
          value={getItemsHelpExampleFunction}
          options={{
            mode: "text/javascript",
            readOnly: true
          }}
        />
      </div>
    </>
  )
};

export class ProjectForm extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      operationOptions: {},
      selectedTab: "general",
      helpDialog: null
    };
  }

  public componentDidMount() {
    const { initialValues } = this.props;
    const specs = initialValues && initialValues.specs;
    if (specs) { this.setOperationOptions(specs); }
  }

  public render() {
    const { initialValues, onSubmit } = this.props;
    const { helpDialog, selectedTab, operationOptions } = this.state;

    return (
      <FinalForm
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, form }) => {
          const values: any = form.getState().values || {};
          const specs = values && values.specs || [];
          const resources = values && values.resources || [];
          const specOptions = specs.map((spec: any) => ({ value: spec.id, label: spec.id }));

          return (
            <form onSubmit={handleSubmit} className="card">
              <div className="card-body d-flex p-0">
                <ul className="nav nav-tabs nav-tabs--vertical nav-tabs--left" role="navigation">
                  {this.renderNavItem("General", "general")}
                  {this.renderNavItem(<>Specs <small className="text-muted">({specs.length})</small></>, "specs")}
                  {this.renderNavItem(<>Resources <small className="text-muted">({resources.length})</small></>, "resources")}
                  {this.renderNavItem("Advanced", "advanced")}
                </ul>
                <div className="tab-pane show active">
                  {selectedTab === "general" && (
                    <TextInput name="name" label="Project name" />
                  )}
                  {selectedTab === "specs" && (                 
                    <FieldArray
                      name="specs"
                      render={({ fields }) => (
                        <>
                          {fields.map((name: any, index: number) => (
                            <div className="card mb-4 bg-light" key={index}>
                              <div className="card-header d-flex">
                                <div className="flex-grow-1 mr-3">
                                  <TextInput
                                    name={`${name}.id`}
                                    label="OpenAPI specification file name"
                                    placeholder="e.g. petstore-api.json"
                                  />
                                </div>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  type="button"
                                  onClick={() => fields.remove(index)}
                                >
                                  <i className="zmdi zmdi-delete" />
                                </button>
                              </div>
                              <div className="card-body">
                                <CodeInput
                                  name={`${name}.spec`}
                                  label="OpenAPI specification file (JSON format)"
                                  mode="javascript"
                                  height={600}
                                  onBlur={(_) => {
                                    this.onSpecBlur(form);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                          <button
                            className="btn btn-sm btn-secondary"
                            type="button"
                            onClick={() => fields.push({ id: "" })}
                          >
                            Add OpenAPI Spec
                          </button>
                        </>
                      )}
                    />
                  )}
                  {selectedTab === "resources" && (                  
                    <FieldArray
                      name="resources"
                      render={({ fields }) => (
                        <>
                          {fields.map((name: any, index: number) => {
                            const spec = form.getFieldState(`${name}.spec`);
                            const innerOperationOptions = spec ? operationOptions[spec.value] : [];

                            return (
                              <div className="card mb-4 bg-light" key={index}>
                                <div className="card-header d-flex">
                                  <div className="flex-grow-1 mr-3"><TextInput name={`${name}.name`} label="Resource name" /></div>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                  >
                                    <i className="zmdi zmdi-delete" />
                                  </button>
                                </div>
                                <div className="card-body">
                                  <table className="mb-3 w-100">
                                    <tbody>
                                      <tr>
                                        <td className="text-right pr-1 w-25">OpenAPI Spec<span className="text-info">* <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></span></td>
                                        <td><Select options={specOptions} name={`${name}.spec`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">ID<span className="text-info">* <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></span></td>
                                        <td><TextInput name={`${name}.id`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">ID Field<span className="text-info">* <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></span></td>
                                        <td><TextInput name={`${name}.idField`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Create Operation <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><Select options={innerOperationOptions} name={`${name}.createOperation`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">List Operation<span className="text-info">* <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></span></td>
                                        <td><Select options={innerOperationOptions} name={`${name}.listOperation`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Get Operation <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><Select options={innerOperationOptions} name={`${name}.getOperation`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Update Operation <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><Select options={innerOperationOptions} name={`${name}.updateOperation`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Delete Operation <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><Select options={innerOperationOptions} name={`${name}.deleteOperation`} /></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Parameter Name <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><TextInput name={`${name}.parameterName`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">List Item Schema <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><TextInput name={`${name}.listItemSchema`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Name Plural <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><TextInput name={`${name}.namePlural`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Name Field<span className="text-info">* <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></span></td>
                                        <td><TextInput name={`${name}.nameField`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Detail Item Schema <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><TextInput name={`${name}.detailItemSchema`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Get List Items <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><CodeInput mode="javascript" name={`${name}.getListItems`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Get Detail Item <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><CodeInput mode="javascript" name={`${name}.getDetailItem`}/></td>
                                      </tr>
                                      <tr>
                                        <td className="text-right pr-1">Get Update Form Defaults <a href="javascript:void(0);" onClick={this.showGetListItemsHelp}><i className="zmdi zmdi-info"/></a></td>
                                        <td><CodeInput mode="javascript" name={`${name}.getUpdateFormDefaults`}/></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <FieldArray
                                    name={`${name}.relationships`}
                                    render={(props) => (
                                      <>
                                        <h5>Relationships <small className="text-muted">({props.fields.length})</small></h5>
                                        {props.fields.length ? (
                                          <table className="table table-sm mb-0">
                                            <thead>
                                              <tr>
                                                <th><small>Resource ID</small></th>
                                                <th><small>Field</small></th>
                                                <th><small>Get ID</small></th>
                                                <th><small>Many</small></th>
                                                <th/>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {props.fields.map((innerName: string, innerIndex: number) => (
                                                <tr key={innerIndex}>
                                                  <td><TextInput name={`${innerName}.resourceId`} /></td>
                                                  <td><TextInput name={`${innerName}.field`} /></td>
                                                  <td><TextInput name={`${innerName}.getId`} /></td>
                                                  <td><CheckboxInput name={`${innerName}.many`} /></td>
                                                  <td className="text-right pr-1">
                                                    <button
                                                      className="btn btn-sm btn-link"
                                                      type="button"
                                                      onClick={() => props.fields.remove(innerIndex)}
                                                    >
                                                      <i className="zmdi zmdi-delete" />
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : null}
                                        <div className="text-right">
                                          <button
                                            className="btn btn-sm btn-link"
                                            type="button"
                                            onClick={() => props.fields.push({})}
                                          >
                                            <i className="zmdi zmdi-plus" /> Add Relationship
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            )
                          })}
                          <button
                            className="btn btn-sm btn-secondary"
                            type="button"
                            onClick={() => fields.push({ id: "" })}
                          >
                            <i className="zmdi zmdi-plus" /> Add Resource
                          </button>
                        </>
                      )}
                    />
                  )}
                  {selectedTab === "advanced" && (
                    <>
                      <CodeInput name="initialize" label="Initialize function" mode="javascript" height={400} />
                      <CodeInput name="signOut" label="Sign out function" mode="javascript" height={200} />
                      <CodeInput name="addPageParams" label="Add page params function" mode="javascript" height={200} />
                      <CodeInput name="getTotalResults" label="Get total results function" mode="javascript" height={200} />
                    </>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary" type="submit">Save changes</button>
              </div>
              {helpDialog !== null && (
                <Modal title={helpDialog.title} onClose={this.closeHelpDialog}>
                  {helpDialog.content}
                </Modal>
              )}
            </form>
          );
        }}
      />
    );
  }

  private showGetListItemsHelp = () => {
    this.setState({
      helpDialog: getItemsHelp
    });
  };

  private closeHelpDialog = () => {
    this.setState({
      helpDialog: null
    });
  }

  private onSpecBlur = (form: FormApi) => {
    const specs = form.getFieldState("specs");
    if (specs && specs.value) {
      this.setOperationOptions(specs.value as unknown as ISpecValue[]);
    }
  }

  private setOperationOptions(specs: Array<{ id: string; spec: string }>) {
    const operationOptions: { [id: string]: IOption[] } = {};
    specs.forEach((spec: any) => {
      try {
        const resolved = resolveAllReferences(JSON.parse(spec.spec));
        const operations = getOperations(resolved);
        const options: IOption[] = [];
        operations.forEach(operation => {
          const operationId = getOperationId(operation);
          options.push({ label: operationId, value: operationId })
        });
        options.unshift({
          label: "None",
          value: ""
        });
        operationOptions[spec.id] = options;
      } catch (e) {
        console.warn(e);
      }
    });

    this.setState({ operationOptions });
  }

  private renderNavItem(label: React.ReactNode, id: tabIds): React.ReactNode {
    const { selectedTab } = this.state;

    return (
      <li className="nav-item">
        <a
          href="javascript:void(0);"
          className={`nav-link ${selectedTab === id ? "active": ""}`}
          data-toggle="tab"
          role="tab"
          aria-controls="lorem"
          onClick={() => this.setState({ selectedTab: id })}
        >
          {label}
        </a>
      </li>
    );
  }
}