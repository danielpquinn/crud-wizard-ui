import * as React from "react";
import { match } from "react-router-dom";
import { CreateResource } from "src/components/resources/CreateResource";
import { ListResources } from "src/components/resources/ListResources";
import { ResourceDesktopHeader } from "src/components/resources/ResourceDesktopHeader";
import { ResourceDetail } from "src/components/resources/ResourceDetail";
import { ResourceNavigation } from "src/components/resources/ResourceNavigation";
import { Toaster } from "src/components/Toaster";
import { Window } from "src/components/Window";
import { headerHeight } from "src/constants";
import { resetAxios } from "src/lib/axiosManager";
import { getProjectManager } from "src/lib/ProjectManager";
import { getTweenManager } from "src/lib/TweenManager";
import { getWindowManager, IWindows, WindowType } from "src/lib/WindowManager";

interface IProps {
  match: match<{ id: string }>
}

interface IState {
  windows: IWindows | null;
}

export class ResourceDesktop extends React.Component<IProps, IState> {
  private windowManagerSubscriptionId: number;

  constructor(props: IProps) {
    super(props);
    this.state = {
      windows: null
    };
    this.onWindowManagerUpdated = this.onWindowManagerUpdated.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    resetAxios();

    await getProjectManager().loadConfig(this.props.match.params.id);

    this.setState({
      windows: getWindowManager().getWindows()
    });
    this.windowManagerSubscriptionId = this.windowManagerSubscriptionId = getWindowManager().subscribe("updated", this.onWindowManagerUpdated);
  }

  public componentWillUnmount(): void {
    getWindowManager().unsubscribe(this.windowManagerSubscriptionId);
  }

  public render(): React.ReactNode {
    const { windows } = this.state;

    if (!windows) { return null; }

    const windowIdOrder = Object.keys(windows).sort((a: string, b: string) => {
      return windows[a].index > windows[b].index ? -1 : 1;
    });
    
    // tslint:disable:jsx-no-lambda
    return (
      <div className="desktop">
        <div className="windows">
          {windowIdOrder.map((windowId: string, i: number) => {
            const window = windows[windowId];
            return (
              <Window
                active={window.active}
                left={window.left}
                top={window.top}
                width={window.width}
                height={window.height}
                key={windowId}
                opacity={window.opacity}
                onDragStart={() => {
                  getWindowManager().moveToFront(windowId);
                }}
                onDrag={(left: number, top: number) => {
                  getWindowManager().updateWindow(windowId, { left, top });
                }}
                onDragEnd={() => {
                  getWindowManager().saveWindows();
                }}
                onResize={(width: number, height: number) => {
                  getWindowManager().updateWindow(windowId, { width, height });
                }}
                onResizeEnd={() => {
                  getWindowManager().saveWindows();
                }}
                onClose={() => {
                  getWindowManager().removeWindow(windowId);
                }}
                onMaximize={() => {
                  const innerWindow = getWindowManager().getWindow(windowId);
                  getTweenManager().addTween(innerWindow, "left", 0);
                  getTweenManager().addTween(innerWindow, "top", headerHeight);
                  getTweenManager().addTween(innerWindow, "width", innerWidth);
                  getTweenManager().addTween(innerWindow, "height", innerHeight - headerHeight, {
                    onStep: () => {
                      getWindowManager().updateWindow(windowId, {});
                    },
                    onFinish: () => {
                      getWindowManager().saveWindows();
                    }
                  });
                }}
                onMinimize={() => {
                  const innerWindow = getWindowManager().getWindow(windowId);
                  getTweenManager().addTween(innerWindow, "left", (innerWidth / 2) - 300);
                  getTweenManager().addTween(innerWindow, "top", headerHeight + 50);
                  getTweenManager().addTween(innerWindow, "width", 600);
                  getTweenManager().addTween(innerWindow, "height", 400, {
                    onStep: () => {
                      getWindowManager().updateWindow(windowId, {});
                    },
                    onFinish: () => {
                      getWindowManager().saveWindows();
                    }
                  });
                }}
              >
                {this.getModalComponent(windowId)}
              </Window>
            );
          })}
        </div>
        <ResourceNavigation />
        <ResourceDesktopHeader />
        <Toaster />
      </div>
    )
  }

  private onWindowManagerUpdated(windows: IWindows): void {
    this.setState({ windows });
  }

  private getModalComponent(windowId: string) {
    const window = getWindowManager().getWindow(windowId);

    switch (window.windowType) {
      case WindowType.Create:
        return <CreateResource {...window.props} />;
      case WindowType.Detail:
        return <ResourceDetail {...window.props} />;
      case WindowType.List:
        return <ListResources {...window.props} />;
      default:
        return null;
    }
  }
}
