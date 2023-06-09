import Vue from "vue"
import Router from "vue-router"
import Index from "./views/index.vue"
import List from "./views/list.vue"
import Detail from "./views/detail.vue"
import About from "./views/about.vue"
import Play from "./views/play.vue"
import Home from "./views/home.vue"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
    path: "*",
    redirect: "/index",
  }, {
    path: "/index",
    component: Index
  }, {
    path: "/list",
    component: List
  }, {
    path: "/detail",
    component: Detail
  }, {
    path: "/about",
    component: About
  }, {
    path: "/play/:id",
    component: Play
  }, {
    path: "/home/:id",
    component: Home
  }]
})
