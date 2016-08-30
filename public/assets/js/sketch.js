// =====================================
// GROUP SECTION =======================
// =====================================

// Grab the URL of the website
var baseURL = window.location.origin;

// =====================================
// FIND GROUP ==========================
// =====================================
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

// =====================================
// JOIN GROUP ==========================
// =====================================
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
				location.reload();
			}, 3000)
		}

		// If successfully added reload
		if (res.success) {
			// Force a reload
			location.reload();
		}
		
	});

	return false;
});

// =====================================
// CREATE GROUP ========================
// =====================================
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
			location.reload();
		}
		
	});

	return false;
});

// =====================================
// Go ==================================
// =====================================
$(document).on("click", ".sketch", function() {

	// Get user input groupname
	var groupname = encodeURI($(this).attr("data-group"));

	// Empty input
	$("#create-input").val('');

	// AJAX get the sketch information 
	$.getJSON(baseURL + "/group/" + groupname, function(data) {

		console.log(data)

		// Update your groups members count
		var count = data.groupmembers.length;
  	$('li.your-groups>a').each(function(index, value) {
  		var group = value.getAttribute('data-group');
  		if (data.groupname === group) {
  			// Update badge
  			value.children[0].innerHTML = count + '/4';
  			// Remove button
  			value.children[1].remove();
  		} 
  		// Add button if button is not there
  		else {
  			if (value.children.length === 1) {
  				// Create button node
  				var button = document.createElement("button");
  				button.classList.add("btn");
  				button.classList.add("btn-info");
  				button.classList.add("sketch");
  				button.setAttribute("data-group", group);
  				// Create i node
  				var i = document.createElement("i");
  				i.classList.add("fa");
  				i.classList.add("fa-arrow-right");
  				i.setAttribute("aria-hidden", "true");
  				// Create text
  				var text = document.createTextNode('Go ');
  				// Appends
  				button.appendChild(text);
  				button.appendChild(i);
  				value.appendChild(button);
  			}
  		}
  	});
  	// Increment recent groups members count (if there)
  	$('li.recent-groups>a').each(function(index, value) {
  		var group = value.getAttribute('data-group');
  		if (data.groupname === group)
  			value.innerHTML = value.innerHTML.slice(0,20) + count + value.innerHTML.slice(21); // number accounts for span element
  	});

		// Set local storage for being used when sending
		localStorage.setItem('groupname', data.groupname);
		localStorage.setItem('storyID', String(data.storyID));
		localStorage.setItem('part', String(data.part));

		// Start socketIO
	  socketIO(data);

		// Remove sun
		$container = $('.container');
		$container.empty();

		// Remove previous group members
		$('.group-members').remove();

		// Create header
		var text = ['Group','Completed','Part'];
		var info = [data.groupname, data.completed, data.part];
		var glyphicon = ['sunglasses', 'ok', 'th-large'];
		// Create row
		var $row = $('<div>').addClass('row').attr('id','header');
		// Loop through and create cols
		for (var i in text) {
			var $h2 = $('<h2>').attr('id',text[i]).html('<span class="glyphicon glyphicon-' + glyphicon[i] + '" aria-hidden="true"></span> ' + text[i] + ': ' + info[i]);
			var $col = $('<div>').addClass('col-md-4 col-lg-4').append($h2);
			$row.append($col);
		}
		// Add header to container
		$container.append($row);

		// Create group members
		var $nav = $('.nav');
		// Add divider
		var $divider = $('<li>').addClass('nav-divider group-members');
		$nav.append($divider);
		var $a = $('<a>').html('<strong>Group Members</strong>');
		var $heading = $('<li>').addClass('active group-members').append($a);
		// Add group members header to side bar
		$nav.append($heading);
		// Add group members to ul
		for (var i in data.groupmembers) {
			var $a = $('<a>').text(data.groupmembers[i]);
			var $li = $('<li>').addClass('group-members').append($a);
			$nav.append($li);
		}

		// Call to get page function if all group members are present
		if (data.groupmembers.length === 4)
			getPage(data);
		else
			addWaitingForMembers();

	});

	return false;
});

// =====================================
// Add waiting for groupmembers ========
// =====================================
function addWaitingForMembers() {
	// Clear completed and part
	var $Completed = $('#Completed');
	$Completed.html($Completed.html().slice(0,-1));
	var $Part = $('#Part');
	$Part.html($Part.html().slice(0,-1));
	// Add waiting
	var $h1 = $('<h1>').html('<i class="fa fa-quote-left" aria-hidden="true"></i> Waiting for group members to reach 4 to start... <i class="fa fa-quote-right" aria-hidden="true"></i>');
	var $canvasWrapper = $('<div>').attr('id','canvas-wrapper').append($h1);
  $('.container').append($canvasWrapper);
}

