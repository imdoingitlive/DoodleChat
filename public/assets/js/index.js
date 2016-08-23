$("button").on('click', function(event) {
 
  // Stop form from submitting normally
  event.preventDefault();

  // Get id
  var type = $(this).attr('id');

  // Empty message
  $('#message').empty();
 
  // Get some values from elements on the page:
  var $form = $("#credentials"),
    username = $form.find( "input[name='username']" ).val(),
    password = $form.find( "input[name='password']" ).val(),
    remember = $form.find( "input[name='remember']" ).val(),
    url = "/" + type;
 
  // Send the data using post
  var posting = $.post(url, {
    username: username,
    password: password,
    remember: remember
  });
 
  // Wait for results
  posting.done(function(res) {
    
    // Redirect if successful
    if (res.redirect)
      window.location = window.location.origin + res.redirect;
    // Else show message
    else {
      $('#message').append('<div class="alert alert-danger">' + res.message + '</div>');
    }

  });

});