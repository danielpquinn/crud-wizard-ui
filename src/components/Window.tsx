import * as React from "react";
import { Button } from "src/components/Button";
import { defaultWindowHeight, defaultWindowWidth, headerHeight } from "src/constants";

interface IProps {
  active?: boolean;
  height?: number;
  left: number;
  opacity: number;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  onDrag?: (top: number, left: number) => any;
  onMaximize?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  onMinimize?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  onResize?: (width: number, height: number) => any;
  onResizeEnd?: () => any;
  onDragStart?: () => any;
  onDragEnd?: () => any;
  top: number;
  width?: number;
}

/**
 * Renders a window form
 */
export class Window extends React.Component<IProps, {}> {
  private dragStartX: number;
  private dragStartY: number;
  private resizeStartX: number;
  private resizeStartY: number;
  private resizeStartWidth: number;
  private resizeStartHeight: number;

  public render() {
    const {
      active,
      children,
      height = defaultWindowHeight,
      left,
      onClose,
      onMinimize,
      onMaximize,
      top,
      width = defaultWindowWidth,
      opacity 
    } = this.props;

    return (
      <div
        className={`modal ${active ? "active" : ""} window`}
        tabIndex={-1}
        role="dialog"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `${left}px`,
          top: `${top}px`,
          opacity
        }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="window-header grabbable text-right" onMouseDown={this.startDrag}>
              <Button level="link" type="button" aria-label="Close" onClick={onMinimize}>
                <span aria-hidden="true"><i className="zmdi zmdi-window-minimize"/></span>
              </Button>
              <Button level="link" type="button" aria-label="Close" onClick={onMaximize}>
                <span aria-hidden="true"><i className="zmdi zmdi-window-maximize"/></span>
              </Button>
              <Button level="link" type="button" aria-label="Close" onMouseUp={onClose}>
                <span aria-hidden="true"><i className="zmdi zmdi-close zmdi-hc"/></span>
              </Button>
            </div>
            <div
              className="modal-body"
              style={{ height: `${height - headerHeight}px` }}
            >
              {children}
            </div>
            <div className="resize-handle" onMouseDown={this.startResize}/>
          </div>
        </div>
      </div>
    );
  }

  private onDragMouseMove = (e: any) => {
    const { onDrag } = this.props;
    if (onDrag) {
      onDrag(e.screenX - this.dragStartX, e.screenY - this.dragStartY);
    }
  }

  private onDragMouseUp = () => {
    const { onDragEnd } = this.props;
    if (onDragEnd) {
      onDragEnd();
    }
    document.removeEventListener("mousemove", this.onDragMouseMove);
    document.removeEventListener("mouseup", this.onDragMouseUp);
  }

  private onResizeMouseMove = (e: any) => {
    const { onResize } = this.props;
    if (onResize) {
      onResize(
        this.resizeStartWidth + e.screenX - this.resizeStartX,
        this.resizeStartHeight + e.screenY - this.resizeStartY
      );
    }
  }

  private onResizeMouseUp = () => {
    const { onResizeEnd } = this.props;
    if (onResizeEnd) {
      onResizeEnd();
    }
    document.removeEventListener("mousemove", this.onResizeMouseMove);
    document.removeEventListener("mouseup", this.onResizeMouseUp);
  }

  private startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, onDragStart } = this.props;
    if (onDragStart) {
      onDragStart();
    }
    this.dragStartX = e.screenX - left;
    this.dragStartY = e.screenY - top;
    document.addEventListener("mousemove", this.onDragMouseMove);
    document.addEventListener("mouseup", this.onDragMouseUp);
  }

  private startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width = defaultWindowWidth, height = defaultWindowHeight } = this.props;
    this.resizeStartX = e.screenX;
    this.resizeStartY = e.screenY;
    this.resizeStartWidth = width;
    this.resizeStartHeight = height;
    document.addEventListener("mousemove", this.onResizeMouseMove);
    document.addEventListener("mouseup", this.onResizeMouseUp);
  }
}