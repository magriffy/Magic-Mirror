/* global Module */

Module.register("MMM-BackgroundSwitcher", {
  defaults: {
    // If null, the module will use its own `pix` folder.
    // You can set this to e.g. "modules/MMM-EasyPix/pix" to use another module's pix folder.
    folder: "../MMM-EasyPix/pix",
    buttonText: "",
    initialIndex: 0
  },

  start() {
    this.images = [];
    this.index = this.config.initialIndex || 0;
    this.sendSocketNotification("GET_IMAGES", { folder: this.config.folder });
  },

  getStyles() {
    return ["MMM-BackgroundSwitcher.css"];
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "IMAGE_LIST") {
      // Ensure we have an array and add a solid black option first
      const list = Array.isArray(payload) ? payload.slice() : [];
      // 'COLOR:black' is a special marker handled by applyBackground
      list.unshift("COLOR:black");
      this.images = list;
      if (this.images.length > 0) {
        // clamp initial index
        this.index = (this.index % this.images.length + this.images.length) % this.images.length;
        this.applyBackground(this.images[this.index]);
      }
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "mmm-background-switcher";

    const btn = document.createElement("button");
    btn.className = "mmm-background-switcher-button";
    btn.innerText = this.config.buttonText || "";
    btn.onclick = () => this.nextImage();

    wrapper.appendChild(btn);

    if (!this.images || this.images.length === 0) {
      const note = document.createElement("div");
      note.className = "mmm-background-switcher-note";
      note.innerText = "Loading images...";
      wrapper.appendChild(note);
    }

    return wrapper;
  },

  nextImage() {
    if (!this.images || this.images.length === 0) return;
    this.index = (this.index + 1) % this.images.length;
    this.applyBackground(this.images[this.index]);
  },

  applyBackground(url) {
    if (!url) return;
    const html = document.documentElement;
    // Handle special color marker: COLOR:#hex or COLOR:name
    if (typeof url === "string" && url.startsWith("COLOR:")) {
      const color = url.split(":")[1] || "black";
      html.style.backgroundImage = "none";
      html.style.backgroundColor = color;
      return;
    }
    // Video URLs: support mp4/webm/ogg
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      this.setVideoBackground(url);
      return;
    }

    // Otherwise treat as image URL
    this.removeVideoBackground();
    html.style.backgroundImage = `url("${url}")`;
    html.style.backgroundPosition = "center center";
    html.style.backgroundSize = "cover";
    html.style.backgroundRepeat = "no-repeat";
    html.style.backgroundAttachment = "fixed";
    html.style.backgroundColor = "";
  },

  // Create or update a <video> element used as the full-viewport background.
  setVideoBackground(url) {
    if (!url) return;
    // remove image background
    const html = document.documentElement;
    html.style.backgroundImage = "none";
    html.style.backgroundColor = "";

    let v = document.getElementById("mmm-background-video");
    if (!v) {
      v = document.createElement("video");
      v.id = "mmm-background-video";
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.style.position = "fixed";
      v.style.top = 0;
      v.style.left = 0;
      v.style.width = "100%";
      v.style.height = "100%";
      v.style.objectFit = "cover";
      v.style.zIndex = "-1";
      v.style.pointerEvents = "none";
      // insert as first child of documentElement so modules (in body) are above
      if (document.documentElement.firstChild) {
        document.documentElement.insertBefore(v, document.documentElement.firstChild);
      } else {
        document.documentElement.appendChild(v);
      }
    }

    // Update source and play
    if (v.src !== url) {
      v.src = url;
      v.load();
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // autoplay might be blocked; ignore silently
        });
      }
    }
  },

  removeVideoBackground() {
    const v = document.getElementById("mmm-background-video");
    if (v) {
      try { v.pause(); } catch (e) {}
      v.remove();
    }
  }
});
