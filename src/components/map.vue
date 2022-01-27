<template>
  <div class="map-main-container">
    <div v-show="false" id="map-container" class="cesium-container" />
    <div v-show="true" id="cesium-container" class="cesium-container" />
  </div>
</template>

<script>
import mapInit from '@/map'
import { addScene } from '@/utils/tools'
export default {
  mounted() {
    mapInit._init()
    setTimeout(() => {
      addScene()
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.map-main-container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: none;
  position: absolute;
  z-index: 1;
  .cesium-container{
    width: 100%;
    height: 100%;
    overflow: hidden;
    // background-image: url('~@/assets/image/home/5b0df.jpeg');
    background-size: 100%;
    border: none;
  }
}
</style>
