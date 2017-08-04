/*
Users
(_id(Username), Username, Name, Password)

Events
(_id, Description, DateBegin, DateEnd, Owner)
*/

var mongoM = require('mongodb');
var MongoClient = mongoM.MongoClient;


// Connection URL
var url = 'mongodb://localhost:27017/';

// Get database name from command line arguments(default: eventCalendar)
var database = 'eventCalendar'
if(process.argv.length >= 4) {
	database = process.argv[3];
}


var mongo = module.exports = {
 
 	dBase: null,

	initMongo: function() {

		var mongoObj = this;
		MongoClient.connect(url + database, function(err, db) {
			if(err) {
				console.log(err);
				return;
			}
			console.log("Connected successfully to " + db.s.databaseName);
			mongoObj.dbase = db;
			mongoObj.createCollections(db);
		});
	},
	createCollections: function(db) {
		var mongoObj = this;
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
				callback(collectionName);
			});
		}
		function populate(templateDoc, index, collectionName, unique) {
			var collection = db.collection(collectionName);
			collection.createIndex(index, { unique: unique } );
			collection.insertOne(templateDoc, function(err, res) {
				if(!err) _callback(err, res.ops, "Inserted with success");
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
		        		'$regex': /[a-z0-9]+/,
		        		'$exists': true 
		        	}
		        },
		        { 'password': 
		        	{ 	
		        		'$regex': /[a-z0-9]+/,
		        		'$exists': true 
		        	}
		    	}
		     ]
		  }
		}, function(collectionName) {
			mongoObj.insertUser({name :'Math', username: 'Mt', password:'1' }, function(err, res) {
				if(!err) _callback(err, res.ops, "Inserted with success");
			});
			mongoObj.insertUser({name :'Math2', username: 'Mt2', password:'2' }, function(err, res) {
				if(!err) _callback(err, res.ops, "Inserted with success");
			});
		});

		create("events", 
		{
		  'validator': { '$and':
		     [
		     	{ 'owner': 
		        	{ 			   
		        		'$exists': true 
		        	}
		        },
		        { 'description': 
		        	{ 			   
		        		'$regex': /[A-Za-z0-9]+/,	
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
		}, function(collectionName) {
			populate({description :'TestEvent', dateBegin: new Date("2017-08-01T00:00:00"), dateEnd: new Date("2017-08-01T00:00:00"), owner: "Mt"}, 
				{owner : 1, dateBegin : 1}, collectionName, true);
			populate({description :'TestEvent2', dateBegin: new Date("2017-08-01T00:00:00"), dateEnd: new Date("2017-08-01T00:00:00"), owner: "Mt2"}, 
				{owner : 1, dateBegin : 1}, collectionName, true);
		});

	},
	insertUser: function(newUser, callback) {
		var collection = this.dbase.collection("users");
		newUser._id = newUser.username;
		collection.insertOne(newUser, function(err, res) {
			callback(err, res);
		});
	},
	readUser: function(filter, collectionName, callback) {
		var collection = this.dbase.collection(collectionName);
		collection.findOne(filter, function(err, doc) {
			callback(err, doc);
		});
	},
	insertEvent: function(newEvent, callback) {
		newEvent.dateBegin = new Date(newEvent.dateBegin);
		newEvent.dateEnd = new Date(newEvent.dateEnd);
		
		var collection = this.dbase.collection("events");
		collection.find(
			{
				owner : newEvent.owner,
				dateBegin: {$lte: newEvent.dateEnd},
				dateEnd: {$gte: newEvent.dateDegin}
			}).toArray(
				function(err, doc) {
						console.log(doc);
						if(doc.length > 0) {
							callback({message:"Events overlap"}, err);
							return;
						}
						collection.insertOne(newEvent, function(err, res) {
						callback(err, res);
					});
				});

	},
	readEvent: function(filter, collectionName, callback) {
		filter._id = mongoM.ObjectID(filter._id);
		var collection = this.dbase.collection(collectionName);
		console.log(filter);
		collection.findOne(filter, function(err, doc) {
			callback(err, doc);
		});
	},
	readEventQuery: function(filter, collectionName, callback) {
		var collection = this.dbase.collection(collectionName);
		console.log(filter);
		collection.findOne(filter, function(err, doc) {
			callback(err, doc);
		});
	},
	updateEvent: function(filter, update, callback) {
		filter._id = mongoM.ObjectID(filter._id);
		update.dateBegin = new Date(update.dateBegin);
		update.dateEnd = new Date(update.dateEnd);
		var collection = this.dbase.collection("events");
		collection.findOneAndUpdate(filter, {$set: update}, function(err, res) {
			callback(err, res);
		});
	},
	deleteEvent: function(filter, callback) {
		filter._id = mongoM.ObjectID(filter._id);
		var collection = this.dbase.collection("events");
		collection.deleteOne(filter, function(err, res) {
			callback(err, res);
		});
	},
	readEvents: function(filter, callback) {
		var collection = this.dbase.collection("events");
		collection.find(filter).toArray(function(err, docs) {
			callback(err, docs);
		});
	}
}
