
// Used to set or retrieve the user's id
function loggedUserId(user_id_str) {
	if(user_id_str !== undefined) {
		// Logging in
		localStorage.setItem('user_id', user_id_str);
	}
	else {
		// ID retrieval
		return localStorage.getItem('user_id');
	}
}

function clickedEventId(eventID) {
	if(eventID !== undefined) {
		localStorage.setItem('cur_event', eventID);
	}
	else {
		// ID retrieval
		return localStorage.getItem('cur_event');
	}
}
function CRUDonClick() {
	refreshTable('#eventsTableBody', "events", eventTableRow);
	$('#create #btnCreateEvent').click(function() {
		createObject('#eventsTableBody', "events", eventTableRow, createEventContainer());
	});
	$('#edit #btnUpdateEvent').click(function() {
		updateObject('#eventsTableBody', "events", eventTableRow, updateEventContainer());
	});
}


function eventTableRow(eventData, tableID) {

	function td(content) {
		return '<td>' + content + '</td>';
	}

	function buttonApagar() {
		var string = '<button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button>'
		return string;
	}

	function buttonAlterar() {
		var string = '<button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button>'
		return string;
	}

	var html = '';

	html += '<tr>';
	html += td(eventData.description);
	html += td(eventData.dateBegin);
	html += td(eventData.dateEnd);
	html += td(buttonAlterar());
	html += td(buttonApagar());
	html += '</tr>';


	return html;
}

function createEventContainer() {
	var new_object = {
		description : $('#create #desc').val(),
		dateBegin : $('#create #date1').val(),
		dateEnd : $('#create #date2').val(),
		owner : loggedUserId()
	};
	return new_object;
}
function updateEventContainer() {
	var new_object = {
		description : $('#edit #altdesc').val(),
		dateBegin : $('#edit #altdate1').val(),
		dateEnd : $('#edit #altdate2').val(),
		owner : loggedUserId()
	};
	return new_object;
}

function createObject(tableID, tableName, tableRow, obj) {

	new_object = obj;
	reqCreateRecord(new_object, tableName, function(result) {
		if (result.success == false) {
			alert('Erro '+ result.error);
		} else {

			alert('Objeto cadastrado com sucesso');
			refreshTable(tableID, tableName, tableRow);
		}
	});

}

function updateObject(tableID, tableName, tableRow, obj) {

	new_object = obj;
	reqReadByIndex(new_object, "events", function(result) {
		if(result.success) {
			reqUpdateRecord(new_object, result.data._id, tableName, function(result) {
				if (result.success == false) {
					alert('Erro '+ result.error);
				} else {
					alert('Objeto Alterado com sucesso');
					refreshTable(tableID, tableName, tableRow);
				}
			});
		}
		else {
			alert('Erro '+ result.error);
		}
	});

}


function deleteObject(tableID, tableName, tableRow, obj) {

	reqReadByIndex(obj, "events", function(result) {
		if(result.success) {
			console.log(result);
		}
		else {
			alert('Erro '+ result.error);
		}
	});
}


function refreshTable(tableID, tableName, tableRow) {
	$(tableID).html('');
	reqReadAllRecords(loggedUserId(), "events", function(result) {
		if (result.success) {
			var prop;
			var month;
			var newProp;
			result.data.forEach(function(object) {
				prop = object.dateBegin.toString();
				newProp = prop.replace(/(T|Z|(\.000))/g, " ") ;
				object.dateBegin = newProp;
				prop = object.dateEnd;
				newProp = prop.replace(/(T|Z|(\.000))/g, " ") ;
				object.dateEnd = newProp;
				$(tableID).append(tableRow(object, tableID));
			});
		}
	});
}