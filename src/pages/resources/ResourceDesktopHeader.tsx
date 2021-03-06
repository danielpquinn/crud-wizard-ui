import * as React from "react";
import { getNavigationManager } from "src/lib/NavigationManager";
import { getProjectManager } from "src/lib/ProjectManager";

interface IState {
  accountOpen: boolean;
}

/**
 * @class Header
 * @description Header with resouces and signout dropdown 
 */

export class ResourceDesktopHeader extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      accountOpen: false
    };
  }

  public componentDidMount() {
    document.addEventListener("keyup", this.onKeyUp);
  }

  public componentWillUnmount() {
    document.removeEventListener("keyup", this.onKeyUp);
  }

  public render() {
    const { accountOpen } = this.state;
    const project = getProjectManager().getProject();
    const signOut = project.signOut;

    // tslint:disable:jsx-no-lambda
    return (
      <header className="navbar p-0 border-0 navbar-expand-lg bg-light">
        <button
          className="btn-link navbar-toggler d-block"
          type="button"
          
          aria-controls="navbarNavDropdown"
          aria-label="Toggle navigation"
          onClick={this.toggleMenuOpen}
        >
          <i className="zmdi zmdi-menu"/>
        </button>
        <span className="navbar-brand mr-auto">{project.name}</span>
        <ul className="navbar-nav">
          {signOut && (
            <li className={`nav-item dropdown ${accountOpen ? "show" : ""}`}>
              <a
                href="javascript:void(0);"
                className="nav-link dropdown-toggle p-2"
                role="button"
                aria-haspopup="true"
                aria-expanded={accountOpen}
                onClick={this.toggleAccountOpen}
              >
                <i className="zmdi zmdi-account"/>
              </a>
              <div className={`dropdown-menu dropdown-menu-right ${accountOpen ? "show" : ""}`}>
                <a className="dropdown-item" href="javascript:void(0);" onClick={signOut}>Sign out from {project.name}</a>
              </div>
            </li>
          )}
        </ul>
      </header>
    );
  }

  /**
   * Toggle menu visibility
   */
  private toggleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    getNavigationManager().toggle();

    if (getNavigationManager().getMenuOpen()) {
      window.addEventListener("click", this.onWindowClick);
    }
  }

  /**
   * Toggle account menu visibility
   */
  private toggleAccountOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    this.setState({
      accountOpen: !this.state.accountOpen
    }, () => {
      if (this.state.accountOpen) {
        window.addEventListener("click", this.onWindowClick);
      }
    });
  }

  /**
   * Close all menus when escape key is pressed
   */
  private onKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.closeMenus();
    }

    if (getNavigationManager().getMenuOpen()) {
      getNavigationManager().toggle();
    }
  }

  private onWindowClick = (e: MouseEvent) => {
    this.closeMenus();
    if (getNavigationManager().getMenuOpen()) {
      getNavigationManager().toggle();
    }
    window.removeEventListener("click", this.onWindowClick);
  }

  private closeMenus() {
    this.setState({
      accountOpen: false
    });
  }
}
