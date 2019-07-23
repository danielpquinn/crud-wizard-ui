import * as React from "react";
import { getTweenManager } from 'src/lib/TweenManager';

interface IVisibleColumns {
  [column: string]: boolean;
}

interface IState {
  opacity: number;
  top: number;
}

interface IProps {
  visibleColumns: IVisibleColumns;
  onSubmit: (visibleColumns: IVisibleColumns) => any;
}

export class ListSettings extends React.Component<IProps, IState> {
  private animation: { top: number, opacity: number };

  constructor(props: IProps) {
    super(props);

    this.animation = {
      top: -300,
      opacity: 0
    };

    this.state = {
      top: -300,
      opacity: 0
    };
  }

  public componentDidMount() {
    getTweenManager().addTween(this.animation, "opacity", 1);
    getTweenManager().addTween(this.animation, "top", 0, {
      onStep: () => {
        this.setState({
          opacity: this.animation.opacity,
          top: this.animation.top
        });
      }
    });
  }

  public render(): React.ReactNode {
    const { opacity, top } = this.state;

    return(
      <div className="list-settings-container">
        <div className="list-settings" style={{ opacity, top: `${top}px` }}>
          Test
        </div>
      </div>
    );
  }
}
