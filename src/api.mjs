import base64 from 'base-64'

const ConsoleLogger = () => {
  return (errorMessage) => {
    if (typeof errorMessage === 'object') {
      console.log(`${new Date().toISOString()}: ${JSON.stringify(errorMessage, null, 2)}`)
    } else {
      console.log(`${new Date().toISOString()}: ${errorMessage}`)
    }
  }
}

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
  username='',
  password='',
  verbose=false,
  logger=(errorMessage) => {},
  kwargs={}
}={}) => {
  return {
    jsonRpc,
    id,
    host,
    username,
    password,
    port,
    verbose,
    logger: (errorMessage) => {
      if (logger) {
        logger(errorMessage)
      }
    },
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
  const logger = wasabiConfig.logger

  const _handleResponse = response => {
    if (response.ok) {
      return response.json()
    } else if (response.status === 401) {
      throw new Error('Unauthorized. Credentials needed.')
    } else {
      logger(response)
      throw new Error(`Error occurred. Status: ${response.status} ${response.message}`)
    }
  }

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

  const _post = async (method, params=[]) => {
    const url = `${wasabiConfig.host}:${wasabiConfig.port}`
    const body = _createPostBody(method, params)
    if (wasabiConfig.verbose) {
      logger(`Url :${url}`)
      logger(`Data:`)
      logger(body)
      logger('Starting fetch')
    }
    const configs = !!(wasabiConfig.password)
      ? {Authorization: `Basic ${base64.encode(`${wasabiConfig.username}:${wasabiConfig.password}`)}`}
      : {}
    if (wasabiConfig.verbose) {
      logger('Configurations')
      logger(configs)
    }
    const result = await fetch(url, {
        method: 'POST',
        headers:{
          'content-type': 'application/json',
          ...configs
        },
        body: JSON.stringify(body)
      }).then(_handleResponse).catch(error => {
      throw error
    })
    return result
  }

  /**
   * Gets the status of the Wasabi application.
   * @returns A promise for a JSON response.
   */
  const getStatus = async () => {
    return _post('getstatus')
  }

  const createWallet = async (walletName, password='') => {
    return _post('createwallet', [walletName, password])
  }

  const listUnSpentCoins = () => {
    return _post('listunspentcoins')
  }

  const getWalletInfo = kwargs => {
    return _post('getwalletinfo', kwargs)
  }

  const getNewAddress = label => {
    return _post('getnewaddress', [label])
  }

  const createSendPayment = (sendTo, amount, label, subtractFee=false) => {
    return !!subtractFee
      ? {
        sendto: sendTo,
        amount,
        label,
        subtractfee: subtractFee
      }
      : {
        sendto: sendTo,
        amount,
        label
      }
  }

  const createCoin = (transactionId, index) => {
    return {
      transactionid: transactionId,
      index
    }
  }

  const send = ({payments=[], coins=[], feeTarget=2, password=""}) => {
    return _post('send', {payments, coins, feeTarget, password})
  }

  const getHistory = () => {
    return _post('gethistory')
  }

  const listKeys = () => {
    return _post('listkeys')
  }

  /**
   * Enqueue coins for a coinjoin.
   */
  const enqueue = ({coins=[]}) => {
    return _post('enqueue', {coins})
  }

  /**
   *  Dequeue coins for a coinjoin.
   */
  const dequeue = ({coins=[]}) => {
    return _post('dequeue', {coins})
  }

  /**
   *  Stops and exists wasabi.
   */
  const stop = () => {
    return _post('stop').catch(x=>x)
  }

  const loadWallet = (name="Wallet0", password="") => {
    return _post('loadwallet', [name, password]).catch(x=>x)
  }

  return {
    getStatus,
    createWallet,
    createCoin,
    listUnSpentCoins,
    getWalletInfo,
    getNewAddress,
    createSendPayment,
    send,
    getHistory,
    listKeys,
    enqueue,
    dequeue,
    loadWallet,
    stop
  }
}

export {
  WasabiAPI,
  WasabiConfig,
  ConsoleLogger,
}
