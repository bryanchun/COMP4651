"use strict"
const Showdown = require('showdown')
const Minio = require('minio')

module.exports = (event, context) => {
    var converter = new Showdown.Converter(),
        html = converter.makeHtml(event.query.md)

    console.log('starting minio')
    var minioClient = new Minio.Client({
            endPoint: '192.168.99.135',
            port: 30322,
            useSSL: false,
            accessKey: 'minio',
            secretKey: 'minio123'
        })

    // var file = './minio.md'
    // minioClient.makeBucket('europetrip', 'us-east-1', function(err) {
    //     if (err) return console.log(err)
        
    //     console.log('Bucket created successfully in "us-east-1".')
        
    //     var metaData = {
    //         'Content-Type': 'application/octet-stream',
    //         'X-Amz-Meta-Testing': 1234,
    //         'example': 5678
    //     }
    //     // Using fPutObject API upload your file to the bucket europetrip.
    //     minioClient.fPutObject('m2h', 'minio.md', file, metaData, function(err, etag) {
    //         if (err) return console.log(err)
    //         console.log('File uploaded successfully.')
    //     })
    // })

    context
        .headers({ "ContentType": "text/html" })
        .status(200)
        .succeed(html)
}
