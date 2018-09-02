/**
* 用来展示列表的基础组件
*/
<template>
  <scroll
    class="listview"
    :data="data" ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li v-for="(group, num) in data" :key="num" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="(item, index) in group.items"
            :key="index"
            @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >{{ item }}</li>
      </ul>
    </div>
    <!-- <div class="list-fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div> -->
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18

  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0
      }
    },

    // created 中创建的数据不同于 data 和 props 的是，它不需要与 dom 有任何关系，一般是为了不同方法之间的数据共享
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = [];
      this.probeType = 3;
    },

    props: {
      data: {
        type: Array,
        default: []
      }
    },

    components: {
      Scroll
    },

    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      // fixedTitle() {
      //   return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      // }
    },

    methods: {
      // 将点击事件派发到父组件，让父组件处理相应的业务逻辑
      selectItem(item) {
        this.$emit('select', item);
      },

      // 点击右侧快速导航，跳转到相应的歌手锚点
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index');
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);

        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;   
        this._scrollTo(anchorIndex);
      },

      // 拖动右侧导航条时，左侧歌手列表可以做相应的定位
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0; // \ 0 相当于取整
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },

      scroll(pos) {
        this.scrollY = pos.y;
      },

      _scrollTo(anchorIndex) {
        this.scrollY = -this.listHeight[anchorIndex];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0);
      },

      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    
    watch: {
      data() {
        // 比 $nextTick 好的原因是可以保证所有手机的兼容性
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight;
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (!height2 || (-newY > height1) && (-newY < height2)) {
            this.currentIndex = i;
            return;
          } else {
            this.currentIndex = 0;
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
