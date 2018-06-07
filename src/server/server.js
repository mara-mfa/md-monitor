import log from 'logger'
import MdMonitorServer from './MdMonitorServer'

const port = process.env.PORT || 8080
const server = new MdMonitorServer('../../dist/portlet.js')
process.on('uncaughtException', (err) => {
  log.error(err)
})

server.listen(port)
