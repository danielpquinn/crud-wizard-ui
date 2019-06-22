import { Publisher } from "src/lib/Publisher";

let navigationManager: NavigationManager;

class NavigationManager extends Publisher<boolean> {
  private menuOpen: boolean;

  constructor() {
    super();

    this.menuOpen = false;
  }

  public toggle() {
    this.menuOpen = !this.menuOpen;
    this.publish("toggle", this.menuOpen);
  }

  public getMenuOpen() {
    return this.menuOpen;
  }
}

export const getNavigationManager = () => {
  if (!navigationManager) {
    navigationManager = new NavigationManager();
  }
  return navigationManager;
};

