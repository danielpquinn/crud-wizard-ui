import * as React from "react";
import { Header } from "src/pages/Header";

export class Layout extends React.Component<{}, {}> {

  public render(): React.ReactNode {
    const { children } = this.props;

    return (
      <>
        <Header />
        <div className="container">
          {children}
        </div>
      </>
    );
  }
}
