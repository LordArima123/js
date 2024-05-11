import { app, BrowserWindow, screen } from "electron";
//import path from "node:path";
// const { app, BrowserWindow } = require("electron");
// const path = require("node:path");

const createWindow = () => {
  const displays = screen.getAllDisplays();

  if (displays.length >= 2) {
    const secondDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });
    const win = new BrowserWindow({
      x: secondDisplay.bounds.x,
      y: secondDisplay.bounds.y,
      width: 800,
      height: 600,
      title: "Second Display",
      icon: "./logobackground.png",
      autoHideMenuBar: true,
      fullscreen: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    win.maximize();
    win.loadFile("index.html");
  } else {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      title: "Second Display",
      icon: "./logobackground.png",
      autoHideMenuBar: true,
      fullscreen: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    win.maximize();
    win.loadFile("index.html");
  }
};
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
