const express = require('express');
const db = require('../modules/connect_mysql');

const router = express.Router();

async function getListData(req, res) {
    const perPage = 8;//一頁幾筆
    //用戶要看第幾頁
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if (page < 1) {
        return res.redirect('/user/list');
    }//頁數合理規則
    const conditions = {}; //傳到 ejs 的條件
    let search = req.query.search ? req.query.search.trim() : '';//trim去掉頭尾空白
    let sqlWhere = ' WHERE 1 ';
    if (search) {
        sqlWhere += ` AND \`user_id\` LIKE ${db.escape('%' + search + '%')} `;
        conditions.search = search;
    }
    //輸出
    const
        output = {
            //success: false,
            perPage,
            page,
            totalRows: 0,
            totalPages: 0,
            rows: [],
            conditions
        };

    const t_sql = `SELECT COUNT(1) num FROM user ${sqlWhere}`;
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    //let totalPages = 0;
    if (totalRows) {
        output.totalPages = Math.ceil(totalRows / perPage);
        output.totalRows = totalRows;
        if (page > output.totalPages) {
            //到最後一頁
            return res.redirect(`/user/list?page=${output.totalPages}`);
        }

        const sql = `SELECT \`member_id\`,\`user_account\`,\`user_time\`,\`user_pass\`,\`member_name\`,\`member_bir\`,\`member_mob\`,\`member_addr\` FROM  \`user\` INNER JOIN \`member\` ON \`user\`.\`user_id\`=\`member\`.\`user_id\` ORDER BY \`member_id\` DESC LIMIT ${perPage*
        (page-1)}, ${perPage}`;
        const [rs2] = await db.query(sql);
        //拿到資料在這邊先做格式轉換
        rs2.forEach(el => {
            let str = res.locals.toDateString(el.member_bir);
            if (str === 'Invalid date') {
                el.member_bir = '沒有輸入資料';
            } else {
                el.member_bir = str;
            }
        })
        rs2.forEach(el => el.member_bir = res.locals.toDateString(el.member_bir));
        output.rows = rs2;
    }
    return output;
}

router.get('/', async (req, res) => {
    res.redirect('user/list')
});
router.get('/list', async (req, res) => {
    res.render('user/list', await getListData(req, res));
});

module.exports = router;