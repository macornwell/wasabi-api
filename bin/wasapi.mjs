import commander from 'commander'
import fetch from 'node-fetch'
import { WasabiAPI, WasabiConfig, ConsoleLogger } from '../src/api.mjs'

commander
  .description('Generic api for wasabi.')
  .option('method <method> [method]')
  .option('args <args> [args]')
  .option('-j, --jsonRpc <value>', 'Changes the JSON RPC Version. Defaults to 2.0', '2.0')
  .option('-i, --id <id>', 'Changes the id. Defaults to 1.', '1')
  .option('-o, --host <http://uri>', 'The host of the Rpc instance. Defaults to http://127.0.0.1', 'http://127.0.0.1')
  .option('-p, --port <port>', 'The port of the Rpc instance. Defaults to 37128', 37128)
  .option('-v, --verbose', 'Turns on verbose, for debugging.', false)
  


commander.parse(process.argv);

if (process.argv.includes('-h') || 
  process.argv.includes('--help') ||
  process.argv.filter(x=>!x.startsWith('-')).length !== 4){
  commander.help()
}

const logger = ConsoleLogger()

const config = WasabiConfig({
  jsonRpc:commander.jsonRpc,
  id:commander.id,
  host:commander.host,
  verbose:commander.verbose,
  logger,
  port:commander.port
})

if (config.verbose) {
  logger('VERBOSE: Config')
  logger(config)
}

const api = WasabiAPI(fetch, config)

const x = (async () => {
  const method = process.argv.slice(-2, -1)
  const args = process.argv.slice(-1)
  if (config.verbose) {
    logger(`Method: ${method}`)
    logger(`Args: ${args}`)
  }
  const result = await api[method](...JSON.parse(args))
  if (method !== 'stop') {
    if (config.verbose) {
      logger(`Result:`)
    }
    logger(JSON.stringify(result, null, 2))
  }
})()


