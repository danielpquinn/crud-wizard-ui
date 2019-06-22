import * as React from "react";

/**
 * Corresponds to bootstrap alert levels
 * https://v4-alpha.getbootstrap.com/components/alerts/
 */
export type AlertLevel = "success" | "info" | "warning" | "danger";

interface IProps {

  /**
   * Level of the alert
   */
  level?: AlertLevel;
}

/**
 * @class Alert
 * @description Simple wrapper around a bootstrap alert
 */
export class Alert extends React.Component<IProps> {

  public render(): JSX.Element {
    const { children, level } = this.props;

    return <div className={`alert alert-${level ? level : "info"}`}>{children}</div>;
  }
}
