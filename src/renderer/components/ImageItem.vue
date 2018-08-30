<template>
  <div
    v-show="!isFixed || isExists"
    class="image-wrapper"
    :style="imageWrapperStyle()"
    @mouseover="onMouseOver(index, $event)"
    @mouseout="onMouseOut()"
    @click="onClick(index, $event)"
  >
    <transition>
      <img
        v-show="isFixed"
        :id="id()"
        :src="imageFileNameFull()"
        :alt="imageFileName()"
        @load="onLoad" @error="onError"
      />
    </transition>
    <p>{{ imageFileName() }}</p>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    boxSize: {
      type: Number,
      default: 100
    },
    filePaths: {
      type: Array,
      default: null
    },
    hoverIndex: {
      type: Number,
      default: 0
    },
    selectIndex: {
      type: Number,
      default: 0
    },
    onMouseOver: {
      type: Function,
      default: null
    },
    onMouseOut: {
      type: Function,
      default: null
    },
    onClick: {
      type: Function,
      default: null
    },
    updateImageInfo: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      isExists: false,
      isLoaded: false,
      isFixed: false,
      ctW: 0,
      ctH: 0,
      opacity: 0
    };
  },
  methods: {
    imageWrapperStyle() {
      return {
        width: this.boxSize + "px",
        height: this.boxSize + "px",
        opacity: this.isExists
          ? this.hoverIndex === 0 || this.isHover() ? 1 : 1
          : 0
      };
    },
    isHover() {
      return this.hoverIndex === this.index;
    },
    isSelect() {
      return this.selectIndex === this.index;
    },
    id() {
      return "image-item_" + this.index;
    },
    imageFileName() {
      let dir = this.filePaths[this.index - 1].split("/");
      return dir[dir.length - 1];
    },
    imageFileNameFull() {
      return this.filePaths[this.index - 1];
    },
    calcSize() {
      this.isExists = false;
      this.isFixed = false;

      let el = document.getElementById(this.id());
      el.setAttribute("width", "");
      el.setAttribute("height", "");

      this.ctW = el.width;
      this.ctH = el.height;
      console.log([this.id(), this.ctW, this.ctH]);

      this.updateImageInfo(this.index, el.width, el.height);

      let s = this.boxSize * 0.7;
      let rtW = this.ctW / s;
      let rtH = this.ctH / s;

      if (rtW < 1 && rtH < 1) {
        // 拡大縮小の必要なし
        // 何もしない
      } else if (rtW > rtH) {
        // 横長なので width を fit させるように最大化
        el.width = s;
        el.height = this.ctH / rtW;
      } else {
        // 縦長なので height を fit さえるように最大化
        el.width = this.ctW / rtH;
        el.height = s;
      }

      this.isExists = true;
      this.isFixed = true;
    },
    onLoad(e) {
      this.calcSize();
    },
    onError() {
      this.isFixed = true;
    }
  }
};
</script>

<style scoped>
.image-wrapper {
  background-color: #fff;
  position: relative;
  cursor: pointer;
}

.image-wrapper:hover {
  background-color: #efefef;
}

img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
p {
  position: absolute;
  margin: 0;
  bottom: 4%;
  left: 0;
  right: 0;
  text-align: center;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 3s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
