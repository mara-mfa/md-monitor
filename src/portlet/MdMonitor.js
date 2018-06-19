import MdPortlet from 'md-lib/client/MdPortlet'
import {el, eltable} from './el'

const RESULT_TABLE = [
  { header: '', data: '', width: '16px', class: 'blink'},
  { header: 'type', data: 'type', width: '80px' },
  { header: 'ip', data: 'ip', width: '100px' }
]

export default class MdMonitor extends MdPortlet {
  constructor () {
    super('mdMonitor') // This must match id in the server part
  }

  createChildren (createElement) {
    this.contentElement = createElement('div')
    this.grpcButton = el.cr('button').txt('Grpc').onClick(this.grpcButtonClickHandler.bind(this)).$renderTo(this.contentElement)
    this.grpcResults = el.cr('span').txt('').$renderTo(this.contentElement)
    this.elTable = eltable.cr().$renderTo(this.contentElement)
    this.elTable.def = RESULT_TABLE
  }

  loaded () {
    this.wsOn('mdDebug', this.mdDebugHandler.bind(this))
  }

  grpcButtonClickHandler() {
    this.grpc('sayHello2', {
      a: 'Parameter a',
      b: 'Parameter b'
    }).then((response) => {
      this.grpcResults.txt(response)
    })
  }

  mdDebugHandler(msg) {
    let message = JSON.parse(msg)
    let originator = message.id
    let type = message.type
    let ip = message.ip
    let statusCode = message.event.code
    let status = statusCode === 1 || statusCode === 4 || statusCode === 5 ? 'Idle': 'Busy'
    let time = new Date().getTime()

    this.nodeDict = this.nodeDict || {}
    this.nodeDict[originator] = {
      ip: ip,
      id: originator,
      type: type,
      status: status,
      time: time
    }

    this.renderData()

    if (statusCode !== 5) {
      let row = this.elTable.getElement().querySelector('.row-' + originator + ' .blink')
      if (row) {
        row.innerHTML = '◔'
        row.style.transition = 'color 150ms'
        row.style.textAlign = 'center'
        row.style.color = 'orangered'

        setTimeout(() => {
          row.style.color = 'transparent'
        }, 100)
      }
    }
  }

  renderData() {
    let now = new Date().getTime()
    this.elTable.data = []
    for (let id in this.nodeDict) {
      if (now - this.nodeDict[id].time > 3000) {
        delete this.nodeDict[id]
      } else {
        this.elTable.addDataItem({
          id: id,
          ip: this.nodeDict[id].ip,
          type: this.nodeDict[id].type,
          status: this.nodeDict[id].status
        })
      }
    }
  }

}

let content = ''
