# The Wasabi JavaScript API

This JavaScript library creates the ability to call the [RPC](https://docs.wasabiwallet.io/using-wasabi/RPC.html) functions for the [Wasabi Wallet](https://github.com/zkSNACKs/WalletWasabi/) from javascript. This repo also includes command line utilities for calling the api directly from a bash CLI.

## To Use
- `git clone https://github.com/macornwell/wasabi-api`
- `cd wasabi-api`
- `npm install`



## Note
This library requires a Wasabi Wallet RPC to be running. As of 02/2020, in order to have RPC functionaliity in Wasabi Wallet, one must [build](https://docs.wasabiwallet.io/using-wasabi/BuildSource.html#get-the-requirements) the latest version of Wasabi Wallet. [Issue](https://github.com/zkSNACKs/WalletWasabi/issues/3121)

**Important:**If you create a new wallet, you have to close down Wasabi Wallet before you can load the wallet!

## Complete Methods
- getStatus


## TODO
- Username / Password support.
- createwallet 
- listunspentcoins 
- getwalletinfo
- getnewaddress
- send
- gethistory
- listkeys
- enqueue
- dequeue
- stop

