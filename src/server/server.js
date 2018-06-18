import log from 'logger'
import MdMonitorServer from './MdMonitorServer'
import GrpcServer from './grpc/GrpcServer'

const PORT = process.env.PORT || 8080
const GRPC_PORT = process.env.GRPC_PORT || 50051

const server = new MdMonitorServer('../../dist/portlet.js')
process.on('uncaughtException', (err) => {
  log.error(err)
})

server.listen(PORT)

const grpc = new GrpcServer()
grpc.listen(GRPC_PORT).then(() => {
  console.log('GRPC listening on ' + GRPC_PORT)
})

