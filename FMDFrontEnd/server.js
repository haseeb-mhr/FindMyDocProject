const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/FMDFrontEnd/'));

app.all('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname));
});
//app.get('/*', (req, res) => res.sendFile(__dirname + '/dist/FMDFrontEnd/index.html'));
const server = http.createServer(app);
server.listen(process.env.PORT || 300, () => console.log('Server is Running...')); 