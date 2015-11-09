function finishSummary(viewCountHash) {
  $("#show_more_total_button").css({"display":"inline"});
  $("#show_more_live_button").css({"display":"inline"});

  // Reset all HTML (if this isn't the first run it will matter)
  $("#summary_results #summary_summary").html("");
  $("#summary_results #summary_most").html("");
  $("#summary_results #summary_second").html("");
  $("#summary_results #show_more_total").html("");
  $("#summary_results #summary_live_summary").html("");
  $("#summary_results #summary_most_live").html("");
  $("#summary_results #summary_second_live").html("");

  viewCount = viewCountHash['viewCount'];
  liveViewCount = viewCountHash['liveViewCount'];
  totalDiscoveries = viewCountHash['totalDiscoveries'];
  totalLiveDiscoveries = viewCountHash['totalLiveDiscoveries'];
  sortedTotalArray = viewCountHash['sortedTotalArray'];
  sortedLiveArray = viewCountHash['sortedLiveArray'];
  errors = viewCountHash['errors'];

  if (totalDiscoveries === 0) {
    totalViewsHTML = "<div id='summary_header'>This user has no discoveries</div>"
    $("#summary_results #summary_summary").html(totalViewsHTML);
    $("#show_more_total_button").css('display', 'none');
    $("#show_more_live_button").css("display", "none");
    return;
  }

  var mostViewedURL, secondMostViewedURL, cURL;

  try {
    mostViewedURL = sortedTotalArray[0].url;
  } catch(err) {
    mostViewedURL = "#";
  }

  try {
    secondMostViewedURL = sortedTotalArray[1].url;
  } catch(err) {
    secondMostViewedURL = "#";
  }

  // Show this information on the screen as well
  $("#summary_results #summary_errors").html(errors.join("<br />"));
  totalViewsHTML = "<div id='summary_header'>Approximate combined views (total):</div> " + viewCount+" on " + totalDiscoveries + " discoveries<br /><br />";
  mostViewsHTML = "<div id='summary_header'>Most viewed:</div><a target='_blank' href='" + mostViewedURL + "'>" + sortedTotalArray[0].title + "</a><br />" + sortedTotalArray[0].views + " views<br /><br />";

  $("#summary_results #summary_summary").html(totalViewsHTML);
  $("#summary_results #summary_most").html(mostViewsHTML);

  if (totalDiscoveries === 1) {
    $("#show_more_total_button").css('display', 'none');
    $("#show_more_live_button").css("display", "none");
    return;
  } else if (totalDiscoveries === 2) {
    $("#show_more_total_button").css('display', 'none');
  }

  secondMostViewsHTML = "<div id='summary_header'>Second most viewed:</div><a target='_blank' href='" + secondMostViewedURL + "'>" + sortedTotalArray[1].title + "</a><br />" + sortedTotalArray[1].views + " views<br /><br />";
  $("#summary_results #summary_second").html(secondMostViewsHTML);

  moreTotalHTML = ""

  for(var j = 2; j < 20; j += 1) {
    if (sortedTotalArray[j] !== undefined) {
      try {
      cURL = sortedTotalArray[j].url;
    } catch(err) {
      cURL = "#";
    }

      moreTotalHTML += (j+1) + ". <a href='" + cURL + "' target='_blank'>" + sortedTotalArray[j].title + "</a><br />" + sortedTotalArray[j].views + " views<br />";
    }
  }

  $("#summary_results #show_more_total").html(moreTotalHTML);

  // This happens when looking at your own profile, since an external user cannot see your dead discoveries
  if(viewCount != liveViewCount) {
    $("#show_more_live_button").css("display", "block");

    liveViewsHTML = "<div id='summary_header'>Approximate combined views (live):</div> " + liveViewCount + " on " + totalLiveDiscoveries + " discoveries<br /><br />";
    mostLiveViewsHTML = "<div id='summary_header'>Most live viewed:</div><a target='_blank' href='" + sortedLiveArray[0].url + "'>" + sortedLiveArray[0].title + "</a><br />" + sortedLiveArray[0].views + " views<br /><br />";
    secondMostLiveViewsHTML = "<div id='summary_header'>Second most live viewed:</div><a target='_blank' href='" + sortedLiveArray[1].url + "'>" + sortedLiveArray[1].title + "</a><br />" + sortedLiveArray[1].views + " views<br />";
    moreLiveHTML = ""

    for(var k = 2; k < 20; k += 1) {
      if (sortedLiveArray[k] !== undefined) {
        try {
      cURL = sortedLiveArray[j].url;
    } catch(err) {
      cURL = "#";
    }

        moreLiveHTML += (k+1) + ". <a href='" + cURL + "' target='_blank'>" + sortedLiveArray[k].title + "</a><br />" + sortedLiveArray[k].views + " views<br />";
      }
    }

    $("#summary_results #summary_live_summary").html(liveViewsHTML);
    $("#summary_results #summary_most_live").html(mostLiveViewsHTML);
    $("#summary_results #summary_second_live").html(secondMostLiveViewsHTML);
    $("#summary_results #show_more_live").html(moreLiveHTML);
  } else {
    $("#show_more_live_button").css("display", "none");

    // Reset the HTML, this might not be the first run
    $("#summary_results #summary_live_summary").html("");
    $("#summary_results #summary_most_live").html("");
    $("#summary_results #summary_second_live").html("");
  }
}
