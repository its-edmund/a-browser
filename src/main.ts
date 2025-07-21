import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { tabStore } from "./tabStore";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hiddenInset",
    transparent: true, // allows OS pixels to show through
    backgroundColor: "#00000000", // required on Windows
    vibrancy: "menu", // macOS Big Sur+ frosted look
    webPreferences: {
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // ⌘L / Ctrl+L  →  tell renderer to focus the address bar
  globalShortcut.register("CommandOrControl+L", () => {
    win.webContents.send("hotkey:focus-address");
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.handle("tabs:request", () => tabStore.store);

ipcMain.on("tabs:save", (_e, state) => {
  tabStore.store = state; // persists to disk
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
