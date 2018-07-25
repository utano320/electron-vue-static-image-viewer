<template>
  <div v-show="selectIndex != 0" id="image-viewer">
    <div id="image-viewer-bg"></div>
    <div id="image-viewer-wrapper">
      <img
        id="image-viewer-content"
        :src="'static/images/' + imageFileName"
        :alt="imageFileName"
        @load="onLoad"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectIndex: {
      type: Number,
      default: 0
    },
    appWidth: {
      type: Number,
      default: window.innerWidth
    },
    appHeight: {
      type: Number,
      default: window.innerHeight
    },
    imageWidth: {
      type: Number,
      default: 0
    },
    imageHeight: {
      type: Number,
      default: 0
    }
  },
  computed: {
    imageFileName() {
      return _.padStart(this.selectIndex, 2, 0) + ".jpg";
    }
  },
  methods: {
    onLoad() {
      this.resize();
    },
    resize() {
      let ct = document.getElementById("image-viewer-content");
      let wp = document.getElementById("image-viewer-wrapper");
      let wpW = wp.clientWidth;
      let wpH = wp.clientHeight;
      let rtW = this.imageWidth / wpW;
      let rtH = this.imageHeight / wpH;

      if (rtW < 1 && rtH < 1) {
        // 拡大縮小の必要なし
        ct.style.width = "";
        ct.style.height = "";
      } else if (rtW > rtH) {
        // 横長なので width を fit させるように最大化
        ct.style.width = wpW + "px";
        ct.style.height = this.imageHeight / rtW + "px";
      } else {
        // 縦長なので height を fit さえるように最大化
        ct.style.width = this.imageWidth / rtH + "px";
        ct.style.height = wpH + "px";
      }
    }
  },
  watch: {
    appWidth: function() {
      this.resize();
    },
    appHeight: function() {
      this.resize();
    }
  }
};
</script>

<style scoped>
#image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#image-viewer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}
#image-viewer-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 80%;
  height: 80%;
}

#image-viewer-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
