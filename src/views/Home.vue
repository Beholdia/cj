<template lang="pug">
.home 
  .record(@click="keyMobile")
  .video
    video(id="video",controls,src="@/assets/video/video.mp4",@ended="ended",style="width: 100%; height: 100%; object-fit: fill"
    poster="@/assets/img/fire.png")

van-dialog(v-model:show="show" title="请输入手机号" show-cancel-button @confirm="confirmMobile")
  van-field(v-model="user.mobile" type="number" :rules="[{ required: true, message: '请填写手机号' }]")
van-overlay(:show="showRecord" @click="showRecord = false")
  .recordDialog(@click="showRecord=false")
    p 恭喜您中了
    p {{ prizeText }}
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { showLoadingToast, closeToast, showDialog } from 'vant'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import axios from 'axios'
import { useUserStore } from '../stores/index.js'


const router = useRouter()
const user = useUserStore()

const showRecord = ref(false)
const prizeText = ref('')

const ended = () => {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '抽奖跳转中…',
    wordBreak: 'break-all'
  })

  let second = 1
  const timer = setInterval(() => {
    second--
    if (!second) {
      clearInterval(timer)
      closeToast()
      router.push('/info')
    }
  }, 500)
}

const playVideo = ref({
  watchMaxTime: 0, // 当前可快进到的最大时长 单位为s
  copyCurrentTime: 0 // 下次进入时继续播放的时长 单位为s
})

onMounted(() => {
  nextTick(() => {
    const myVideo = document.getElementById('video')
    myVideo.currentTime = playVideo.value.copyCurrentTime // 从上次播放的时间继续播放
    myVideo.addEventListener('timeupdate', () => {
      // 记录视频已经播放时长
      if (myVideo.currentTime > playVideo.value.watchMaxTime) {
        // 但如果相差1秒就证明是往后拖时间了 正常来说是每次时长更新相差0.3s
        const num = parseFloat(myVideo.currentTime) - parseFloat(playVideo.value.watchMaxTime)
        if (num < 1) {
          // 正常播放时，记录当前播放时间
          playVideo.value.watchMaxTime = myVideo.currentTime
          playVideo.value.copyCurrentTime = myVideo.currentTime
        } else {
          // 差值大于1s时，视为拖动，将上一次记录的播放时间赋值给当前播放器的播放时间
          myVideo.currentTime = playVideo.value.watchMaxTime
          playVideo.value.copyCurrentTime = playVideo.value.watchMaxTime
        }
      }
    })
  })
})

const prizes = [
  { name: '1元话费', id: '2' },
  { name: '1元话费', id: '2' },
  { name: '1元话费', id: '2' },
  { name: '5元话费', id: '7' },
  { name: '3.5元话费', id: '6' },
  { name: '3元话费', id: '5' },
  { name: '2元话费', id: '4' },
  { name: '1.5元话费', id: '3' },
  { name: '0.5元话费', id: '1' },
  { name: '0.5元话费', id: '1' },
  { name: '0.5元话费', id: '1' },
  { name: '0.5元话费', id: '1' }
]

const show = ref(false)
const keyMobile = () => {
  // if (!user.mobile) show.value = true
  // else onShowRecord()
  show.value = true
}
const confirmMobile = () => {
  showDialog({
    message: '是否确认提交？',
  }).then(() => {
    localStorage.mobile = user.mobile
    onShowRecord()
  });
}
const onShowRecord = async () => {
  const { data } = await axios(
    `https://marry.aienji01.cn/houtai_h1/account/act_result?mobile=${user.mobile}`
  )
  if (data.code === 0) {
    const jp_id = data.data.jp_id
    if (jp_id === '0' || jp_id === 0) return showToast('该手机号没有中奖记录')
    const result = prizes.find((item) => item.id === jp_id).name
    prizeText.value = result
    showRecord.value = true
  } else {
    showToast(data.msg)
  }
}
</script>
<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/img/bg.png);
  background-size: 100% 100%;
  position: relative;

  .record {
    background: url('../assets/img/text.png');
    background-size: 100% 100%;
    width: 80px;
    height: 20px;
    margin: 20px auto;
    position: absolute;
    top: 42.5%;
    left: 50%;
    transform: translateX(-50%);
  }

  .video {
    position: absolute;
    top: 50%;
    bottom: 10%;
    left: 5%;
    right: 5%;
    background-color: white;

    video {
      width: 100%;
      height: 100%;
    }
  }
}

// //进度条

video::-webkit-media-controls-timeline {
  display: none !important;
}

video::-moz-range-progress {
  display: none !important;
}

video::-ms-fill-lower {
  display: none !important;
}

// // 全屏按钮
// video::-webkit-media-controls-fullscreen-button {
//   display: none;
// }
// //播放按钮
// video::-webkit-media-controls-play-button {
//   display: none;
// }

// //观看的当前时间
// video::-webkit-media-controls-current-time-display {
//   display: none;
// }
// //剩余时间
// video::-webkit-media-controls-time-remaining-display {
//   display: none;
// }
// //音量按钮
// video::-webkit-media-controls-mute-button {
//   display: none;
// }
// // 画中画
// video::-webkit-media-controls-toggle-closed-captions-button {
//   display: none;
// }
// //音量的控制条
// video::-webkit-media-controls-volume-slider {
//   display: none;
// }
// //所有控件
// video::-webkit-media-controls-enclosure {
//   display: none;
// }

.recordDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 250px;
  height: 150px;
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
