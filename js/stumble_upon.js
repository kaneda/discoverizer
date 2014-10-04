// Thanks stackoveflow: http://stackoverflow.com/a/12790873
function viewSorter(a, b) {
  return b.views - a.views;
}

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

  var liveViewArray = Array();
  var totalViewArray = Array();
  
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

        totalViewArray.push({
          url: baseURL + result.data.data.items[i].view.data.url,
          title: result.data.data.items[i].view.data.title,
          views: currentViews
        })

        if(result.data.data.items[i].view.data.dead === false) {
          liveViewArray.push({
            url: baseURL + result.data.data.items[i].view.data.url,
            title: result.data.data.items[i].view.data.title,
            views: currentViews
          })
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
    msg = "There was an error between " + currentStart + " and " + (currentStart+count) + ", these entries will not be counted";
    console.log(msg);
    errors.push(msg);
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

  sortedTotalArray = totalViewArray.sort(viewSorter);
  sortedLiveArray = liveViewArray.sort(viewSorter);

  $(".summary_spinner").css({"display":"none"});
  $("#show_more_total_button").css({"display":"inline"});
  $("#show_more_live_button").css({"display":"inline"});

  console.log("Approximate combined views: " + viewCount+" on " + totalDiscoveries + " discoveries");

  // Show this information on the screen as well
  $("#summary_results #summary_errors").html(errors.join("<br />"));
  totalViewsHTML = "<div id='summary_header'>Approximate combined views (total):</div> " + viewCount+" on " + totalDiscoveries + " discoveries<br /><br />";
  mostViewsHTML = "<div id='summary_header'>Most viewed:</div><a target='_blank' href='" + sortedTotalArray[0].url + "'>" + sortedTotalArray[0].title + "</a><br />" + sortedTotalArray[0].views + " views<br /><br />";
  secondMostViewsHTML = "<div id='summary_header'>Second most viewed:</div><a target='_blank' href='" + sortedTotalArray[1].url + "'>" + sortedTotalArray[1].title + "</a><br />" + sortedTotalArray[1].views + " views<br /><br />";
  moreTotalHTML = ""

  for(var j = 2; j < 20; j += 1) {
    moreTotalHTML += (j+1) + ". <a href='" + sortedTotalArray[j].url + "' target='_blank'>" + sortedTotalArray[j].title + "</a><br />" + sortedTotalArray[j].views + " views<br />";
  }

  $("#summary_results #summary_summary").html(totalViewsHTML);
  $("#summary_results #summary_most").html(mostViewsHTML);
  $("#summary_results #summary_second").html(secondMostViewsHTML);
  $("#summary_results #show_more_total").html(moreTotalHTML);
  
  // This happens when looking at your own profile, since an external user cannot see your dead discoveries
  if(viewCount != liveViewCount) {
    liveViewsHTML = "<div id='summary_header'>Approximate combined views (live):</div> " + liveViewCount + " on " + totalLiveDiscoveries + " discoveries<br /><br />";
    mostLiveViewsHTML = "<div id='summary_header'>Most live viewed:</div><a target='_blank' href='" + sortedLiveArray[0].url + "'>" + sortedLiveArray[0].title + "</a><br />" + sortedLiveArray[0].views + " views<br /><br />";
    secondMostLiveViewsHTML = "<div id='summary_header'>Second most live viewed:</div><a target='_blank' href='" + sortedLiveArray[1].url + "'>" + sortedLiveArray[1].title + "</a><br />" + sortedLiveArray[1].views + " views<br />";
    moreLiveHTML = ""

    for(var k = 2; k < 20; k += 1) {
      moreLiveHTML += (k+1) + ". <a href='" + sortedLiveArray[k].url + "' target='_blank'>" + sortedLiveArray[k].title + "</a><br />" + sortedLiveArray[k].views + " views<br />";
    }

    $("#summary_results #summary_live_summary").html(liveViewsHTML);
    $("#summary_results #summary_most_live").html(mostLiveViewsHTML);
    $("#summary_results #summary_second_live").html(secondMostLiveViewsHTML);
    $("#summary_results #show_more_live").html(moreLiveHTML);
  } else {
    // Reset the HTML, this might not be the first run
    $("#summary_results #summary_live_summary").html("");
    $("#summary_results #summary_most_live").html("");
    $("#summary_results #summary_second_live").html("");
  }
}

