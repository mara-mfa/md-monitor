import log from 'logger'
import MdMonitorServer from './MdMonitorServer'

const PORT = process.env.PORT || 8080
const GRPC_PORT = process.env.GRPC_PORT || 50051

const server = new MdMonitorServer('../../dist/portlet.js', './helloworld.proto')
process.on('uncaughtException', (err) => {
  log.error(err)
})

server.listen(PORT)
server.listenGrpc(GRPC_PORT)

