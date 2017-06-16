// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');

  



// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/url", function (request, response) {
  
  var url = request.query.url;
  console.log(url);
  var urlPattern = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")
  
   
  if(url.match(urlPattern)){
    console.log("Pattern matched");
  } 
  
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/microservice';    
  
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      
      db.collection("urls", function(error, collection){
        
        if(!error){
          // do some work here with the database.
          var lastId = collection.find({}, {_id: 1}).sort({_id:-1}).limit(1);
          
          console.log("last id: ");
          console.log(lastId);
          var id = 0;
          if(lastId._id){
            id = lastId._id; 
          }

          var newURL = {
            _id: id, 
            url: url,
            createdAt: new Date(), 
          }
          collection.insert(newURL, function(err,docsInserted){
              console.log(docsInserted.getInsertedIds());
          }); 
          //Close connection
          db.close();
        }else{
          console.log(error);
        }
        
      });

      
    }
  });
  response.send(dreams);
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
