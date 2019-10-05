import * as React from "react";
import { Link } from "react-router-dom";

interface IBreadcrumb {
  title: string;
  to: string;
}

interface IProps {
  title: string;
  breadcrumbs: IBreadcrumb[];
}

export class DocsLayout extends React.Component<IProps,  {}> { 

  public render() {
    const { breadcrumbs, children, title } = this.props;

    return (
      <div className="docs">
        <header className="navbar pt-0 pb-0 border-0 navbar-expand-lg">
          <span className="navbar-brand mr-auto"><Link to="/">crud wizard</Link></span>
        </header>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/docs">Documentation</Link></li>
            {breadcrumbs.map(breadcrumb => (
              <li className="breadcrumb-item"><Link to={breadcrumb.to}>{breadcrumb.title}</Link></li>
            ))}
            <li className="breadcrumb-item active" aria-current="page">{title}</li>
          </ol>
        </nav>
        <div className="row">
          <nav className="col-md-2 p-5">
            <ul className="nav flex-column ">
              <li className="nav-item">
                <Link to="/docs" className="nav-link">Introduction</Link>
              </li>
              <li className="nav-item">
                <Link to="/docs/getting-started" className="nav-link">Getting Started</Link>
              </li>
            </ul>
          </nav>
          <div className="col-md-10 pt-5 pl-5 docs-content-wrapper">
            <div className="docs-content">
              <h1>{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
