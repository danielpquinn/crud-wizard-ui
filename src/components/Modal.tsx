import * as React from "react";
import * as ReactDOM from "react-dom";

interface IProps {
  title: string;
  onClose: () => unknown;
}

export class Modal extends React.Component<IProps, {}> {
  private el: HTMLDivElement;

  constructor(props: IProps) {
    super(props);
    this.el = document.createElement("div");
    this.el.classList.add("modal", "fade", "show");
    this.el.setAttribute("role", "dialog");
    this.el.setAttribute("style", "display: block; z-index: 10;");
    document.body.classList.add("modal-open");
  }

  public componentDidMount() {
    document.body.appendChild(this.el);
  }

  public componentWillUnmount() {
    document.body.classList.remove("modal-open");
    document.body.removeChild(this.el);
  }

  public render() {
    const {
      children,
      onClose,
      title
    } = this.props;

    return ReactDOM.createPortal(
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>,
      this.el
    )
  }
}
