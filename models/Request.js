const mongoose = require('mongoose')
const Schema = mongoose.Schema


const HeadersSchema = new Schema({
    key: String, values: Array
}, { _id: false, })

//schema for a single request,  we will probably store a request group
const RequestSchema = new Schema({
    url: { type: String, required: true },
    method: { type: String, required: true },
    body: { type: Object, required: false },
    headers: [HeadersSchema],
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
        timestamps: () => Date.now()
    }
});

const RequestGroupSchema = new Schema({
    _id: { type: String },
    requests: [RequestSchema]
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
        timestamps: () => Date.now()
    }
});

module.exports = mongoose.model('requestGroup', RequestGroupSchema)