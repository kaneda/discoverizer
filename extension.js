appAPI.ready(function($) {
  if (!appAPI.matchPages("stumbleupon.com") && !appAPI.matchPages("www.stumbleupon.com")) return;

  if (typeof console == "undefined") {
    this.console = {log: function() {}};
  }

  /*
  * DOM additions
  */
  // Include the CSS

  // Add a 5 second time delay, since Stumbleupon is now very slow
  setTimeout(
    function(){
        console.log("Loading Discoverizer");

        appAPI.resources.includeCSS('css/summarizer.css', {
          key:'intro',
          color:'#365F91',
          fontFamily:'Cambria',
          fontSize:'14pt',
          fontWeight:'bold'
      });

      var bar_html = $(appAPI.resources.get('html/summary_template.html'));

      // There are two places where we might need to append information
      var top_bar = $('#header-top');
      var use_top = false;

      if(top_bar === undefined || top_bar === null || top_bar.length === 0) {
        top_bar = jQuery("#toolbar-container .inner-container");
        use_top = true;
      }

      // Include the summarizer template
      top_bar.append(bar_html);

      console.log("Appending to top bar");

      if(use_top === true) {
        $('#summary_nav').css({'margin-top': '8px'});
        console.log("Using the top bar");
      }

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

      if(typeof(Worker) !== "undefined") {
        var script = appAPI.resources.get("js/stumble_worker.js");
        var blob = new Blob([script], {type: "text/javascript"});
        var blobURL = window.URL.createObjectURL(blob);
        var worker = new Worker(blobURL);

        worker.onmessage = function(event) {
          finishSummary(event.data);
          $(".summary_spinner").css({"display": "none"});
        };
      } else {
          alert("No web worker support, aborting");
          return;
      }

      $("#discovery_submit").bind('click', function(e) {
        e.preventDefault();
        if($("#su_username").val() && $("#su_username").val().length > 0) {
          username = $("#su_username").val();
          $(".summary_spinner").css({"display": "inline-block"});

          worker.postMessage({ "username": username });
        } else {
          alert("You must enter a username for this to work");
        }
      });
      },
      5000
  );
});
