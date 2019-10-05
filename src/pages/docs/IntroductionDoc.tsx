import Markdown from "markdown-to-jsx";
import * as React from "react";
import { DocsLayout } from "src/pages/docs/DocsLayout";
import { content } from "src/pages/docs/IntroductionContent";

export class IntroductionDoc extends React.Component<{}, {}> {
  public render() {
    return (
      <DocsLayout title="Introduction" breadcrumbs={[]}>
        <Markdown>{content}</Markdown>
      </DocsLayout>
    )
  }
}