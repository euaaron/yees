import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  nativeTheme,
  screen,
  Tray
} from "electron";
import { is } from "electron-util";
import * as path from "path";
import { format } from "url";

let vibrancy:
  | "appearance-based"
  | "light"
  | "dark"
  | "titlebar"
  | "selection"
  | "menu"
  | "popover"
  | "sidebar"
  | "medium-light"
  | "ultra-dark"
  | "header"
  | "sheet"
  | "window"
  | "hud"
  | "fullscreen-ui"
  | "tooltip"
  | "content"
  | "under-window"
  | "under-page" = "dark";
let win: BrowserWindow | null = null;
let backgroundColor = "#272D3520";
let isHidden: Boolean = false;
let tray: Tray | null = null;
const HEIGHT = 180;
const WIDTH = 280;

function getIconByTheme() {
  if (nativeTheme.shouldUseDarkColors) {
    return nativeImage.createFromPath(
      path.join(__dirname, "./assets/bulb.png")
    );
  }
  return nativeImage.createFromPath(
    path.join(__dirname, "./assets/bulbDark.png")
  );
}

if (!nativeTheme.shouldUseDarkColors) {
  backgroundColor = "#f2f2ff20";
  vibrancy = "light";
}

function setNativeTheme() {
  if (nativeTheme.shouldUseDarkColors) {
    win?.setBackgroundColor("#272D3520");
    win?.setVibrancy("dark");
  } else {
    win?.setBackgroundColor("#f2f2ff20");
    win?.setVibrancy("light");
  }
  tray?.setImage(getIconByTheme());
  win?.setIcon(getIconByTheme());
}

async function createWindow() {
  win = new BrowserWindow({
    frame: false,
    width: WIDTH,
    height: HEIGHT,
    minHeight: HEIGHT,
    minWidth: WIDTH,
    titleBarOverlay: false,
    autoHideMenuBar: true,
    paintWhenInitiallyHidden: true,
    transparent: true,
    backgroundColor,
    vibrancy,
    fullscreenable: false,
    skipTaskbar: true,
    resizable: false,
    title: "Yees",
    icon: getIconByTheme(),
    x: getTrayPosition().x,
    y: getTrayPosition().y,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      contextIsolation: true,
      experimentalFeatures: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });
  win.setMenu(null);
  win.setMenuBarVisibility(false);
  Menu.setApplicationMenu(null);

  const isDev = is.development;

  if (isDev) {
    win.loadURL("http://localhost:9080");
  } else {
    win.loadURL(
      format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  win.addListener("blur", () => {
    if (!isHidden) {
      win?.hide();
      isHidden = true;
    }
  });

  win.on("closed", () => {
    win = null;
  });

  win.webContents.on("devtools-opened", () => {
    win!.focus();
  });

  win.on("ready-to-show", () => {
    win!.show();
    win!.focus();

    if (isDev) {
      win!.webContents.openDevTools({ mode: "bottom" });
    }
  });
}

function getTrayPosition() {
  const position = findTaskbarPosition();
  if (position === "bottom" || position === "top") {
    return {
      x: tray!.getBounds().x - WIDTH / 2,
      y: tray!.getBounds().y,
    };
  }
  return {
    x: tray!.getBounds().x,
    y: tray!.getBounds().y - HEIGHT / 2,
  };
}

function findTaskbarPosition(): string {
  const { x, y } = tray!.getBounds();
  let height = screen.getPrimaryDisplay().bounds.height;

  if (y === 0) {
    return "top";
  }
  if (y === height) {
    return "bottom";
  }
  if (x - 280 < 0) {
    return "left";
  }
  return "right";
}

function toggleVisibility() {
  if (isHidden) {
    win?.show();
    isHidden = false;
  } else {
    win?.hide();
    isHidden = true;
  }
}

app.on("ready", () => {
  const iconPath = path.join(__dirname, "./assets/bulb.png");
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);
  tray.setToolTip("Yees: Control your lights");

  tray.addListener("click", () => {
    if (win === null && app.isReady()) {
      createWindow();
    }
    toggleVisibility();
  });

  nativeTheme.on("updated", () => {
    setNativeTheme();
  });
});

app.on("activate", () => {
  if (win === null && app.isReady()) {
    createWindow();
  }
});
