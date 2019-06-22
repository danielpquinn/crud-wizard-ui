import { IConfig } from "src/types/Config";

class ConfigManager {
  public getConfig(): IConfig {
    return {
      apiBaseUrl: (window as any).ApiBaseUrl
    };
  }
}

let instance: ConfigManager;

export const getConfigManager = () => {
  if (!instance) {
    instance = new ConfigManager();
  }
  return instance;
};
