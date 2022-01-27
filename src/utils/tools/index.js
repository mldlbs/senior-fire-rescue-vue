/*eslint no-undef: */
/*eslint no-unused-vars: */
import { psg } from '@/map'
// import S3MTilesLayer from '../S3M_module/S3MTiles/S3MTilesLayer.js'

// 添加三维场景
export function addScene() {
  const b3d = psg.get('b3d')
  b3d.openScene({
    url: 'http://www.supermapol.com/realspace/services/3D-OlympicGreen_Plan/rest/realspace',
    success: (viewer) => {
      console.log(viewer)
    }
  })

  b3d.viewer.scene.debugShowFramesPerSecond = true
  b3d.viewer.orderIndependentTranslucency = false
  // b3d.viewer.contextOptions.webgl.alpha = true[]
  b3d.viewer.scene.skyBox.show = false
  b3d.viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#ffffff')
  // b3d.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
  b3d.viewer.scene.sun.show = false
  b3d.viewer.scene.moon.show = false
}

// 添加模型
export function getModelPosition(callback) {
  // rmHanderClick()
  const plan = psg.get('plan3d')
  plan.getPoint(res => {
    callback(res)
  })
}

// 添加线
// 添加模型
export function getLinePosition(callback) {
  // rmHanderClick()
  const plan = psg.get('plan3d')
  plan.drawLine(res => {
    callback(res)
    plan.clear()
  })
}

// 添加模型列表
export function addModels(data, callback) {
  // addStripeEvenPolygon()
  if (data) {
    data.forEach((item, i) => {
      if (getEntity(item.plotId)) { return }
      const position = isJsonPosition(item.plottingPosition)
      if (!position || !item.plottingName || !item.plottingType) {
        callback(item)
        return
      }
      switch (item.plottingType) {
        case 'P':
          addModel(item, position)
          break
        case 'L':
          addLine(item)
          break
        case 'A':
          addArea(item)
          break
      }
    })
  }
}

export function addModel(item, position) {
  addEntityModel(item, position)
}

export function addLine(item) {
  const b3d = psg.get('b3d')
  const positions = []
  const position = JSON.parse(item.plottingPosition)
  position.forEach(item => {
    positions.push(item.longitude)
    positions.push(item.latitude)
    positions.push(item.height || 0)
  })
  const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
  switch (item.plottingName) {
    case '实线': {
      const fullLineColor = Cesium.Color.fromCssColorString('#C8910A')
      const fullLineWidth = Number(3)
      b3d.viewer.entities.add({
        id: item.plotId,
        polyline: {
          positions: hierarchy,
          width: fullLineWidth,
          material: fullLineColor
        },
        prop: item
      })
      break
    }
    case '虚线': {
      const dashLineColor = Cesium.Color.fromCssColorString('C8910A')
      const dashLineGapColor = Cesium.Color.fromCssColorString('#0AC848')
      const dashLineWidth = Number(3)
      const dashLineDashSectionLength = Number(16)
      b3d.viewer.entities.add({
        id: item.plotId,
        polyline: {
          positions: hierarchy,
          width: dashLineWidth,
          material: new Cesium.PolylineDashMaterialProperty({
            color: dashLineColor,
            gapColor: dashLineGapColor,
            dashLength: dashLineDashSectionLength
          })
        },
        prop: item
      })
      break
    }
    case '轮廓线': {
      const outlineInnerColor = Cesium.Color.fromCssColorString('#C8910A')
      const outlineOuterColor = Cesium.Color.fromCssColorString('#1754E3')
      const outlineInnerWidth = Number(5)
      const outlineOuterWidth = Number(2)
      b3d.viewer.entities.add({
        id: item.plotId,
        polyline: {
          positions: hierarchy,
          width: outlineInnerWidth,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: outlineInnerColor,
            outlineWidth: outlineOuterWidth,
            outlineColor: outlineOuterColor
          })
        },
        prop: item
      })
      break
    }
    case '箭头线': {
      const arrowLineColor = Cesium.Color.fromCssColorString('#C8910A')
      const arrowLineWidth = Number(5)
      b3d.viewer.entities.add({
        id: item.plotId,
        polyline: {
          positions: hierarchy,
          width: arrowLineWidth,
          followSurface: false,
          material: new Cesium.PolylineArrowMaterialProperty(arrowLineColor)
        },
        prop: item
      })
      break
    }
    case '光晕线': {
      const glowLineColor = Cesium.Color.fromCssColorString('#C8910A')
      const glowLineWidth = Number(5)
      const glowLinePower = Number(1)
      b3d.viewer.entities.add({
        id: item.plotId,
        polyline: {
          positions: hierarchy,
          width: glowLineWidth,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: glowLinePower,
            color: glowLineColor
          })
        },
        prop: item
      })
      break
    }
    case '尾迹线': {
      const trailLineColor = Cesium.Color.fromCssColorString('#C8910A')
      const trailLineWidth = 5 // 线宽
      const trailLinePercent = 0.3 // 尾迹线占比
      const trailLinePeroid = 1.5 // 尾迹线周期
      b3d.viewer.entities.add({
        id: item.plotId,
        polyline: {
          positions: hierarchy,
          width: trailLineWidth,
          material: new Cesium.PolylineTrailMaterialProperty({
            color: trailLineColor,
            trailLength: trailLinePercent,
            period: trailLinePeroid
          })
        },
        prop: item
      })
      break
    }
    default:
      break
  }
}

