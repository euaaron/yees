import { contextBridge } from "electron";
import find from "local-devices";
import { DevicePropery, Discover, IDevice, Yeelight } from "yeelight-awesome";

const devices: IDevice[] = [];
const discover = new Discover({});

discover.start();

async function discoverDevices() {
  const foundDevices: IDevice[] = [];

  if (devices.length == 0) {
    const data = await discover.scanByIp();
    data.forEach((item) => {
      foundDevices.push(item);
    });
    discover.destroy();
    const networkItems = await find();
    networkItems
      .filter((item) => item.name.includes("yeel"))
      .forEach((item) => {
        const found = foundDevices.find((device) => device.host === item.ip);
        found && devices.push(found);
      });
  }

  return devices;
}

function getLampProps(host: string) {
  return connectDevice(host)?.then((light) => {
    const props: DevicePropery[] = [
      DevicePropery.POWER,
      DevicePropery.BRIGHT,
      DevicePropery.NAME,
      DevicePropery.RGB,
      DevicePropery.HUE,
    ];
    const lampProps = light.getProperty(props);
    light.disconnect();
    return lampProps;
  });
}

function connectDevice(host: string): Promise<Yeelight> | null {
  const item = devices.find((device) => device.host === host);
  if (item) {
    const light = new Yeelight({
      lightIp: item.host,
      lightPort: item.port,
    });
    return light.connect();
  }
  return null;
}

function powerOff(host: string): Boolean {
  return connectDevice(host)?.then((light) => {
    light.setPower(false, 'smooth', 2500).then(() => {
      light.disconnect();
    });
  })
    ? true
    : false;
}

function powerOn(host: string): Boolean {
  return connectDevice(host)?.then((light) => {
    light.setPower(true, 'smooth', 2500).then(() => {
      light.disconnect();
    });
  })
    ? true
    : false;
}

contextBridge.exposeInMainWorld("Yees", {
  devices: async () => discoverDevices(),
  lamp: (host: string) => getLampProps(host),
  powerOff: (host: string) => powerOff(host),
  powerOn: (host: string) => powerOn(host),
});
