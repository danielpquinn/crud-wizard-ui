import { IResource } from "src/types/resource";
import { Spec } from "src/types/swagger";

export interface IProjectResponseBody {
  id: number;
  name: string;
  resources: IResource[];
  initialize: string;
  addPageParams: string;
  getTotalResults: string;
  specs: Array<{ [id: string]: Spec }>;
  userId: number;
}
