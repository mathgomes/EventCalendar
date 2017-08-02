/*
Users
(_id, Username(unique), Name, Password)

Events
(_id, Description, DateBegin, DateEnd)
*/

var MongoClient = require('mongodb').MongoClient;


// Connection URL
var url = 'mongodb://localhost:27017/';

// Get database name from command line arguments(default: eventCalendar)
var database = 'eventCalendar'
if(process.argv.length >= 4) {
	database = process.argv[3];
}

var mongo = module.exports = {
 
	dbase : null,

	initMongo: function() {

		var mongoObj = this;
		MongoClient.connect(url + database, function(err, db) {
			if(err) {
				console.log(err);
				return;
			}
			console.log("Connected successfully to " + db.s.databaseName);
			this.dbase = db;
			mongoObj.createCollections(db);
		});
	},
	createCollections: function(db) {

		function _callback(err, results, message) {
			if(err) console.log(err.name, err.message);
			else console.log(results);
			console.log(message);
		}

		function createIndex(collectionName, unique, attr) {
			db.createIndex(collectionName, { attr: 1 }, { unique: true } )
		}
		function create(collectionName, validator, callback) {
			db.createCollection(collectionName, validator, function(err, results) {
				_callback(err, results.s.name,"Created with success");
				callback(db, collectionName);
			});
		}
		function populate(db, templateDoc, index, collectionName) {
			var collection = db.collection(collectionName);
			collection.createIndex({ index: 1 }, { unique: true } );
			collection.count(function(err, count) {
				templateDoc._id = count + 1;
				collection.insertOne(templateDoc, function(err, res) {
					if(err) _callback(err, null, "Insertion failed");
					else _callback(err, res.ops, "Inserted with success");
				});
			});
		}

		create("users", 
		{
		  'validator': { '$and':
		     [
		        { 'name': 
		        	{
		        		'$regex': /^[A-Z][a-z]+/,
		        		'$exists': true 
		        	}
		        },
		        { 'username': 
		        	{ 	
		        		'$regex': /[a-z]+/,
		        		'$exists': true 
		        	}
		        },
		        { 'password': 
		        	{ 	
		        		'$regex': /[a-z]+/,
		        		'$exists': true 
		        	}
		    	}
		     ]
		  }
		}, function(db, collectionName) {
			populate(db, {name :'Test', username: 'test', password:'test' }, 
				"username", collectionName);
		});

		create("events", 
		{
		  'validator': { '$and':
		     [
		        { 'description': 
		        	{ 	
		        		'$regex': /[a-z]+/,
		        		'$exists': true 
		        	}
		        },
		        { 'dateBegin': 
		        	{ 	
		        		'$exists': true 
		        	}
		        },
		        { 'dateEnd': 
		        	{ 	
		        		'$exists': true 
		        	}
		        }
		     ]
		  }
		},function(db, collectionName) {
			populate(db, {description :'TestEvent', dateBegin: new Date(), dateEnd: new Date() }, 
				"description", collectionName);
		});

	},
	insertDocument: function(newDocument, collectionName, callback) {
		var collection = db.collection(collectionName);
		collection.count(function(err, count) {
			newDocument._id = count + 1;
			collection.insertOne(newDocument, function(err, res) {
				callback(err, res);
			});
		});
	},
	updateDocument: function() {

	},
	deleteDocument: function() {
	},
	readDocument: function() {
	},
	readCollection: function() {

	},
	deleteCollection: function() {

	}
}
