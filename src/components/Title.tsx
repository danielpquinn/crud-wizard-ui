import * as React from "react";

interface IProps {
  title: string;
}

export class Title extends React.Component<IProps> {

  public render(): JSX.Element {
    return (
      <h1>{this.props.title}</h1>
    );
  }
}
