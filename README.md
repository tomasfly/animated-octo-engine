# animated-octo-engine

Tradingview alerts handling to buy cryptos with Binance API.

This code should be deployed in any cloud services provider such as AWS, Azure or Gcloud.

Then you will have to setup alerts in Trading view based on trading scripts. For example: RSI < 20 buy signal. RSI > 80 sell signal.

The alert will be sent to server via Tradingview webhooks. And based on the signal and the currency, it will perform the desired operation using Binance API.

disclaimer : Do not use this script for trading with real money or Cryptos. I am not responsible of any looses you may have when using this program. This is just an example on how you could operate with Tradingview + Binance using NodeJS.
