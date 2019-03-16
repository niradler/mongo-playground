const electron = require("electron");
const Store = require("electron-store");

const store = new Store();

const getScreenSize = () => {
  const screenElectron = electron.screen;
  const mainScreen = screenElectron.getPrimaryDisplay();
  const dimensions = mainScreen.size;

  return dimensions;
};

export default { getScreenSize, store };
