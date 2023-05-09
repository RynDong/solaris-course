<template>
  <div class="container">
    <h1>成就系统</h1>
    <div>
      <div class="ach-header">
        <img
          class="avatar"
          :src="`https://api.multiavatar.com/${(userId || 'default')}.png`"
          alt=""
        >
        <span>{{userId}}</span>
      </div>
      <div class="ach-body">
        <div class="ach-body-left">
          <h4 class="left-title">成就</h4>
          <div
            class="left-item"
            :class="{activate: currentType == -1}"
            @click="switchType(-1)"
          >总览</div>
          <div
            class="left-item"
            :class="{activate: currentType == 0}"
            @click="switchType(0)"
          >学习历程</div>
          <div
            :class="{activate: currentType == 1}"
            class="left-item"
            @click="switchType(1)"
          >互动成就</div>
          <div
            :class="{activate: currentType == 2}"
            class="left-item"
            @click="switchType(2)"
          >隐藏成就</div>
          <div
            :class="{activate: currentType == 3}"
            class="left-item"
            @click="switchType(3)"
          >限时成就</div>
        </div>
        <div class="ach-body-right">
          <div class="ach-cabinet">
            <h3>陈列柜</h3>
            <div>
              <img
                :src="`https://api.multiavatar.com/${achievementTypes.find(e=>e.id==item.achievementsId).achievementDsc}.png`"
                class="ach-cabinet-item-img"
                v-for="item in allAchievements"
                :key="item.key"
              >
            </div>
          </div>
          <div class="ach-list">
            <div class="ach-list-header">
              <span class="ach-list-header">成就列表（已获得）</span>
              <span>已获得{{achievements.length}} 未获得{{allAchievements.filter(e=>e?.type == (currentType == -1 ? e.type : currentType)).length - achievements.length}}</span>
            </div>
            <div
              class="ach-list-item"
              v-for="item in achievements"
              :key="item.id"
            >
              <img
                class="ach-img"
                :src="`https://api.multiavatar.com/${achievementTypes.find(e=>e.id==item.achievementsId).achievementDsc}.png`"
                alt=""
              >
              <span class="ach-desc">{{achievementTypes.find(e=>e.id==item.achievementsId).achievementDsc}}</span>
              <span class="ach-time">{{item.createTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      userId: "",
      currentType: 0,
      achievements: [],
      achievementTypes: [],
      allAchievements: [],
    };
  },
  methods: {
    getAchievementType() {
      this.$ajax
        .post(process.env.VUE_APP_SERVER + "/business/web/parameter/all")
        .then((response) => {
          this.achievementTypes = response.data.content;
        });
    },
    getAchievementsByType(type) {
      this.$ajax
        .get(
          process.env.VUE_APP_SERVER +
            (type == -1
              ? "/business/web/achievement/listOneUser?id=" + this.userId
              : "/business/web/achievement/selectByUserIdAndType?userId=" +
                this.userId +
                "&&type=" +
                type)
        )
        .then((response) => {
          this.achievements = response.data.content;
        });
    },
    switchType(type) {
      this.currentType = type;
      this.getAchievementsByType(type);
    },
    getAchievements() {
      this.$ajax
        .get(
          process.env.VUE_APP_SERVER +
            "/business/web/achievement/listOneUser?id=" +
            this.userId
        )
        .then((response) => {
          this.allAchievements = response.data.content;
          console.log(this.allAchievements);
        });
    },
  },
  mounted() {
    this.userId = this.$route.params.id;
    this.getAchievementType();
    this.getAchievementsByType(this.currentType);
    this.getAchievements();
  },
};
</script>

<style scoped>
.ach-header {
  background: orange;
  padding: 20px;
  display: flex;
  align-items: center;
}
.avatar {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  cursor: pointer;
}
.avatar:hover {
  opacity: 0.9;
}
.ach-body {
  display: flex;
  gap: 20px;
  height: 500px;
  margin-top: 20px;
}
.ach-body-left {
  flex: 1;
  background: orange;
  padding: 0 10px;
}
.ach-body-right {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
.ach-cabinet,
.ach-list {
  background: orange;
}
.ach-list {
  flex: 1;
}
.left-title {
  text-align: center;
  padding: 5px;
  line-height: 100%;
  padding-top: 20px;
}
.left-item {
  background: #ccc;
  margin: 10px 0;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  transition: 0.3s;
}
.left-item:hover {
  opacity: 0.9;
}

.ach-list-header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.ach-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
.ach-list-item .ach-img {
  height: 40px;
  width: 40px;
}

.activate {
  background: yellow;
}
.ach-cabinet {
  padding: 10px;
}
.ach-cabinet h3 {
  padding: 10px;
}
.ach-cabinet-item-img {
  width: 50px;
  height: 50px;
  margin: 10px;
}
h1 {
  margin: 20px 0;
}
</style>