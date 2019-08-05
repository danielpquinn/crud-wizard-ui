import * as axios from "axios";
import { cloneDeep } from "lodash";
import * as React from "react";
import { Link, match } from "react-router-dom";
import { getConfigManager } from "src/lib/ConfigManager";
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";
import { Layout } from "src/pages/Layout";
import { ProjectForm } from "src/pages/projects/ProjectForm";
import { IProjectResponseBody } from "src/types/ProjectResponseBody";

interface IProps {
  match: match<{ projectId: string }>
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
      <Layout
        breadcrumbs={[
          {
            title: "Projects",
            to: "/projects"
          }
        ]}
        pageTitle={project.name}
      >
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active">Edit Project</a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/projects/${project.id}/desktop`}>View Project</Link>
          </li>
        </ul>
        <div className="container p-5">
          <div className="row">
            <div className="col-12">
              <h3>Edit Project</h3>
              <ProjectForm onSubmit={this.onSubmit} initialValues={project} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  private loadProject = async () => {
    const id = this.props.match.params.projectId;
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

    const id = this.props.match.params.projectId;
    try {
      await axios.default.put(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/${id}`, parsedValues);
      getToastManager().addToast(`Edited project "${parsedValues.name}"`, "success");
    } catch (e) {
      getToastManager().addToast(`Error updating project ${parsedValues.name}: ${getErrorMessage(e)}`, "danger");
    }
  }
}
