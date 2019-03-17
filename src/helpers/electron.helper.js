const electron = require("electron");
const Store = require("electron-store");
const { getCurrentWindow, globalShortcut } = require("electron").remote;

const store = new Store();

const getScreenSize = () => {
  const screenElectron = electron.screen;
  const mainScreen = screenElectron.getPrimaryDisplay();
  const dimensions = mainScreen.size;

  return dimensions;
};

const reload = () => {
  getCurrentWindow().reload();
};

export default { getScreenSize, store, reload };
