/*eslint no-undef: */
import { psg } from '@/map'

// 流程启动
export function start() {
  const engine = psg.get('engine')
  engine.start()
}

// 流程停止
export function stop() {
  const engine = psg.get('engine')
  engine.stop()
  clear()
}

// 清除场景
export function clear() {
  const b3d = psg.get('b3d')
  b3d.viewer.entities.removeAll()
  const particle = psg.get('particle')
  particle.destroy()
}

// 流程暂停
export function pause() {
  const engine = psg.get('engine')
  engine.pause()
}

export function assembly(plan, action, callback) {
  const engine = psg.get('engine')
  engine.assembly(plan, (item) => {
    render3d(item, action)
    if (item.content.indexOf('灭火成功') > -1) {
      outfire()
    }
    if (callback) callback(item)
  })
}

export function outfire() {
  const action = psg.get('action')
  action.outfire()
}

// 渲染3维执行动画
export function render3d(step, actions) {
  const action = psg.get('action')
  const act = actions.filter((item) => step.id === item.id)[0]
  if (act) {
    switch (act.action) {
      case 'xf_14':
        action.setXFFenCeng(act, 'B1_F19@东港商务中心_1')
        break
      case 'xf_01':
        action.addXFEventPoint(act)
        break
      case 'xf_02':
        console.log('灾情播报')
        // addXFEvacuateRoute(action)
        break
      case 'xf_03':
        action.addXFEvacuateRoute(act)
        break
      case 'xf_04':
        action.addXFEvacuateRouteMove(act)
        break
      case 'xf_05':
        action.addXFReceiveAlarm(act)
        break
      case 'xf_06':
        action.addXFCarMove(act)
        break
      case 'xf_07':
        action.addXFOutDeploy(act)
        break
      case 'xf_08':
        action.addXFOutDeploy(act)
        break
      case 'xf_09':
        action.addXFSprayWater(act)
        break
      case 'xf_10':
        action.addXFEvacuateRoute(act)
        break
      case 'xf_11':
        action.addXFInDeploy(act)
        break
      case 'xf_12':
        action.addXFFireCock(act)
        break
      case 'xf_13':
        action.addXFFMDeploy(act)
        break
      case 'xf_15':
        action.addXFFireCock(act)
        break
    }
  }
}

