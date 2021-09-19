const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Web3 = require('web3');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// transaction checker

class TransactionChecker {
  web3;
  // web3ws;
  account;
  // subscription;
  // projectId = 'eebc80bed4004210894a7399808bd621';

  constructor(projectId, account) {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/' + projectId,
      ),
    );

    //initialize the account
    this.account = account.toLowerCase();
  }

  // check block
  async checkBlock() {
    // to return the latest block transaction
    let block = await this.web3.eth.getBlock('latest');

    //block number
    let number = block.number;
    console.log('Searching block ' + number);

    if (block != null && block.transactions != null) {
      for (let txHash of block.transactions) {
        let tx = await this.web3.eth.getTransaction(txHash);
        console.log('*******************************')
        console.log(tx)
        console.log('*******************************');
        if (this.account == tx.to.toLowerCase()) {
          console.log('Transaction found on block: ' + number);
          console.log({
            address: tx.from,
            value: this.web3.utils.fromWei(tx.value, 'ether'),
            timestamp: new Date(),
          });
        }
      }
    }
  }
}

// create an instance of the class
let txChecker = new TransactionChecker(
  'eebc80bed4004210894a7399808bd621',
  '0xe1Dd30fecAb8a63105F2C035B084BfC6Ca5B1493',
);
setInterval(() => {
  txChecker.checkBlock();
}, 5 * 1000);

module.exports = app;
