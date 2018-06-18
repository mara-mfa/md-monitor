import grpc from 'grpc'
import log from '../logger'
import ip from 'ip'

const PROTO_PATH = __dirname + '/helloworld.proto'

var hello_proto = grpc.load(PROTO_PATH).helloworld

export default class GrpcServer {
  sayHello (call, callback) {

  }

  listen (port) {
    return new Promise((resolve) => {
      let server = new grpc.Server()
      server.addService(hello_proto.Greeter.service, {
        sayHello: (call, callback) => {
          log.debug('Handling call ...')
          callback(null, {
            message: call.request.name + ' from ' + ip.address()
          })
        }
      })
      server.bind('0.0.0.0:' + port, grpc.ServerCredentials.createInsecure())
      server.start()
      resolve()
    })


  }
}
