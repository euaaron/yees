import { IYees } from "../models/IYees";

declare global {
  interface Window {
    Yees: IYees
  }
}