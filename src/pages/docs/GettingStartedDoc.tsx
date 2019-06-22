import * as React from "react";
import { DocsLayout } from "src/pages/docs/DocsLayout";

export class GettingStartedDoc extends React.Component<{}, {}> {

  public render() {
    return (
      <DocsLayout>
<h1 id="gettingstarted">Getting Started</h1>

<p>This getting started guide will walk you through an integration with the Twilio API. When you are done with this guide, you will be able to view your Twilio account information and notifications.</p>

<h2 id="createafreecrudwizardaccount">Create a Free Crud Wizard Account</h2>

<p>Sign up for a free crud wizard account on the home page of <a href="https://crudwizard.com">crudwizard.com</a>. After signing up you will land on a Projects page where you can edit your projects.</p>

<h2 id="createatrialtwilioaccount">Create a Trial Twilio Account</h2>

<p>To complete this getting started guide, you will also have to sign up for a free Twilio account at <a href="https://www.twilio.com/try-twilio">twilio.com/try-twilio</a>.</p>

<h2 id="findanopenapispecforthetwilioapi">Find an OpenAPI Spec for the Twilio API</h2>

<p>When creating a new project, the first step is to save a copy of your OpenAPI specification in JSON format. Twilio does not provide an official OpenAPI version of its API spec, but you can find one at APIs.guru (along with many other popular API specs).</p>

<ol>
<li>Navigate to <a href="https://apis.guru/browse-apis/">apis.guru</a></li>

<li>Search for <strong>twilio</strong></li>

<li>Click on the json button and save a copy of the API spec</li>
</ol>

<h2 id="createanewproject">Create a New Project</h2>

<p>After logging in to your crud wizard account, click on the <strong>Create Project</strong> button at the top of the projects list view.</p>

<ul>
<li>Under <strong>General</strong>, enter a <strong>Project Name</strong> (for example: Twilio).</li>

<li>Under <strong>Specs</strong>, click <strong>Add OpenAPI Spec</strong>. Give your spec a name (for example: twilio.json) and paste the json file that you downloaded in the last section into the text area.</li>
</ul>

      </DocsLayout>
    )
  }
}