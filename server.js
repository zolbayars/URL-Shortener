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
  
  var result = {
    error: "Wrong URL format or some error just happened", 
  }
  
    
  
  
});

app.get("/to/:id", function (request, response){
  
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

function saveURL(){
  
      // do some work here with the database.
      collection.find({}, {_id: 1}).toArray(function (err, value) { 
        console.log(value);
        var lastId = value[value.length - 1]; 
          var id = 0; 
          if(lastId != undefined){
            id = lastId._id + 1; 
          }

          console.log("lastId: ");
          console.log(lastId);

          console.log("id: ");
          console.log(id);

          var newURL = {
            _id: id, 
            url: origURL,
            createdAt: new Date(), 
          }
          collection.insert(newURL, function(err,docsInserted){
            if(!err){
              var insertedId = docsInserted.insertedIds;
              result = {
                original_url: origURL,
                short_url: "https://lavender-drum.glitch.me/to/"+insertedId
              }

              response.send(result);
            }else{
              console.log(err);
            }

              //Close connection
            db.close();
          }); 


        });

          
        
}

function connectToMongo(){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/microservice4';  
  
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      
      db.collection("urls", function(error, collection){
        if(!error){
          
        }else{
          result = {
            error: "Could not connect to DB!"
          }
          response.send(result);
        }
        
      });

      
    }
  });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
