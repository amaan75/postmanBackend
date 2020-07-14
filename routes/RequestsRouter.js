const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth').auth
const RequestsCtrl = require('../controllers/RequestsCtrl')
const connectedSql = require("../utils/database/sql/connectedSql")


router.get("/sql", (req, res, next) => {
    connectedSql.then(db => {
        const dbOps = db.events;
        const dbResult = dbOps.getEvents("123");
        dbResult.then(dbResult => res.status(200).send(dbResult.recordset))
            .catch(err => console.log(err))
    });

});

router.get('/selectAll', (req, res, next) => {
    RequestsCtrl.selectAll(req, res, next)
        .then(requests => {
            res.status(200).json(requests)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})

router.post('/insert', (req, res, next) => {
    console.log("Accessing request insert function")
    RequestsCtrl.insert(req, res, next).then(request => {
        res.status(200).json(request)
    }).catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router
