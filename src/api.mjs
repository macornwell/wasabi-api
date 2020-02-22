/**
 * A configuration for the WasabiAPI.
 *
 * @param jsonRpc {String} - The JSON Rpc version.
 * @param id {String} - The id.
 * @param host {String} - A host path to the Rpc instance. Note: this should include http or https.
 * @param port {Number} - The port hosting the Rpc instance.
 * @param verbose {Boolean} - Whether or not verbose logging should be turned on. (For Debugging)
 * @param kwargs {Object} - Any additional keyword arguments.
 * @returns {{}&{port: number, host: string, id: string, jsonRpc: string, verbose: boolean}}
 * @constructor
 */
const WasabiConfig = ({
  jsonRpc='2.0',
  id='1',
  host='http://127.0.0.1',
  port=37128,
  verbose=false,
  kwargs={}
}={}) => {
  return {
    jsonRpc,
    id,
    host,
    port,
    verbose,
    ...kwargs
  }
}

/**
 *  A JavaScript API for the Wasabi Wallet RPC.
 *
 * @param fetch {Object} - An implementation of fetch. (Mozilla, or node?)
 * @param wasabiConfig {WasabiConfig} - A WasabiConfig object.
 * @returns An Object with all of the API functions.
 * @constructor
 */
const WasabiAPI = (fetch, wasabiConfig) => {

  const _createPostBody = (method, params=[]) => {
    return !!params
      ? {
        jsonrpc: wasabiConfig.jsonRpc,
        id: wasabiConfig.id,
        method,
        params
      }
      : {
        jsonrpc: wasabiConfig.jsonRpc,
        id: wasabiConfig.id,
        method
      }
  }

  const _post = (method, params=[]) => {
    const url = `${wasabiConfig.host}:${wasabiConfig.port}`
    const body = _createPostBody(method, params)
    if (wasabiConfig.verbose) {
      console.log(`Url :${url}`)
      console.log(`Data:`)
      console.log(body)
    }

    return fetch(url, {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  /**
   * Gets the status of the Wasabi Wallet RPC
   * @returns A promise
   */
  const getStatus = () => {
    return _post('getstatus')
  }

  return {
    getStatus,
  }
}

export {
  WasabiAPI,
  WasabiConfig
}
