<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="this.food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info">
          <h1 class="title">商品信息</h1>
          <p class="text" v-show="food.info">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @contenttoggle="contentToggle" @ratingtypeselect="ratingtypeSelect" :select-type="selectType"
                        :only-content="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index)  in food.ratings" :key="index"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <!--时间戳转换为时间-->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></span>
                  {{rating.text}}
                </p>
              </li>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import {formatDate} from 'common/js/date'
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import split from 'components/split/split'
  import ratingselect from 'components/rating-select/rating-select'

  // const POSITIVE = 0
  // const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      food: {
        type: Object,
        default() {
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {cartcontrol, split, ratingselect},
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      addFirst(event) {
        if (!event._constructed) {
          return
        }
        Vue.set(this.food, 'count', 1)
        this.$emit('cartadd', event.target)
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      },
      ratingtypeSelect(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      contentToggle(onlyContent) {
        this.onlyContent = onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
    &.move-enter-active, &.move-leave-active { /*最终的一个状态*/
      transform: translate3d(0, 0, 0) /*移到当前的这个位置*/
      transition: all .2s linear; /*缓动*/
    }
    &.move-enter, &.move-leave-to {
      transform: translate3d(100%, 0, 0)
    }
    .food-content {
      .image-header {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .back {
          position: absolute;
          top: 10px;
          left: 0;
          .icon-arrow_lift {
            display: block;
            padding: 10x;
            font-size: 20px;
            color: #fff;
          }
        }
      }
      .content {
        padding: 18px;
        position: relative;
        .title {
          line-height: 14px;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(7, 17, 27)
        }
        .detail {
          margin-bottom: 18px;
          line-height: 10px;
          height: 10px;
          font-size: 0;
          .sell-count, .rating {
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .sell-count {
            margin-right: 12px;
          }
        }
        .price {
          font-weight: 700;
          line-height: 24px;
          display: inline-block;
          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20)
          }
          .old {
            font-size: 10px;
            text-decoration: none
          }
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 12px;
          float: right;
          display: inline-block;
        }
        .buy {
          position: absolute;
          display: inline-block;
          right: 18px;
          margin-top: 5px;
          z-index: 10;
          height: 24px;
          line-height: 24px;
          padding: 0 12px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          font-size: 10px;
          border-radius: 12px;
          color: #fff;
          background: #00a0dc;
          &.fade-enter-active, &.fade-leave-active {
            opacity: 1;
            transition: all .2s linear;
          }
          &.enter, &.leave {
            opacity: 0;
          }
        }
      }

      .info {
        padding: 18px;
        .title {
          line-height: 14px;
          margin-bottom: 6px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .text {
          line-height: 24px;
          padding: 0 8px;
          color: rgb(77, 85, 93);
          font-size: 12px;
        }
      }
      .rating {
        padding-top: 18px;
        .title {
          line-height: 14px;
          margin-left: 18px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .rating-wrapper {
          padding: 0 18px;
          .rating-item {
            position: relative;
            padding: 16px 0;
            border-1px(rgba(7, 17, 27, 0.1));
            .user {
              position: absolute;
              right: 0;
              top: 16px;
              line-height: 12px;
              font-size: 0;
              .name {
                display: inline-block;
                vertical-align: top;
                font-size: 10px;
                margin-right: 6px;
                color: rgb(147, 153, 159)
              }
              .avatar {
                border-radius: 50%;
              }
            }
            .time {
              margin-bottom: 6px;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
            .text {
              line-height: 16px;
              font-size: 12px;
              color: rgb(7, 17, 27);
              .icon-thumb_up, .icon-thumb_down {
                line-height: 16px;
                margin-right: 4px;
                font-size: 12px;
              }
              .icon-thumb_up {
                color: rgb(0, 160, 220);
              }
              .icon-thumb_down {
                color: rgb(147, 153, 159);
              }
            }
          }
          .no-rating {
            padding: 16px 0;
            font-size: 12px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>
