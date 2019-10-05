import * as H from "history";

class RouterManager {
  private history: H.History | null;

  constructor() {
    this.history = null;
  }

  public setHistory(history: H.History) {
    this.history = history;
  }

  public getHistory() {
    return this.history;
  }
}

let routerManager: RouterManager | null = null;

export const getRouterManager = () => {
  if (!routerManager) {
    routerManager = new RouterManager();
  }
  return routerManager;
};
