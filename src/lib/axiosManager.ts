import { AxiosInstance, default as axios } from "axios";

let instance: AxiosInstance | null;

export const resetAxios = () => {
  instance = null;
};

export const getAxios = () => {
  if (!instance) {
    instance = axios.create();
  }
  return instance;
};
