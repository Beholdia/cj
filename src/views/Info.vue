<template lang="pug">
.info
  .detail
    .form 
      .item
        van-button(round,style="width:150px;") 姓名 :
        input(v-model="info.name")
      .item
        van-button(round,style="width:150px") 电话 :
        input(v-model="info.phone",type="number",placeholder="*为领取话费红包的手机")
      van-button(round,style="margin-bottom:20px") 家庭地址或单位地址 :
      .item
        input(v-model="info.address",placeholder = "请填写详细地址以方便核查，如:X小区X幢X单元XX室 " )
  .conditionText
  .submit(@click="submit")
  .text *填写完后点击提交即可抽奖
//- .cover
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/index.js'
import axios from 'axios'

import { showToast, showConfirmDialog } from 'vant'

const user = useUserStore()
const router = useRouter()
const info = reactive({ name: '', phone: '', address: '' })

const submit = async () => {
  if (!info.name) return showToast('请填写姓名')
  if (!info.phone) return showToast('请填写电话')
  if (!info.address) return showToast('请填写地址')
  try {
    await showConfirmDialog({
      message: '是否确认提交?',
      confirmButtonColor: 'rgb(244, 93, 35)'
    })
    const { data } = await axios(
      `https://marry.aienji01.cn/houtai_h1/account/act_submit?mobile=${info.phone}&name=${info.name}&address=${info.address}`
    )
    showToast(data.msg)
    // if (!data.code) {
    user.mobile = info.phone
    showToast(data.msg)
    setTimeout(() => {
      router.push('/draw')
    }, 500)
    // }
  } catch (error) {
    console.log(error)
  }
}
</script>
<style lang="less" scoped>
.info {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/img/infobg3.png);
  background-size: 100% 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  .detail {
    box-sizing: border-box;

    margin: 0 auto;
    width: 100%;
    height: calc(80vh);
    background-image: url(../assets/img/info.png);
    background-size: 100% 100%;
    position: relative;
    display: flex;
    justify-content: center;
    overflow-y: auto;
    .form {
      box-sizing: border-box;
      padding: 0 20px;
      width: 70%;
      position: absolute;
      top: 45%;
      overflow: hidden;
      .item {
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        align-items: center;
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }
  .conditionText {
    background-image: url(../assets/img/conditionText.png);
    background-size: 100% 100%;
    margin: 0 auto;
    width: 280px;
    height: 80px;
  }
  .submit {
    // width: 60%;
    height: 40px;
    width: 100px;
    margin: 20px auto;
    background-image: url(../assets/img/button.png);
    background-size: 100% 100%;
    // position: absolute;
    // bottom: 0;
    z-index: 100;
  }
  .text {
    color: #fff;
    text-align: center;
  }
}
input {
  outline: none; /* 移除默认边框 */
  border-left: 2px solid rgb(244, 93, 35);
  border-right: 2px solid rgb(244, 93, 35);
  border-bottom: 1px dashed rgb(244, 93, 35);
  border-top: 1px dashed rgb(244, 93, 35);
  border-radius: 3px;
  z-index: 100;
  width: 100%;
  color: black;
}
input::placeholder {
  font-size: 10px;
  font-style: italic;
}
.cover {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0;
  z-index: 9;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/img/infobg2.png');
  background-size: 100% 100%;
}
.van-button {
  border-color: rgb(244, 93, 35);
  background: rgb(244, 93, 35);
  color: #fff;
  margin-right: 10px;
  z-index: 100;
  white-space: nowrap;
}
</style>
