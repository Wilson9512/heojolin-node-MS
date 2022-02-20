require('dotenv').config();

const express = require('express');
const moment = require('moment-timezone');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    res.locals.wil = '哈囉';
    //res.send('oooo'); //回應之後,不會往下個路由規則

    // template helper functions 樣板輔助樣式
    res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
    res.locals.toDatetimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');

    next();
})

app.use((req, res, next) => {
    res.locals.title = '會員中心';
    next();
});

app.use('/', require('./routes/login'));
app.use('/user', require('./routes/user'));

//routes begin



app.get('/', (req, res) => {
    res.locals.title = '首頁 -' + res.locals.title;

    res.render('home', {name: '會員中心'});
});//路徑跟方法

app.use('/user', require('./routes/user'));




//routes end

app.use((req, res) => {
    res.status(404).send(`<h1>找不到這頁</h1>`)
})


let port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV || 'development';
app.listen(port, () => {
    console.log(`NODE_ENV:${node_env}`);
    console.log(`啟動: ${port} - `, new Date());
});