export function addArea(item) {
  const b3d = psg.get('b3d')
  const positions = []
  const position = JSON.parse(item.plottingPosition)
  position.forEach(item => {
    positions.push(item.longitude)
    positions.push(item.latitude)
    positions.push(item.height && item.height + 1 || 0)
  })
  const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
  switch (item.plottingName) {
    case '纯色': {
      const polygonSymbolPureColor = Cesium.Color.fromCssColorString('#C8910A')
      b3d.viewer.entities.add({
        id: item.plotId,
        polygon: {
          perPositionHeight: true,
          hierarchy: hierarchy,
          material: polygonSymbolPureColor,
          clampToGround: true// 贴地
        },
        clampToS3M: true,
        prop: item
      })
      break
    }
    case '网格': {
      const polygonSymbolGridColor = Cesium.Color.fromCssColorString('#C8910A')
      const polygonSymbolGridCellAlpha = Number(0.1) // 单元透明度
      const polygonSymbolGridLineCount = Number(8) // 网格线数
      const polygonSymbolGridLineThickness = Number(1) // 网格线宽度
      const polygonSymbolGridLineOffset = Number(0) // 网格线偏移
      b3d.viewer.entities.add({
        id: item.plotId,
        polygon: {
          perPositionHeight: true,
          hierarchy: hierarchy,
          material: new Cesium.GridMaterialProperty({
            color: polygonSymbolGridColor,
            cellAlpha: polygonSymbolGridCellAlpha,
            lineCount: new Cesium.Cartesian2(polygonSymbolGridLineCount, polygonSymbolGridLineCount),
            lineThickness: new Cesium.Cartesian2(polygonSymbolGridLineThickness, polygonSymbolGridLineThickness),
            lineOffset: new Cesium.Cartesian2(polygonSymbolGridLineOffset, polygonSymbolGridLineOffset)
          }),
          clampToGround: true// 贴地
        },
        clampToS3M: true,
        prop: item
      })
      break
    }
    case '条纹': {
      const polygonSymbolStripeEvenColor = Cesium.Color.fromCssColorString('#C8910A') // 偶数
      const polygonSymbolStripeOddColor = Cesium.Color.fromCssColorString('#FFFFFF') // 奇数
      const polygonSymbolStripeRepeat = Number(12) // 条带重复数
      const polygonSymbolStripeOffset = Number(0) // 偏移量
      const polygonSymbolStripeOrientation = Number(0) // 条带方向
      b3d.viewer.entities.add({
        id: item.plotId,
        polygon: {
          perPositionHeight: true,
          hierarchy: hierarchy,
          material: new Cesium.StripeMaterialProperty({
            evenColor: polygonSymbolStripeEvenColor,
            oddColor: polygonSymbolStripeOddColor,
            repeat: polygonSymbolStripeRepeat,
            offset: polygonSymbolStripeOffset,
            orientation: polygonSymbolStripeOrientation
          }),
          clampToGround: true// 贴地
        },
        clampToS3M: true,
        prop: item
      })
      break
    }
    default:
      break
  }
}

