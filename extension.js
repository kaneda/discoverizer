appAPI.ready(function($) {
  if (!appAPI.matchPages("stumbleupon.com") && !appAPI.matchPages("www.stumbleupon.com")) return;
  
  /*
  * DOM additions
  */
  // Include the CSS
  appAPI.resources.includeCSS('css/summarizer.css', {
    key:'intro',
    color:'#365F91',
    fontFamily:'Cambria',
    fontSize:'14pt',
    fontWeight:'bold'
  });
  
  // Include the summarizer template
  $(appAPI.resources.get('html/summary_template.html'))
    .appendTo('#header-top');
    
  // Load the stumble discoveries JS I wrote
  appAPI.resources.includeJS('js/stumble_upon.js');
  
  /*
  * Logic
  */
  $("#summary_button").on('click', function(e) {
    e.preventDefault();
    $("#discovery_summary").slideToggle(250);
  });

  $("#show_more_total_button").on('click', function(e) {
    e.preventDefault();
    $("#show_more_total").slideToggle(250);
  });
  
  $("#show_more_live_button").on('click', function(e) {
    e.preventDefault();
    $("#show_more_live").slideToggle(250);
  });
  
  $("#discovery_submit").bind('click', function(e) {
    e.preventDefault();
    if($("#su_username").val() && $("#su_username").val().length > 0) {
      stumblerDiscoveries($("#su_username").val());
    } else {
      alert("You must enter a username for this to work");
    }
  });
});

