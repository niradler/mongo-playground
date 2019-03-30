const electron = require("electron");
const Store = require("electron-store");
const { getCurrentWindow, globalShortcut, dialog } = require("electron").remote;
const { shell, app } = require("electron");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

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

const downloadFile = (
  fileString,
  type = { name: "JavaScript", extensions: ["js"] }
) => {
  let savePath = dialog.showSaveDialog({
    filters: [type]
  });
  if (!savePath) return;
  // if (!savePath.includes(".js")) savePath += ".js";

  return writeFile(savePath, fileString);
};

export default {
  getScreenSize,
  store,
  reload,
  shell,
  globalShortcut,
  app,
  downloadFile
};
