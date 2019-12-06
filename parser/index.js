const express = require('express');
const path = require('path');
const showdown  = require('showdown');

const app = express();

app.set('views', './public');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

const text = `
# Blog Post Example
by Tom

#### Download Docker

Here's an :+1: idea: download docker from https://www.docker.com and turn \`NormalProject\` into \`ServerlessProject\`.

#### Homebrew

    brew install docker

`;

const converter = new showdown.Converter();
const md_html = converter.makeHtml(text);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/res', (req, res) => {
    res.render('output.ejs', {md_content: md_html});
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
