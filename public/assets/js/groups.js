// Grab the URL of the website
var baseURL = window.location.origin;

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
	$.post(baseURL + "/findgroup", obj, function(res) {

		// Remove previous messages and search groups
		$("#find-group").empty();
		$('#create-group').empty();

		// Append message
		if (res.message) {
			$("#find-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
		}

		// Append group
		if (res.groupname) {
			var $a = $("<a>").html('<span class="badge">' + res.totalusers + '/4</span> ' + res.groupname + ' ');
			// If not joined append join button
			if (!res.joined) {
				var $but = $("<button>").addClass("btn btn-info join-submit").attr("data-group",res.groupname).attr("type","button").text("Join");
				$a.append($but)
			}
			$('#find-group').append($a);
		}
		
	});

	return false;
});

// Capture join group submit
$(document).on("click", ".join-submit", function() {

	// Get user input groupname
	var groupname = $(".join-submit").attr("data-group");
	var obj = {
		groupname: groupname
	}

	// AJAX post the group name 
	$.post(baseURL + "/joingroup", obj, function(res) {

		console.log(res)

		// Remove previous messages and search groups
		$("#find-group").empty();
		$('#create-group').empty();

		// Append message
		if (res.message) {
			$("#find-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
			// Force a reload after 3 secs
			setTimeout(function() {
				window.location = baseURL + "/sketch";
			}, 3000)
		}

		// Append group
		if (res.group) {
			// Force a reload
			window.location = baseURL + "/sketch";
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
	$.post(baseURL + "/creategroup", obj, function(res) {

		// Remove previous messages and serach groups
		$("#find-group").empty();
		$('#create-group').empty();

		// Append message
		if (res.message) {
			$("#create-group").append('<div class="alert alert-danger message">' + res.message + '</div>');
		}

		// Append group
		if (res.group) {
			// Force a reload
			window.location = baseURL + "/sketch";
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
	// window.location = baseURL + "/group/" + groupname;

	// AJAX get the sketch information 
	$.getJSON(baseURL + "/group/" + groupname, function(data) {

		console.log(data)

		// Remove sun
		$container = $('.container');
		$container.empty();

		// Add header
		var text = ['Group','Completed','Part'];
		var info = [data.groupname, data.completed, data.part];
		var glyphicon = ['sunglasses', 'ok', 'th-large'];

		// Create row
		var $row = $('<div>').addClass('row').attr('id','header');
		// Loop through and create cols
		for (var i in text) {
			var $h1 = $('<h1>').html('<span class="glyphicon glyphicon-' + glyphicon[i] + '" aria-hidden="true"></span> ' + text[i] + ': ' + info[i]);
			var $col = $('<div>').addClass('col-md-4 col-lg-4').append($h1);
			$row.append($col);
		}
		// Add row to container
		$container.append($row);
		
	});

	return false;
});