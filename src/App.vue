<script setup>
import { ref } from "vue"
import { halfKataToWide, toHira, toWideKata, toHalfKata } from "./katakana"

const text = ref()
const texts = ref([])
const currentIllust = ref()
const illusts = ref([])
const play = ref(false)
const interval = ref()

const ms = ref(10000)
const opacity = ref(0.6)
const fontsize = ref(25)
const textwidth = ref(500)
const textlineheight = ref(180)
const contrast = ref(80)
const hankakukana = ref(true)

function onDragover(event) {
  event.preventDefault()
  event.stopPropagation()
}

function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  let filetype = ""
  for (const num in event.dataTransfer.files) {
    const file = event.dataTransfer.files[num]
    if (file.type == "image/jpeg") {
      illusts.value.push(file)
      filetype = "illust"
    }
    if (file.type == "text/plain") {
      texts.value.push(file)
      filetype = "text"
    }
  }
  if (filetype == "illust") {
    if (event.dataTransfer.files.length === 1) {
      stop()
      updateIllustUsiro()
    } else {
      start()
    }
  }
  if (filetype == "text") {
    if (event.dataTransfer.files.length === 1) {
      setTextUsiro()
    } else {
      setText()
    }
  }
}

function setText() {
  if (texts.value.length === 0) {
    return
  }
  const file = texts.value[Math.floor(Math.random() * texts.value.length)]
  const reader = new FileReader()
  reader.onload = () => {
    if (hankakukana.value) {
      text.value = halfKataToWide(reader.result)
    } else {
      text.value = reader.result
    }
  }
  reader.readAsText(file)
}

function setTextUsiro() {
  if (texts.value.length === 0) {
    return
  }
  const file = texts.value[texts.value.length - 1]
  const reader = new FileReader()
  reader.onload = () => {
    if (hankakukana.value) {
      text.value = halfKataToWide(reader.result)
    } else {
      text.value = reader.result
    }
  }
  reader.readAsText(file)
}

function clearText() {
  texts.value = []
  text.value = null
}

function updateIllust() {
  const file = illusts.value[Math.floor(Math.random() * illusts.value.length)]
  const reader = new FileReader()
  reader.onload = () => {
    currentIllust.value = reader.result
  }
  reader.readAsDataURL(file)
}

function updateIllustUsiro() {
  const file = illusts.value[illusts.value.length - 1]
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
  <div class="container" @dblclick="skip" @dragover="onDragover" @drop="onDrop" :style="{ opacity: opacity }">
    <div class="contents" :style="{ 'max-width': textwidth + 'px' }">
      <pre :style="{ 'font-size': fontsize + 'px', 'line-height': textlineheight + '%' }">{{ text }}</pre>
    </div>
  </div>
  <div class="imgwrapper">
    <img :src="currentIllust" v-if="illusts.length != 0" :style="{ filter: 'contrast(' + contrast + '%)' }">
  </div>
  <div class="control">
    <div class="controlnakami">
      <table>
        <tr>
          <td>画像枚数</td>
          <td>{{ illusts.length }}</td>
        </tr>
        <tr>
          <td>テキスト数</td>
          <td>{{ texts.length }}</td>
        </tr>
        <tr>
          <td>ミリ秒</td>
          <td><input class="num" type="number" v-model="ms"></td>
        </tr>
        <tr>
          <td>透明度</td>
          <td><input type="range" min="0.05" max="1" step="0.01" v-model="opacity"></td>
        </tr>
        <tr>
          <td>文字</td>
          <td><input type="range" min="10" max="100" step="1" v-model="fontsize"></td>
        </tr>
        <tr>
          <td>幅</td>
          <td><input type="range" min="100" max="1000" step="1" v-model="textwidth"></td>
        </tr>
        <tr>
          <td>行間</td>
          <td><input type="range" min="50" max="400" step="1" v-model="textlineheight"></td>
        </tr>
        <tr>
          <td>画像</td>
          <td><input type="range" min="0" max="100" step="1" v-model="contrast"></td>
        </tr>
        <tr>
          <td>半角カナ変換</td>
          <td><input type="checkbox" v-model="hankakukana"></td>
        </tr>
      </table>
    </div>
    <div :style="{ opacity: opacity }">
      📝
      <button @click="setText">⏭️</button>
      <button @click="clearText">🆑</button><br>
      🖼️
      <button @click="start" v-if="!play">▶️</button>
      <button @click="stop" v-if="play">⏸️</button>
      <button @click="skip">⏭️</button>
      <button @click="clearIllust">🆑</button>
    </div>
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
  margin: 0;
  font-family: serif;
  white-space: pre-wrap;
  user-select: none;
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
  position: fixed;
  bottom: 0;
  left: 0;
}

.controlnakami {
  display: none;
  margin: 5px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.6);
}

.control:hover .controlnakami {
  display: block;
}

tr {
  height: 30px;
}

td {
  padding-right: 10px;
}
</style>
