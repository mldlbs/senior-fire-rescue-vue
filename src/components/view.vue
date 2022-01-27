<template>
  <div class="vue-flow-edit">
    <vue-flow-edit
      v-if="psg != null"
      class="flow-container"
      :flow-list="test"
      :select-array="selectArray"
      :psg="psg"
      @save="save"
    />
    <cr-map />
  </div>
</template>

<script>
import VueFlowEdit from 'vue-flow-edit'
import CrMap from '../components/map.vue'
import 'vue-flow-edit/dist/vue-flow-edit.css'
import selectArray from '../data/event.json'
import test from '../data/test.json'
import { psg } from '@/map'
export default {
  name: 'HelloWorld',
  components: {
    CrMap, VueFlowEdit
  },
  data() {
    return {
      selectArray: selectArray,
      psg: null,
      test: test
    }
  },
  mounted() {
    this.psg = psg
  },
  methods: {
    save(res) {
      console.log(res)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.vue-flow-edit{
  display: flex;
  flex-flow: column nowrap;
  // .flow-container{
  //   position: absolute;
  // }
}
</style>
