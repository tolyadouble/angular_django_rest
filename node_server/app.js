var express = require('express');
var app = express();
var port = 8001;

app.use('/static', express.static(__dirname + '/public'));

app.set('views', __dirname + '/public/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('*', function(req, res){
  res.render('index.html');
});

app.listen(port, '127.0.0.1');
console.log("Server on port " + port);
