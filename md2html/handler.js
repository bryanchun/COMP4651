"use strict"

const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const minio = require('minio')
const request = require('request')
const fs = require('fs')
const showdown = require('showdown')

var mc = new minio.Client({
  endPoint: process.env.minio_endpoint,
  port: Number(process.env.minio_port),
  useSSL: false,
  accessKey: process.env.minio_accessKey,
  secretKey: process.env.minio_secretKey
})
const bucketName = 'incoming',
      region = 'us-east-1',
      writeStreamName = 'tmp',
      policy = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetBucketLocation","s3:ListBucket","s3:ListBucketMultipartUploads"],"Resource":["arn:aws:s3:::incoming"]},{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:AbortMultipartUpload","s3:DeleteObject","s3:GetObject","s3:ListMultipartUploadParts","s3:PutObject"],"Resource":["arn:aws:s3:::incoming/*"]}]}'
var converter = new showdown.Converter()

module.exports = async (config) => {
    const app = config.app

    app.set('views', path.join(__dirname, '/themes'))
    app.use(express.static('themes'))
    app.set('view engine', 'ejs')
    app.engine('ejs', ejs.__express)
    
    app.use(bodyParser.json({ limit: '4mb' }))
    app.use(bodyParser.urlencoded({ extended: false }))
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

    /** Input: Any markdown file URL
     *  Output: Converting markdown to html
     **/
    app.get('/with',  (req, res) => {
        console.log('express receives:', req.query)
        // request.get(req.query.mdUrl, (err, res, body) => {
        //     console.log('mdUrl has body:', body)
        // })
        request.get(req.query.mdUrl)
            .pipe(fs.createWriteStream(writeStreamName))
            .on('finish', () => {
                fs.readFile(writeStreamName, 'utf8', (err, data) => {
                  if (err)  return console.log(err)
                  console.log('mdUrl has body:', data)
                  const html = converter.makeHtml(data)
                  res.send(html)
              })
            })
    })

    /** Output:
     *  Converting markdown to html
     **/
    app.post('*',
        multer({ storage: multer.memoryStorage() }).single('file'),
        (req, res) => {
            console.log('express receives:', req.body, req.file)

            // Plain-text mode  
            if (req.body.markdown) {
                const html = converter.makeHtml(req.body.markdown)
                // res.send(html)
                res.render('post.ejs', { md_content: html })
            }
            // File mode
            else if (req.file) {
                mc.bucketExists(bucketName, (err, exists) => {
                    if (err) return console.log(err)
                    if (!exists) {
                        mc.makeBucket(bucketName, region, (err) => {
                            if (err) { return console.log(err) }
                            console.log(`Bucket created successfully in ${region}.`)
                        })
                    }
                    
                    // mc.getBucketPolicy(bucketName, (err, policy) => {
                    //     if (err)  return console.log(err)
                    //     console.log('policy:', policy)
                    // })
                    mc.setBucketPolicy(bucketName, policy, (err, policy) => {
                        if (err)  return console.log(err)
                        console.log('policy is set')
                    })

                    mc.putObject(bucketName, req.file.originalname, req.file.buffer, (err, etag) => {
                        if (err)  return console.log(err)
                        console.log(`File uploaded successfully in ${bucketName}.`)
                    })

                    mc.listBuckets((err, buckets) => {
                        if (err) return console.log(err)
                        console.log('buckets :', buckets)
                    })

                    mc.presignedGetObject(bucketName, req.file.originalname, 24*60*60, (err, presignedUrl) => {
                        if (err) return console.log(err)
                        console.log(`${req.file.originalname} is served at:`, presignedUrl)
                        res.send(presignedUrl)
                    })

                    console.log('req.file', req.file)
                    console.log('req.file.buffer', req.file.buffer)
                })
            }
            // Otherwise
            else {
              res.send('Please paste in or upload your markdown 🤷‍♀️')
            }
        })
}
