const express  = require('express');
const bcrypt = require('bcryptjs');

const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-images');

const router  = express.Router();

//登入
router.get('/login', (req, res)=>{
   res.json({});
});
router.post('/login', async (req, res)=>{
   res.json({});
});
//註冊
router.get('/register', (req, res)=>{
   res.render('register');
});
router.post('/register', async (req, res)=>{
   res.json(req.body);
});
//登出
router.get('/logout', (req, res)=>{
    res.json({});
});


module.exports = router;