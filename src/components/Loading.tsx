/**
 * @class Loading
 * @description Loading spinner
 */
import * as React from "react";

export class Loading extends React.Component<{}> {

  public render(): JSX.Element {
    return (
      <div className="loading text-center">
        <i className="zmdi zmdi-refresh zmdi-hc-2x zmdi-hc-spin"/>
      </div>
    );
  }
}
