"use strict"

const path = require('path')

module.exports = async (config) => {
    const app = config.app
    // app.disable('etag')
    app.use((req, res, next) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
      next()
    })

    app.get('/',  (req, res) => {
        console.log('in a route')
        res.sendFile(path.join(__dirname, 'index.html'))
        // res.send('root!')
    })

    app.get('/*',  (req, res) => {
      res.send('arbitrary')
    })
}
