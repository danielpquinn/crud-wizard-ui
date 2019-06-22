import * as React from "react";
import { Link } from 'react-router-dom';

export class DocsLayout extends React.Component<{}, {}> {

  public render() {
    const { children } = this.props;

    return (
      <div className="container-fluid docs">
        <div className="row">
          <div className="col-2">
            <ul>
              <li><Link to="/docs">Introduction</Link></li>
              <li><Link to="/docs/getting-started">Getting Started</Link></li>
            </ul>
          </div>
          <div className="col-8">
            {children}
          </div>
          <div className="col-2"/>
        </div>
      </div>
    )
  }
}