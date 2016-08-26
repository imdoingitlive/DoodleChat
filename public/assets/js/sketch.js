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
				window.location = baseURL + "/sketch";
			}, 3000)
		}

		// If successfully added reload
		if (res.success) {
			// Force a reload
			window.location = baseURL + "/sketch";
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
			window.location = baseURL + "/sketch";
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

	// Go to group sketch
	// window.location = baseURL + "/group/" + groupname;

	// AJAX get the sketch information 
	$.getJSON(baseURL + "/group/" + groupname, function(data) {

		console.log(data)

		// Remove sun
		$container = $('.container');
		$container.empty();

		// Remove previous group members
		$('.group-members').remove();

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

		// Add group members
		var $nav = $('.nav');
		// Add divider
		var $divider = $('<li>').addClass('nav-divider group-members');
		$nav.append($divider);
		var $a = $('<a>').html('<strong>Group Members</strong>');
		var $heading = $('<li>').addClass('active group-members').append($a);
		// Add header
		$nav.append($heading);
		// Add group members to ul
		for (var i in data.groupmembers) {
			var $a = $('<a>').text(data.groupmembers[i]);
			var $li = $('<li>').addClass('group-members').append($a);
			$nav.append($li);
		}

		// Call to get page function
		getPage(data)

	});

	return false;
});

// =====================================
// SKETCH SECTION ======================
// =====================================

// =====================================
// AJAX Request after hitting Go =======
// =====================================
function getPage(data) {

	// Compute storyID currently on from completed
	var storyID = data.completed + 1;

	// Set local storage for being used when sending
	localStorage.setItem('groupname', data.groupname);
	localStorage.setItem('storyID', String(storyID));
	localStorage.setItem('part', String(data.part));

	// Save completed and part
	var completedObj = {
	  completed: data.completed
	};

	// AJAX get the page 
	$.post(baseURL + "/group/" + data.groupname +"/story", completedObj, function(res) {

	  console.log(res)

	  // Switch statement for caption
	  var caption;
	  switch (data.part) {
	    case 1: caption = res.caption1; break;
	    case 2: caption = res.caption2; break;
	    case 3: caption = res.caption3; break;
	    case 4: caption = res.caption4; break;
	  }

	  // Check if canvas should be shown by comparing part number to array
	  if (data.username === data.groupmembers[data.part-1]) {
	    var obj = {
	      part: data.part,
	      caption: caption,
	      groupnameEncoded: encodeURIComponent(data.groupname),
	      storyID: storyID
	    }
	    addCanvas(obj);
	  }    
	  else
	    addWaiting(data.part);

	  // Start socketIO
	  socketIO(data)
	  
	});
}

// =====================================
// Add canvas for drawing ==============
// =====================================
function addCanvas(obj) {

  // Add tools
  var $done = $('<a>').attr('href','#colors_sketch').attr('data-send','png').css('width','100px').text('Done');
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
  var $caption = $('<h1>').attr('id','caption').text(obj.caption);

  // Add canvas
  var $canvas = $('<canvas>').attr('id','colors_sketch').attr('width','800').attr('height','300');
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
  // Start the sketching
  $('#colors_sketch').sketch();
};

// =====================================
// Add waiting instead of canvas =======
// =====================================
function addWaiting(part) {
  $('.container').append('<h1>Waiting for group member to finish part ' + part + ' sketch</h1>');
}

// =====================================
// Socket IO callback function =========
// =====================================

// Socket io
var socket = io.connect();

function socketIO(data) {

	// Send username
	socket.on(data.groupname + 'new user', function(newUser) {
	  var alreadyAdded = false;
	  // Loop through group members
	  for (var i in data.groupmembers) {
	  	if (newUser === data.username) {
	      alreadyAdded = true;
	    }
	  }
	  // If if not already added
	  if (!alreadyAdded) {
	  	var $a = $('<a>').text(newUser);
			var $li = $('<li>').addClass('group-members').append($a);
			$('.nav').append($li);
	  }	  	
	});

	// Listen for reload
	socket.on(groupname + 'reload', function() {
	  location.reload()
	});

}

// =====================================
// Sketch.js ===========================
// =====================================
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
      if (this.options.toolLinks) {
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
          // Custom listener for sending
          if ($(this).attr('data-send')) {
            // Save gropuname, storyID, and part for img URL
            var obj = {
              groupname: localStorage.getItem('groupname'),
              storyID: localStorage.getItem('storyID'),
              part: localStorage.getItem('part')
            }
            sketch.send($(this).attr('data-send'),obj);
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
    // Add custom prototype for sending
    Sketch.prototype.send = function(format, obj) {
      // Save background if part is not 1
      if (obj.part !== '1') {
        this.context.globalCompositeOperation = 'destination-over';
        this.context.drawImage(bk, 0, 0);
        this.context.globalCompositeOperation = 'source-over';
      }
      // Get MIME type
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      // Save dataURL
      var dataURL = this.el.toDataURL(mime);
      obj.dataURL = dataURL;
      console.log(obj)
      // Send dataURL through socket
      // IMPORTANT BECAUSE IT SAVES WITH GROUPNAME, STORYID, AND PART
      return socket.emit('send sketch', obj);
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