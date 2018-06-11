import uuid from 'uuid/v4'
import MdPortletServer from 'md-lib/server/MdPortletServer'
import log from './logger'

const MSGHUB_ID = process.env.MSGHUB_ID || 'mdesktop'

export default class MdMonitorServer extends MdPortletServer {
  constructor (portletLocation) {
    super('mdMonitor', portletLocation)
    this.expose(::this.doSomeWork)
    this.exposeJob(::this.doSomeWorkAsync)
    this.expose(::this.suicide)

    this.subscribe(MSGHUB_ID + '.dbg.>', (msg, reply, subject) => {
      //let remoteClientId = subject.replace(MSGHUB_ID + '\.dbg.', '');
      let message = JSON.parse(msg)
      log.debug(`${message.type} (${message.id}): ${message.event.code} - ${message.event.label}`)
      this.publish(MSGHUB_ID + '.ws.mdDebug', msg)
    })

    setInterval(() => {
      log.debug('md-monitor - Ping ...')
      this.publish('mdPing', uuid())
    }, 3000)
  }

  doSomeWork (param1, param2) {
    log.debug(`Doing some work ... ${param1}, ${param2}`)
    return `Join: ${param1}:${param2} - ${new Date()}`
  }

  async doSomeWorkAsync (job, timeout) {
    var token = uuid()
    var responses = []

    let responseHandler = (resp) => {
      job.progress(resp)
      responses.push(JSON.parse(resp))
    }

    this.subscribe(token, responseHandler)
    this.publish('mdPing', token)

    setTimeout(() => {
      job.done(JSON.stringify(responses))
    }, 5000)
  }

  suicide () {
    log.info(`${this.id} received suicide request. Exiting !!!`)
    setTimeout(process.exit, 0)
    return this.id + ' committing suicide'
  }
}

var sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
