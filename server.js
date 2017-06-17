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
  
  connectToMongo(function(callbackResponse){
    if(!callbackResponse.error){
      saveURL(callbackResponse.collection, origURL, function(resultObj){
        response.send(resultObj);
      });
    }else{
      response.send(callbackResponse);
    }
  });
  
  
});

app.get("/to/:id", function (request, response){
  
  connectToMongo(function(callbackResponse){
    if(!callbackResponse.error){
      getURL(callbackResponse.collection, request.params.id, function(resultObj){
        response.send(resultObj);
      });
    }else{
      response.send(callbackResponse);
    }
  });
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

function getURL(collection, id, callback){
  collection.find({_id: id}, {url: 1}).toArray(function(err, value){
    if(!err){
      console.log(value);
      callback(value);
    }else{
      callback({error: "Could not get the url. Try again later."}); 
    }
  });
}

function saveURL(collection, origURL, callback){
  
  // do some work here with the database.
  collection.find({}, {_id: 1}).toArray(function (err, value) { 

    var lastId = value[value.length - 1]; 
    var id = 0; 

    if(lastId != undefined){
      id = lastId._id + 1; 
    }

    var newURL = {
      _id: id, 
      url: origURL,
      createdAt: new Date(), 
    }

    collection.insert(newURL, function(err,docsInserted){

      var result = {
        error: "Could not insert you URL",
      }

      if(!err){
        var insertedId = docsInserted.insertedIds;
        result = {
          original_url: origURL,
          short_url: "https://lavender-drum.glitch.me/to/"+insertedId
        }
        callback(result);
      }else{
        callback(result);
      }

    }); 
  });
}

function connectToMongo(callback){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/microservice4';  
  
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      callback({ error: "Unable to connect to the mongoDB server" });
    } else {
      console.log('Connection established to', url);
      
      db.collection("urls", function(error, collection){
        if(!error){
          callback({db: db, collection: collection});  
        }else{
          callback({ error: "Could not connect to DB!" });
        }
        
      });

      
    }
  });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
