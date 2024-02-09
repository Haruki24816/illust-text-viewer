<script setup>
import { ref } from "vue"

const text = ref()
const currentIllust = ref()

const illusts = ref([])
const play = ref(false)
const interval = ref()
const ms = ref(60000)
const opacity = ref(0.5)
const fontsize = ref(20)
const textwidth = ref(400)
const textlineheight = ref(180)

function onDragover(event) {
  event.preventDefault()
  event.stopPropagation()
}

function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  let illustFile = false
  for (const num in event.dataTransfer.files) {
    const file = event.dataTransfer.files[num]
    if (file.type == "image/jpeg") {
      illusts.value.push(file)
      illustFile = true
    }
    if (file.type == "text/plain") {
      const reader = new FileReader()
      reader.onload = () => {
        text.value = reader.result
      }
      reader.readAsText(file)
    }
  }
  if (illustFile) {
    start()
  }
}

function updateIllust() {
  const file = illusts.value[Math.floor(Math.random() * illusts.value.length)]
  const reader = new FileReader()
  reader.onload = () => {
    currentIllust.value = reader.result
  }
  reader.readAsDataURL(file)
}

function start() {
  if (play.value) {
    return
  }
  if (illusts.value.length === 0) {
    return
  }
  play.value = true
  updateIllust()
  interval.value = setInterval(() => {
    updateIllust()
  }, ms.value)
}

function stop() {
  play.value = false
  clearInterval(interval.value)
}

function skip() {
  if (illusts.value.length === 0) {
    return
  }
  if (play.value) {
    stop()
    start()
  } else {
    updateIllust()
  }
}

function clearIllust() {
  stop()
  illusts.value = []
  currentIllust.value = null
}
</script>

<template>
  <div class="container" @dragover="onDragover" @drop="onDrop" :style="{ opacity: opacity }">
    <div class="contents" :style="{ 'max-width': textwidth + 'px' }">
      <div class="control">
        <button @click="start">再生</button>
        <button @click="stop">停止</button>
        <button @click="skip">スキップ</button>
        <button @click="clearIllust">イラストクリア</button>
        ミリ秒<input class="num" type="number" v-model="ms"><br>
        透明度<input type="range" min="0.05" max="1" step="0.01" v-model="opacity"><br>
        文字<input type="range" min="10" max="100" step="1" v-model="fontsize"><br>
        幅<input type="range" min="100" max="1000" step="1" v-model="textwidth"><br>
        行間<input type="range" min="50" max="400" step="1" v-model="textlineheight">
      </div>
      <pre :style="{ 'font-size': fontsize + 'px', 'line-height': textlineheight + '%' }">{{ text }}</pre>
    </div>
  </div>
  <div class="imgwrapper">
    <img :src="currentIllust" v-if="illusts.length != 0">
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: darkgray;
}

.container {
  width: 100vw;
  padding-top: 100vh;
}

.imgwrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: -1;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

pre {
  font-family: serif;
  white-space: pre-wrap;
  margin-top: 100px;
  text-shadow:
    white 1px 1px 1px,
    white 1px -1px 1px,
    white -1px 1px 1px,
    white -1px -1px 1px;
}

.contents {
  margin-left: auto;
  margin-right: auto;
}

.control {
  width: 100%;
  text-align: center;
}

.num {
  width: 80px
}
</style>
