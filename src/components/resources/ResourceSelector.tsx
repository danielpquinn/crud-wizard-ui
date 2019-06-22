import * as React from "react";
import { ParamForm } from "src/components/ParamForm";
import { Window } from "src/components/Window";
import { getProjectManager } from "src/lib/ProjectManager";
import { IOperationParameters, operate } from "src/lib/swagger";
import { IResource } from "src/types/resource";

interface IOption {
  label: string;
  value: string;
}

interface IProps {
  getValue?: (data: any) => string;
  getLabel?: (data: any) => string;
  resourceId: string;
  onChange: (value: string) => any;
  value: string;
}

interface IState {
  modalOpen: boolean;
  options: IOption[];
}

export class ResourceSelector extends React.Component<IProps, IState> {
  private resource: IResource;
  private args: IOperationParameters;

  constructor(props: IProps) {
    super(props);
    this.args = {};
    this.state = {
      modalOpen: false,
      options: []
    };
    const { resourceId } = this.props;
    const resource = getProjectManager().getResources().find(r => r.id === resourceId);
    if (!resource) { throw new Error(`Could not find resource ${resourceId}`); }
    this.resource = resource;
  }

  public componentDidMount() {
    this.loadOptions();
  }

  public render() {
    const { value, onChange } = this.props;
    const { modalOpen } = this.state;

    // tslint:disable:jsx-no-lambda
    const modal = (
      <Window top={0} left={0} opacity={1} width={400} height={600} onClose={this.closeModal}>
        <ParamForm onChange={this.onParamFormChange} operation={this.resource.listOperation} resource={this.resource} />
        <select className="form-control" onChange={(e) => onChange(e.target.value)} value={value}>
          {this.state.options.map((option: IOption, i: number) => {
            return <option key={i} value={option.value}>{option.label}</option>;
          })}
        </select>
      </Window>
    );

    const openModal = (
      <button onClick={this.openModal}>{value}</button>
    );

    // tslint:disable:jsx-no-lambda
    return modalOpen ? modal : openModal;
  }

  private getLabel(data: any): string {
    const { getLabel } = this.props;
    return getLabel ? getLabel(data) : data[this.resource.nameField];
  }

  private getValue(data: any): string {
    const { getValue } = this.props;
    return getValue ? getValue(data) : data[this.resource.idField];
  }

  private openModal = () => {
    this.setState({ modalOpen: true });
  };

  private closeModal = () => {
    this.setState({ modalOpen: false });
  };

  private onParamFormChange = (args: IOperationParameters) => {
    this.args = args;
  }

  private loadOptions = async () => {
    const { onChange } = this.props;
    const { spec } = this.resource;

    const resolvedSpec = getProjectManager().getResolvedSpec(spec);
    if (!resolvedSpec) { return; }

    const response = await operate(resolvedSpec, this.resource.listOperation, this.args);
    
    if (response.status === 200 && response.data) {
      const options = response.data.map((item: any) => {
        return {
          label: this.getLabel(item),
          value: this.getValue(item)
        }
      });
      this.setState({ options });
      if (options.length > 0) {
        onChange(options[0].value);
      }
    } else {
      this.setState({ options: [] });
    }
  }
}
