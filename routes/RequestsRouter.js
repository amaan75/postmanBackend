const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth').auth
const RequestsCtrl = require('../controllers/RequestsCtrl')
const connectedSql = require("../utils/database/sql/connectedSql")
const e = require('express')
const axios = require('axios').default;


router.get("/sql", (req, res, next) => {
    connectedSql.then(db => {
        const dbOps = db.events;
        const dbResult = dbOps.getEvents("123");
        dbResult.then(dbResult => res.status(200).send(dbResult.recordset))
            .catch(err => console.log(err))
    }).catch(err => console.log(err));

});

router.post("/make/request", (req, res, next) => {
    console.log("make requests")
    const method = req.body.method.toLowerCase() || "get";
    const url = req.body.url;
    const body = req.body.body;
    const headers = req.body.headers || [];
    const axiosHeaders = {};
    for (let index = 0; index < headers.length; index++) {
        const element = headers[index];
        axiosHeaders[element.key] = element.values.reduce(reducer);
    }
    axios.request({ url: url, method: method, headers: axiosHeaders, data: body })
        .then(response => {
            console.log(response);
            const headers = repsonseHeaders(response.headers);
            const body = response.data
            res.status(response.status).json({ url, headers, body, method });
        }).catch(err => {
            console.log(err)
            res.status(400).send(err.message)
        })

});

const reducer = (accumulator, currentValue) => `${accumulator},${currentValue}`;
const unReduce = (headerValueString) => {
    if (headerValueString !== undefined || headerValueString !== null) {
        return headerValueString.split(',');
    }
    return [];
}
const repsonseHeaders = (headers) => {
    let resultHeaders = [];
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
            const element = headers[key];
            resultHeaders.push({ key, values: unReduce(headers[key]) })
        }
    }

    return resultHeaders;
}

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
