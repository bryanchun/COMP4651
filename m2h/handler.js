"use strict"
const showdown = require('showdown')

module.exports = (event, context) => {
    var converter = new showdown.Converter(),
        html = converter.makeHtml(event.query.md)
    context
        .headers({ "ContentType": "text/html" })
        .status(200)
        .succeed(html)
}
