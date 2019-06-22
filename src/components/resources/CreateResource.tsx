import { AxiosResponse } from "axios";
import * as React from "react";
import { Alert } from "src/components/Alert";
import { Button } from "src/components/Button";
import { JsonViewer } from "src/components/JsonViewer";
import { ParamForm } from "src/components/ParamForm";
import { getProjectManager } from "src/lib/ProjectManager";
import { IOperationParameters, operate } from "src/lib/swagger";
import { getToastManager } from "src/lib/ToastManager";
import { getWindowManager } from "src/lib/WindowManager";
import { IBreadcrumb } from "src/types/breadcrumb";
import { IResource } from "src/types/resource";

interface IProps {
  breadcrumbs: IBreadcrumb[];

  /**
   * Type of resource to render a create form for
   */
  resourceId: string;
}

interface IState {

  /**
   * Error response from server
   */
  axiosResponse: AxiosResponse | null;

  /**
   * Default values for param form
   */
  defaultFormValues: { [key: string]: string }
}

/**
 * @class Create
 * @description Renders a create resource form
 */
export class CreateResource extends React.Component<IProps, IState> {
  private resource: IResource | undefined;
  private args: IOperationParameters;

  constructor(props: IProps) {
    super(props);

    // Attempt to find a resource and create operation for this resource

    this.resource = getProjectManager().getResource(props.resourceId);

    const defaultFormValues = {};

    props.breadcrumbs.forEach((breadcrumb) => {
      defaultFormValues[breadcrumb.param] = breadcrumb.value;
    });

    this.args = {};

    this.state = {
      axiosResponse: null,
      defaultFormValues
    };
  }

  public render() {
    const { axiosResponse, defaultFormValues } = this.state;

    return this.resource && this.resource.createOperation ? (
      <div>
        <h4>Create {this.resource.name}</h4>
        <ParamForm
          defaults={defaultFormValues}
          resource={this.resource}
          operation={this.resource.createOperation}
          onChange={this.onParamFormChange}
        />
        {axiosResponse && axiosResponse.status >= 400 && (
          <Alert level="danger"><JsonViewer value={axiosResponse.data}/></Alert>
        )}

        <Button onClick={this.create} level="primary" size="sm">Create</Button>
      </div>
    ) : null;
  }

  /**
   * Handle param form changes
   */
  private onParamFormChange = (args: IOperationParameters) => {
    this.args = args;
  }

  /**
   * Create the resource
   */
  private create = async () => {
    if (this.resource && this.resource.createOperation) {
      const resolvedSpec = getProjectManager().getResolvedSpec(this.resource.spec);
      if (!resolvedSpec) { return; }
      const axiosResponse = await operate(resolvedSpec, this.resource.createOperation, this.args);
      if (axiosResponse.status >= 400) {
        this.setState({ axiosResponse });
      } else {
        getWindowManager().removeWindow(`create:${this.props.resourceId}`);
        getToastManager().addToast(`Created new ${this.resource.name}`, "success");
      }
    }
  }
}
