const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./../modules/connect_mysql');
const upload = require('./../modules/upload-images');

const router = express.Router();

//登入
router.get('/login', (req, res) => {
    res.locals.pageName = 'login';
    res.json({});
});
router.post('/login', async (req, res) => {
    res.json({});
});
//註冊
router.get('/register', (req, res) => {
    res.locals.pageName = 'register';
    res.render('register');
});
router.post('/register', async (req, res) => {
    const output = {
        success: false,
        postData: req.body,
        error: '',
    }
    //TODO:欄位檢查

    const hash = await bcrypt.hash(req.body.user_pass, 10);

    const sql = "INSERT INTO `user`(`user_account`, `user_pass`, `user_time`) " +
        "VALUES ( ?, ?,NOW());";

    const [result] = await db.query(sql, [
        req.body.user_account,
        hash,
    ]);
    if (result.affectedRows===1) {
        output.success = true;
    } else {
        output.error = '無法新增會員';
    }

    res.json(output);
});
//登出
router.get('/logout', (req, res) => {
    res.json({});
});


module.exports = router;