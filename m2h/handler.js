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

    /**
     * Plain text file upload to Minio
     * */

    var mc = new Minio.Client({
            endPoint: process.env.minio_endpoint,
            port: Number(process.env.minio_port),
            useSSL: false,
            accessKey: process.env.minio_accessKey,
            secretKey: process.env.minio_secretKey
        })
    const bucketName = "incoming"
    
    /* Create and write plain text file */
    const filename = "tmp"
    fs.writeFile(filename, "Hello Minio!", (err) => {
        if (err) return console.err(err)
        console.log("File written")
    })
    const fileStream = fs.createReadStream(filename)

    /* Get a bucket, create it if it does not yet exist */
    mc.bucketExists(bucketName, (err, exists) => {
        if (err) return console.err(err)
        if (!exists) {
            mc.makeBucket(bucketName, 'us-east-1', (err) => {
                if (err) { return console.log(err) }
                console.log('Bucket created successfully in "us-east-1".')
            })
        }

        /* Upload to Minio */
        fs.stat(filename, (err, stats) => {
            if (err) return console.log(err)
            mc.putObject(bucketName, 'hellofile', fileStream, stats.size, (err, etag) => {
                return console.log(err, etag)
            })
        })
    })

    /* List buckets */
    mc.listBuckets((err, buckets) => {
        if (err) return console.log(err)
        console.log('buckets :', buckets)
    })

    /* Get file from bucket */
    mc.fGetObject(bucketName, filename, "/tmp/" + filename)


    context
        .headers({ "Content-Type": "text/html" })
        .status(200)
        .succeed(html)
}
