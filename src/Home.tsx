import * as React from "react";
import { Link } from "react-router-dom";

export class Home extends React.Component<{}, {}> {

  public render() {
    return (
      <div className="container container-home flex-column ml-0 h-100">
        <div className="row row-home h-100">

          <div className="col-7 home-col-left h-100 p-5">
            <img src={`${process.env.PUBLIC_URL}/home-background.svg`} className="home-background"/>
            <div className="row">
              <div className="col-10">
                <img src={`${process.env.PUBLIC_URL}/home-logo.png`} alt="crud wizard" className="home-logo mb-5"/>
                <h2 className="mb-4">Generate a user interface for your API in minutes.</h2>
                <h5 className="mb-4">Provide crud wizard with an OpenAPI specification for your API and it will generate a flexible, polished and robust user interface for managing your resources.</h5>
                <Link to="/docs" className="btn btn-light mr-3">documentation</Link>
                <a href="#" className="btn btn-light">demo</a>
              </div>
              <div className="col-3"/>
            </div>
          </div>

          <div className="col-5 home-col-right p-5">
            {this.props.children}
          </div>

        </div>
      </div>
    );
  }
}
