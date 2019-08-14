import * as axios from "axios";
import { getAxios } from "src/lib/axiosManager";
import { getConfigManager } from "src/lib/ConfigManager";
import { resolveAllReferences } from "src/lib/swagger";
import { IProject } from "src/types/Project";
import { Spec } from "src/types/swagger";

let config: ProjectManager;

class ProjectManager {
  private resolvedSpecs: Array<{ id: string; spec: Spec }>;
  private project: IProject;

  constructor() {
    this.resolvedSpecs = [];
  }

  public async loadConfig(project: string): Promise<string | null> {
    const response = await axios.default.get(`${getConfigManager().getConfig().apiBaseUrl}/api/v1/projects/${project}`);

    if (!response.data) { return null; }

    this.project = response.data;

    this.evalField(this.project, "initialize");
    this.evalField(this.project, "getTotalResults");
    this.evalField(this.project, "addPageParams");
    this.evalField(this.project, "signOut");

    for (const resource of this.project.resources) {
      this.evalField(resource, "getListItems");
      this.evalField(resource, "getDetailItem");
      this.evalField(resource, "getUpdateFormDefaults");
    }

    if (this.project.initialize) {
      this.project.initialize(getAxios());
    }

    try {
      for (const spec of this.project.specs) {
        this.resolvedSpecs.push({
          id: spec.id,
          spec: resolveAllReferences(spec.spec)
        });
      }
    } catch (e) {
      return e.message;
    }

    return null;
  };

  public getResolvedSpec(specId: string): Spec | null {
    const resolvedSpec = this.resolvedSpecs.find(spec => spec.id === specId);
    return resolvedSpec ? resolvedSpec.spec : null;
  }

  public getResource(resourceId: string) {
    return this.project.resources.find(resource => resource.id === resourceId);
  }

  public getResources() {
    return this.project.resources;
  }

  public getProject(): IProject {
    return this.project;
  }

  private evalField(object: {}, field?: string) {
    if (!field) { return; }
    if (object[field]) {
      try {
        // tslint:disable:no-eval
        eval(`window.___tempFunction = ${object[field]}`);
        object[field] = (window as any).___tempFunction;
        delete (window as any).___tempFunction;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const getProjectManager = () => {
  if (!config) {
    config = new ProjectManager();
  }
  return config;
};
