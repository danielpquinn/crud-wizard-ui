import * as React from "react";
import { Link, match } from "react-router-dom";
import { Toaster } from "src/components/Toaster";
import { Window } from "src/components/Window";
import { headerHeight } from "src/constants";
import { resetAxios } from "src/lib/axiosManager";
import { getProjectManager } from "src/lib/ProjectManager";
import { getTweenManager } from "src/lib/TweenManager";
import { getWindowManager, IWindows, WindowType } from "src/lib/WindowManager";
import { Layout } from "src/pages/Layout";
import { CreateResource } from "src/pages/resources/CreateResource";
import { ListResources } from "src/pages/resources/ListResources";
import { ResourceDesktopHeader } from "src/pages/resources/ResourceDesktopHeader";
import { ResourceDetail } from "src/pages/resources/ResourceDetail";
import { ResourceNavigation } from "src/pages/resources/ResourceNavigation";
import { UpdateResource } from "src/pages/resources/UpdateResource";

interface IProps {
  match: match<{ projectId: string }>
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

    await getProjectManager().loadConfig(this.props.match.params.projectId);

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
    const project = getProjectManager().getProject();

    if (!windows || !project) { return null; }

    const windowIdOrder = Object.keys(windows).sort((a: string, b: string) => {
      return windows[a].index > windows[b].index ? -1 : 1;
    });
    
    // tslint:disable:jsx-no-lambda
    return (
      <Layout
        pageTitle={project.name}
        breadcrumbs={[
          {
            title: "Projects",
            to: "/projects"
          }
        ]}
      >
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link className="nav-link" to={`/projects/${project.id}/edit`}>Edit Project</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link active">View Project</a>
          </li>
        </ul>
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
      </Layout>
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
      case WindowType.Update:
        return <UpdateResource {...window.props} />;
      case WindowType.Detail:
        return <ResourceDetail {...window.props} />;
      case WindowType.List:
        return <ListResources {...window.props} />;
      default:
        return null;
    }
  }
}
