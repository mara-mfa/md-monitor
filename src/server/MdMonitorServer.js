import uuid from 'uuid/v4'
import MdPortletServer from 'md-lib/server/MdPortletServer'
import log from './logger'
import ip from 'ip'

const protoLoader = require('@grpc/proto-loader')
import grpc from 'grpc'

const MSGHUB_ID = process.env.MSGHUB_ID || 'mdesktop'

export default class MdMonitorServer extends MdPortletServer {
  constructor (portletLocation, grpcDefLocation) {
    super('mdMonitor', portletLocation, grpcDefLocation)
    this.expose(::this.doSomeWork)
    this.exposeJob(::this.doSomeWorkAsync)
    this.expose(::this.suicide)

    this.subscribe(MSGHUB_ID + '.dbg.>', (msg, reply, subject) => {
      //let remoteClientId = subject.replace(MSGHUB_ID + '\.dbg.', '');
      let message = JSON.parse(msg)
      log.debug(`${message.type} (${message.id}): ${message.event.code} - ${message.event.label}`)
      this.publish(MSGHUB_ID + '.ws.mdDebug', msg)
    })

    this.exposeGrpc(::this.sayHello2)




    setInterval(() => {
      log.debug('md-monitor - Ping ...')
      this.publish('mdPing', uuid())
    }, 10000)
  }

  sayHello2 (call, callback) {
    callback(null, {
      message: `${call.request.name} from ${call.request._userId} - ${call.request._userEmail}; ip = ${ip.address()}`
    })
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
