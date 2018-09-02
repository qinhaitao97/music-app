<template>
  <transition name="slide" mode="out-in">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/musicList/musicList'

  export default {
    data() {
      return {
        songs: []
      }
    },

    components: {
      MusicList
    },

    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      // console.log(this.singer);
      this._getDetail();
    },

    methods: {
      _getDetail() {
        // 如果直接访问了歌手详情的路由，那么是无法根据获取到歌手详情数据的，这时应该将路由跳转至歌手列表
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        } else {
          getSingerDetail(this.singer.id).then((res) => {
            if (res.code === ERR_OK) {
              // console.log(res.data.list);
              this.songs = this._normalizeSongs(res.data.list);
              // console.log(res.data.list);
              // console.log(this.songs);
            }
          })
        }
      },

      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        })
        return ret;
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  
  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background-color $color-background

  .slide-enter-active
  .slide-enter-leave-active
    transition all .3s linear
  .slide-enter
  .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
