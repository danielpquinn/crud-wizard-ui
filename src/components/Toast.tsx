import * as React from "react";
import { Alert } from "src/components/Alert";
import { IToast } from "src/types/toast";

interface IProps {
  toast: IToast;
}

/**
 * @class Toast
 * @description Handles the display of toast notifications
 */
export class Toast extends React.Component<IProps> {

  public render(): React.ReactNode {
    const { toast } = this.props;
    return <Alert level={toast.level}>{toast.message}</Alert>;
  }
}
