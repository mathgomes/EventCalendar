/*
*	File: index.js
*
*	Contains a set of functions used to process javascript in general,
*	such as layout of the page and provide auxiliar functions
*/
$(document).ready(function() {
	loadPage('login_page.html', setLoginAction);
});


// Changes the page content, but not the header, navbar and footer
function loadPage(page, callback) {
	$('#indexCenterPage').load(page, callback);
}

// Sends the user back to the login page
function logOut() {
	loggedUserId(undefined);
	loadPage('login_page.html', setLoginAction);
	$('#indexNavWrapper').html('');
}

function loadNavbar(user_data) {
	var first_name = user_data.split(' ')[0];
	$('#navUsername').html(first_name);
	$('#navLogout').click(logOut);
	CRUDonClick();
}

function setLoginAction() {
	$('#loginButton').click(function() {
		var username = $('#userName').val();
		var password = $('#userPassword').val();

		reqUserLogin(username, password, function(result) {
			if(result.success) {
				var page;
				var navbar;

				page = 'controlPanel.html';
				navbar = 'navbar.html';

				loggedUserId(result.data._id);

				loadPage(page);
				$('#indexNavWrapper').load(navbar, function() {
					loadNavbar(result.data.name);
				});
			}
			else {
				alert(result.error);
			}
		});
	});
}
