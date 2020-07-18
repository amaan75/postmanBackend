const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth').auth
const RequestsCtrl = require('../controllers/RequestsCtrl')
const connectedSql = require("../utils/database/sql/connectedSql")
const { request } = require('express')
const axios = require('axios').default;
const _ = require("lodash");


router.get("/sql", (req, res, next) => {
    connectedSql.then(db => {
        const dbOps = db.camunda;
        const dbResult = dbOps.executeQuery(req.sql);
        dbResult.then(dbResult => res.status(200).send(dbResult.recordset))
            .catch(err => console.log(err))
    }).catch(err => console.log(err));

});



router.post("/make/request", (req, res, next) => {
    console.log("make requests")
    const requestBody = req.body || {};
    const method = (requestBody.method || "get").toLowerCase()
    const url = requestBody.url;
    const body = requestBody.body;
    const headers = requestBody.headers || {};
    const params = requestBody.params || {};
    const maxRedirects = requestBody.maxRedirects || 0;
    let validateStatus = undefined;
    let axiosHeaders = {};
    for (const header in headers) {
        if (headers.hasOwnProperty(header)) {
            const element = headers[header];
            axiosHeaders[header] = element.reduce(reducer);
        }
    }

    if (maxRedirects === 0) {
        validateStatus = function (status) {
            return status >= 200 && status < 400;
        }
    }
    const axiosRequest = {
        url: url,
        method: method,
        headers: axiosHeaders,
        params,
        maxRedirects,
        data: body,
        validateStatus
    };
    axios.request(axiosRequest)
        .then(response => {
            console.log(response.headers);
            const headers = repsonseHeaders(response.headers);
            const body = response.data
            res.status(200).json({ url, headers, body, method });
        }).catch(err => {
            console.log(err.response)
            res.status(400).send(err.message)
        })

});

const reducer = (accumulator, currentValue) => `${accumulator},${currentValue}`;
const unReduce = (headerValueString) => {
    if (_.isArray(headerValueString)) return headerValueString;
    if (headerValueString !== undefined || headerValueString !== null) {

        return [headerValueString]
    }
    return [];
}
const repsonseHeaders = (headers) => {
    if (_.isEmpty(headers)) return {};
    let resultHeaders = {};
    for (const key in headers) {
        const values = headers[key];
        console.log(`key : ${key} values :${values}`)
        resultHeaders[key] = unReduce(values)
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
