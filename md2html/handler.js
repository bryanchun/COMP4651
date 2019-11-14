"use strict"

// const querystring = require('querystring')
const showdown = require('showdown')
const converter = new showdown.Converter()

module.exports = async (content, callback) => {
    callback(null, converter.makeHtml(content))
}
