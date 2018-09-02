import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations' 
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 开发环境下开启 vuex 严格模式，有助于在开发时提示各种不规范的信息
const debug = process.env.NODE_ENV !== 'production'

// 注意这里的 Store 是大写，错好几次了!!!
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})