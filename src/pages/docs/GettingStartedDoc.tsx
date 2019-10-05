import Markdown from "markdown-to-jsx";
import * as React from "react";
import { DocsLayout } from "src/pages/docs/DocsLayout";
import { content } from "src/pages/docs/GettingStartedContent";

export class GettingStartedDoc extends React.Component<{}, {}> {
  public render() {
    return (
      <DocsLayout title="Getting Started" breadcrumbs={[]}>
        <Markdown>{content}</Markdown>
      </DocsLayout>
    )
  }
}