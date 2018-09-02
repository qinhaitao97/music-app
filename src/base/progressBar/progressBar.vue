<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          ref="progressBtn"
          @touchstart.prevent.stop="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform');

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },

  watch: {
    // 歌曲进度变化，进度条及按钮随之变化
    percent(newPercent) {
      // this.touch.initiated 为 false 的时候才监听 percent，因为拖动时不应再监听 percent 的变化，否则拖动时会跳到实时监听的位置
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },

  created() {
    // 在 created 中定义数据的原因是，这些数据并不满足 data 和 props 中数据的语义，只是为了完成内部方法之间的数据通信而存在
    // touch 对象，用于 methods 对象内的几个不同的方法之间的数据通信
    this.touch = {}
  },

  methods: {
    // 
    progressTouchStart(e) {
      // 是否初始化的标志
      this.touch.initiated = true;
      // e.touches[0].pageX 表示第一个手指点击位置的横坐标
      this.touch.startX = e.touches[0].pageX;
      // 进度条当前已经偏移的宽度
      this.touch.left = this.$refs.progress.clientWidth;
    },

    // 
    progressTouchMove(e) {
      // 如果 initiated 标志没有被初始化，即还没有点击事件触发时，不进行操作
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX));
      this._offset(offsetWidth);
    },    

    // 
    progressTouchEnd() {
      this.touch.initiated = false;
      // 拖动结束后，要将当前的拖动位置相对应的 percent 传给父组件，让父组件修改当前播放的时间
      this._triggerPercent();
    },

    // 封装改变进度条和按钮位置的方法
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;   
    },

    // 封装拖动结束后，要将当前的拖动位置相对应的 percent 传给父组件，让父组件修改当前播放的时间的方法
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit('percentChange', percent);
    },

    progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent();
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
