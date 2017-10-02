
const express = require('express'),
    router = express.Router();

router.get('/', _get);

/*
  GET /
 */
function _get(req, res, next) {
    res.render('index.pug');
}

module.exports = router;