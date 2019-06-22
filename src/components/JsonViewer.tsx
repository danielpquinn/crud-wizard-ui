/**
 * @class JsonViewer
 * @description Displays JSON in an expandable tree view format
 */

import * as React from "react";

interface IProps {

  /**
   * Key to display in left column
   */
  keyName?: string;

  /**
   * Value to display in right column
   */
  value: any;
}

interface IState {

  /**
   * If the value is an array or object, this controls whether it is expanded
   */
  expanded: boolean;
}

export class JsonViewer extends React.Component<IProps, IState> {

  /**
   * Max number of key/value pairs to include in an object or array summary string
   */
  private static readonly maxKeysInSummary = 4;

  /**
   * How many characters to display when truncating strings in summaries
   */
  private static readonly maxValueSummaryLength = 10;

  /**
   * Check whether type is a primitive
   */
  private static isPrimitiveType(value: any): boolean {
    return value === null || typeof value !== "object";
  }

  /**
   * Return a summary string for any type of value
   * @param value Can be any value for a key or index in some JSON object
   * @param truncate If this is a string, should it be truncated
   */
  private static getValueSummary(value: any, truncate?: boolean): string {
    if (Array.isArray(value)) {
      return "[…]";
    } else if (typeof value === "object") {
      return "{…}";
    } else if (typeof value === "string") {
      let ellipsis = "";
      if (value.length > JsonViewer.maxValueSummaryLength) {
        ellipsis = "…";
      }
      return truncate ? `"${value.substring(0, 10)}${ellipsis}"` : `"${value}"`;
    } else {
      return `${value}`;
    }
  }

  /**
   * Any array or object
   * @param object Array or object to generate a summary for
   */
  private static getObjectSummary(object: { [key: string]: any }): string {
    const keys = Object.keys(object);
    const hasManyKeys = keys.length > JsonViewer.maxKeysInSummary;
    const keysInSummary = keys.slice(0, JsonViewer.maxKeysInSummary);
    const isArray = Array.isArray(object);

    let summary = isArray ? "[ " : "{ ";

    for (const key of keysInSummary) {
      const value = object[key];
      if (!isArray) { summary += `${key}: `; }
      summary += `${JsonViewer.getValueSummary(value, true)}, `;
    }

    if (hasManyKeys) {
      summary += "…";
    }

    summary += isArray ? " ]" : " }";

    return summary;
  }

  constructor(props: IProps) {
    super(props);

    // Initialize state

    this.state = {
      expanded: false
    };
  }

  public render(): React.ReactNode {
    const { keyName, value } = this.props;
    const { expanded } = this.state;
    const showToggle = !JsonViewer.isPrimitiveType(value);
    const iconDirection = expanded ? "down" : "right";

    const toggle = (
      <a href="javascript:void(0)" onClick={this.toggle} style={{ visibility: showToggle ? "inherit" : "hidden"}}><i className={`zmdi zmdi-caret-${iconDirection} zmdi-hc-fw`}/></a>
    );

    const isPrimitiveType = JsonViewer.isPrimitiveType(value);
    const summary = isPrimitiveType ? JsonViewer.getValueSummary(value) : JsonViewer.getObjectSummary(value);

    return (
      <span className="json-viewer">
        {toggle}{keyName && <strong>{keyName}: </strong>}{summary}

        {expanded && (
          <ul>
            {Object.keys(value).map((innerKey: string) => {
              return <li key={innerKey}><JsonViewer keyName={innerKey} value={value[innerKey]}/></li>;
            })}
          </ul>
        )}
      </span>
    );
  }

  /**
   * Expand or close this key/value pair
   */
  private toggle = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  }
}