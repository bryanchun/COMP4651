const http = require('http');
let storage = "No input";

const server = http.createServer(function (req, res) {

    if (req.url == '/') {

        res.writeHead(200, { 'Content-Type': 'text/html' });

        res.write("Comp4651");
        storage = "changed";

        res.write('<html>\
        <button type="button" onclick="testfunction();">Get Value</button> \
        <p id="demo"></p>\
        <script>\
        function testfunction() {\
          var text_input = prompt("Please enter your text:", "");\
          if (text_input == null || text_input == "") {\
            storage = "No input";\
          } else {\
            storage = text_input;\
          }\
          document.getElementById("demo").innerHTML = storage;\
        }\
        </script>\
        </html>');

        res.write('<html>\
        <input type="button" onclick = "location.href=\'http://localhost:8888/to_html\';"value = "To html" />\
        </html>');

        res.end();

    } else if (req.url == "/to_html") {
        const { exec } = require('child_process');
        // var hihi = document.getElementById("demo").innerHTML;
        exec('echo '+ storage +'| faas-cli invoke markdown', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          res.write(`${stdout}`);
          console.log(`stdout: ${stdout}`);
          // console.log(`stderr: ${stderr}`);
          res.end();
        });

    } else if (req.url == "/markdown") {

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>Markdown</p></body></html>');
        res.end();

    } else {

        res.end('Invalid request');
    }

});

server.listen(8888);

console.log('server running on port 8888');

