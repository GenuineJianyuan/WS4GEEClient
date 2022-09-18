/**
 * 存储流程设计相关参数
 */
export default class BpmData {
  constructor() {
    this.controls = [] // 设计器控件
    this.init()
  }

  init() {
    this.controls = [
      {
        action: 'create.start-event',
        // title: '输入数据'
        title: 'Start Data Node'
      },
      {
        action: 'create.intermediate-event',
        // title: '中间数据'
        title: 'Intermediate Data Node'
      },
      {
        action: 'create.end-event',
        // title: '输出结果'
        title: 'Result Node'
      },
      {
        action: 'create.task',
        // title: '处理服务'
        title: 'Processing Node'
      },
      {
        action: 'create.subprocess-expanded',
        title: '子流程'
      },
      {
        action: 'create.participant-expanded',
        title: '扩展流程'
      },
      {
        action: 'create.group',
        title: '分组'
      }
    ]
  }

  //  获取控件配置信息
  getControl(action) {
    const result = this.controls.filter(item => item.action === action)
    return result[0] || {}
  }
}
