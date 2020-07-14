const RequestGroup = require('../models/Request')


// SELECT, UPDATE, INSERT, DELETE, selectByName


exports.selectAll = (req, res, next) => {
    return new Promise((resolve, reject) => {
        RequestGroup.find()
            .then(requestGroup => {
                console.log(requestGroup)
                resolve(requestGroup)
            })
            .catch(err => {
                reject(err)
            })
    })
}



exports.insert = (req, res, next) => {
    return new Promise((resolve, reject) => {
        const requestGroup = new RequestGroup({
            _id: req.body.name,
            requests: req.body.requests,
        })

        console.log(requestGroup)
        requestGroup.save()
            .then(requestGroup => {
                console.log(requestGroup)
                resolve(requestGroup)
            })
            .catch(err => {
                reject(err)
            })
    })
}

exports.update = (req, res, next) => {
    return new Promise((resolve, reject) => {
        let id = req.body.name
        let requests = req.body.requests
        RequestGroup.findById(id)
            .then(requestGroup => {
                requestGroup.requests = requests;
                requestGroup.save()
                    .then(() => {
                        resolve("request updated")
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
            .catch(err => reject(err))
    })
}