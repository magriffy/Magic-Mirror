const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
  start() {},

  socketNotificationReceived(notification, payload) {
    if (notification !== "GET_IMAGES") return;

    // Determine folder to read
    const requestedFolder = payload && payload.folder ? payload.folder : null;
    let readPath;
    let webBase;

    try {
      if (requestedFolder) {
        // resolve relative to project root if possible
        const root = (typeof global !== 'undefined' && global.root_path) ? global.root_path : process.cwd();
        readPath = path.resolve(root, requestedFolder);
        webBase = '/' + requestedFolder.replace(/\\/g, '/').replace(/^\//, '');
      } else {
        // default to this module's `pix` folder. Use __dirname for reliability.
        readPath = path.join(__dirname, 'pix');
        const moduleName = path.basename(__dirname);
        webBase = `/modules/${moduleName}/pix`;
      }

      // Ensure path exists and is a directory
      if (!fs.existsSync(readPath) || !fs.statSync(readPath).isDirectory()) {
        // fallback: try module pix using __dirname
        const fallback = path.join(__dirname, 'pix');
        if (fallback !== readPath && fs.existsSync(fallback) && fs.statSync(fallback).isDirectory()) {
          readPath = fallback;
          const moduleName = path.basename(__dirname);
          webBase = `/modules/${moduleName}/pix`;
        } else {
          // nothing we can read
          this.sendSocketNotification('IMAGE_LIST', []);
          return;
        }
      }

      const files = fs.readdirSync(readPath);
      const images = files
        .filter((f) => /\.(jpe?g|png|gif|webp|bmp|mp4|webm|ogg)$/i.test(f))
        .map((f) => `${webBase}/${encodeURIComponent(f)}`);

      this.sendSocketNotification('IMAGE_LIST', images);
    } catch (err) {
      // On error always send an empty list so the client can update
      console.error("MMM-BackgroundSwitcher: error reading images:", err);
      this.sendSocketNotification('IMAGE_LIST', []);
    }
  }
});