// =====================================
// SKETCH SECTION ======================
// =====================================

// =====================================
// AJAX Request after hitting Go =======
// =====================================
function getPage(data) {

	// Make story obj to send
	var storyObj = {
	  storyID: data.storyID
	};

	// AJAX get the page 
	$.post(baseURL + "/group/" + data.groupname +"/story", storyObj, function(res) {

	  console.log(res)

	  // Clear waiting for members
	  $('#canvas-wrapper').remove();

	  // Set local storage for captions
	  localStorage.setItem('storyID', res.storyID);
		localStorage.setItem('caption1', res.caption1);
		localStorage.setItem('caption2', res.caption2);
		localStorage.setItem('caption3', res.caption3);
		localStorage.setItem('caption4', res.caption4);

	  // Switch statement for caption
	  var caption;
	  switch (data.part) {
	    case 1: caption = res.caption1 + '...'; break;
	    case 2: caption = '...' + res.caption2 + '...'; break;
	    case 3: caption = '...' + res.caption3 + '...'; break;
	    case 4: caption = '...' + res.caption4; break;
	  }

	  // Check if canvas should be shown by comparing part number to array
	  if (data.username === data.groupmembers[data.part-1]) {
	    var obj = {
	      part: data.part,
	      caption: caption,
	      groupnameEncoded: encodeURIComponent(data.groupname),
	      storyID: data.storyID
	    }
	    addCanvas(obj);
	    sendListener();
	  }    
	  else
	    addWaiting(data.part);
	  
	});
}

// =====================================
// Only allow send to be clicked once ==
// =====================================
function sendListener() {
	$send = $('#send');
	// Custom listener for sending
  $send.on('click', function(e) {
  	console.log('working');
  	// Turn off listener
  	$send.off('click');
    // Save groupname, storyID, and part for img URL
    var obj = {
      groupname: localStorage.getItem('groupname'),
      storyID: localStorage.getItem('storyID'),
      part: localStorage.getItem('part')
    }
    sendIO(obj);
    return false;
  })
}

function sendIO(obj) {
	// Get canvas element
  var $el = document.getElementById("colors_sketch");
  // Save background if part is not 1
  if (obj.part !== '1') {
    $el.getContext('2d').globalCompositeOperation = 'destination-over';
    $el.getContext('2d').drawImage(bk, 0, 0);
    $el.getContext('2d').globalCompositeOperation = 'source-over';
  }
  // Get MIME type
  var mime = "image/png";
  // Save dataURL
  var dataURL = $el.toDataURL(mime);
  obj.dataURL = dataURL;
  console.log(obj)
  // Send dataURL through socket
  // IMPORTANT BECAUSE IT SAVES WITH GROUPNAME, STORYID, AND PART
  return socket.emit('send sketch', obj);
}

// =====================================
// Add canvas for drawing ==============
// =====================================
function addCanvas(obj) {

  // Add tools
  var $done = $('<a>').attr('href','#').attr('id','send').css('width','100px').text('Done');
  var $tools = $('<div>').attr('id','tools').append($done);
  // Add colors
  var colors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'];
  for (var i=0; i<colors.length; i++) {
    var $a = $('<a>').attr('href','#colors_sketch').attr('data-color',colors[i]).css('width','10px').css('background',colors[i]);
    $tools.append($a);}
  // Add sizes
  var sizes = [3, 5, 10, 15];
  for (var i=0; i<sizes.length; i++) {
    var $a = $('<a>').attr('href','#colors_sketch').attr('data-size',sizes[i]).css('background','#ccc').text(sizes[i]);
    $tools.append($a);
  }

  // Add caption
  var $caption = $('<h1>').attr('id','caption').html('<i class="fa fa-quote-left" aria-hidden="true"></i> ' + obj.caption + ' <i class="fa fa-quote-right" aria-hidden="true"></i>');

  // Add canvas
  var $canvas = $('<canvas>').attr('id','colors_sketch').attr('width','800').attr('height','600');
  var $canvasHolder = $('<div>').attr('id','canvas').append($canvas).append($caption);
  
  // Only add image back if the part is not first
  if (obj.part !== 1) {
    // Add img
    var previousPart = obj.part-1;
    var $img = $('<img>').attr('crossOrigin','annoymous').attr('id','bk').attr('src','https://s3.amazonaws.com/project2storyboard/' + obj.groupnameEncoded  + '/' + obj.storyID + '/' + previousPart);
    $canvasHolder.prepend($img);
  }
  // Add tools and canvas to wrapper
  var $canvasWrapper = $('<div>').attr('id','canvas-wrapper').append($tools).append($canvasHolder);
  $('.container').append($canvasWrapper);
  // Start the sketching (once the first time)
  $('#colors_sketch').sketch();

};

