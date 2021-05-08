const Binance = require('node-binance-api');
const logger = require('./Winston')
const binance = new Binance().options({
    APIKEY: process.env.apiKey,
    APISECRET: process.env.secretKey
});

let currencyPrice;
let usdtQuantityToBuy;
let currencyQuantityToBuy;

async function getTime() {
    return await binance.futuresTime()
}

async function getPrice(symbol){
    prices = await binance.prices()
    return prices[symbol]
}

function getBuyQuantity(usdt,currencyPrice){
    quantity = usdt /currencyPrice 
    return quantity
}

async function buy(usdt,symbol){
    usdtQuantityToBuy = usdt
    await getPrice(`${symbol}USDT`).then((response)=>{
        currencyPrice = response;
        currencyQuantityToBuy = getBuyQuantity(usdt,currencyPrice)
        logger.info(`Quantity in actual currency to buy is${currencyQuantityToBuy}`)
    })
}

buy(50000,'BTC')