function isJsonPosition(pos) {
  try {
    let position = JSON.parse(pos)
    if (position.length <= 0) {
      return false
    }
    position = position[0]
    if (!position || !position.longitude) {
      return false
    }
    return position
  } catch (error) {
    return false
  }
}

// 添加实线
export function addFullLine() {
  console.log('添加实线')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    const fullLineColor = Cesium.Color.fromCssColorString('#C8910A')
    const fullLineWidth = Number(3)
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polyline: {
        positions: hierarchy,
        width: fullLineWidth,
        material: fullLineColor
      }
    })
  })
}

// 添加虚线
export function addDashLine() {
  console.log('添加虚线')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    const dashLineColor = Cesium.Color.fromCssColorString('C8910A')
    const dashLineGapColor = Cesium.Color.fromCssColorString('#0AC848')
    const dashLineWidth = Number(3)
    const dashLineDashSectionLength = Number(16)
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polyline: {
        positions: hierarchy,
        width: dashLineWidth,
        material: new Cesium.PolylineDashMaterialProperty({
          color: dashLineColor,
          gapColor: dashLineGapColor,
          dashLength: dashLineDashSectionLength
        })
      }
    })
  })
}

// 添加箭头线
export function addArrowLine() {
  console.log('添加箭头线')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    var arrowLineColor = Cesium.Color.fromCssColorString('#C8910A')
    var arrowLineWidth = Number(5)
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polyline: {
        positions: hierarchy,
        width: arrowLineWidth,
        followSurface: false,
        material: new Cesium.PolylineArrowMaterialProperty(arrowLineColor)
      }
    })
  })
}

// 添加轮廓线
export function addOutLine() {
  console.log('添加轮廓线')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    const outlineInnerColor = Cesium.Color.fromCssColorString('#C8910A')
    const outlineOuterColor = Cesium.Color.fromCssColorString('#1754E3')
    const outlineInnerWidth = Number(5)
    const outlineOuterWidth = Number(2)
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polyline: {
        positions: hierarchy,
        width: outlineInnerWidth,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: outlineInnerColor,
          outlineWidth: outlineOuterWidth,
          outlineColor: outlineOuterColor
        })
      }
    })
  })
}

// 添加光晕线
export function addGlowLine() {
  console.log('添加光晕线')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    var glowLineColor = Cesium.Color.fromCssColorString('#C8910A')
    var glowLineWidth = Number(5)
    var glowLinePower = Number(1)
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polyline: {
        positions: hierarchy,
        width: glowLineWidth,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: glowLinePower,
          color: glowLineColor
        })
      }
    })
  })
}

// 添加尾迹线
export function addTrailLine() {
  console.log('添加尾迹线')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    var trailLineColor = Cesium.Color.fromCssColorString('#C8910A')
    var trailLineWidth = 5 // 线宽
    var trailLinePercent = 0.3 // 尾迹线占比
    var trailLinePeroid = 1.5 // 尾迹线周期
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polyline: {
        positions: hierarchy,
        width: trailLineWidth,
        material: new Cesium.PolylineTrailMaterialProperty({
          color: trailLineColor,
          trailLength: trailLinePercent,
          period: trailLinePeroid
        })
      }
    })
  })
}

// 添加纯色面
export function addPurePolygon() {
  console.log('添加纯色面')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    var polygonSymbolPureColor = Cesium.Color.fromCssColorString('#C8910A')
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polygon: {
        perPositionHeight: true,
        hierarchy: hierarchy,
        material: polygonSymbolPureColor
      }
    })
  })
}

