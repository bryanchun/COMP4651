"use strict"

const http = require('http')
const fs = require('fs')

/**
 * NPM modules
 */
const Showdown = require('showdown')
const Minio = require('minio')

module.exports = (event, context) => {
    var converter = new Showdown.Converter(),
        html = converter.makeHtml(event.query.md)

    var mc = new Minio.Client({
            endPoint: process.env.minio_endpoint,
            port: Number(process.env.minio_port),
            useSSL: false,
            accessKey: process.env.minio_accessKey,
            secretKey: process.env.minio_secretKey
        })


    // var filename = "tmpfile"
    // const file = fs.createWriteStream(filename)
    // const request = http.get("http://images.pexels.com/photos/72161/pexels-photo-72161.jpeg?dl&fit=crop&w=640&h=318", (response) => {
    //     response.pipe(file)
    // })
    
    // mc.makeBucket('incoming', 'us-east-1', function(err) {
    //     if (err) return console.log(err)
    //     console.log('Bucket created successfully in "us-east-1".')
        
    //     var metaData = {
    //         'Content-Type': 'application/octet-stream',
    //         'X-Amz-Meta-Testing': 1234,
    //         'example': 5678
    //     }
    //     // Using fPutObject API upload your file to the bucket europetrip.
    //     mc.fPutObject('incoming', 'image1', filename, metaData, function(err, etag) {
    //         if (err) return console.log(err)
    //         console.log('File uploaded successfully.')
    //     })
    // })

    context
        .headers({ "Content-Type": "text/html" })
        .status(200)
        .succeed(html)
}
