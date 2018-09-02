<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
        <slot></slot>  
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    // 这里也可以使用 $nextTick
    setTimeout(() => {
      this._setSliderWidth();
      // 初始化 dots 要在 slider 之前，因为 BScroll 内部会额外创造两个 dom 以便实现循环录播的效果
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }

      // 窗口大小变化时，要重新计算宽度
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        // this.slider.refresh();
      })
    }, 20);
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;

      let width  = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');
        child.style.width = sliderWidth + 'px';
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },

    _initDots() {
      this.dots = new Array(this.children.length);
    },

    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400,
        },
        bounce: false,
        // stopPropagation: true,
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        // if (this.loop) {
        //   pageIndex -= 1;
        // }
        this.currentPageIndex = pageIndex;

        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      })
    },

    _play() {
      let pageIndex = this.slider.getCurrentPage().pageX + 1;
      // if (this.loop) {
      //   pageIndex += 1;
      // }
      
      if (pageIndex === this.dots.length) {
        pageIndex = 0;
      }

      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    },

    destoryed() {
      // 路由切换时，组件会调用这个生命周期钩子，这时要把计时器清除掉
      clearTimeout(this.timer);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
          img
            display block
            width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background-color $color-text-l
        &.active
          width 20px
          border-radius 5px
          background-color $color-text-ll
</style>
