/**
 * OpenAPI utilities
 */
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAxios } from "src/lib/axiosManager";
import { BodyParameter, FormDataParameter, HeaderParameter, Operation, PathParameter, QueryParameter, Ref, Spec } from "src/types/swagger";

export type ResolvedParameter =
  BodyParameter |
  FormDataParameter |
  QueryParameter |
  PathParameter |
  HeaderParameter;

export interface IOperationParameters {
  [key: string]: any;
}

export interface IOperationObjectWithPathAndMethod {
  method: string;
  path: string;
  operation: Operation;
}

export const getOperations = (spec: Spec): IOperationObjectWithPathAndMethod[] => {
  const result = [];
  for (const path in spec.paths) {
    if (spec.paths[path]) {
      for (const method in spec.paths[path]) {
        if (spec.paths[path]) {
          result.push({
            method,
            operation: spec.paths[path][method],
            path
          });
        }
      }
    }
  }
  return result;
}

export const findOperationObject = (spec: Spec, operationId: string): IOperationObjectWithPathAndMethod | null => {
  for (const path in spec.paths) {
    if (spec.paths[path]) {
      for (const method in spec.paths[path]) {
        if (spec.paths[path][method].operationId === operationId || `${method}${path}` === operationId) {
          return {
            method,
            operation: spec.paths[path][method],
            path
          }
        }
      }
    }
  }
  return null;
};

const isArray = (item: any): boolean => {
  return Array.isArray(item);
};

const isObject = (item: any): boolean => {
  return typeof item === "object";
};

const isArrayOrObject = (item: any): boolean => {
  return isArray(item) || isObject(item);
};

export const resolveAllReferences = (spec: Spec): Spec => {
  const resolved = {};

  const queue: any[] = [];
  const resolvedQueue: any[] = [];

  queue.push(spec);
  resolvedQueue.push(resolved);

  while (queue.length > 0) {
    const node = queue.shift();
    const resolvedNode = resolvedQueue.shift();

    if (isArray(node)) {
      for (let i = 0; i < node.length; i += 1) {
        const item = node[i];
        if (isArray(item)) {
          resolvedNode[i] = [];
        } else if (isObject(item)) {
          resolvedNode[i] = {};
        } else {
          resolvedNode[i] = item;
        }
        if (isArrayOrObject(item)) {
          queue.push(item);
          resolvedQueue.push(resolvedNode[i]);
        }
      }
    } else if (isObject(node)) {
      for (const key in node) {
        if (node[key]) {
          const item = node[key];
          if (isArray(item)) {
            resolvedNode[key] = [];
          } else if (isObject(item)) {
            resolvedNode[key] = {};
          } else {
            resolvedNode[key] = item;
          }
          if (isArrayOrObject(item)) {
            queue.push(item);
            resolvedQueue.push(resolvedNode[key]);
          }
        }
      }
    }
  }

  resolvedQueue.push(resolved);

  while (resolvedQueue.length > 0) {
    const node = resolvedQueue.shift();

    if (isArray(node)) {
      for (let i = 0; i < node.length; i += 1) {
        const item = node[i];
        if (isArrayOrObject(item)) {
          node[i] = resolveReference(spec, item);
          resolvedQueue.push(node[i]);
        }
      }
    } else if (isObject(node)) {
      for (const key in node) {
        if (node[key]) {
          node[key] = resolveReference(spec, node[key]);
          if (isArrayOrObject(node[key])) {
            resolvedQueue.push(node[key]);
          }
        }
      }
    }
  }

  return resolved as Spec;
};

export const resolveReference = <RefType>(spec: Spec, value: RefType | Ref): RefType => {
  const referenceObject: Ref = value as Ref;
  if (referenceObject.$ref && referenceObject.$ref.startsWith("#")) {
    let result: any = spec;
    const path = referenceObject.$ref.substring(2, referenceObject.$ref.length).split("/");
    for (const segment of path) {
      if (result[segment]) {
        result = result[segment];
        if (result.$ref) { result = spec; }
      }
    }
    return result as RefType;
  }
  return value as RefType;
}

export const getRequestConfig = async (spec: Spec, operationId: string, args: IOperationParameters) => {
  const operation = findOperationObject(spec, operationId);
  if (!operation) { throw new Error(`Could not find operation with ID ${operationId}`); }
  const url = new URL(`https://${spec.host}${spec.basePath || ""}`);

  const config: AxiosRequestConfig = {
    headers: { "Content-Type": "application/json" },
    method: operation.method,
  };

  let path = operation.path;

  if (operation.operation.parameters) {
    const resolvedParams = operation.operation.parameters.map(param => resolveReference(spec, param));
    const pathParams = resolvedParams.filter(param => param && param.in === "path");

    pathParams.forEach(param => {
      if (!param) { return; }
      const argument = args[param.name];
      if (argument) {
        path = path.replace(`{${param.name}}`, encodeURIComponent(argument));
      }
    });
  }

  const remainingPathParams = path.match(/{(\w*)}/g);

  if (remainingPathParams) {
    remainingPathParams.forEach(param => {
      const paramName = param.substring(1, param.length - 1);
      if (args[paramName]) {
        path = path.replace(`{${paramName}}`, encodeURIComponent(args[paramName]));
      }
    });
  }

  url.pathname = `${spec.basePath || ""}${path}`;

  if (operation.operation.parameters) {
    const resolvedParams = operation.operation.parameters.map(param => resolveReference(spec, param));
    const queryParams = resolvedParams.filter(param => param && param.in === "query");
    const bodyParams = resolvedParams.filter(param => param && param.in === "body");

    queryParams.forEach(param => {
      if (!param) { return; }
      const argument = args[param.name];
      if (argument) {
        url.searchParams.append(param.name, argument);
      }
    });

    bodyParams.forEach(param => {
      if (!param) { return; }
      config.data = args[param.name];
    });
  }

  config.url = url.href;

  return config;
};

export const operate = async (spec: Spec, operationId: string, args: IOperationParameters): Promise<AxiosResponse> => {
  const config = await getRequestConfig(spec, operationId, args);

  try {
    const response = await getAxios()(config);
    return response;
  } catch (e) {
    // tslint:disable:no-console
    console.error(e);
    const response = e.response;
    return response;
  }
};

export const getOperationId = (operation: IOperationObjectWithPathAndMethod): string => {
  if (operation.operation.operationId) {
    return operation.operation.operationId;
  }
  return `${operation.method}${operation.path}`;
}
