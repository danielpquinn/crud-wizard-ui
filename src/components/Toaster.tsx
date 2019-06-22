import * as React from "react";
import { Toast } from "src/components/Toast";
import { getToastManager } from "src/lib/ToastManager";
import { IToast } from "src/types/toast";

interface IState {
  toasts: IToast[];
}

/**
 * @class Toaster
 * @description Handles the display of toast notifications
 */
export class Toaster extends React.Component<{}, IState> {
  private toastManagerSubsriptionId: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      toasts: []
    };
  }

  public componentDidMount() {
    this.toastManagerSubsriptionId = getToastManager().subscribe("update", this.onToastManagerUpdate);
  }

  public componentWillUnmount() {
    getToastManager().unsubscribe(this.toastManagerSubsriptionId);
  }

  public render(): React.ReactNode {
    const { toasts } = this.state;
    return (
      <div className="toaster">
        {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
      </div>
    );
  }

  private onToastManagerUpdate = (toasts: IToast[]) => {
    this.setState({ toasts });
  }
}
