/*eslint no-undef:  */
import CCGIS from 'ccgis'
import { CesiumFence, CesiumMaterial, AlertMarker, Move, Plan3D, Particle, Action } from 'ccgis/dist/features'
let psg, mhander
export default {
  _init() {
    console.log(CCGIS)
    psg = new CCGIS({
      cesium: {
        sceneid: 'cesium-container'
      },
      modules: [CesiumFence, CesiumMaterial, AlertMarker, Move, Plan3D, Particle, Action]
    })
    const b3d = psg.get('cc3dcesium')
    mhander = new Cesium.ScreenSpaceEventHandler(b3d.viewer.scene.canvas)
  }
}
export { psg, mhander }
