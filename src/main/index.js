import { app, BrowserWindow, screen, dialog, Menu } from "electron";
import fs from "fs";
// import menu from "./menu";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function openDialog() {
  let currentDir = dialog.showOpenDialog(null, {
    properties: ["openDirectory"]
  })[0];

  let filePaths = [];

  fs.readdir(currentDir, (err, files) => {
    if (err) throw err;
    filePaths = files
      .filter(file => {
        return (
          fs.statSync(currentDir + "/" + file).isFile() &&
          /.*\.(jpg|png|gif)$/.test(file)
        );
      })
      .map(file => {
        return currentDir + "/" + file;
      });

    mainWindow.webContents.send("filepath", filePaths);
    console.log(filePaths);
  });
}

function createWindow() {
  const size = screen.getPrimaryDisplay().size;
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: "Static Image Viewer",
    height: size.height,
    width: size.width,
    useContentSize: true,
    frame: false
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  openDialog();
}

app.on("ready", () => {
  createWindow();

  const tpl = [
    {
      label: "ファイル",
      submenu: [
        {
          label: "開く",
          accelerator: "Command+O",
          click() {
            openDialog();
          }
        },
        {
          label: "開発ツール",
          accelerator: "Alt+Command+I",
          click: function() {
            mainWindow.toggleDevTools();
          }
        },
        {
          type: "separator"
        },
        {
          label: "終了",
          accelerator: "Command+Q",
          click() {
            app.quit();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(tpl);
  Menu.setApplicationMenu(menu);
});

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
