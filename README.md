# 项目简介

一款使用 vue 全家桶开发的音乐 app，包括推荐、歌手、排行、搜索四大核心业务组件；使用 vue 框架、ES6 语法以及 css 预处理 stylus 进行详细页面的开发；配合 vue-router 实现页面路由，vuex 实现状态管理；音乐及推荐数据来自 QQ 音乐，通过 ajax、jsonp 等技术调取后台接口；

![](https://ws1.sinaimg.cn/large/006eYMu7ly1fuv5kmp1n5j309m0h1q7h.jpg)

![](https://ws1.sinaimg.cn/large/006eYMu7ly1fuv5l5c0ucj309m0h3my9.jpg)

![](https://ws1.sinaimg.cn/large/006eYMu7ly1fuv5lat1jhj309l0gzdhz.jpg)

![](https://ws1.sinaimg.cn/large/006eYMu7ly1fuv5lh7cvuj309l0h310s.jpg)



# 环境依赖

```json
"dependencies": {
	"axios": "^0.18.0",
	"babel-runtime": "^6.26.0",
	"better-scroll": "^1.12.6",
	"create-keyframe-animation": "^0.1.0",
	"fastclick": "^1.0.6",
	"jsonp": "^0.2.1",
	"vue": "^2.5.2",
	"vue-lazyload": "^1.2.6",
	"vue-router": "^3.0.1",
	"vuex": "^3.0.1"
},
```

# 项目结构

使用 vue-cli 搭建基本的开发环境，开发目录结构如下

```
src
├─ App.vue
├─ api
│    ├─ config.js
│    ├─ recommend.js
│    └─ singer.js
├─ base
│    ├─ listview
│    │    └─ listview.vue
│    ├─ loading
│    │    ├─ loading.gif
│    │    └─ loading.vue
│    ├─ progressBar
│    │    └─ progressBar.vue
│    ├─ scroll
│    │    └─ scroll.vue
│    ├─ slider
│    │    └─ slider.vue
│    └─ songList
│           ├─ first@2x.png
│           ├─ first@3x.png
│           ├─ second@2x.png
│           ├─ second@3x.png
│           ├─ songList.vue
│           ├─ third@2x.png
│           └─ third@3x.png
├─ common
│    ├─ fonts
│    │    ├─ music-icon.eot
│    │    ├─ music-icon.svg
│    │    ├─ music-icon.ttf
│    │    └─ music-icon.woff
│    ├─ image
│    │    └─ default.png
│    ├─ js
│    │    ├─ config.js
│    │    ├─ dom.js
│    │    ├─ jsonp.js
│    │    ├─ singer.js
│    │    └─ song.js
│    └─ stylus
│           ├─ base.styl
│           ├─ icon.styl
│           ├─ index.styl
│           ├─ mixin.styl
│           ├─ reset.styl
│           └─ variable.styl
├─ components
│    ├─ m-header
│    │    ├─ header.vue
│    │    ├─ logo@2x.png
│    │    └─ logo@3x.png
│    ├─ musicList
│    │    └─ musicList.vue
│    ├─ player
│    │    └─ player.vue
│    ├─ rank
│    │    └─ rank.vue
│    ├─ recommend
│    │    └─ recommend.vue
│    ├─ search
│    │    └─ search.vue
│    ├─ singer
│    │    ├─ singer.vue
│    │    └─ singerDetail.vue
│    └─ tab
│           └─ tab.vue
├─ main.js
├─ router
│    └─ index.js
├─ store
│    ├─ actions.js
│    ├─ getters.js
│    ├─ index.js
│    ├─ mutation-types.js
│    ├─ mutations.js
│    └─ state.js
└─ tmp.vue
```

# 版本说明

## 当前版本

0.1

+ 功能

  推荐组件

  歌手组件

+ 正在开发

  排行组件

  搜索组件

## 历史版本

0.1