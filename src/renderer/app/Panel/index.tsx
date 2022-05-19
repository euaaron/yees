import React, { Component } from "react";
import { IDevice } from "yeelight-awesome";
import { BulbCard } from "./components/BulbCard";

interface IPanelState {
  devices: IDevice[];
}

export class Panel extends Component<{}, IPanelState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  componentDidMount() {
    window.Yees.devices().then((devices: IDevice[]) => {
      this.setState({
        devices,
      });
    });
  }

  render() {
    const { devices } = this.state;
    return (
      <div id="panel">
        {devices.map((device: IDevice) => (
          <BulbCard key={device.host} {...device} />
        ))}
      </div>
    );
  }
}
