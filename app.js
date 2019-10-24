
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var port = 3000
const MongoClient = require('mongodb').MongoClient ;
const uri = "mongodb+srv://zenek:Zenek123@cluster0-srlfh.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.post('/', function (req, res, next) {
    var dane = req.body
    console.log(dane.option);
    var opcja
    opcja = dane.option
    
        client.connect( err => {
            if(opcja==1){
                const collection = client.db("Books").collection("listofbooks");
                var query = {};
                collection.find(query).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    result.forEach(function(el, i, arr) {
                    });
                    res.send(result)
                });
            } else {
                const collection = client.db("Books").collection("listofbooks");
                var count
                collection.count(function(err, count) {
                    if (err) throw err;
                    count = count+1
                    res.send({"LP": count});
                    collection.insertOne(
                        {
                            "LP": count,
                            "author": dane.author,
                            "title": dane.title,
                            "date": dane.date,
                            "publisher": dane.publisher,
                            "availability": dane.availability
                        });

                });
            }
        })
        client.close();
})
