import * as React from "react";
import { Field } from "react-final-form";

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export class TextArea extends React.Component<IProps> {

  public render() {
    const { name, label, placeholder } = this.props;

    return (
      <Field
        name={name}
        render={({ input, meta }) => (
          <div className="form-group mb-1">
            {label && <label><small>{label}</small></label>}
            <textarea className="form-control" {...input} placeholder={placeholder} />
            {meta.touched && meta.error && <small>{meta.error}</small>}
          </div>
        )}
      />
    );
  }
}