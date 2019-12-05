"use strict"

const path = require('path')
const bodyParser = require('body-parser')
const showdown = require('showdown')

module.exports = async (config) => {
    const app = config.app

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        next()
    })
    
    /** Input:
     *  Serving landing page
     **/
    app.get('/',  (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'))
    })

    /** Output:
     *  Converting markdown to html
     **/
    app.post('*', (req, res) => {
        console.log('express receives:', req.body)  
        var converter = new showdown.Converter(),
            html = converter.makeHtml(req.body.markdown)
        res.send(html)
    })
}
