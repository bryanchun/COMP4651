"use strict"

module.exports = async (config) => {
    const app = config.app;

    console.log('before a route');

    app.get('/',  (req, res) => {
        console.log('in a route');
        res.send('hello world');
    });

    app.get('/*',  (req, res) => {
      res.send('arbitrary');
    });
    console.log('at the end');
}
