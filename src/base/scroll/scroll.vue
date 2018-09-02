/**
* 封装 scroll 组件，实现自动计算滚动高度，数据变换自动计算更新
*/

<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);

    // this.$nextTick(() => {
    //   this._initScroll();
    // })
  },

  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        let _this = this;
        this.scroll.on('scroll', (pos) => {
          _this.$emit('scroll', pos);
        })
      }
    },

    enable() {
      this.scroll && this.scroll.enable();
    },

    disable() {
      this.scroll && this.scroll.disable();
    },

    refresh() {
      this.scroll && this.scroll.refresh();
    },

    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },

    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },

  // 监听 data 变化，当 data 数据变化时，要刷新 scroll 重新计算滚动
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
}
</script>
