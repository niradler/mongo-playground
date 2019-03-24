const electron = require("electron");
const Store = require("electron-store");
const { getCurrentWindow, globalShortcut } = require("electron").remote;
const { shell } = require("electron");
const store = new Store();

const getScreenSize = () => {
  const dimensions = {};
  const screenElectron = electron.screen;
  const mainScreen = screenElectron.getPrimaryDisplay();
  dimensions.actual = mainScreen.size;
  dimensions.bounds = getCurrentWindow().getBounds();
  dimensions.size = getCurrentWindow().getSize();

  return dimensions;
};

const reload = () => {
  getCurrentWindow().reload();
};

export default { getScreenSize, store, reload, shell };
