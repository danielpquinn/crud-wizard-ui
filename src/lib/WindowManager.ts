import { pick } from "lodash";
import {
  defaultWindowHeight,
  defaultWindowWidth,
  headerHeight
} from "src/constants";
import { Publisher } from "src/lib/Publisher";
import { getTweenManager } from "src/lib/TweenManager";

const localStorageWindowsKey = "windowState";
const addWindowOffset = 20;

export enum WindowType {
  Create,
  List,
  Detail
}

interface IWindow {
  active: boolean;
  height: number;
  index: number;
  left: number;
  props: any;
  savedProps: string[];
  top: number;
  width: number;
  opacity: number;
  windowType: WindowType;
}

export interface IWindows {
  [id: string]: IWindow;
}

let windowManager: WindowManager;

class WindowManager extends Publisher<IWindows> {
  private windows: IWindows;

  constructor() {
    super();
    this.loadWindows();
  }

  public addWindow(id: string, windowType: WindowType, props: any, savedProps: string[]) {
    const activeWindowKey = Object.keys(this.windows).filter(key => this.windows[key].active)[0];
    const activeWindow = activeWindowKey ? this.windows[activeWindowKey] : null;

    let top = headerHeight + addWindowOffset;
    let left = (window.innerWidth - defaultWindowWidth) / 2;

    if (activeWindow) {
      top = activeWindow.top + addWindowOffset;
      left = activeWindow.left + addWindowOffset;
    }

    Object.keys(this.windows).forEach((windowId: string) => {
      this.windows[windowId].active = false;
      this.windows[windowId].index += 1;
    });

    this.windows[id] = {
      active: true,
      height: defaultWindowHeight,
      index: 0,
      left: left - addWindowOffset,
      props,
      savedProps,
      top: top - addWindowOffset,
      width: defaultWindowWidth,
      windowType,
      opacity: 0
    };

    getTweenManager().addTween(this.windows[id], "opacity", 1, {
      onStep: () => this.publish("updated", this.windows),
      ease: "OutQuad",
      onFinish: () => {
        getTweenManager().addTween(this.windows[id], "left", left, { ease: "OutQuad" });
        getTweenManager().addTween(this.windows[id], "top", top, {
          onStep: () => this.publish("updated", this.windows),
          ease: "OutQuad",
          onFinish: () => { this.saveWindows(); }
        });
      }
    });
  }

  public removeWindow(id: string) {
    getTweenManager().addTween(this.windows[id], "top", this.windows[id].top - addWindowOffset, {
      onStep: () => this.publish("updated", this.windows),
      ease: "InOutQuad",
      onFinish: () => {
        getTweenManager().addTween(this.windows[id], "opacity", 0, {
          onStep: () => this.publish("updated", this.windows),
          ease: "OutQuad",
          onFinish: () => {
            delete this.windows[id];
            const activeWindow = Object.keys(this.windows).map(key => this.windows[key]).sort((a, b) => a.index < b.index ? -1 : 1)[0];
            if (activeWindow) {
              activeWindow.active = true;
            }
          }
        });
      }
    });
  }

  public getWindows(): IWindows {
    return this.windows;
  }

  public getWindow(windowId: string): IWindow {
    return this.getWindows()[windowId];
  }

  public updateWindow(windowId: string, windowState: Partial<IWindow>) {
    const window = this.getWindow(windowId);
    Object.keys(windowState).forEach(key => {
      window[key] = windowState[key];
    });
    this.publish("updated", this.windows);
  }

  public moveToFront(windowId: string) {
    Object.keys(this.windows).forEach((id: string) => {
      if (this.windows[id].index < this.windows[windowId].index) {
        this.windows[id].active = false;
        this.windows[id].index += 1;
      }
    });
    this.windows[windowId].active = true;
    this.windows[windowId].index = 0;
    this.publish("updated", this.windows);
  }

  public saveWindows() {
    const serialized = Object.keys(this.windows).reduce((last: IWindows, key: string) => {
      const window = this.windows[key];
      last[key] = {
        active: window.active,
        height: window.height,
        index: window.index,
        left: window.left,
        props: pick(window.props, window.savedProps),
        savedProps: window.savedProps,
        top: window.top,
        width: window.width,
        windowType: window.windowType,
        opacity: window.opacity
      };
      return last;
    }, {});
    const stringified = JSON.stringify(serialized);
    localStorage.setItem(localStorageWindowsKey, stringified);
  }

  private loadWindows() {
    const serializedWindows = localStorage.getItem(localStorageWindowsKey);
    if (!serializedWindows) {
      this.windows = {};
      return;
    }
    let windowStateIndex: IWindows = {};
    try {
      windowStateIndex = JSON.parse(serializedWindows as string);
    } catch (e) {
      localStorage.removeItem(localStorageWindowsKey);
    }
    this.windows = windowStateIndex;
  }
}

export const getWindowManager = () => {
  if (!windowManager) {
    windowManager = new WindowManager();
  }
  return windowManager;
};
