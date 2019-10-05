import * as React from "react";
// import { Converter } from "showdown";
import { DocsLayout } from "src/pages/docs/DocsLayout";
// import markdown from "src/pages/docs/GettingStartedDoc.md";

// const html = new Converter().makeHtml(markdown);

export class GettingStartedDoc extends React.Component<{}, {}> {
  public render() {
    return (
      <DocsLayout title="Getting Started" breadcrumbs={[]}>
        <h1 id="gettingstarted">Getting Started</h1>

<p>This getting started guide will walk you through an integration with the Twilio API. When you are done with this guide, you will be able to view your Twilio account information and notifications.</p>

<p>To complete this getting started guide, you will have to sign up for a free Twilio account at <a href="https://www.twilio.com/try-twilio">twilio.com/try-twilio</a>. You will also need a free crud wizard account, which you can create at <a href="https://crudwizard.com/signup">crudwizard.com/signup</a>.</p>

<h2 id="findanopenapispecforthetwilioapi">Find an OpenAPI Spec for the Twilio API</h2>

<p>When creating a new project, the first step is to find an specification for the API you want to work with and save it in JSON format. You can find an OpenAPI spec for the Twilio api at apis.guru, along with many other popular APIs.</p>

<ol>
<li>Navigate to <a href="https://apis.guru/browse-apis/">apis.guru</a></li>

<li>Search for <strong>twilio</strong></li>

<li>Click on the json button and save a copy of the API spec</li>
</ol>

<h2 id="createanewproject">Create a New Project</h2>

<p>Next we will create a new project in crud wizard for the Twilio API.</p>

<ol>
<li>Navigate to <a href="https://crudwizard.com/projects">crudwizard.com/projects</a></li>

<li>Under <strong>General</strong>, enter a <strong>Project Name</strong> (for example: Twilio)</li>

<li>Under <strong>Specs</strong>, click <strong>Add OpenAPI Spec</strong>. Give your spec a name (for example: <code>twilio.json</code>) and paste the json file that you downloaded in the last section into the text area</li>

<li>Click <strong>Save Changes</strong> to save your new project</li>
</ol>

<h2 id="configureresources">Configure Resources</h2>

<p>At this point you will have a new project called <strong>Twilio</strong> on your projects list view. Navigate to <a href="https://crudwizard.com/projects">crudwizard.com/projects</a> and click on your new project. You will see an empty dashboard titled "Twilio". Clicking on the menu icon in the dashboard's header will open an empty panel because we haven't told crud wizard which resources we want to manage. Let's do that now 🧙‍.</p>

<p>The first resource we will set up is our <code>Account</code> resource. This will allow us to view our Twilio account information.</p>

<ol>
<li>Click on the <strong>Edit Project</strong> tab at the top of the dashboard</li>

<li>Click on the <strong>Resources</strong> tab</li>

<li>Click on <strong>Add Resource</strong></li>

<li>Enter the following information into the form (you will leave some fields blank):


<ul>
<li><strong>Name:</strong> <code>Account</code></li>

<li><strong>OpenAPI Spec:</strong> <code>twilio.json</code></li>

<li><strong>ID:</strong> <code>account</code></li>

<li><strong>ID Field:</strong> <code>sid</code></li>

<li><strong>Create Operation:</strong> <code>post/accounts{'{'}mediaTypeExtension{'}'}</code></li>

<li><strong>List Operation:</strong> <code>get/accounts{'{'}mediaTypeExtension}</code></li>

<li><strong>Get Operation:</strong> <code>get/accounts/{'{'}AccountSid}{'{'}mediaTypeExtension}</code></li>

<li><strong>Account ID:</strong> <code>AccountSid</code></li>

<li><strong>List Item Schema:</strong> <code>definitions/account</code></li>

<li><strong>Name Plural:</strong> <code>Accounts</code></li>

<li><strong>Name Field:</strong> <code>Name</code></li>

<li><strong>Get List Items:</strong> <code>(r) =&gt; r.data.accounts</code></li></ul>
</li>

<li>Click <strong>Save Changes</strong></li>
</ol>

<p>Now that we've told crud wizard about the <code>Account</code> resource, we can click on the <strong>View Project</strong> tab, and then open the menu. You should see an <code>Account</code> item in the navigation. Clicking on the item will open a new list view for the account resource, but you will be presented with an error because the Twilio API requires authentication. We will add authentication in the next section.</p>

<h2 id="addyourtwilioapitoken">Add Your Twilio API Token</h2>

<p>Crud wizard uses <a href="https://github.com/axios/axios">axios</a> to make HTTP requests. We will add an <a href="https://github.com/axios/axios#interceptors">interceptor</a> to all requests made by axios which adds an Authorization header. Additionally, the Twilio API requires a <code>mediaTypeExtension</code> parameter, so we will add that extension to each request as well.</p>

<ol>
<li>Navigate to <a href="https://www.twilio.com/console">https://www.twilio.com/console</a></li>

<li>Find your account SID and auth token. Create a basic authorization string that looks like this: <code>{'{'}accountSid}:{'{'}apiToken}</code>. You will paste this string into a prompt generated by the script we add below.</li>

<li>Click on the <strong>Edit Project</strong> tab at the top of the dashboard</li>

<li>Click on the <strong>Advanced</strong> tab</li>

<li>Enter the following script into the <code>Initialize function</code> text area:</li>
</ol>

<pre><code>(axios) =&gt; {'{'}
  const key = "twilioAuth";
  const message = "Enter your twilio basic authorization string in the following format: {'{'}accountId}:{'{'}apiToken}";
  let authString = localStorage.getItem(key);

  if (!authString) {'{'}
    authString = prompt(message);
    if (authString) {'{'}
      localStorage.setItem(key, authString);
    }
  }

  axios.interceptors.request.use(config =&gt; {'{'}
    config.url = window.decodeURI(config.url).replace("{'{'}mediaTypeExtension}", ".json");
    config.headers.Authorization = `Basic ${'{'}btoa(authString)}`;
    return config;
  });
}
</code></pre>

<ol>
<li>Click <strong>Save Changes</strong></li>

<li>Copy the string you created in step 1 to your clipboard</li>

<li>Click on the <strong>View Project</strong> tab</li>

<li>Paste the string you created in step 1 into the prompt</li>

<li>Open the menu and click on <strong>Accounts</strong>. You should see your twilio account listed 🤞</li>
</ol>
      </DocsLayout>
    )
  }
}