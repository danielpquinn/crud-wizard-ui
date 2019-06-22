import { level } from "src/types/bootstrap";

export interface IToast {
  id: number;
  level: level;
  message: string;
}
