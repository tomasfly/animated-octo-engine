const express = require('express')
const binance = require('./lib/Binance')
const logger = require('./lib/Winston')
const app = express()
const port = 3000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send('I\'m alive')
});

app.post('/', (req, res) => {
    let alertInfo = { action: req.body.action, ticker: req.body.ticker, time: req.body.time, open: req.body.open, close: req.body.close }
    if (alertInfo.action === 'buy') {
        logger.info(`Buy signal comming for ${alertInfo.ticker}`)
        binance.executeBuy(100, alertInfo.ticker)
    }

    if (alertInfo.action === 'sell') {
        logger.info(`Sell signal comming for ${alertInfo.ticker}`)
        let ticker = alertInfo.ticker
        binance.executeSell(ticker)
    }
    res.send('OK')
});

app.listen(port, () => logger.info(`App listening on port ${port}!`))