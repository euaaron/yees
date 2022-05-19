import { IDevice, Yeelight } from "yeelight-awesome";


export interface IYeeDevice {
  device: IDevice;
  light: Yeelight | null;
}
