"use strict"

const fs = require('fs')
const path = require('path')
// const http = require('http')

/**
 * NPM modules
 */
const Showdown = require('showdown')
const Minio = require('minio')
const Formidable = require('formidable')
const Express = require('express')

const app = new Express()
var mc = new Minio.Client({
    endPoint: process.env.minio_endpoint,
    port: Number(process.env.minio_port),
    useSSL: false,
    accessKey: process.env.minio_accessKey,
    secretKey: process.env.minio_secretKey
})
const uploadDir = path.join(__dirname, '/uploads/')

module.exports = (event, context) => {
    /* Input file handling */
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/index.html'))
    })
    app.post('/upload', minioUploadHandler)
    minioUploadDemo()

    /* Output rendering */
    var converter = new Showdown.Converter(),
        html = converter.makeHtml(event.query.md)
    context
        .headers({ "Content-Type": "text/html" })
        .status(200)
        .succeed(html)
}

const minioUploadHandler = (req, res) => {
    /* Local file upload */
    var form = new Formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = uploadDir
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: err })
        res.status(200).json({ uploaded: true })
    })
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.')
        file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
    })

    /* Minio file upload from local */
}

const minioUploadDemo = (path) => {
    const   region = "us-east-1",
            bucketName = "incoming",
            filename = "hellofile",
            dummy_content = "Hello Minio!"

    /**
     * Plain text file upload to Minio
     * */

    /* Create and write plain text file */
    fs.writeFile(filename, dummy_content, (err) => {
        if (err) return console.err(err)
        console.log("File written")
    })
    const fileStream = fs.createReadStream(filename)

    /* Get a bucket, create it if it does not yet exist */
    mc.bucketExists(bucketName, (err, exists) => {
        if (err) return console.err(err)
        if (!exists) {
            mc.makeBucket(bucketName, region, (err) => {
                if (err) { return console.log(err) }
                console.log(`Bucket created successfully in ${region}.`)
            })
        }

        /* Upload to Minio */
        fs.stat(filename, (err, stats) => {
            if (err) return console.log(err)
            mc.putObject(bucketName, filename, fileStream, stats.size, (err, etag) => {
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
    // mc.fGetObject(bucketName, filename, "/tmp/" + filename)

    /* Get URL for file */
    mc.presignedGetObject(bucketName, filename, 24*60*60, (err, presignedUrl) => {
        if (err) return console.log(err)
        console.log(`${filename} is served at:`, presignedUrl)
    })
}
