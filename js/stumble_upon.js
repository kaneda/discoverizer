function stumblerDiscoveries(username) {
  $(".summary_spinner").css({"display":"block"});
  
  var baseURL = "http://www.stumbleupon.com";
  var count = 50; // Fairly small, but due to the possibility of errors we don't want to miss a bunch of discoveries
  var currentStart = 0; // Start from the beginning
  var user = username; // Your StumbleUpon name

  // Initialize the vars we'll need in the script
  var totalDiscoveries = 0;
  var viewCount = 0;
  
  var totalLiveDiscoveries = 0;
  var liveViewCount = 0;
  
  var mostViews = 0;
  var mostViewedTitle = "";
  var mostViewedURL = "";
  
  var mostLiveViews = 0;
  var mostLiveViewedTitle = "";
  var mostLiveViewedURL = "";
  
  var secondMostViews = 0;
  var secondViewedTitle = "";
  var secondViewedURL = "";
  
  var secondMostLiveViews = 0;
  var secondLiveViewedTitle = "";
  var secondLiveViewedURL = "";
  
  var errors = [];

  var keepGoing = true;
  
  var resultFunction = function(result) {
    if(result.data && result.data.data && result.data.data.items && result.data.data.items.length > 0) {
      currentStart += count;
      console.log(currentStart);
      data_length = result.data.data.items.length;
      totalDiscoveries += data_length;
      for(var i = 0; i < data_length; i+=1) {
        currentViews = parseInt(result.data.data.items[i].view.data.countStumblesPretty.replace(",","").replace(".","").replace("K","000").replace("M","000000"), 10);
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

        if(result.data.data.items[i].view.data.dead === false) {
          if(currentViews > mostLiveViews) {
            secondMostLiveViews = mostLiveViews;
            secondViewedLiveTitle = mostLiveViewedTitle;
            secondViewedLiveURL = mostLiveViewedURL;
  
            mostLiveViews = currentViews;
            mostLiveViewedTitle = result.data.data.items[i].view.data.title;
            mostLiveViewedURL = baseURL + result.data.data.items[i].view.data.url;
          } else if(currentViews > secondMostLiveViews) {
            secondMostLiveViews = currentViews;
            secondLiveViewedTitle = result.data.data.items[i].view.data.title;
            secondLiveViewedURL = baseURL + result.data.data.items[i].view.data.url;
          }
          liveViewCount += currentViews;
          totalLiveDiscoveries += 1;
        }
        viewCount += currentViews;
      }
    } else {
      keepGoing = false;
    }
  };
  
  var errorResult = function(result) {
    console.log("There was an error between " + currentStart + " and " + (currentStart+count) + ", these entries will not be counted");
    errors.push("There was an error between " + currentStart + " and " + (currentStart+count) + ", these entries will not be counted");
    currentStart += count;
  };

  // We're going to do this synchronously, since it's the only action
  while(keepGoing) {
    jQuery.ajax({
      type: "GET",
      url: "http://www.stumbleupon.com/stumbler/" + user + "/likes?_count=" + count + "&_filter=discoveries&_start=" + currentStart,
      contentType: "application/json",
      dataType: "json",
      success: resultFunction,
      error:  errorResult,
      async: false
    });
  }

  $(".summary_spinner").css({"display":"none"});

  console.log("Approximate combined views: " + viewCount+" on " + totalDiscoveries + " discoveries");
  console.log("Most viewed:\n" + mostViewedTitle + "\n"+mostViewedURL + "\n" + mostViews + "\n\n");
  console.log("Second most viewed:\n" + secondViewedTitle + "\n" + secondViewedURL + "\n" + secondMostViews + "\n");

  // Show this information on the screen as well
  $("#summary_results #summary_errors").html(errors.join("<br />"));
  totalViewsHTML = "<div id='summary_header'>Approximate combined views (total):</div> " + viewCount+" on " + totalDiscoveries + " discoveries<br /><br />";
  mostViewsHTML = "<div id='summary_header'>Most viewed:</div><a target='_blank' href='" + mostViewedURL + "'>" + mostViewedTitle + "</a><br />" + mostViews + " views<br /><br />";
  secondMostViewsHTML = "<div id='summary_header'>Second most viewed:</div><a target='_blank' href='" + secondViewedURL + "'>" + secondViewedTitle + "</a><br />" + secondMostViews + " views<br /><br />";
  $("#summary_results #summary_summary").html(totalViewsHTML);
  $("#summary_results #summary_most").html(mostViewsHTML);
  $("#summary_results #summary_second").html(secondMostViewsHTML);
  
  // This happens when looking at your own profile, since an external user cannot see your dead discoveries
  if(viewCount != liveViewCount) {
    liveViewsHTML = "<div id='summary_header'>Approximate combined views (live):</div> " + liveViewCount + " on " + totalLiveDiscoveries + " discoveries<br /><br />";
    mostLiveViewsHTML = "<div id='summary_header'>Most live viewed:</div><a target='_blank' href='" + mostLiveViewedURL + "'>" + mostLiveViewedTitle + "</a><br />" + mostLiveViews + " views<br /><br />";
    secondMostLiveViewsHTML = "<div id='summary_header'>Second most live viewed:</div><a target='_blank' href='" + secondLiveViewedURL + "'>" + secondLiveViewedTitle + "</a><br />" + secondMostLiveViews + " views<br />";
    $("#summary_results #summary_live_summary").html(liveViewsHTML);
    $("#summary_results #summary_most_live").html(mostLiveViewsHTML);
    $("#summary_results #summary_second_live").html(secondMostLiveViewsHTML);
  } else {
    // Reset the HTML, this might not be the first run
    $("#summary_results #summary_live_summary").html("");
    $("#summary_results #summary_most_live").html("");
    $("#summary_results #summary_second_live").html("");
  }
}

