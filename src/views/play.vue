<template>
  <div class="container">
    <!-- <video class="player"></video> -->
    <player
      :onLoaded="videoEndedListener"
      v-bind:player-id="'modal-player-div'"
      ref="player"
    ></player>
    <div>
      <div
        ref="input"
        id="comment-input"
        contenteditable="输入评论"
      ></div>
      <button
        type="button"
        class="btn btn-primary"
        @click="publishComment"
        :style="{float: 'right'}"
      >发布</button>
      <ul class="comments">
        <li
          class="comment-item"
          v-for="(comment, index) in comments"
          :key="index"
        >
          <div class="comment-header">
            <img
              class="avatar"
              :src="`https://api.multiavatar.com/${(comment.userId || 'default')}.png`"
              alt=""
            >
            <span>{{comment.userName}}</span>
            <span>{{comment.createdAt}}</span>
            <span
              @click="likeComment(comment)"
              class="like"
            >👍{{comment.likes}}</span>
          </div>
          <div class="comment-body">
            {{comment.content}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Player from "@/components/player";

export default {
  data: function () {
    return {
      courseId: "",
      id: "",
      comments: [],
      user: {},
    };
  },
  components: { Player },
  methods: {
    playUrl(url) {
      let _this = this;
      _this.$refs.player.playUrl(url);
    },

    playVod(vod) {
      let _this = this;
      _this.$refs.player.playVod(vod);
      // $("#player-modal").modal("show");
    },
    publishComment() {
      const commentText = this.$refs.input.innerText.trim();
      if (commentText == "") return;
      this.$ajax
        .post(process.env.VUE_APP_SERVER + "/business/web/comment/addComment", {
          content: this.$refs.input.innerText,
          courseId: this.courseId,
          createdAt: "",
          id: this.id,
          likes: 0,
          userId: this.user.id,
        })
        .then((response) => {
          this.getComments();
          this.$refs.input.innerText = "";
        })
        .catch((response) => {
          console.log("error：", response);
        });
    },
    getComments() {
      this.$ajax
        .get(
          process.env.VUE_APP_SERVER +
            "/business/web/comment/getCommentsByCourseId?id=" +
            this.courseId
        )
        .then((response) => {
          console.log("查询结果：", response);
          this.comments = response.data.content;
        })
        .catch((response) => {
          console.log("error：", response);
        });
    },
    likeComment(comment) {
      this.$ajax
        .get(
          process.env.VUE_APP_SERVER +
            "/business/web/commentLikes/countLikeByUserAndComment?commentId=" +
            comment.id +
            "&&userId=" +
            this.user.id
        )
        .then((response) => {
          console.log("查询结果：", response);
          this.getComments();
        })
        .catch((response) => {
          console.log("error：", response);
        });
    },
    addAchievement(achievementsId = 6, type = 0) {
      this.$ajax
        .post(process.env.VUE_APP_SERVER + "/business/web/achievement/save", {
          achievementsId: achievementsId,
          createTime: "",
          expirationTime: "",
          id: "",
          type: type,
          userId: this.user.id,
        })
        .then((response) => {
          console.log("添加成功", response);
        })
        .catch((response) => {
          console.log("error：", response);
        });
    },
    videoEndedListener() {
      const video = document.getElementsByTagName("video")[0];
      if (!video) return;

      video.addEventListener(
        "ended",
        () => {
          //结束
          Toast.success("播放完毕");
          this.addAchievement();
        },
        false
      );
    },
  },
  mounted() {
    this.playVod(this.$route.params.id);
    this.courseId = this.$route.query.courseId;
    this.id = this.$route.query.id;
    this.getComments();
    this.user = Tool.getLoginMember();

    setTimeout(() => {
      this.videoEndedListener();
    }, 1000);
  },
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}
.comments {
  list-style: none;
  padding: 0;
  margin-top: 80px;
}
.comment-item {
  padding: 10px 0;
  margin: 10px 0;
  border-bottom: 1px solid #ccc;
}
.comment-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
#comment-input {
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  padding: 10px;
  overflow: auto;
  margin: 10px 0;
}
.avatar {
  height: 30px;
  width: 30px;
}
.like {
  cursor: pointer;
}
</style>