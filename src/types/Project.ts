import { AxiosInstance, AxiosResponse } from "axios";
import { IOperationParameters } from "src/lib/swagger";
import { IResource } from "src/types/resource";
import { Spec } from "src/types/swagger";

/**
 * Project configuration provided by users
 */
export interface IProject {
  id: string;
  name: string;
  getTotalResults: (response: AxiosResponse) => number;
  addPageParams: (
    page: number,
    params: IOperationParameters,
    response: AxiosResponse
  ) => IOperationParameters;
  initialize?: (axios: AxiosInstance) => Promise<any>,
  signOut?: () => Promise<any>;
  resources: IResource[];
  specs: Array<{ id: string, spec: Spec }>;
}
