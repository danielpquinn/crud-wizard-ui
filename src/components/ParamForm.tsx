import { get, set, startCase } from "lodash";
import * as React from "react";
import { Alert } from "src/components/Alert";
import { maxFormColumnWidth } from "src/constants";
import { getNumColumns } from "src/lib/layout";
import { getProjectManager } from "src/lib/ProjectManager";
import { findOperationObject, IOperationObjectWithPathAndMethod, IOperationParameters, ResolvedParameter } from "src/lib/swagger";
import { IResource } from "src/types/resource";
import { BodyParameter, Schema } from "src/types/swagger";

interface IProps {
  defaults?: { [key: string]: string };
  resource: IResource;
  operation: string;
  onChange: (args: IOperationParameters) => any;
}

interface IState {
  operation: IOperationObjectWithPathAndMethod | null;
  formState: { [key: string]: string };
  errorMessage: string | null;
}

// tslint:disable:max-classes-per-file

interface INestedParamFormProps {
  formState: { [key: string]: string };
  path: string;
  schema: Schema;
  onChange: (path: string, value: any) => any;
}

interface INestedParamFormState {
  numCols: number;
  open: boolean;
}

class NestedParamForm extends React.Component<INestedParamFormProps, INestedParamFormState> {
  private myRef: React.RefObject<HTMLDivElement>;

  constructor(props: INestedParamFormProps) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      numCols: 1,
      open: false
    };
  }

  public render(): React.ReactNode {
    const { formState, onChange, path, schema } = this.props;
    const { open } = this.state;
    const properties = schema.properties;
    let numFields = 0;
  
    if (properties) {
      const fieldKeys = [];
      const nestedFormKeys = [];
      
      for (const key in properties) {
        if (properties[key].properties || (properties[key] as BodyParameter).schema) {
          nestedFormKeys.push(key);
          numFields += 1;
        } else {
          fieldKeys.push(key);
          numFields += 1;
        }
      }

      let numCols = 1;
      
      if (this.myRef && this.myRef.current) {
        numCols = getNumColumns(this.myRef.current.clientWidth, maxFormColumnWidth, numFields);
      }

      const fieldRows: React.ReactNode[][] = [];

      const numRows = Math.ceil(fieldKeys.length / numCols);

      for (let row = 0; row < numRows; row += 1) {
        fieldRows.push([]);

        for (let col = 0; col < numCols; col += 1) {

          const key = fieldKeys[row * numCols + col];
          const property = properties[key];

          if (property) {
            const nestedPath = path ? `${path}.${key}` : key;
            const description = properties[key].description;
            const info = description ? (
              <i title={description} className="zmdi zmdi-info-outline" />
            ) : null;

            fieldRows[row].push(
              <div className="form-group" key={nestedPath}>
                <div className="d-flex"><div className="mr-auto">{startCase(key)}</div>{info}</div>
                {this.getInputForSchema(nestedPath, properties[key])}
              </div>
            );
          }
        }
      }

      const fields = fieldRows.map((row, i) => {
        return (
          <div key={i} className="row">
            {row.map((field, j) => {
              return <div key={`${i}${j}`} className="col">{field}</div>
            })}
          </div>
        );
      });

      const nestedForms = nestedFormKeys.map((key) => {
        const bodySchema = (properties[key] as BodyParameter).schema;
        const nestedProperties = properties[key].properties;
        const nestedPath = path ? `${path}.${key}` : key;

        return (bodySchema || nestedProperties) && (
          <NestedParamForm
            key={nestedPath}
            formState={formState}
            onChange={onChange}
            path={nestedPath}
            schema={bodySchema || { properties: nestedProperties } as Schema}
          />
        );
      });

      const form = (
        <div>
          {fields}
          {nestedForms}
        </div>
      );

      return (
        <div ref={this.myRef}>
          {path ? (
            <div className="card mb-4">
              <div className="d-flex card-header" onClick={this.toggle}>
                <div className="mr-auto">{startCase(path)}</div>
                <i className={`zmdi zmdi-chevron-${open ? "down" : "left"}`} />
              </div>
              {open && (
                <div className="card-body">
                  {form}
                </div>
              )}
            </div>
          ) : form}
        </div>
      );
    }

    return null;
  }

  private toggle = () => {
    this.setState({ open: !this.state.open });
  };

  private getInputForSchema(path: string, schema: Schema): React.ReactNode | null {
    const { formState, onChange } = this.props;
    const value = get(formState, path.split("."));

    // tslint:disable:jsx-no-lambda
    if (schema.enum) {
      return (
        <select
          className="form-control"
          value={value}
          onChange={(e) => { onChange(path, e.target.value); }}
        >
          {schema.enum.map((enumValue: any, i: number) => {
            return <option key={i} value={enumValue}>{enumValue}</option>;
          })}
        </select>
      );
    }

    if (schema.type === "integer") {
      return (
        <input
          className="form-control"
          type="number"
          onChange={(e) => {
            onChange(path, parseInt(e.target.value, 10))
          }}
          value={value}
        />
      );
    }

    return (
      <input
        className="form-control"
        type="text"
        onChange={(e) => { onChange(path, e.target.value) }}
        value={value || ""}
      />
    )
  }
}

export class ParamForm extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    const { resource, operation } = props;
    const { spec } = resource;
    const resolvedSpec = getProjectManager().getResolvedSpec(spec);
    let foundOperation = null;
    let errorMessage = null;

    if (!resolvedSpec) {
      errorMessage = `Could not find spec with id ${spec}. Please make sure your resources.ts file is correct`;
    } else {
      // Find the operation we want to render a form for in the spec
      foundOperation = findOperationObject(resolvedSpec, operation);
    }

    if (!foundOperation) {
      errorMessage = `Operation ${operation} does not exist, please fix your configuration`;
    }

    // Initialize state

    this.state = {
      errorMessage,
      formState: props.defaults || {},
      operation: foundOperation
    };
  }

  public render() {
    const { errorMessage, formState, operation } = this.state;

    if (errorMessage) {
      return <Alert level="danger">{errorMessage}</Alert>;
    }

    const parameters = operation && operation.operation.parameters as ResolvedParameter[];

    if (!parameters) {
      return null;
    }

    const schema = parameters.reduce((acc, parameter) => {
      acc.properties[parameter.name] = parameter;
      return acc;
    }, { properties: {} }) as Schema;

    // tslint:disable:jsx-no-lambda
    return (
      <NestedParamForm formState={formState} onChange={this.onChange} path="" schema={schema}/>
    );
  }

  private onChange = (path: string, value: string | number) => {
    const newFormState = set(this.state.formState, path.split("."), value);
    this.setState({ formState: newFormState }, () => {
      this.props.onChange(this.state.formState);
    });
  }
}
