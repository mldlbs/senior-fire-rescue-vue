/*eslint no-undef:  */
let psg, mhander
export default {
  _init() {
    const { CesiumFence, CesiumMaterial, AlertMarker, Move } = B3dCesium.Plugins
    const Plan3D = B3dCesium.Plugins.Plan3D
    const Particle = B3dCesium.Plugins.Particle
    const Action = B3dCesium.Plugins.Action
    psg = new CCG({
      cesium: {
        sceneid: 'cesium-container'
      },
      modules: [CesiumFence, CesiumMaterial, AlertMarker, Move, Plan3D, Particle, Action]
    })
    const b3d = psg.get('b3d')
    mhander = new Cesium.ScreenSpaceEventHandler(b3d.viewer.scene.canvas)
  }
}
export { psg, mhander }
