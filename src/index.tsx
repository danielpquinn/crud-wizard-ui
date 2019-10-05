import * as axios from "axios";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { Toaster } from "src/components/Toaster";
import { authTokenKey } from "src/constants";
import "src/index.css";
import { getToastManager } from "src/lib/ToastManager";
import { GettingStartedDoc } from "src/pages/docs/GettingStartedDoc";
import { IntroductionDoc } from "src/pages/docs/IntroductionDoc";
import { LogIn } from "src/pages/LogIn";
import { CreateProject } from "src/pages/projects/CreateProject";
import { EditProject } from "src/pages/projects/EditProject";
import { Projects } from "src/pages/projects/Projects";
import { ResourceDesktop } from "src/pages/resources/ResourceDesktop";
import { SignUp } from "src/pages/SignUp";
import registerServiceWorker from "src/registerServiceWorker";
import { getRouterManager } from './lib/RouterManager';

class App extends React.Component<RouteComponentProps, {}> {

  public constructor(props: RouteComponentProps) {
    super(props);

    getRouterManager().setHistory(this.props.history);

    axios.default.interceptors.request.use((config) => {
      const authToken = localStorage.getItem(authTokenKey);
      if (authToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = authToken;
      }
      return config;
    });

    // Redirect to login on 401
    axios.default.interceptors.response.use(
      response => response,
      async (error) => {
        console.error(error);
        if (error && error.response && error.response.status === 401) {
          localStorage.removeItem(authTokenKey);
          this.props.history.push("/");
          getToastManager().addToast("Your session has expired");
        } else {
          throw error;
        }
      }
    );

    // Redirect to projects if logged in
    const token = localStorage.getItem(authTokenKey);
    if (token && window.location.pathname === "/") {
      this.props.history.push("/projects");
    }
  }

  public render() {
    return (
      <div className="router">
      <Route path="/" exact={true} component={LogIn} />
        <Route path="/signup" exact={true} component={SignUp} />
        <Route path="/docs" exact={true} component={IntroductionDoc} />
        <Route path="/docs/getting-started" exact={true} component={GettingStartedDoc} />
        <Route path="/projects" exact={true} component={Projects} />
        <Route path="/create-project" exact={true} component={CreateProject} />
        <Route path="/projects/:projectId/edit" exact={true} component={EditProject} />
        <Route path="/projects/:projectId/desktop" exact={true} component={ResourceDesktop} />
        <Toaster />
      </div>
    );
  }
}

const AppWithRouter = withRouter(App);

// tslint:disable:jsx-no-lambda
ReactDOM.render(
  <Router>
    <AppWithRouter />
  </Router>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
