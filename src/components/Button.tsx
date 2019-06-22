import * as React from "react";

interface IProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {

  /**
   * These are all of the levels available for the button component
   */
  level?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link";

  /**
   * Whether to render a large or small button
   */
  size?: "lg" | "sm";
}

/**
 * @class Button
 * @description Simple wrapper around a bootstrap button
 */
export class Button extends React.Component<IProps> {

  public render(): React.ReactNode {
    const { children, className, level, size, ...rest } = this.props;

    return <button className={`btn btn-${level || "secondary"} ${size ? `btn-${size}` : ""}`} { ...rest }>{children}</button>;
  }
}
