<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 路由切换时，不用重新渲染dom -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style>

</style>
