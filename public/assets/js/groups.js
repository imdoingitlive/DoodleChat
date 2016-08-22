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
			var $p = $("<p>").text(res.group);
			var $div = $("<div>").attr("id","search-group").append($p);
			// If not joined append join button
			if (!res.joined) {
				var $but = $("<button>").addClass("btn btn-info").attr("data-group",res.group).attr("type","button").attr("id","join-submit").text("Join");
				$div.append($but);
			}
			$('#find-group').append($div);
		}
		
	});

	return false;
});

// Capture join group submit
$(document).on("click", "#join-submit", function() {

	// Get user input groupname
	var groupname = $("#join-submit").attr("data-group");
	var obj = {
		groupname: groupname
	}

	// AJAX post the group name 
	$.post(currentURL + "/joingroup", obj, function(res) {

		// Remove previous messages and serach groups
		$('.message').remove();
		$('#search-group').remove();

		// Append message
		if (res.message) {
			$("#find-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
		}

		// Append group
		if (res.group) {
			// var $p = $("<p>").text(res.group);
			// var $but = $("<button>").addClass("btn btn-info sketch").attr("data-group",res.group).attr("type","button").text("Go");
			// var $div = $("<div>").append($p).append($but)
			// $('#your-groups').append($div);
			window.location = currentURL + "/groups";
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

		// Remove previous messages and serach groups
		$('.message').remove();
		$('#search-group').remove();

		// Append message
		if (res.message) {
			$("#create-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
		}

		// Append group
		if (res.group) {
			// var $p = $("<p>").text(res.group);
			// var $but = $("<button>").addClass("btn btn-info sketch").attr("data-group",res.group).attr("type","button").text("Go");
			// var $div = $("<div>").append($p).append($but)
			// $('#your-groups').append($div);
			window.location = currentURL + "/groups";
		}
		
	});

	return false;
});

// Capture go submit
$(document).on("click", ".sketch", function() {

	// Get user input groupname
	var groupname = encodeURI($(this).attr("data-group"));

	// Empty input
	$("#create-input").val('');

	// Go to group sketch
	window.location = currentURL + "/sketch/" + groupname;

	return false;
});