// 添加网格面
export function addGridPolygon() {
  console.log('添加网格面')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    var polygonSymbolGridColor = Cesium.Color.fromCssColorString('#C8910A')
    var polygonSymbolGridCellAlpha = Number(0.1) // 单元透明度
    var polygonSymbolGridLineCount = Number(8) // 网格线数
    var polygonSymbolGridLineThickness = Number(1) // 网格线宽度
    var polygonSymbolGridLineOffset = Number(0) // 网格线偏移
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polygon: {
        perPositionHeight: true,
        hierarchy: hierarchy,
        material: new Cesium.GridMaterialProperty({
          color: polygonSymbolGridColor,
          cellAlpha: polygonSymbolGridCellAlpha,
          lineCount: new Cesium.Cartesian2(polygonSymbolGridLineCount, polygonSymbolGridLineCount),
          lineThickness: new Cesium.Cartesian2(polygonSymbolGridLineThickness, polygonSymbolGridLineThickness),
          lineOffset: new Cesium.Cartesian2(polygonSymbolGridLineOffset, polygonSymbolGridLineOffset)
        })
      }
    })
  })
}

// 添加条纹面
export function addStripeEvenPolygon() {
  console.log('添加条纹面')
  const b3d = psg.get('b3d')
  getLinePosition((res) => {
    console.log(res)
    const positions = []
    res.forEach(item => {
      positions.push(item.longitude)
      positions.push(item.latitude)
      positions.push(item.height || 0)
    })
    var polygonSymbolStripeEvenColor = Cesium.Color.fromCssColorString('#C8910A') // 偶数
    var polygonSymbolStripeOddColor = Cesium.Color.fromCssColorString('#FFFFFF') // 奇数
    var polygonSymbolStripeRepeat = Number(12) // 条带重复数
    var polygonSymbolStripeOffset = Number(0) // 偏移量
    var polygonSymbolStripeOrientation = Number(0) // 条带方向
    const hierarchy = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    b3d.viewer.entities.add({
      id: 'polyline-symbol-full-' + (new Date()).getTime(),
      polygon: {
        perPositionHeight: true,
        hierarchy: hierarchy,
        material: new Cesium.StripeMaterialProperty({
          evenColor: polygonSymbolStripeEvenColor,
          oddColor: polygonSymbolStripeOddColor,
          repeat: polygonSymbolStripeRepeat,
          offset: polygonSymbolStripeOffset,
          orientation: polygonSymbolStripeOrientation
        })
      }
    })
  })
}

export function addDynamicCircle(item, position) {
  const b3d = psg.get('b3d')
  const height = Number(position.height)
  position = Cesium.Cartesian3.fromDegrees(Number(position.longitude), Number(position.latitude), Number(position.height))
  b3d.viewer.entities.add({
    id: item.id,
    name: '动态圆',
    position: position,
    ellipse: {
      height: height + 0.1,
      semiMinorAxis: 20,
      semiMajorAxis: 20,
      material: b3d.createDynamicCricle({
        duration: 2e3,
        gradient: 3.5, // 亮度
        color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
        count: 3
      })
    },
    prop: item
  })
}

// 添加模型
export function addEntityModel(item, position) {
  const b3d = psg.get('b3d')
  const headingPitchRoll = new Cesium.HeadingPitchRoll(
    Cesium.Math.toRadians(0),
    Cesium.Math.toRadians(0),
    Cesium.Math.toRadians(0)
  )
  position = Cesium.Cartesian3.fromDegrees(Number(position.longitude), Number(position.latitude), Number(position.height))
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, headingPitchRoll)
  b3d.viewer.entities.add({
    id: item.plotId,
    position: position,
    orientation: orientation,
    model: {
      uri: 'symbol' + item.plotUrl,
      colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
      color: Cesium.Color.WHITE, // .withAlpha(0.5),
      scale: 1,
      maximumScale: 1
    },
    prop: item
  })
}

// 根据id 获取选中entity
export function getEntity(id) {
  const b3d = psg.get('b3d')
  let entity
  const entities = b3d.viewer.entities._entities._array
  for (var i = 0; i < entities.length; i++) {
    if (entities[i]._id === id) {
      entity = entities[i]
      break
    }
  }
  return entity
}

// 拾取模型
export function getModel() {
  const b3d = psg.get('b3d')
  const viewer = b3d.viewer
  const plan = psg.get('plan3d')
  plan.getPoint(res => {
    const point = res[0]
    const pos = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height)
    var pick = viewer.scene.pick(pos)
    if (pick) {
      console.log(pick)
    }
    // viewer.camera.lookAtTransform(matrix, new Cesium.Cartesian3(-50, 0, 800))
  })
}

