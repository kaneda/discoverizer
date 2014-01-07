function stumblerDiscoveries(username) {
  $(".summary_spinner").css({"display":"block"})
  
  var baseURL = "http://www.stumbleupon.com"
  var count = 50; // Fairly small, but due to the possibility of errors we don't want to miss a bunch of discoveries
  var currentStart = 0; // Start from the beginning
  var user = username; // Your StumbleUpon name

  // Initialize the vars we'll need in the script
  var totalDiscoveries = 0;
  var viewCount = 0;
  var mostViews = 0;
  var mostViewedTitle = ""
  var mostViewedURL = "";
  var secondMostViews = 0;
  var secondViewedTitle = "";
  var secondViewedURL = "";
  var errors = [];

  var keepGoing = true;

  // We're going to do this synchronously, since it's the only action
  while(keepGoing) {
    jQuery.ajax({
      type: "GET",
      url: "http://www.stumbleupon.com/stumbler/"
            + user
            + "/likes?_count=" 
            + count
            + "&_filter=discoveries&_start="
            + currentStart,
      contentType: "application/json",
      dataType: "json",
      success:  function(result) {
                  if(result.data && result.data.data && result.data.data.items && result.data.data.items.length > 0) {
                    currentStart += count;
                    console.log(currentStart);
                    data_length = result.data.data.items.length
                    totalDiscoveries += data_length;
                    for(var i = 0; i < data_length; i+=1) {
                      currentViews = parseInt(result.data.data.items[i].view.data.countStumblesPretty.replace(",","").replace("K","000").replace("M","000000").replace(".",""));
                      if(currentViews > mostViews) {
                        secondMostViews = mostViews;
                        secondViewedTitle = mostViewedTitle;
                        secondViewedURL = mostViewedURL;

                        mostViews = currentViews;
                        mostViewedTitle = result.data.data.items[i].view.data.title;
                        mostViewedURL = baseURL + result.data.data.items[i].view.data.url;
                      } else if(currentViews > secondMostViews) {
                        secondMostViews = currentViews;
                        secondViewedTitle = result.data.data.items[i].view.data.title;
                        secondViewedURL = baseURL + result.data.data.items[i].view.data.url;
                      }
                      viewCount += currentViews;
                    }
                  } else {
                    keepGoing = false;
                  }
              },
      error:  function(result) {
                console.log("There was an error between " + currentStart + " and " + (currentStart+count) + ", these entries will not be counted");
                errors.push("There was an error between " + currentStart + " and " + (currentStart+count) + ", these entries will not be counted");
                currentStart += count;
              },
      async: false
    });
  }

  $(".summary_spinner").css({"display":"none"})

  console.log("Approximate combined views: " + viewCount+" on " + totalDiscoveries + " discoveries");
  console.log("Most viewed:\n" + mostViewedTitle + "\n"+mostViewedURL + "\n" + mostViews + "\n\n");
  console.log("Second most viewed:\n" + secondViewedTitle + "\n" + secondViewedURL + "\n" + secondMostViews + "\n");

  // Show this information on the screen as well
  $("#summary_results #summary_errors").html(errors.join("<br />"));
  $("#summary_results #summary_summary").html("<div id='summary_header'>Approximate combined views:</div> " + viewCount+" on " + totalDiscoveries + " discoveries<br /><br />");
  $("#summary_results #summary_most").html("<div id='summary_header'>Most viewed:</div><a target='_blank' href='" + mostViewedURL + "'>" + mostViewedTitle + "</a><br />" + mostViews + " views<br /><br />");
  $("#summary_results #summary_second").html("<div id='summary_header'>Second most viewed:</div><a target='_blank' href='" + secondViewedURL + "'>" + secondViewedTitle + "</a><br />" + secondMostViews + " views<br />");
}

