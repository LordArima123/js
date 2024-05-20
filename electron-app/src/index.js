import { app, BrowserWindow, screen } from "electron";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { appName } = require("./package.json");
//import path from "node:path";
// const { app, BrowserWindow } = require("electron");
// const path = require("node:path");
// let myWindow = null;

const createWindow = () => {
  const displays = screen.getAllDisplays();
  const existingWindow = BrowserWindow.getAllWindows()[0];
  if (existingWindow) {
    // If a window already exists, just focus it
    existingWindow.focus();
  } else {
    if (displays.length >= 2) {
      const secondDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
      });
      const win = new BrowserWindow({
        x: secondDisplay.bounds.x,
        y: secondDisplay.bounds.y,
        width: 800,
        height: 600,
        title: appName,
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
        title: appName,
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
  }
};
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    createWindow();
  });

  app.whenReady().then(createWindow);
}
