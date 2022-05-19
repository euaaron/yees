import { IDevice, IEventResult } from "yeelight-awesome";

export interface IYees {
  devices: () => Promise<IDevice[]>;
  lamp: (host: string) => Promise<IEventResult>;
  powerOff: (host: string) => Boolean;
  powerOn: (host: string) => Boolean;
}
