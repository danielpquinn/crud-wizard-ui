import * as React from "react";

interface IProps {
    brand: string;
}

export class Title extends React.Component<IProps> {

    public render(): JSX.Element {
      return (
       <h2>{this.props.brand}</h2>
      );
    }
  }