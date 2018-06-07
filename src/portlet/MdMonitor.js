import MdPortlet from 'md-lib/client/MdPortlet'
import {el, eltable} from './el'

const RESULT_TABLE = [
  { header: 'type', data: 'type', width: '120px' },
  { header: 'ip', data: 'ip', width: '100px' },
  { header: 'port', data: 'port', width: '100px'},
  { header: 'cores', data: 'cores', width: '80px'},
  { header: 'avg load', data: 'load', width: '100px'},
  { header: 'ms', data: 'responseMs', width: '100px'}
]

export default class MdMonitor extends MdPortlet {
  constructor () {
    super('mdMonitor') // This must match id in the server part
  }

  createChildren (createElement) {
    this.contentElement = createElement('div')
    this.elTable = eltable.cr().$renderTo(this.contentElement)
    this.elTable.def = RESULT_TABLE
  }

  loaded () {
    this.getSocket().on('refresh', this.loadData.bind(this))
    this.loadData()
  }

  async loadData () {
    let timerStart = new Date().getTime()
    this.context.api.inProgress(true)
    this.elTable.data = []
    var successHandler = (res) => {
      this.context.api.inProgress(false)
    }
    var errorHandler = (msg) => {
      el.clear(this.contentElement).txt('Error: ' + msg)
    }
    var progressHandler = (msg) => {
      let timerEnd = new Date().getTime()
      var record = JSON.parse(decodeURIComponent(msg))
      record.responseMs = (timerEnd - timerStart)
      record.load = record.loadData.avgload
      record.cores = record.cpuData.cores
      this.elTable.addDataItem(record)

    }
    this.job('doSomeWorkAsync', [456, 789], progressHandler).then(successHandler, errorHandler)
  }

}

let content = ''
