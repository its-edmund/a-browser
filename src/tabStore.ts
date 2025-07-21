import Store from "electron-store";
import { BrowserWindow } from "electron";

interface TabSnapshot {
  id: string;
  url: string;
  title?: string;
}
interface TabsState {
  tabs: TabSnapshot[];
  activeId: string | null;
}

export const tabStore = new Store<TabsState>({
  name: "tabs", // tabs.json in userData
  defaults: { tabs: [], activeId: null },
});
