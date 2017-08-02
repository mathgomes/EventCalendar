
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
// Channels
app.get('/:store', (req, res, next) => {
	var store = req.params.store;
	console.log(store);
});
app.get('/:store/:id', (req, res, next) => {

});
app.post(':store', (req, res, next) => {
	var store = req.params.store;
	var record = req.body;
	console.log(store);
	console.log(record);
	mongo.insertDocument(record, store, function(err, result) {
		if(err) {
			console.log(err);
			next(err, req, res, null);
		}
		else {
			console.log(result);
			res.send(result);
		}
	});
});
app.put('/store/:id', (req, res, next) => {

});
app.delete('/store', (req, res, next) => {

});
app.delete('/store/:id', (req, res, next) => {

});

// User-friendly error middleware
app.use( (err, req, res, next) => {
	var errMessage = 'Error ' + err.statusCode + ' - ' +  err.reason;
	console.log(errMessage);
	res.status(err.statusCode).send(errMessage);
});


// Get port from command-line arguments (default: 8000)
var port = 8000;
if(process.argv.length >= 3) {
	port = parseInt(process.argv[2]);
}

app.listen(port, () => {
	console.log('Listening on port', port);
});
