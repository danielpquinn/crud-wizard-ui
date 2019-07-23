import * as axios from "axios";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { authTokenKey } from "src/constants";
import { getConfigManager } from "src/lib/ConfigManager";
import { getToastManager } from "src/lib/ToastManager";
import { IProjectResponseBody } from "src/types/ProjectResponseBody";

interface IState {
  settingsOpen: boolean;
}

interface IState {
  project: IProjectResponseBody | null;
}

class HeaderWithoutRouterProps extends React.Component<RouteComponentProps<{ projectId: string }>, IState> {

  constructor(props: RouteComponentProps<{ projectId: string }>) {
    super(props);

    this.state = {
      settingsOpen: false,
      project: null
    };
  }

  public componentDidMount() {
    this.loadProject();
  }

  public render() {
    const { project, settingsOpen } = this.state;

    if (!project) {
      return <></>;
    }

    return (
      <>
        <header className="navbar pt-0 pb-0 border-0 navbar-expand-lg">
          <span className="navbar-brand mr-auto">crud wizard</span>
          <ul className="navbar-nav">
            <li className={`nav-item dropdown ${settingsOpen ? "show" : ""}`}>
              <a
                href="javascript:void(0);"
                className="nav-link dropdown-toggle p-2"
                role="button"
                aria-haspopup="true"
                aria-expanded={settingsOpen}
                onClick={this.toggleSettingsOpen}
              >
                <i className="zmdi zmdi-account"/>
              </a>
              <div className={`dropdown-menu dropdown-menu-right ${settingsOpen ? "show" : ""}`}>
                <a href="javascript:void(0)" onClick={this.signOut}>Sign Out</a>
              </div>
            </li>
          </ul>
        </header>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link className="nav-link" to="/projects">Projects</Link>
            </li>
            <li className="breadcrumb-item"><a href="#">{project.name}</a></li>
            <li className="breadcrumb-item active" aria-current="page">Desktop</li>
          </ol>
        </nav>
      </>
    )
  }

  /**
   * Load project data
   */
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

  /**
   * Sign out of the app
   */
  private signOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.localStorage.removeItem(authTokenKey);
    this.props.history.push("/");
    getToastManager().addToast("Thanks for playing!")
  }

  /**
   * Toggle settings menu visibility
   */
  private toggleSettingsOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    this.setState({
      settingsOpen: !this.state.settingsOpen
    }, () => {
      if (this.state.settingsOpen) {
        window.addEventListener("click", this.onWindowClick);
      }
    });
  }

  private onWindowClick = (e: MouseEvent) => {
    this.closeMenus();
    window.removeEventListener("click", this.onWindowClick);
  }

  private closeMenus() {
    this.setState({
      settingsOpen: false
    });
  }
}

export const Header = withRouter(HeaderWithoutRouterProps);
