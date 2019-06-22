import * as React from "react";
import { Field } from "react-final-form";
import { default as ReactSelect } from "react-select";

interface IOption {
  value: string;
  label: string;
}

interface IProps {
  name: string;
  options: IOption[];
  label?: string;
}

export class Select extends React.Component<IProps> {
  public render() {
    const { name, label, options } = this.props;

    return (
      <Field
        name={name}
        render={({ input, meta }) => (
          <div className="form-inline form-group mb-1">
            {label && <label>{label}</label>}
            <ReactSelect
              styles={{
                container: (provided) => ({ ...provided, width: "100%" }),
                control: (provided) => ({ ...provided, minHeight: "31px", height: "31px" })
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#00FAF2",
                  primary75: "rgba(0, 250, 242, 0.75)",
                  primary50: "rgba(0, 250, 242, 0.5)",
                  primary25: "rgba(0, 250, 242, 0.25)",
                  danger: "#EF2706",
                  dangerLight: "#FF5A0C",
                  neutral0: "#12141D",
                  neutral5: "#111E29",
                  neutral10: "#122B3A",
                  neutral20: "#123748",
                  neutral30: "#124155",
                  neutral40: "#2E5B6D",
                  neutral50: "#4F7585",
                  neutral60: "#7896A2",
                  neutral70: "#A5BAC1",
                  neutral80: "#C8D6DA",
                  neutral90: "#EFF5F5"
                }
              })}
              options={options}
              value={{ value: input.value, label: input.value }}
              onChange={(option: IOption) => input.onChange(option.value)}
            />
            {meta.touched && meta.error && <small>{meta.error}</small>}
          </div>
        )}
      />
    );
  }
}