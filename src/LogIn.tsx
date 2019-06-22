import * as axios from "axios";
import * as H from "history";
import * as React from "react";
import { Field, Form as FinalForm } from "react-final-form";
import { Link } from "react-router-dom";
import { Home } from "src/Home";
import { getConfigManager } from "src/lib/ConfigManager";

interface IProps {
  history: H.History;
}

interface IState {
  response: axios.AxiosResponse | null;
  submitted: boolean;
  disabled: boolean;
}

interface IFormValues {
  email: string;
  password: string;
}

export class LogIn extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      disabled: false,
      response: null,
      submitted: false
    };
  }

  public render() {
    const {
      disabled,
      response
    } = this.state;

    let error: React.ReactNode = null;

    if (response && response.status >= 400) {
      const message = response.data && response.data.message;
      error = (
        <div className="alert alert-warning">
          {message || "Something went wrong"}
        </div>
      );
    }

    return (
      <Home>
        <h2 className="mb-4">Log In 🧙‍♂️</h2>
        <FinalForm
          onSubmit={this.onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="email"
                validate={value => !(value && value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) ? "Invalid email address" : undefined}
                render={({ input, meta }) => (
                  <div className="form-group">
                    <label>Email</label>
                    <input placeholder="Enter email address" className="form-control" {...input} />
                    {meta.touched && meta.error && <small className="text-danger">{meta.error}</small>}
                  </div>
                )}
              />
              <Field
                name="password" 
                validate={value => !(value && value.length >= 8) ? "Password must be at least 8 characters long" : undefined}
                render={({ input, meta }) => (
                  <div className="form-group">
                    <label>Password</label>
                    <input placeholder="Enter password" type="password" className="form-control" {...input} />
                    {meta.touched && meta.error && <small className="text-danger">{meta.error}</small>}
                  </div>
                )}
              />

              {error}

              <p className="text-center">
                <button type="submit" disabled={disabled} className="btn btn-lg btn-primary w-100">Log In</button>
              </p>
            </form>
          )}
        />
        <p className="text-center">
            Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </Home>
    );
  }

  private onSubmit = async (values: IFormValues) => {
    const { disabled } = this.state;

    if (disabled) { return; }

    let response: axios.AxiosResponse;
    this.setState({ disabled: true });

    try {
      response = await axios.default.post(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/login`, {
        email: values.email,
        password: values.password
      });
    } catch (e) {
      response = e.response;
    }
    this.setState({
      disabled: false,
      response
    });

    if (response && response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      this.props.history.push("/projects");
    }
  }
}