// =====================================
// Add waiting instead of canvas =======
// =====================================
function addWaiting(part) {
	var $h1 = $('<h1>').html('<i class="fa fa-quote-left" aria-hidden="true"></i> Waiting for group member to finish part ' + part + ' sketch... <i class="fa fa-quote-right" aria-hidden="true"></i>');
	var $canvasWrapper = $('<div>').attr('id','canvas-wrapper').append($h1);
  $('.container').append($canvasWrapper);
}

// =====================================
// Socket IO callback function =========
// =====================================

// Socket io
var socket = io.connect();

function socketIO(data) {

	var count = data.groupmembers.length;

	// Send username
	socket.on(data.groupname + 'new user', function(newUser) {
	  var alreadyAdded = false;
	  // Loop through group members
	  for (var i in data.groupmembers) {
	  	if (newUser === data.username) {
	      alreadyAdded = true;
	    }
	  }
	  // If not already added
	  if (!alreadyAdded) {
	  	// Increment group member count
	  	count++;
	  	// Increment your groups members count
	  	$('li.your-groups>a').each(function(index, value) {
	  		var group = value.getAttribute('data-group');
	  		if (data.groupname === group)
	  			value.innerHTML = value.innerHTML.slice(0,20) + count + value.innerHTML.slice(21); // number accounts for span element
	  	});
	  	// Increment recent groups members count(if there)
	  	$('li.recent-groups>a').each(function(index, value) {
	  		var group = value.getAttribute('data-group');
	  		if (data.groupname === group)
	  			value.innerHTML = value.innerHTML.slice(0,20) + count + value.innerHTML.slice(21); // number accounts for span element
	  	});
	  	// Add new user to side nav bar
	  	var $a = $('<a>').text(newUser);
			var $li = $('<li>').addClass('group-members').append($a);
			$('.nav').append($li);
			// If members is reaches 4
	  	if (count === 4) {
				// Fill in completed and part
				var $Completed = $('#Completed');
				$Completed.html($Completed.html().slice(0,-1) + ' 0');
				var $Part = $('#Part');
				$Part.html($Part.html().slice(0,-1) + ' 1');
				// Get page
	  		getPage(data);
	  	}
	  }  

	});

	// Listen for signal for next story or part
	socket.on(data.groupname + 'next', function(res) {

	  console.log(res)

	  // Update part
		var $Part = $('#Part');
		$Part.html($Part.html().slice(0,-1) + ' ' + res.part);

	  // Empty canvas-wrapper
	  $('#canvas-wrapper').remove();

  	// Set local storage for storyID to new storyID and part
  	localStorage.setItem('storyID', String(res.storyID));
  	localStorage.setItem('part', String(res.part));

  	// Get caption
	  var caption;

	  // If new story get new caption
  	if (res.caption1) {
  		// Stop listeners from being added again
	  	listeners = false;
  		// Update completed
			var $Completed = $('#Completed');
			var completed = Number($Completed.html().slice(-1)) + 1;
			$Completed.html($Completed.html().slice(0,-1) + ' ' + completed);
  		// Set local storage for captions
			localStorage.setItem('caption1', res.caption1);
			localStorage.setItem('caption2', res.caption2);
			localStorage.setItem('caption3', res.caption3);
			localStorage.setItem('caption4', res.caption4);
			// Set caption to first
			caption = res.caption1
  	}

  	// If new part get caption from local storage
  	else {
  		// Switch statement for caption
		  switch (res.part) {
		  	// Get caption from local storage
		    case 1: caption = localStorage.getItem('caption1') + '...'; break;
		    case 2: caption = '...' + localStorage.getItem('caption2') + '...'; break;
		    case 3: caption = '...' + localStorage.getItem('caption3') + '...'; break;
		    case 4: caption = '...' + localStorage.getItem('caption4'); break;
		  }
  	}	  

	  // Check if canvas should be shown by comparing part number to array
	  if (data.username === data.groupmembers[res.part-1]) {
	    var obj = {
	      part: res.part,
	      caption: caption,
	      groupnameEncoded: encodeURIComponent(data.groupname),
	      storyID: res.storyID
	    }
	    addCanvas(obj);
	    sendListener();
	  }    
	  else
	    addWaiting(res.part);

	});

}

