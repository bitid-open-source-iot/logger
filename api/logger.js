var bll     = require('./../bll/bll');
var router  = require('express').Router();

router.use(function timeLog(req, res, next) {
    next();
});

router.post('/get', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.get(req, res);
});

router.post('/add', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.add(req, res);
});

router.post('/load', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.load(req, res);
});

router.post('/list', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.list(req, res);
});

router.put('/write', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.write(req, res);
});

router.post('/share', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.share(req, res);
});

router.post('/update', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.update(req, res);
});

router.post('/delete', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.delete(req, res);
});

router.post('/historical', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.historical(req, res);
});

router.post('/unsubscribe', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.unsubscribe(req, res);
});

router.post('/updatesubscriber', (req, res) => {
    var myModule = new bll.module();
    myModule.logger.updatesubscriber(req, res);
});

module.exports = router;