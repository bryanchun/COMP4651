const http = require('http')
const fs = require('fs')

const downloadFile = (url, dest, callback) => {
    const file = fs.createWriteStream(dest)
    const request = http.get(url, (response) => {
        if (response.statusCode != 200) {
            callback('File not found')
        }
        const len = parseInt(response.headers['content-length'], 10)
        let dowloaded = 0
        response.pipe(file)

        response.on('data', (chunk) => {
            dowloaded += chunk.length
            console.log("Downloading " + (100.0 * dowloaded / len).toFixed(2) + "% " + dowloaded + " bytes" + "\r")
        }).on('end', () => {
            file.end()
            callback(null)
        }).on('error', (err) => {
            callback(err.message)
        })
        
    }).on('error', (err) => {
        fs.unlink(dest)
        callback(err.message)
    })
}

// HTTP only
const url = "http://images.pexels.com/photos/72161/pexels-photo-72161.jpeg?dl&fit=crop&w=640&h=318",
    filename = "tmp"

downloadFile(url, filename, (err) => {
    if (err) { console.log(err) }
    else { console.log('File downloaded') }
})
const path = '.'
fs.readdir(path, function(err, items) {
    for (var i=0; i<items.length; i++) {
        var file = path + '/' + items[i];
        console.log("Start: " + file);
 
        fs.stat(file, function(err, stats) {
            console.log(file);
            console.log(stats["size"]);
        });
    }
});


mc.makeBucket('incoming', 'us-east-1', (err) => {
    if (err) return console.log(err)
    console.log('Bucket created successfully in "us-east-1".')
    
    var metaData = {
        'Content-Type': 'image/jpeg'
    }
    
    mc.fPutObject('incoming', 'image1', filename, metaData, function(err, etag) {
        if (err) return console.log(err)
        console.log('File ${filename} uploaded successfully.')
    })
})

var metaData = {
    // 'Content-Type': 'image/jpeg',
    'Content-Type': 'application/octet-stream',
    'X-Amz-Meta-Testing': 1234,
    'example': 5678
}

mc.fPutObject('incoming', 'tmp', filename, metaData, function(err, etag) {
    if (err) return console.log(err)
    console.log(`File ${filename} uploaded successfully.`)
})