// =====================================
// Sketch.js ===========================
// =====================================

var listeners = true;

var __slice = Array.prototype.slice;
var Sketch;
(function($) {
  $.fn.sketch = function() {
    var args, key, sketch;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this.length > 1) {
      $.error('Sketch.js can only be called on one element at a time.');
    }
    sketch = this.data('sketch');
    if (typeof key === 'string' && sketch) {
      if (sketch[key]) {
        if (typeof sketch[key] === 'function') {
          return sketch[key].apply(sketch, args);
        } else if (args.length === 0) {
          return sketch[key];
        } else if (args.length === 1) {
          return sketch[key] = args[0];
        }
      } else {
        return $.error('Sketch.js did not recognize the given command.');
      }
    } else if (sketch) {
      return sketch;
    } else {
      this.data('sketch', new Sketch(this.get(0), key));
      return this;
    }
  };
  Sketch = (function() {
    function Sketch(el, opts) {
      this.el = el;
      this.canvas = $(el);
      this.context = el.getContext('2d');
      this.options = $.extend({
        toolLinks: true,
        defaultTool: 'marker',
        defaultColor: '#000000',
        defaultSize: 5
      }, opts);
      this.painting = false;
      this.color = this.options.defaultColor;
      this.size = this.options.defaultSize;
      this.tool = this.options.defaultTool;
      this.actions = [];
      this.action = [];
      this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
      // Only run on first story
      if (this.options.toolLinks && listeners === true) {
        $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function(e) {
          var $canvas, $this, key, sketch, _i, _len, _ref;
          $this = $(this);
          $canvas = $($this.attr('href'));
          sketch = $canvas.data('sketch');
          _ref = ['color', 'size', 'tool'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            if ($this.attr("data-" + key)) {
              sketch.set(key, $(this).attr("data-" + key));
            }
          }
          if ($(this).attr('data-download')) {
            sketch.download($(this).attr('data-download'));
          }
          return false;
        });
      }
    }
    Sketch.prototype.download = function(format) {
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      return window.open(this.el.toDataURL(mime));
    };
    Sketch.prototype.set = function(key, value) {
      this[key] = value;
      return this.canvas.trigger("sketch.change" + key, value);
    };
    Sketch.prototype.startPainting = function() {
      this.painting = true;
      return this.action = {
        tool: this.tool,
        color: this.color,
        size: parseFloat(this.size),
        events: []
      };
    };
    Sketch.prototype.stopPainting = function() {
      if (this.action) {
        this.actions.push(this.action);
      }
      this.painting = false;
      this.action = null;
      return this.redraw();
    };
    Sketch.prototype.onEvent = function(e) {
      if (e.originalEvent && e.originalEvent.targetTouches) {
        e.pageX = e.originalEvent.targetTouches[0].pageX;
        e.pageY = e.originalEvent.targetTouches[0].pageY;
      }
      $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
      e.preventDefault();
      return false;
    };
    Sketch.prototype.redraw = function() {
      var sketch;
      this.el.width = this.canvas.width();
      this.context = this.el.getContext('2d');
      sketch = this;
      $.each(this.actions, function() {
        if (this.tool) {
          return $.sketch.tools[this.tool].draw.call(sketch, this);
        }
      });
      if (this.painting && this.action) {
        return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
      }
    };
    return Sketch;
  })();
  $.sketch = {
    tools: {}
  };
  $.sketch.tools.marker = {
    onEvent: function(e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          this.startPainting();
          break;
        case 'mouseup':
        case 'mouseout':
        case 'mouseleave':
        case 'touchend':
        case 'touchcancel':
          this.stopPainting();
      }
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        return this.redraw();
      }
    },
    draw: function(action) {
      var event, previous, _i, _len, _ref;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";
      this.context.beginPath();
      this.context.moveTo(action.events[0].x, action.events[0].y);
      _ref = action.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.context.lineTo(event.x, event.y);
        previous = event;
      }
      this.context.strokeStyle = action.color;
      this.context.lineWidth = action.size;
      return this.context.stroke();
    }
  };
  return $.sketch.tools.eraser = {
    onEvent: function(e) {
      return $.sketch.tools.marker.onEvent.call(this, e);
    },
    draw: function(action) {
      var oldcomposite;
      oldcomposite = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "copy";
      action.color = "rgba(0,0,0,0)";
      $.sketch.tools.marker.draw.call(this, action);
      return this.context.globalCompositeOperation = oldcomposite;
    }
  };
})(jQuery);