var express = require('express');
var router = express.Router();
const { Reports }  = require('../models/reports');
const reportModel = new Reports();

// getAllByPost(idPost)
router.get('/:idPost', function(req, res, next) {
  const report = reportModel.getAllByPost(req.params.idPost);
  console.log(report);
  if (!report) return res.status(404).end();
  return res.json(report);
});

// getOne(idPost, idUser)
router.get('/:idPost/:idUser', function(req, res, next) {
  const report = reportModel.getOne(req.params.idPost, req.params.idUser);
  if (!report) return res.status(404).end();
  return res.json(report);
});

// addOne(body)
router.post('/', function(req, res, next) {
  if (!req.body ||
      !req.body.idUser ||
      !req.body.idPost ||
      !req.body.message
  )
    return res.status(400).end();
  return res.json(reportModel.addOne(req.body));
});

module.exports = router;