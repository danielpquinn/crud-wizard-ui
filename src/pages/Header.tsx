import * as React from "react";
import { Link } from "react-router-dom";
import { authTokenKey } from "src/constants";
import { getToastManager } from "src/lib/ToastManager";

interface IBreadcrumb {
  title: string;
  to: string;
}

export interface IHeaderProps {
  breadcrumbs: IBreadcrumb[];
  pageTitle: string;
}

interface IState {
  settingsOpen: boolean;
}

export class Header extends React.Component<IHeaderProps, IState> {

  constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      settingsOpen: false
    };
  }

  public render() {
    const { breadcrumbs, pageTitle } = this.props;
    const { settingsOpen } = this.state;

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
            {breadcrumbs.map(breadcrumb => (
              <li className="breadcrumb-item"><Link to={breadcrumb.to}>{breadcrumb.title}</Link></li>
            ))}
            <li className="breadcrumb-item active" aria-current="page">{pageTitle}</li>
          </ol>
        </nav>
      </>
    )
  }

  /**
   * Sign out of the app
   */
  private signOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.localStorage.removeItem(authTokenKey);
    // this.props.history.push("/login");
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
