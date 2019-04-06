const electron = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fixPath = require("fix-path");
const ipc = require("electron-better-ipc");

fixPath();

const { app, Menu } = electron;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let workerWindow;

ipc.answerRenderer("run-code", async task => {
  try {
    if (!workerWindow)
      throw new Error("worker is close, please restart the app.");
    const response = await ipc.callRenderer(
      workerWindow,
      "run-code-worker",
      task
    );

    return response;
  } catch (error) {
    return { output: error.message, endAt: 0 };
  }
});

ipc.answerRenderer("restart-worker", async () => {
  try {
    if (workerWindow) workerWindow.close();
    else throw new Error("worker not found.");

    return "success";
  } catch (error) {
    return error.message;
  }
});
function createWorkerWindow() {
  if (!mainWindow) return;
  workerWindow = new BrowserWindow({
    show: false,
    parent: mainWindow,
    width: 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  });

  workerWindow.loadURL(
    isDev
      ? `file://${path.join(__dirname, "../public/worker.html")}`
      : `file://${path.join(__dirname, "../build/worker.html")}`
  );
  if (isDev) {
    workerWindow.webContents.openDevTools();
  }
  workerWindow.on("closed", function(event) {
    createWorkerWindow();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    options: {
      fullscreen: true
    },
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3080"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => (mainWindow = null && workerWindow == null));

  createWorkerWindow(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const template = [
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" }
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    role: "window",
    submenu: [{ role: "minimize" }, { role: "close" }]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          require("electron").shell.openExternal(
            "https://github.com/niradler/mongo-playground"
          );
        }
      }
    ]
  }
];

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideothers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" }
    ]
  });

  // Window menu
  template[3].submenu = [
    { role: "close" },
    { role: "minimize" },
    { role: "zoom" },
    { type: "separator" },
    { role: "front" }
  ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
