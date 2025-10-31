<script setup>
import { reactive, ref } from "vue"
import { halfKataToWide, toHira, toWideKata, toHalfKata } from "./katakana"
import gsap from "gsap"

const settings = reactive({
  "color": "#ffffff",
  "shadow": "#000000",
  "scale": 1,
  "dangumi": true,
  "bold": "bold",
  "fontfamily": "Meiryo",
})

const seek = reactive({
  "seek": 0
})

const text = ref()
const texts = ref([])
const currentIllust = ref()
const illusts = ref([])
const play = ref(false)
const interval = ref()

const ms = ref(5000)
const opacity = ref(0.9)
const fontsize = ref(12)
const textwidth = ref(400)
const textlineheight = ref(160)
const contrast = ref(60)
const hankakukana = ref(true)

function onDragover(event) {
  event.preventDefault()
  event.stopPropagation()
}

const onDrop = async (event) => {
  event.preventDefault()
  event.stopPropagation()

  const fileList = []
  const items = event.dataTransfer.items
  let textFileCount = 0
  let illustFileCount = 0

  for (const item of items) {
    const entry = item.webkitGetAsEntry()
    const loop = async (entry) => {
      if (entry.isFile) {
        const file = await new Promise((resolve) => {
          entry.file((file) => {
            resolve(file)
          })
        })
        let fileExt = file.name.split(".").pop()
        if (["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"].includes(fileExt)) {
          illusts.value.push(file)
          illustFileCount += 1
        }
        if (["txt", "TXT"].includes(fileExt)) {
          texts.value.push(file)
          textFileCount += 1
        }
        fileList.push(file)
      } else if (entry.isDirectory) {
        const directoryReader = entry.createReader()
        const children = await new Promise((resolve) => {
          directoryReader.readEntries((children) => {
            resolve(children)
          })
        })
        for (const num in children) {
          const child = children[num]
          await loop(child)
        }
      }
    }
    await loop(entry)
  }

  console.log(fileList)

  if (illustFileCount === 1) {
    stop()
    updateIllustUsiro()
  } else if (illustFileCount === 0) {
    //
  } else {
    start()
  }

  if (textFileCount === 1) {
    setTextUsiro()
  } else if (textFileCount === 0) {
    //
  } else {
    setText()
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
  window.location.replace("#top")
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
  window.location.replace("#top")
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
  seek.seek = 0
  gsap.to(seek, { duration: (ms.value / 1000 - 0.1), seek: 100, ease: "none" })
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
    <div class="contents">
      <div>
        <div id="top"></div>
        <div class="spacer"></div>
        <div class="spacer" v-if="settings.dangumi"></div>
        <pre :style="{ 'font-size': fontsize + 'px', 'line-height': textlineheight + '%' }">{{ text }}</pre>
      </div>
      <div v-if="settings.dangumi">
        <div class="spacer"></div>
        <pre :style="{ 'font-size': fontsize + 'px', 'line-height': textlineheight + '%' }">{{ text }}</pre>
      </div>
    </div>
  </div>
  <div class="imgwrapper">
    <img :src="currentIllust" v-if="illusts.length != 0">
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
          <td><input class="num" type="number" v-model="ms" step="1000"></td>
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
          <td><input type="range" min="10" max="1000" step="1" v-model="textwidth"></td>
        </tr>
        <tr>
          <td>行間</td>
          <td><input type="range" min="50" max="400" step="1" v-model="textlineheight"></td>
        </tr>
        <tr>
          <td>ｺﾝﾄﾗｽﾄ</td>
          <td><input type="range" min="0" max="100" step="1" v-model="contrast"></td>
        </tr>
        <tr>
          <td>拡大</td>
          <td><input type="range" min="0.1" max="10" step="0.01" v-model="settings.scale"><button
              @click="settings.scale = 1">100</button></td>
        </tr>
        <tr>
          <td>半角カナ変換</td>
          <td><input type="checkbox" v-model="hankakukana"></td>
        </tr>
        <tr>
          <td>文字色</td>
          <td><input type="color" v-model="settings.color"><input type="color" v-model="settings.shadow"></td>
        </tr>
        <tr>
          <td>段組み</td>
          <td><button @click="settings.dangumi = false">1</button><button @click="settings.dangumi = true">2</button>
          </td>
        </tr>
        <tr>
          <td>フォント</td>
          <td>
            <select v-model="settings.fontfamily">
              <option value="Meiryo">Meiryo</option>
              <option value="ＭＳ ゴシック">ＭＳ ゴシック</option>
              <option value="ＭＳ 明朝">ＭＳ 明朝</option>
              <option value="BIZ UDPゴシック">BIZ UDPゴシック</option>
              <option value="BIZ UDP明朝 Medium">BIZ UDP明朝 Medium</option>
              <option value="Noto Sans JP">Noto Sans JP</option>
              <option value="Noto Serif JP">Noto Serif JP</option>
              <option value="游ゴシック">游ゴシック</option>
              <option value="游明朝">游明朝</option>
            </select>
            <input type="text" v-model="settings.fontfamily">
            <button @click="settings.bold = 'normal'">普通</button>
            <button @click="settings.bold = 'bold'">太字</button>
          </td>
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
  <div class="seek">a</div>
</template>

<style>
body {
  margin: 0;
  background-color: darkgray;
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
  filter: contrast(v-bind("contrast + '%'"));
  transform: scale(v-bind("settings.scale"));
}

pre {
  margin: 0;
  font-family: v-bind("settings.fontfamily");
  font-weight: v-bind("settings.bold");
  color: v-bind("settings.color");
  white-space: pre-wrap;
  user-select: none;
  text-shadow:
    v-bind("settings.shadow") 1px 1px 1px,
    v-bind("settings.shadow") 1px -1px 1px,
    v-bind("settings.shadow") -1px 1px 1px,
    v-bind("settings.shadow") -1px -1px 1px;
}

.spacer {
  height: 100vh;
}

.contents {
  display: flex;
  justify-content: center;
}

.contents>div {
  max-width: v-bind("textwidth + 'px'");
  padding-left: 10px;
  padding-right: 10px;
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

.seek {
  width: v-bind("seek.seek + '%'");
  height: 4px;
  position: fixed;
  bottom: 0;
  left: 0;
  mix-blend-mode: difference;
  background: rgb(255, 255, 255);
}
</style>
