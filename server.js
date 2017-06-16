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
  
  var origURL = request.query.url;
  console.log(origURL);
  var urlPattern = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")
  
   
  if(origURL.match(urlPattern)){
    console.log("Pattern matched");
  } 
  
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/microservice3';    
  
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      
      db.collection("urls", function(error, collection){
        
        if(!error){
          // do some work here with the database.
          collection.find({}, {_id: 1}).toArray(function (err, value) { 
            console.log(value);
            var lastId = value[value.length - 1]; 
            var id = 0; 
            if(lastId){
              id = lastId + 1; 
            }
            
            console.log("lastId");
            console.log(lastId);
            var newURL = {
              _id: id, 
              url: origURL,
              createdAt: new Date(), 
            }
            collection.insert(newURL, function(err,docsInserted){
              if(!err){
                console.log(docsInserted.insertedIds[0]["_id"]);
              }else{
                console.log(err);
              }
            }); 
            //Close connection
            db.close();
            
          });

          
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
