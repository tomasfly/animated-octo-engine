const express = require('express')
const app = express()
const f = require('fs')
const port = 3000;
app.use(express.json())

app.get('/', (req, res) => {
    res.send('I\'m alive')
});

app.post('/', (req, res) => {
    let alertInfo = {action:req.body.action,ticker:req.body.ticker,time:req.body.time,open:req.body.open,close:req.body.close}
    console.log(alertInfo)
    f.appendFileSync("./alert.log",JSON.stringify(alertInfo)+'\n')
});

app.listen(port, () => console.log(`App listening on port ${port}!`))