const BrowserWindow = require("sketch-module-web-view");
const { getWebview } = require("sketch-module-web-view/remote");
// we will also need a function to transform an NSArray into a proper JavaScript array
// the `util` package contains such a function so let's just use it.
const { toArray } = require("util");
const UI = require("sketch/ui");
const sketch = require("sketch");
const { handlerSelection } = require("./selection.js");
const webviewIdentifier = "sketch-slice-plugin.webview";

export default function(context) {
  const options = {
    identifier: webviewIdentifier,
    width: 400,
    height: 380
  };
  const browserWindow = new BrowserWindow(options);
  const webContents = browserWindow.webContents;
  const selection = toArray(context.selection);

  // add a handler for a call from web content's javascript
  webContents.on("getOptions", options => {
    UI.message("handleSelection");
    handlerSelection(selection, options);
  });

  browserWindow.loadURL(require("../resources/webview.html"));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}
