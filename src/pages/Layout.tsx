import * as React from "react";
import { Header, IHeaderProps } from "src/pages/Header";

export class Layout extends React.Component<IHeaderProps, {}> {

  public render(): React.ReactNode {
    const { breadcrumbs, pageTitle, children } = this.props;

    return (
      <>
        <Header
          breadcrumbs={breadcrumbs}
          pageTitle={pageTitle}
        />
        {children}
      </>
    );
  }
}
