<template>
  <main role="main">

    <section class="jumbotron text-center">
      <div class="index-title">
        <div class="title-container">
          <h1 class="title">索拉里斯在线教学平台</h1>
          <router-link
            to="/list"
            class="btn btn-primary my-2 p-3 font-weight-bold"
          >点击进入所有课程</router-link>
        </div>
        <div class="star card" >
          <div class="img-container">
            <img
            class="avatar"
                @click="openHomePage(star.id)"
              :src="`https://api.multiavatar.com/${star.id}.png`"
              alt=""
            >  
            </div>
<div class="star-desc">
            <div>
            <span>成就之星：</span>
            <span class="name">{{star.name}}</span>
          </div>
          <div>
            <span>成就数量：</span>
            <!-- <span class="num">{{"⭐".repeat(star.num)}}</span> -->
            <span class="num">{{star.num}}</span>
          </div>
</div>
        </div>
      </div>
    </section>

    <div class="album py-5 bg-light">
      <div class="container">
        <div class="title1">最新上线</div>
        <div class="row">
          <div
            v-for="(o,i) in news"
            :key="i"
            class="col-md-4"
          >
            <the-course v-bind:course="o"></the-course>
          </div>
        </div>

        <hr>

        <div class="title2">好课推荐</div>
        <div class="row">
          <div
            v-for="(o,i) in news"
            :key="i"
            class="col-md-4"
          >
            <the-course v-bind:course="o"></the-course>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import TheCourse from "../components/the-course";
export default {
  name: "index",
  components: { TheCourse },
  data: function () {
    return {
      news: [],
      star: {}
    };
  },
  mounted() {
    let _this = this;
    _this.listNew();
    this.getStar();
  },
  methods: {
    /**
     * 查询新上好课
     */
    listNew() {
      let _this = this;

      // 新上好课不经常变，又经常被访问，适合用缓存
      // 判断是否有缓存
      let news = SessionStorage.get("news");
      if (!Tool.isEmpty(news)) {
        _this.news = news;
        return;
      }

      _this.$ajax
        .get(process.env.VUE_APP_SERVER + "/business/web/course/list-new")
        .then((response) => {
          console.log("查询新上好课结果：", response);
          let resp = response.data;
          if (resp.success) {
            _this.news = resp.content;
            // 保存到缓存
            SessionStorage.set("news", _this.news);
          }
        })
        .catch((response) => {
          console.log("error：", response);
        });
    },
    getStar(){
      this.$ajax.get(process.env.VUE_APP_SERVER+'/business/web/achievement/star').then(res=>{
        this.star=res.data.content;
      })
    },
    openHomePage(id){
      window.open(location.origin + "/home/" + id);
    }
  },
};
</script>

<style>
.title {
  margin: 50px 0;
  font-weight: 500 !important;
}
.title1 {
  margin-bottom: 2rem;
  color: #fafafa;
  letter-spacing: 0;
  text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777,
    0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333,
    0px 8px 7px #001135;
  font-size: 2rem;
}
.title2 {
  margin-bottom: 2rem;
  color: transparent;
  -webkit-text-stroke: 1px black;
  letter-spacing: 0.04em;
  font-size: 2rem;
}
.index-title{
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 100px;
}
.star{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap:10px;
  max-width: 400px;
  padding: 20px 40px;
  transition: .3s;
  box-shadow: rgba(153, 153, 159, 0.25) 0px 13px 27px -5px, rgba(140, 140, 140, 0.3) 0px 8px 16px -8px;
}
.star:hover{
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.img-container{
  width: 100%;
  /* height: 50px; */
  position:relative;
}
.star img{
  width: 60px;
  height: 60px;
}
.star-desc{
  display: flex;
  gap:10px;
  flex-direction: column;
}
.star-desc span{
  word-break: break-all;
}
.avatar{
  transition: .3s ease;
}
.avatar:hover{
  transform: rotate(360deg);
  cursor:pointer;
  opacity: .9;
}
</style>
