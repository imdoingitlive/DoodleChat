// Grab the URL of the website
var currentURL = window.location.origin;

// Capture find group submit
$(document).on("click", "#find-submit", function() {

	// Get user input groupname
	var groupname = $("#find-input").val().trim();
	var obj = {
		groupname: groupname
	}

	// Empty input
	$("#find-input").val('');

	// AJAX post the group name 
	$.post(currentURL + "/findgroup", obj, function(res) {

		// Remove previous messages and serach groups
		$('.message').remove();
		$('#search-group').remove();

		// Append message
		if (res.message) {
			$("#find-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
		}

		// Append group
		if (res.group) {
			$('#find-group').append('<p id="search-group">' + res.group + '</p>');
		}
		
	});

	return false;
});

// Capture create group submit
$(document).on("click", "#create-submit", function() {

	// Get user input groupname
	var groupname = $("#create-input").val().trim();
	var obj = {
		groupname: groupname
	}

	// Empty input
	$("#create-input").val('');

	// AJAX post the group name 
	$.post(currentURL + "/creategroup", obj, function(res) {

		// Remove previous messages
		$('.message').remove();

		// Append message
		if (res.message) {
			$("#create-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
		}

		// Append group
		if (res.group) {
			$('#your-groups').append('<p>' + res.group + '</p>');
		}
		
	});

	return false;
});