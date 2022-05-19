import React, { Component } from "react";
import { IDevice } from "yeelight-awesome";
import BulbIconOff from "../../../../main/assets/bulb.svg";
import BulbIconOn from "../../../../main/assets/bulbOn.svg";

interface IBulbState {
  power: "On" | "Off" | "Unknown";
  temperature: number;
  brightness: number;
  hue: number;
  device: IDevice;
}

export class BulbCard extends Component<IDevice, IBulbState> {
  constructor(props: IDevice) {
    super(props);
    this.state = {
      power: "Unknown",
      temperature: 0,
      brightness: 0,
      hue: 0,
      device: props,
    };
  }

  toggleOn() {
    window.Yees.powerOn(this.props.host);
    this.setState({ power: "On" });
  }

  toggleOff() {
    window.Yees.powerOff(this.props.host);
    this.setState({ power: "Off" });
  }

  toggle() {
    if (this.state.power === "On") {
      this.toggleOff();
    } else {
      this.toggleOn();
    }
  }

  render() {
    const { device, power } = this.state;
    return (
      <button className="bulbCard" onClick={() => this.toggle()}>
        <span>
          {power === "On" ? (
            <img src={BulbIconOn} />
          ) : (
            <img src={BulbIconOff} />
          )}
          <h2>{power}</h2>
        </span>
        <strong>Address: {device.host}</strong>
      </button>
    );
  }
}
