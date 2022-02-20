const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./../modules/connect_mysql');
const upload = require('./../modules/upload-images');

const router = express.Router();

//登入
router.get('/login', (req, res) => {
    res.locals.pageName = 'login';
    res.render('login');
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

    let result;
    try {
        [result] = await db.query(sql, [
            req.body.user_account,
            hash,
        ]);
        if (result.affectedRows === 1) {
            output.success = true;
        } else {
            output.error = '無法新增會員';
        }
    } catch (ex) {
        console.log(ex);
        output.error = 'Email 已被使用過';
    }
    res.json(output);
});

router.get('/account-check', async (req, res) => {
    const sql = "SELECT `user_account` FROM user WHERE `user_account`=?";
    const [rs] = await db.query(sql, [req.query.user_account || 'aa']);

    res.json({used: !!rs.length});

});
//登出
router.get('/logout', (req, res) => {
    res.json({});
});


module.exports = router;