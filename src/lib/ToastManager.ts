import { toastDuration } from "src/constants";
import { Publisher } from "src/lib/Publisher";
import { level as bootstrapLevel } from "src/types/bootstrap";
import { IToast } from "src/types/toast";

let toastManager: ToastManager;

class ToastManager extends Publisher<IToast[]> {
  private toasts: IToast[];
  private toastId: number;

  constructor() {
    super();

    this.toastId = 0;
    this.toasts = [];
  }

  public addToast(message: string, level: bootstrapLevel = "info") {
    const toastId = this.toastId;

    this.toasts.push({
      id: this.toastId,
      level,
      message
    });
    this.publish("update", this.toasts);

    setTimeout(() => {
      this.removeToast(toastId);
    }, toastDuration);
  }

  private removeToast(toastId: number) {
    const toast = this.toasts.find((t) => t.id === toastId);
    if (!toast) { return; }
    const toastIndex = this.toasts.indexOf(toast);
    this.toasts.splice(toastIndex, 1);
    this.publish("update", this.toasts);
  }
}

export const getToastManager = () => {
  if (!toastManager) {
    toastManager = new ToastManager();
  }
  return toastManager;
};
