<template lang="pug">
.draw
  .text
  .wheel
    LuckyWheel(ref="myLucky",
    width="300px",
    height="300px",
    :prizes="prizes",
    :blocks="blocks",
    :buttons="buttons",
    @start="startCallback",
    @end="endCallback")
  .bottom
  //- .record(@click="onShowRecord")
  .hint
van-overlay(:show="show" @click="show = false")
  .wrapper(@click.stop)
    .dialog(@click="show=false")

van-overlay(:show="showRecord" @click="showRecord = false")
  .recordDialog(@click="showRecord=false")
    p 恭喜您中了
    p {{ prizeText }}
  
</template>

<script setup>
import { ref } from 'vue'
import { showSuccessToast } from 'vant'
import axios from 'axios'
import { useUserStore } from '../stores/index.js'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import configs from '../config.js'

const router = useRouter()
const user = useUserStore()

const myLucky = ref(null)
const show = ref(false)
const showRecord = ref(false)
const prizeText = ref('')

const blocks = [
  { imgs: [{ src: 'cj/src/assets/img/wheel.png', width: '100%', rotate: false }] },
  { imgs: [{ src: 'cj/src/assets/img/wheelContent.png', width: '90%', rotate: true, top: '5%' }] }
]
// const blocks = [
//   { imgs: [{ src: `${configs.baseUrl}/wheel.png`, width: '100%', rotate: false }] },
//   { imgs: [{ src: `${configs.baseUrl}/wheelContent.png`, width: '90%', rotate: true, top: '5%' }] }
// ]
const prizes = [
  { name: '1元话费', id: 2 },
  { name: '1元话费', id: 2 },
  { name: '1元话费', id: 2 },
  { name: '5元话费', id: 7 },
  { name: '3.5元话费', id: 6 },
  { name: '3元话费', id: 5 },
  { name: '2元话费', id: 4 },
  { name: '1.5元话费', id: 3 },
  { name: '0.5元话费', id: 1 },
  { name: '0.5元话费', id: 1 },
  { name: '0.5元话费', id: 1 },
  { name: '0.5元话费', id: 1 }
]
const buttons = [
  {
    radius: '15%',
    // background: 'rgb(255,214,98)',
    imgs: [{ src: 'cj/src/assets/img/pointer.png', width: '100%', top: '-100%' }]
    // imgs: [{ src: `${configs.baseUrl}/pointer.png`, width: '100%', top: '-100%' }]
    // pointer: true,
    // fonts: [
    //   { text: '抽奖', top: '-10px', fontSize: 12, fontColor: 'rgb(231, 84, 33)', fontWeight: '600' }
    // ]
  }
]

const startCallback = async () => {
  const { data } = await axios(
    `https://marry.aienji01.cn/houtai_h1/account/act_cj?mobile=${user.mobile}`
  )
  if (data.code === 0) {
    myLucky.value.play()
    const index = prizes.indexOf(prizes.find((item) => item.id === data.data.jp))
    console.log(index);
    myLucky.value.stop(index)
  } else {
    showToast(data.msg)
    if (data.msg === '请先登记信息') {
      return router.push('/info')
    }
  }
}

// 抽奖结束会触发end回调
const endCallback = (prize) => {
  showSuccessToast(`恭喜您！抽到${prize.name}`)
  show.value = true
}

const onShowRecord = async () => {
  const { data } = await axios(
    `https://marry.aienji01.cn/houtai_h1/account/act_result?mobile=${user.mobile}`
  )
  if (data.code === 0) {
    const jp_id = data.data.jp
    const result = prizes.find((item) => item.id === jp_id).name
    console.log(result)
    prizeText.value = result
    showRecord.value = true
  } else {
    showToast(data.msg)
  }
}
</script>
<style lang="less" scoped>
.draw {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/img/infobg3.png);
  background-size: 100% 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .text {
    width: 100vw;
    height: 200px;
    background-image: url(../assets/img/header.png);
    background-size: 100% 100%;
  }

  .wheel {
    display: flex;
    justify-content: center;
  }

  .bottom {
    background: url('../assets/img/bottom.png');
    background-size: 100% 100%;
    width: 100%;
    height: 100px;
    margin-top: -30px;
  }

  .record {
    background: url('../assets/img/text.png');
    background-size: 100% 100%;
    width: 80px;
    height: 20px;
    margin: 20px auto;
  }

  .hint {
    background: url('../assets/img/hint.png');
    background-size: 100% 100%;
    width: 300px;
    height: 10px;
    margin: 20px auto;
  }
}

.dialog,
.recordDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 250px;
  height: 150px;
  background: url('../assets/img/dialog.png');
  background-size: 100% 100%;
}

.recordDialog {
  background: url('../assets/img/recordDialog.png');
  background-size: 100% 100%;
  padding: 20px;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 24px;
  white-space: nowrap;
}
</style>
