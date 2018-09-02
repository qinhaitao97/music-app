<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="getPercent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left"  :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <!-- .stop 组织冒泡，如果不组织，点击事件冒泡到父元素上，会触发全屏播放 -->
          <i :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 利用 audio 派发的 timeupdate 事件，完成对 时间的一系列操作 -->
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progressBar/progressBar'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0
      }
    },

    components: {
      ProgressBar
    },

    computed: {
      // 读取 state 中的数据
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex'
      ]),

      // 根据 playing 的值返回对应 fullScreen 播放/暂停 状态的图标类名
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },

      // 根据 playing 的值返回对应的 mini 播放状态下的 播放/暂停 状态的图标类名
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },

      // 根据 playing 的值返回对应 旋转/不旋转 状态的图标类名
      cdRotate() {
        return this.playing ? 'play' : 'play pause';
      },

      // 当歌曲无法正常加载时，audio canplay 事件就始终是 false，这时我们给控制按钮加不可点击的属性
      disableCls() {
        return this.songReady ? '' : 'disable';
      },

      // 计算当前播放长度的百分比
      getPercent() {
        return this.currentTime / this.currentSong.duration;
      }

    },

    methods: {
      // 映射修改 $store.state 中的数据的方法
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),

      // 点击关闭全屏播放
      back() {
        this.setFullScreen(false);
      },

      // 点击 mini 播放器，展开全屏播放
      open() {
        this.setFullScreen(true);
      },

      // vue 提供的 JavaScript 动画钩子，用这个来实现复杂交互动画
      // 动画结束后就会调用 done 回调函数
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`,
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`,
          }
        };

        // 注册 move 动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        // 运行 move 动画
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },

      afterEnter() {
        // 清除 move 动画
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },

      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all .4s linear';
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        // console.log(this.$refs.cdWrapper.style);
        // console.log(`translate3d(${x}px, ${y}px, 0) scale(${scale})`)
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },

      afterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },

      // 获取动画元素的位置，以及缩放大小
      _getPosAndScale() {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

        return {
          x,
          y,
          scale
        }
      },

      // 将当前的播放状态置反，还需要实时监听 playing 的状态，用 watch
      togglePlaying() {
        this.setPlayState(!this.playing);
      },

      // 上一首，下一首功能，因为 currentSong 的值是 currentIndex 的计算属性，所以 currentIndex 的改变就会触发 currentSong 的改变
      next() {
        // 快速点击切歌按钮，会引发 Uncaught (in promise) DOMException 的错误，用 audio 标签自带的 canplay 事件解决
        // 如果 audio 还没有成为 ready 状态，则不执行任何操作
        if (!this.songReady) {
          return;
        }
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }

        // 将 ready 标志重新置为 false
        this.songReady = false;
      },

      prev() {
        if (!this.songReady) {
          return;
        }
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      },

      // 当 audio 标签的 canplay 事件触发后，将 audio 的 ready 状态置为 true
      ready() {
        this.songReady = true;
      },

      error() {
        this.songReady = true;
      },

      // 当 audio 派发的 timeupdate 事件触发时，执行的函数
      updateTime(e) {
        // console.log(e);
        this.currentTime = e.target.currentTime;
      },

      // 将 currentTime 时间戳转换成指定的格式
      format(interval) {
        interval = interval | 0;
        let minute = interval / 60 | 0;
        let second = interval % 60;

        minute = minute.toString().padStart(2, '0');
        second = second.toString().padStart(2, '0');
        return `${minute}:${second}`;
      },

      // 根据子组件传来的要改变的 percent 修改播放时间
      onProgressBarChange(percent) {
        this.$refs.audio.currentTime = this.currentSong.duration * percent;
        // 如果是暂停状态下拖动，则拖动结束后自动播放
        if (!this.playing) {
          this.togglePlaying();
        }
      }

    },

    watch: {
      // 当前歌曲发生变化时，audio 进行播放
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play();
          // console.log(this.currentSong.id);
          // this.playing ? this.$refs.audio.play() : this.$refs.audio.pause();
        })
      },

      // playing 状态改变时，相应的改变 audio 的播放状态
      playing(newPlaying) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause();
        })   
      },
      
    }
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
