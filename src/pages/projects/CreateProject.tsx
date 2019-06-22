import * as axios from "axios";
import * as H from "history";
import { cloneDeep } from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";
import { ProjectForm } from "src/components/projects/ProjectForm";
import { getConfigManager } from "src/lib/ConfigManager";
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";

interface IProps {
  history: H.History;
}

interface IState {
  errorMessage: string | null;
}

export class CreateProject extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = { errorMessage: null };
  }

  public render() {
    const { errorMessage } = this.state;

    if (errorMessage !== null) {
      return (
        <div className="alert alert-warning">{errorMessage}</div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active"><Link to="/projects">Projects</Link></li>
                <li className="breadcrumb-item active">Create Project</li>
              </ol>
            </nav>
            <h3>Create Project</h3>
            <ProjectForm onSubmit={this.onSubmit} initialValues={undefined} />
          </div>
        </div>
      </div>
    );
  }

  private onSubmit = async (values: any) => {
    const parsedValues = cloneDeep(values);
    
    // Make sure that specs provided are valid JSON

    if (parsedValues.specs) {
      for (const spec of parsedValues.specs) {
        try {
          spec.spec = JSON.parse(spec.spec);
        } catch (e) {
          getToastManager().addToast(`Spec ${spec.id} does not contain valid JSON`, "warning");
          return;
        }
      }
    }

    try {
      await axios.default.post(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/`, parsedValues);
      getToastManager().addToast(`Created project "${parsedValues.name}"`, "success");
      this.props.history.push("/projects");
    } catch (e) {
      getToastManager().addToast(`Error creating project ${parsedValues.name}: ${getErrorMessage(e)}`, "danger");
    }
  };
}
