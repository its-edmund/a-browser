// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // example: tell main process to open devtools for the active webview
  openGuestDevTools: () => ipcRenderer.send("tab:open-devtools"),
});

contextBridge.exposeInMainWorld("tabsAPI", {
  requestState: () => ipcRenderer.invoke("tabs:request"),
  saveState: (state) => ipcRenderer.send("tabs:save", state),
});

contextBridge.exposeInMainWorld("electron", {
  hotkeys: {
    onHotkey: (cb) => ipcRenderer.on("hotkey-fired", (_e, id) => cb(id)),
  },
  cookies: {
    set: (cookie) => ipcRenderer.invoke("cookie-set", cookie),
    get: (filter) => ipcRenderer.invoke("cookie-get", filter),
  },
});
