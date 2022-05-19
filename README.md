# Yees: Control your Yeelights

A tray menu app that facilitates control Yeelight bulbs.

## About

I have a Yeelight lamp and all apps that I've found did not worked with it, except by the official Android app, Google Home, Alexa and Razer Chroma. Unfortunately those apps are not available everywhere and they bring much more functions than I needed. I wanted an app that would be simple, compact and have the same functionalities on Mac, Windows and Linux. That's why I started this project.

## Techs

- Electron - to make the app compatible with all platforms.
- React - a handy way to make components e add reactivity.
- Typescript - to do not get lost.
- Vite and ESBuild instead of Webpack, so it can build and run faster than light.
- Yeelight-Awesome - to discover, connect and send actions to the lamps on the network.
- local-devices - to help to remove devices that aren't Yeelights.

## Compatibility

> Should work anywhere compatible with Chrome v100.

- Tested on MacOS Big Sur v11.6.6

## What work

- Turn lights on and off

## TODO

- Change color
- Change brightness
- Add actions to be triggered at specific time (ex. turn lights off at midnight)
