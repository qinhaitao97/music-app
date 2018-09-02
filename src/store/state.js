import {playMode} from 'common/js/config';

const state = {
  singer: {},
  // 播放状态
  playing: false,
  // 播放时的展示方式
  fullScreen: false,
  // 播放列表
  playList: [],
  // 顺序播放列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放歌曲的索引
  currentIndex: -1
}

export default state;