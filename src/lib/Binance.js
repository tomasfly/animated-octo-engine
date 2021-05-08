const Binance = require('node-binance-api');
const logger = require('./Winston')
const binance = new Binance().options({
    APIKEY: process.env.apiKey,
    verbose: true,
    useServerTime: true,
    APISECRET: process.env.secretKey
});

let currencyPrice
let currencyQuantityToBuy
let isBuyInProgress = false
let isSellInProgress = false
tries = 5

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getTime() {
    return await binance.futuresTime()
}

async function getPrice(symbol) {
    prices = await binance.prices()
    return prices[symbol]
}

function getBuyQuantity(usdt, currencyPrice) {
    quantity = usdt / currencyPrice
    return quantity.toFixed(6)
}

async function buy(usdt, symbol) {
    isBuyInProgress = true
    usdtQuantityToBuy = usdt
    // get the price of the actual symbol. for example BTC
    await getPrice(symbol).then(async (response) => {
        currencyPrice = response;
        // convert the usdt amount I want to buy to symbol price
        currencyQuantityToBuy = getBuyQuantity(usdt, currencyPrice)
        try {
            // place a market buy order 
            await binance.marketBuy(symbol, currencyQuantityToBuy).then((response) => {
                logger.info(JSON.stringify(response, null, 2))
                isBuyInProgress = false
            })
        }
        catch (e) {
            logger.error(`Error trying to buy currency ${e}`)
            isBuyInProgress = false
        }
    })
}

async function sellAllBalance(symbol) {
    isSellInProgress = true
    try {
        // Get all the balance for a given symbol. For example BTC
        binance.balance(async (error, balances) => {
            if (error) return console.error(error);
            //Removing 'USDT' part of the symbol
            balanceToSell = balances[symbol.replace('USDT','')].available
            logger.info(`Balance is:${balanceToSell}`)
            try {
                finalBalanceSell = parseFloat(balanceToSell)
                balanceLessDecimals = finalBalanceSell.toFixed(3)
                // Setting toFixed to avoid Filter failure: LOT_SIZE\ When trying to sell
                // Sell all the balance and convert it to USDT. Triggered when there is a sell signal
                logger.info(`Attempting to sell :${balanceLessDecimals}`)
                await binance.marketSell(symbol, balanceLessDecimals).then((response) => {
                    logger.info(JSON.stringify(response, null, 2))
                    isSellInProgress = false
                })
            }
            catch (e) {
                logger.error(`Error trying to sell ${JSON.stringify(e)}`)
                isSellInProgress = false
            }
        });

    }
    catch (e) {
        logger.error(`Error trying to get balance currency ${e}`)
        isSellInProgress = false
    }
}

async function executeBuy(quantity, symbol) {
    while (isSellInProgress) {
        await snooze(5000)
        logger.warn('Could not buy because sell was in progress. Sleeping 5 seconds')
    }
    logger.info('No sell operation seems to be in progress hence trying to buy')
    buy(quantity, symbol)
}

async function executeSell(symbol) {
    while (isBuyInProgress) {
        await snooze(5000)
        logger.warn('Could not sell because buy was in progress. Sleeping 5 seconds')
    }
    logger.info('No buy operation seems to be in progress trying to sell')
    sellAllBalance(symbol)
}

// executeBuy(100,'BTC')
//executeSell('BTC')
module.exports = {executeBuy,executeSell}




