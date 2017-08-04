
var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('./database/mongo');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

/*

*	GET /:store (get whole collection)
*	GET /:store/:id ( get document of specific id from a collection)
*	POST /:store (add new document to store)
*	PUT /:store/:id (update new document to store)
*	DELETE /:store/ (delete a collection)
*	DELETE /:store/:id (delete a document with specified id)

TABLE OF ERRORS :
200 - OK
201 - Created
202 - Accepted
304 - Not Modified
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
405 - Resource Not Allowed
406 - Not Acceptable
409 - Conflict
412 - Precondition Failed
415 - Bad Content Type
416 - Requested Range Not Satisfiable
417 - Expectation Failed
500 - Internal Server Error

*/

mongo.initMongo();


app.get('/users/:username', (req, res, next) => {
	var username = req.params.username;
	mongo.readUser({username: username}, "users", function(err, doc) {
		_getCallback(err, doc, res, "404 user not found");
	});
});
app.post('/users', (req, res, next) => {
	var record = req.body;
	console.log(record);
	mongo.insertUser(record, function(err, result) {
		if(err) {
			next(err, 500);
		}
		else {
			console.log("User " + result.insertedId + " created");
			res.status(201).json(_dbSuccess(result.insertedId));
		}
	});
});

app.get('/:userid/events', (req, res, next) => {
	var userid = req.params.userid
	mongo.readEvents({owner: userid}, function(err, docs) {
		_getCallback(err, docs, res, "404 no events exist");
	});
});
app.get('/:userid/events/:id', (req, res, next) => {
	var userid = req.params.userid
	mongo.readEvent({_id: id, owner: userid}, "events", function(err, doc) {
		_getCallback(err, doc, res, "404 event not found");
	});
});
app.post('/events', (req, res, next) => {
	var record = req.body;
	console.log(record);
	mongo.insertEvent(record, function(err, result) {
		if(err) {
			next(err, 500);
		}
		else {
			if(result == null) {
				res.status(201).json(_dbSuccess(result.insertedId));
			}
			res.status(201).json(_dbSuccess(result.insertedId));
		}
	});	
});
app.put('/events/:id', (req, res, next) => {
	var id = req.params.id;
	var record = req.body;
	console.log(record);
	mongo.updateEvent({_id: id}, record, function(err, result) {
		if(err) {
			next(err, 500);
		}
		else {
			res.status(200).json(_dbSuccess(result.value));
		}
	});
});
app.get('/events/:owner/:date', (req, res, next) => {
	var owner = req.params.owner;
	var date = req.params.date;
	mongo.readEventQuery({owner: owner, dateBegin: new Date(date)}, "events", function(err, doc) {
		_getCallback(err, doc, res, "404 event not found");
	});
});
app.delete('/events/:id', (req, res, next) => {
	var id = req.params.id;
	mongo.deleteEvent({_id: id}, function(err, result) {
		if(err) {
			next(err, 500);
		}
		else {
			if(result.deletedCount == 0) {
				res.status(404).json(_dbFailure("404 event not found"));
			}
			console.log(result.deletedCount + " events deleted");
			res.status(200).json(_dbSuccess(200));
		}
	});

});

function _getCallback(err, doc, res, errmsg) {
	if(err) {
		next(err, 500);
	}
	else {
		if(doc == null) {
			res.status(404).json(_dbFailure(errmsg));
		}
		else {
			res.status(200).json(_dbSuccess(doc));
		}
	}
}

// Creates a successful result object
function _dbSuccess(data) {
	return {
		success: true,
		error: undefined,
		data: data,
	};
}


// Creates an unsuccessful result object
function _dbFailure(error) {
	return {
		success: false,
		error: error,
		data: undefined,
	};
}


// Error middleware
app.use( (err, req, res, next) => {
	res.status(500).json(_dbFailure(err.message));
});


// Get port from command-line arguments (default: 8000)
var port = 8000;
if(process.argv.length >= 3) {
	port = parseInt(process.argv[2]);
}

app.listen(port, () => {
	console.log('Listening on port', port);
});
