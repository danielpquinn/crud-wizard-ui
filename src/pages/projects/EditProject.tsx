import * as axios from "axios";
import { cloneDeep } from "lodash";
import * as React from "react";
import { Link, match } from "react-router-dom";
import { ProjectForm } from "src/components/projects/ProjectForm";
import { getConfigManager } from "src/lib/ConfigManager";
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";
import { IProjectResponseBody } from "src/types/ProjectResponseBody";

interface IProps {
  match: match<{ id: string }>
}

interface IState {
  project: IProjectResponseBody | null;
}

export class EditProject extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      project: null
    };
  }

  public componentDidMount() {
    this.loadProject();
  }

  public render() {
    const { project } = this.state;

    if (!project) {
      return null;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active"><Link to="/projects">Projects</Link></li>
                <li className="breadcrumb-item active">{project.name}</li>
              </ol>
            </nav>
            <h3>Edit Project</h3>
            <ProjectForm onSubmit={this.onSubmit} initialValues={project} />
          </div>
        </div>
      </div>
    );
  }

  private loadProject = async () => {
    const id = this.props.match.params.id;
    const response = await axios.default.get(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/${id}`);
    const project = response.data;

    if (project.specs) {
      for (const spec of project.specs) {
        spec.spec = JSON.stringify(spec.spec, null, 2);
      }
    }
    this.setState({ project });
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

    const id = this.props.match.params.id;
    try {
      await axios.default.put(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/${id}`, parsedValues);
      getToastManager().addToast(`Edited project "${parsedValues.name}"`, "success");
    } catch (e) {
      getToastManager().addToast(`Error updating project ${parsedValues.name}: ${getErrorMessage(e)}`, "danger");
    }
  }
}
