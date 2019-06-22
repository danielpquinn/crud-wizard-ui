import * as axios from "axios";
import * as React from "react";
import { Link } from "react-router-dom";
import { Alert } from "src/components/Alert";
import { getConfigManager } from 'src/lib/ConfigManager';
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";
import { IProjectResponseBody } from "src/types/ProjectResponseBody";

interface IState {
  projects: IProjectResponseBody[] | null;
  errorMessage: string | null;
}

export class Projects extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      projects: null,
      errorMessage: null
    };
  }

  public componentDidMount() {
    this.loadProjects();
  }

  public render() {
    const { projects } = this.state;
    let content: React.ReactNode = null;

    if (!projects) {
      content = <div className="text-center"><i className="zmdi zmdi-refresh zmdi-hc-spin" /></div> ;
    } else if (projects.length === 0) {
      content = <Alert>You don't have any projects</Alert>;
    } else {
      content = (
        <table className="table table-sm w-100">
          <thead>
            <tr>
              <th>Name</th>
              <th>Url</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              return (
                <tr key={project.id}>
                  <td className="align-middle">{project.name}</td>
                  <td className="align-middle"><Link to={`/desktop/${project.id}`}>Go to desktop</Link></td>
                  <td className="align-middle text-right">
                    <Link
                      title="Edit project"
                      className="btn btn-lg btn-link"
                      to={`/projects/${project.id}`}
                    >
                      <i className="zmdi zmdi-edit" />
                    </Link>
                    <a
                      title="Delete project"
                      className="btn btn-lg btn-link"
                      onClick={() => this.deleteProject(project.id)}
                      href="javascript:void(0);"
                    >
                      <i className="zmdi zmdi-delete" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Projects</li>
            </ol>
          </nav>

            <h3>Projects</h3>

            <div className="card">
              <div className="card-header">
                <Link className="btn btn-primary btn-sm" to="/create-project">Create Project</Link>
              </div>
              <div className="card-body">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private loadProjects = async () => {
    try {
      const response = await axios.default.get(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/`);
      if (response.data) {
        this.setState({ projects: response.data });
      }
    } catch (e) {
      this.setState({ errorMessage: getErrorMessage(e) });
    }
  }

  private deleteProject = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await axios.default.delete(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/${id}`);
    
        if (response.status < 400) {
          this.loadProjects();
          getToastManager().addToast("Deleted project", "success");
        } else {
          getToastManager().addToast("Error deleting project", "danger");
        }
      } catch (e) {
        getToastManager().addToast(getErrorMessage(e), "danger");
      }
    }
  }
}
