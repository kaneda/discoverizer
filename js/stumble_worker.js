// Thanks stackoverflow: http://stackoverflow.com/a/12790873
function viewSorter(a, b) {
  return b.views - a.views;
}

var host = "http://www.stumbleupon.com";

var count = 50; // Fairly small, but due to the possibility of errors we don't want to miss a bunch of discoveries
var currentStart = 0; // Start from the beginning

// Initialize the vars we'll need in the script
var totalDiscoveries = 0;
var viewCount = 0;

var totalLiveDiscoveries = 0;
var liveViewCount = 0;

var liveViewArray = Array();
var totalViewArray = Array();
var sortedTotalArray;
var sortedLiveArray;

var errors = [];

var keepGoing = true;

function resultFunction(result) {
  if(result.data && result.data.data && result.data.data.items && result.data.data.items.length > 0) {
    data_length = result.data.data.items.length;
    totalDiscoveries += data_length;
    for(var i = 0; i < data_length; i+=1) {
      stumbleViews = result.data.data.items[i].view.data.countStumblesPretty;
      currentViews = parseInt(stumbleViews.replace(",", "").replace(".", "").replace("K", "000").replace("M", "000000"), 10);

      totalViewArray.push({
        url: host + result.data.data.items[i].view.data.url,
        title: result.data.data.items[i].view.data.title,
        views: currentViews
      });

      if(result.data.data.items[i].view.data.dead === false) {
        liveViewArray.push({
          url: host + result.data.data.items[i].view.data.url,
          title: result.data.data.items[i].view.data.title,
          views: currentViews
        });

        liveViewCount += currentViews;
        totalLiveDiscoveries += 1;
      }

      viewCount += currentViews;
    }
  } else {
    keepGoing = false;
  }
}

function errorResult(result) {
  msg = "There was an error between " + currentStart + " and " + (currentStart + count) + ", these entries will not be counted";
  console.log(msg);
  errors.push(msg);
}

var lockWait = false;

// Thanks stackoverflow: http://stackoverflow.com/a/20663354
function ajax(url) {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      lockWait = false;
      if (req.status === 200) {
        return resultFunction(JSON.parse(req.responseText));
      } else {
        return errorResult(req.responseText);
      }
    }
  };

  req.open('GET', url, false);
  req.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
  req.send();
  return req;
}

function stumblerDiscoveries(username) {
  var baseURL = host + "/stumbler/" + username + "/likes?_notoolbar&_nospa=true&_nospa=true&action_trigger=userscrolldown&_count=" + count + "&_filter=discoveries&_start=";

  // Reset these, they might exist as we're loading this JS as a blob now
  currentStart = 0;

  totalDiscoveries = 0;
  viewCount = 0;

  totalLiveDiscoveries = 0;
  liveViewCount = 0;

  liveViewArray = Array();
  totalViewArray = Array();

  errors = [];

  keepGoing = true;

  while(keepGoing === true) {
    if(lockWait === false) {
    lockWait = true;

      url = baseURL + currentStart;
      ajax(url);
      currentStart += count;
    }
  }

  sortedTotalArray = totalViewArray.sort(viewSorter);
  sortedLiveArray = liveViewArray.sort(viewSorter);

  return {
    'viewCount': viewCount,
    'liveViewCount': liveViewCount,
    'totalDiscoveries': totalDiscoveries,
    'totalLiveDiscoveries': totalLiveDiscoveries,
    'sortedTotalArray': sortedTotalArray,
    'sortedLiveArray': sortedLiveArray,
    'errors': errors
  };
}

self.addEventListener("message", function(e) {
  var username = e.data.username;
  postMessage(stumblerDiscoveries(username));
}, false);
