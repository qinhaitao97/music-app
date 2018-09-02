<template>
  <div class="recommend">
    <!-- :data="discList"，这样 scroll 组件就可以自动监听数据的变化，保证滚动的计算值始终是准确的 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- 这里要特别注意，要保证轮播图和歌单一起滚动，就要把他们放在一个容器中 -->
      <div>
        <!-- v-if 是要确保拿到推荐数据以后再加载 slider 组件 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <!-- class="needclick" 解决 fastclick 点击和 scroll 点击冲突的问题 -->
                <img class="needclick" :src="item.picUrl" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="index">
              <div class="icon">
                <!-- 使用 vue-lazyload 实现图片懒加载 -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'

  export default {
    data() {
      return {
        recommends: [],
        discList: []
      };
    },

    components: {
      Slider,
      Scroll,
      Loading
    },

    created() {
      this._getRecommend(),

      // 模拟网络延迟，展示 loading 组件
      // setTimeout(() => {
        this._getDiscList()
      // }, 3000);
      
    },

    methods: {
      // 获取推荐轮播数据
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.slider);
            this.recommends = res.data.slider;
          }
        })
      },

      // 获取歌单列表
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list);
            this.discList = res.data.list;
          }
        })
      },

      // 当轮播图片加载完成时，刷新 scroll 组件，重新计算高度
      loadImage() {
        // 重新计算高度只执行一次即可
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '~common/stylus/variable.styl'

  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0px
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .item
          display flex
          box-sizing border-box
          align-items center
          padding 0 20px 20px
          .icon
            flex 0 0 60px
            width 60px
            padding-right 20px
            img
              border-radius 15%
          .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)

</style>
