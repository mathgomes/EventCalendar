/*
*	File: request.js
*
*	Contains a set of functions used to make requests to the server, 
*	such as CRUD requests for authentication and display 
*/

function reqReadAllRecords(user_id, store, callback) {


	_jsonAjax('GET', user_id + "/" + store, null, function(result) {
		callback(result);
	});
}

function reqUpdateRecord(new_record, recordId, store, callback) {

	_jsonAjax('PUT', store + "/" + recordId, new_record, function(result) {
		callback(result);
	});
}

function reqDeleteRecord(record_id, store, callback) {

	_jsonAjax('DELETE', store + "/" + record_id, null, function(result) {
		callback(result);
	});
}


function reqCreateRecord(record, store, callback) {

	_jsonAjax('POST', store , record, function(result) {
		callback(result);
	});
}

function reqReadRecord(record_id, store, callback) {
	console.log('Reading record', record_id, 'from ' + store);


	_jsonAjax('GET', store + '/' + record_id, null, function(result) {
		callback(result);
	});
}
function reqReadByIndex(index, store, callback) {
	console.log('Reading record', index, 'from ' + store);


	_jsonAjax('GET', store + '/' + index.owner + "/" + index.dateBegin, null, function(result) {
		callback(result);
	});
}

function reqUserLogin(username, password, callback) {
	console.log('Login attempt:', username + ', ' + password);
	reqReadRecord(username, "users", function(result) {
		callback(result);
	});

}

// Calls the requested HTTP method, converting the <data> object into
// an url-encoded string, then invoking callback with a result object
function _jsonAjax(method, path, data, callback) {

	// Create and send JSON request
	req = new XMLHttpRequest();

	var full_path = path; // Used by req.open
	var send_data = null; // Used by req.send

	if(['POST', 'PUT'].indexOf(method) !== -1) {
		send_data = JSON.stringify(data);
		// Undefined otherwise
	}
	else if(['TRACE', 'CONNECT', 'PATCH'].indexOf(method) !== -1) {
		// These are unsupported because they don't seem necessary now,
		// so I didn't try to implement them
		callback('Unsupported HTTP method: ' + method);
		return;
	}
	console.log('_jsonAjax:', method, full_path);
	req.open(method, full_path, true);
	req.setRequestHeader("Content-type", "application/json");

	req.onreadystatechange = function(event) {
		var req = event.target;

		if(req.readyState === XMLHttpRequest.DONE) {
			var result = JSON.parse(req.responseText);
			callback(result);
		}
	};

	req.send(send_data); // Sempre esqueco isso aqui
}
