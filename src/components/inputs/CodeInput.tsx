import * as React from "react";
import * as CodeMirror from "react-codemirror";
import { Field } from "react-final-form";

interface IProps {
  name: string;
  label?: string;
  mode: "javascript";
  height?: number;
  onBlur?: (instance: CodeMirror.Editor) => void;
}

export class CodeInput extends React.Component<IProps> {
  private reactCodeMirrorInstance: ReactCodeMirror.ReactCodeMirror;
  private listening: boolean;

  constructor(props: IProps) {
    super(props);
    this.listening = false;
  }

  public render() {
    const {
      height,
      label,
      mode,
      name,
      onBlur
    } = this.props;

    return (
      <Field
        name={name}
        render={({ input }) => (
          <div className="form-group code-input mb-1">
            {label && <label>{label}</label>}
            <div
              style={{ height: height ? `${height}px` : "100px" }}
            >
              <CodeMirror
                ref={(instance: ReactCodeMirror.ReactCodeMirror) => {
                  this.reactCodeMirrorInstance = instance;
                  if (onBlur && instance && !this.listening) {
                    this.reactCodeMirrorInstance.getCodeMirror().on("blur" as any, onBlur);
                    this.listening = true;
                  }
                }}
                value={input.value}
                onChange={input.onChange}
                options={{ mode: `text/${mode}` }}
              />
            </div>
          </div>
        )}
      />
    );
  }

  public componentWillUnmount() {
    const { onBlur } = this.props;
    if (this.reactCodeMirrorInstance && onBlur) {
      this.reactCodeMirrorInstance.getCodeMirror().off("blur" as any, onBlur);
    }
  }
}
