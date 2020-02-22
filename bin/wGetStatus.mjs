import commander from 'commander'
import fetch from 'node-fetch'
import { WasabiAPI, WasabiConfig } from '../src/api.mjs'

commander
  .description('Gets the status of Wasabi. Note: Rpc must be setup and running on the Wasabi Wallet instance.')
  .option('-j, --jsonRpc <value>', 'Changes the JSON RPC Version. Defaults to 2.0', '2.0')
  .option('-i, --id <id>', 'Changes the id. Defaults to 1.', '1')
  .option('-o, --host <http://uri>', 'The host of the Rpc instance. Defaults to http://127.0.0.1', 'http://127.0.0.1')
  .option('-p, --port <port>', 'The port of the Rpc instance. Defaults to 37128', 37128)
  .option('-v, --verbose', 'Turns on verbose, for debugging.', false)


commander.parse(process.argv);
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  commander.help()
}

const config = WasabiConfig({
  jsonRpc:commander.jsonRpc,
  id:commander.id,
  host:commander.host,
  verbose:commander.verbose,
  port:commander.port
})

const api = WasabiAPI(fetch, config)

api.getStatus().then(x=> x.json()).then(x=>{
  console.log(JSON.stringify(x, null, 2))
})



