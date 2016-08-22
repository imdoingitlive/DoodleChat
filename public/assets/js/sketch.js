// Sketch.js
var __slice = Array.prototype.slice;
(function($) {
  var Sketch;
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
            sketch.send($(this).attr('data-send'));
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
    // Custom prototype for sending
    Sketch.prototype.send = function(format) {
      // Save background
      this.context.globalCompositeOperation = 'destination-over';
      this.context.drawImage(bk, 0, 0);
      this.context.globalCompositeOperation = 'source-over';
      // Get MIME type
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      // Save dataURL
      var dataURL = this.el.toDataURL(mime);
      // Send dataURL through socket
      return socket.emit('send sketch', dataURL, 'test2');
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

// <div id="canvas-wrapper">

//   <div id="tools">
//     <a href="#colors_sketch" data-send="png" style="float: right; width: 100px;">Send</a>
//   </div>

//   <div id="canvas">
//     <img crossOrigin="annoymous" id="bk" src="https://s3.amazonaws.com/project2storyboard/test">
//     <canvas id="colors_sketch" width="800" height="300"></canvas>
//   </div>

// </div>

// Start of Custom scripting
function addCanvas() {
  // Add tools
  var $done = $('<a>').attr('href','#colors_sketch').attr('data-send','png').css('width','100px').text('Done');
  var $tools = $('<div>').attr('id','tools').append($done);
  // Add colors
  var colors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'];
  for (var i=0; i<colors.length; i++) {
    var $a = $('<a>').attr('href','#colors_sketch').attr('data-color',colors[i]).css('width','10px').css('background',colors[i]);
    $tools.append($a);
    // $tools.append("<a href='#colors_sketch' data-color='" + val + "' style='width: 10px; background: " + val + ";'></a> ");
  }

  // Add sizes
  var sizes = [3, 5, 10, 15];
  for (var i=0; i<sizes.length; i++) {
    var $a = $('<a>').attr('href','#colors_sketch').attr('data-size',sizes[i]).css('background','#ccc').text(sizes[i]);
    $tools.append($a);
  }
    //$tools.append("<a href='#colors_sketch' data-size='" + val + "' style='background: #ccc'>" + val + "</a> ");

  // Add canvas
  var $img = $('<img>').attr('crossOrigin','annoymous').attr('id','bk').attr('src','https://s3.amazonaws.com/project2storyboard/test');
  var $canvas = $('<canvas>').attr('id','colors_sketch').attr('width','800').attr('height','300');
  var $canvasHolder = $('<div>').attr('id','canvas').append($img).append($canvas);
  // Add tools and canvas to wrapper
  var $canvasWrapper = $('<div>').attr('id','canvas-wrapper').append($tools).append($canvasHolder);
  $('.container').append($canvasWrapper);
  // Start the sketching
  $('#colors_sketch').sketch();
};

 // Grab the URL of the website
var currentURL = window.location;

// Save groupname
var groupname = decodeURIComponent(currentURL.pathname.slice(8));

// AJAX get the page 
$.get(currentURL + "/story", function(res) {

  // Save story information to local storage
  localStorage.setItem("storyID",res.storyID);
  localStorage.setItem("pageID",res.pageID);
  localStorage.setItem("caption",res.caption);

  // Check if canvas should be shown
  if (res.pageID === 1)
    addCanvas();
  
});

// Socket io
var socket = io.connect();

// Send username
socket.on('new user', function(newUser) {
  var alreadyAdded = false;
  $('#group-members>p').each(function() {
    var username = $(this).text();
    if (newUser === username) {
      alreadyAdded = true;
    }
  });
  // If if not already added
  if (!alreadyAdded)
    $('#group-members').append('<p>' + newUser + '</p>');
});

// Send get request for sketch
socket.emit('get sketch', 'test');

// Show data received
socket.on('sketch url', function (data) {
  console.log(data)
});