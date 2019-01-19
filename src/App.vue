<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <hheader :seller="seller"></hheader>
    <div class="tab">
      <div class="tab-item border-1px">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
<!--    <keep-alive>-->
      <router-view :seller="seller"/>
<!--    </keep-alive>-->
  </div>
</template>

<script>
  import hheader from './components/header/header'
  import {urlParse} from 'common/js/util'

  export default {
    name: 'App',
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created() {
      this.$axios.get('../../static/data/data.json?id=' + this.seller.id).then(res => {
        if (res.status === 200) {
          this.seller = res.data.seller
          this.seller = Object.assign({}, this.seller, res.data.seller)
        }
      })
    },
    components: {hheader}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl";
  #app {
    .tab {
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      /*
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      */
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item {
        flex: 1;
        text-align: center;
        & > a {
          display: block;
          text-decoration: none;
          font-size: 14px;
          color: rgb(77, 85, 93);
          &.active {
            color: #f80707;
          }
        }
      }
    }
  }
</style>
