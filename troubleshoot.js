var boxPlot = function () {
  //initialize the dimensions
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 800 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    padding = 20,
    midline = (height - padding) / 2;

  //initialize the x scale
  var xScale = d3.scale.linear()
    .range([padding, width - padding]);

  //initialize the x axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  console.log("what?");
  //initialize boxplot statistics
  var data = [],
    outliers = [],
    minVal = Infinity,
    lowerWhisker = Infinity,
    q1Val = Infinity,
    medianVal = 0,
    q3Val = -Infinity,
    iqr = 0,
    upperWhisker = -Infinity,
    maxVal = -Infinity;

  console.log("who?");
  console.log(chartData);

  // set boxplot array to chartData array from translateData
  data = chartData;

  // sort data
  data = data.sort(d3.ascending);

  //calculate the boxplot statistics
  minVal = data[0];
  q1Val = d3.quantile(data, 0.25);
  medianVal = d3.quantile(data, 0.5);
  q3Val = d3.quantile(data, 0.75);
  iqr = q3Val - q1Val;
  maxVal = data[data.length - 1];
  // lowerWhisker = d3.max([minVal, q1Val - iqr])
  // upperWhisker = d3.min([maxVal, q3Val + iqr]);

  var index = 0;

  //search for the lower whisker, the mininmum value within q1Val - 1.5*iqr
  while (index < data.length && lowerWhisker == Infinity) {

    if (data[index] >= (q1Val - 1.5 * iqr)) {
      lowerWhisker = data[index];
    } else {
      outliers.push(data[index]);
    }
    index++;
  }

  index = data.length - 1; // reset index to end of array

  //search for the upper whisker, the maximum value within q1Val + 1.5*iqr
  while (index >= 0 && upperWhisker == -Infinity) {

    if (data[index] <= (q3Val + 1.5 * iqr))
      upperWhisker = data[index];
    else
      outliers.push(data[index]);
    index--;
  }

  //map the domain to the x scale +10%
  xScale.domain([0, maxVal * 1.10]);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //append the axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (height - padding) + ")")
    .call(xAxis);

  //draw verical line for lowerWhisker
  svg.append("line")
    .attr("class", "whisker")
    .attr("x1", xScale(lowerWhisker))
    .attr("x2", xScale(lowerWhisker))
    .attr("stroke", "black")
    .attr("y1", midline - 10)
    .attr("y2", midline + 10);

  //draw vertical line for upperWhisker
  svg.append("line")
    .attr("class", "whisker")
    .attr("x1", xScale(upperWhisker))
    .attr("x2", xScale(upperWhisker))
    .attr("stroke", "black")
    .attr("y1", midline - 10)
    .attr("y2", midline + 10);

  //draw horizontal line from lowerWhisker to upperWhisker
  svg.append("line")
    .attr("class", "whisker")
    .attr("x1", xScale(lowerWhisker))
    .attr("x2", xScale(upperWhisker))
    .attr("stroke", "black")
    .attr("y1", midline)
    .attr("y2", midline);

  //draw rect for iqr
  svg.append("rect")
    .attr("class", "box")
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("x", xScale(q1Val))
    .attr("y", padding)
    .attr("width", xScale(iqr) - padding)
    .attr("height", 20);

  //draw vertical line at median
  svg.append("line")
    .attr("class", "median")
    .attr("stroke", "black")
    .attr("x1", xScale(medianVal))
    .attr("x2", xScale(medianVal))
    .attr("y1", midline - 10)
    .attr("y2", midline + 10);

  //draw data as points
  svg.selectAll("circle")
    .data(csv)
    .enter()
    .append("circle")
    .attr("r", 2.5)
    .attr("class", function(d) {
      if (d.value < lowerWhisker || d.value > upperWhisker)
        return "outlier";
      else
        return "point";
    })
    .attr("cy", function(d) {
      return random_jitter();
    })
    .attr("cx", function(d) {
      return xScale(d.value);
    })
    .append("title")
    .text(function(d) {
      return "Date: " + d.date + "; value: " + d.value;
    });

  function random_jitter() {
    if (Math.round(Math.random() * 1) == 0)
      var seed = -5;
    else
      var seed = 5;
    return midline + Math.floor((Math.random() * seed) + 1);
  }

  function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
}; <
/script>

<!-- BIRST FUNCTIONS -->
<
script >
  /* BIRST FUNCTIONS - NO MODIFICATION NEEDED */

  /* FUNCTIONS */

  // FUNCTION: escapeParam
  // Replace single quotes in a string
  function escapeParam(str) {
    str = str.replace(/'/g, "\\'");
    return str;
  }

// FUNCTION: indexOf
// Lookup a particular object key in an array of objects
var indexOf = function(key, array) {
  for (var i = 0; i < array.length; i++) {
    if (key === array[i].key) {
      return i; // returns index of matching object
    }
  }
  return -1; // no match found
};

// FUNCTION: prepareFilters
// Validates and prepares the filter state
var prepareFilters = function(state, apply) {

  if (apply == null) {
    console.debug("apply is null. All filters valid.");
    return state;
  }

  // apply is empty
  if (apply.length == 0) {
    console.debug("apply is empty. All filters valid.");
    return state;
  }

  var idx = indexOf("filters", apply)
  if (idx >= 0) {
    var value = apply[idx].value;
    console.debug("value:" + value);
  }

  switch (value) {
    case "ALL":
      console.log("apply is ALL. All filters valid.");
      return state;
      break;

    case "NONE":
      console.debug("apply is NONE. No filters valid.");
      state.length = 0;
      return state;
      break;

    case "VALID":
      for (var f = 0; f < state.length; f++) {

        console.debug("STATE[" + f + "]");
        console.debug(state[f]);
        console.debug(state[f].key);

        var test = indexOf(state[f].key, apply);
        console.debug("test: " + test);

        if (test < 0) {
          // remove filter from state
          state.splice(f, 1);
          console.debug("Filter not listed as VALID. Removed.");
        }
      }
      return state;
      break;

    case "INVALID":
      for (var f = 0; f < state.length; f++) {

        console.debug(state[f]);
        console.debug(state[f].key);

        var test = indexOf(state[f].key, apply);

        if (test >= 0) {
          // remove filter from state
          state.splice(f, 1);
          console.debug("Filter listed as INVALID. Removed.");
        }
      }
      return state;
      break;

    default:
      // apply is misconfigured, then ALL assumed
      console.debug("apply was misconfigured, leaving filter state as is");
      return state;
  }

};

// FUNCTION: addDefaultFilters
// Adds default filters to the filter state
var addDefaultFilters = function(state, defaults) {

  for (var d = 0; d < defaults.length; d++) {

    var filt = defaults[d];

    // If filter does NOT exist in the current filter state
    if (indexOf(filt.key, state) < 0) {
      // Add filter to state
      console.debug("F" + d + ": Default filter not present. Add to filter state.")
      state.push(filt);
    } else {
      console.debug("F" + d + ": Default filter already exists. Ignore default filter.")
    }
  }
  return state;
};

// FUNCTION: createWhere
// Creates WHERE clause based on filter state
var createWhere = function(state) {

  var clause = "";

  // Check to see if there are current filters
  if (state.length != 0) {
    clause += " WHERE ("; // Start WHERE

    // Get the filters from the filter state array and append them to the base query
    for (var i = 0; i < state.length; i++) {

      var filter = state[i];

      // Split multiple filter values into an array of filter values
      var values = String(filter.value).split(",");

      // IF NOT the first or only param, add an AND
      if (i != 0) {
        clause += " AND ";
      }

      // Start Filter
      clause += "(";

      // Loop through filter value array and append filter params to the query
      for (var q = 0; q < values.length; q++) {

        // For each filter value, set the key and the value
        if (q === values.length - 1) {
          // Single or final filter value
          clause += "[" + filter.key + "]" + filter.operator + "'" + escapeParam(values[q]) + "'";
        } else {
          // OR for multiple filter values
          clause += "[" + filter.key + "]" + filter.operator + "'" + escapeParam(values[q]) + "' OR ";
        }

      }

      // Close Filter
      clause += ")";
    }

    // Close WHERE
    clause += ")";

    console.log("Clause: " + clause);

  } else {
    console.debug("Filter state empty. No clause created.")
  }

  // Return the finalized WHERE clause
  return clause;
};

// FUNCTION: runQuery
// Sets filters, creates and runs the query
var runQuery = function() {
  console.log("runQuery");

  // Test for applyFilters definition, if missing, define
  if (!("applyFilters" in window) || (typeof applyFilters == "undefined")) {
    var applyFilters = [];
  }

  // Test for defaultFilters definition, if missing, define
  if (!("defaultFilters" in window) || (typeof defaultFilters == "undefined")) {
    var defaultFilters = [];
  }

  // Prepare filter state for WHERE clause construction
  var state = prepareFilters(filterState, applyFilters);
  state = addDefaultFilters(state, defaultFilters);

  // Create WHERE clause
  var clause = createWhere(state);

  // Append final query params
  var query = bql + clause + bqlSuffix;

  // Verify the final query
  console.log(query);

  // Execute the query
  BirstConfig.getData(query);

};

<
/script>

<!-- QUERY DEFINITION SCRIPT -->
<
script >
  /* QUERY DEFINITION - MODIFICATION NEEDED */

  // MODIFICATION NEEDED
  // Set the value of the measure to the appropriate Birst measure name
  var measure = "[DeviceLocalDateStart: Avg: Dock Duration]";

// MODIFICATION NEEDED
// Set the value of Title to the appropriate Birst dimension name
var dimension = "[Dock.UserID]";

// MODIFICATION NEEDED
// Set the sort dimension
var sortDimension = "";
//var sortDimension = "";
var sortOrder = "ASC";

// Default query
var bql = "SELECT USING OUTER JOIN " + measure + " 'COL0' , " + dimension + " 'COL1' " + ((sortDimension != "") ? ", " + sortDimension + " 'COL2' " : "") + "FROM [ALL]";

// MODIFICATION NEEDED
// Query suffix
// Set appropriate suffix
if (sortDimension != "") {
  var bqlSuffix = " ORDER BY " + sortDimension + " " + sortOrder; // Don't forget the leading space
} else {
  var bqlSuffix = ""; // For no suffix
}


/* FILTER DEFINITION */

var filterState = []; // Create a filter state array

// MODIFICATION NEEDED
// Set the valid filters that can be applied
var applyFilters = []; // All filters are valid
//var applyFilters = [{"key":"filters","value":"ALL"}]; // All filters are valid
//var applyFilters = [{"key":"filters","value":"VALID"},{"key":"Manager.Channel Name"}]; // Listed filters are valid
//var applyFilters = [{"key":"filters","value":"INVALID"},{"key":"Manager.Channel Name"}]; // Listed filters are NOT valid
//var applyFilters = [{"key":"filters","value":"NONE"}]; // No filters are valid

// MODIFICATION NEEDED
// Default filters (for initial WHERE clause)
var defaultFilters = [];
//var defaultFilters = [{"key":"Manager.Channel","operator":"=","value":["Direct"]}];
//var defaultFilters = [{"key":"Manager.Channel","operator":"<>","value":["Direct","Partner"]}];
//var defaultFilters = [{"key":"Manager.Channel","operator":"=","value":["Direct"]},{"key":"Manager.Territory","operator":"=","value":["East"]}];
<
/script>

<!-- CHART SCRIPT -->
<
script >
  /* CHART SPECIFIC SCRIPT - MODIFICATION NEEDED TO MATCH CHART TYPE */

  // VARIABLE DEFINITIONS


  // FUNCTION DEFINITIONS
  // IMPORTANT!! translateData AND drawD3 FUNCTIONS WILL BE DIFFERENT FOR EACH CHART

  // FUNCTION: translateData
  // Data conversion function, BQL to Google Donut chart format
  var translateData = function(bqlResult) {

    /// Example chart data format goes here
    // {"title":"someTitle","subtitle":"someSubtitle","ranges":[50,100,200],"measures":[210],"markers":[250]}

    // Define array for chart data
    var dataArray = [];

    // Loop through BQL results to translate each row
    for (var i = 0, len = bqlResult.length; i < len; i++) {

      var row = bqlResult[i];

      dataArray.push(row);

    }

    // Return properly formatted data
    return dataArray;

  };

// FUNCTION: drawD3
// Draws the D3 chart
var drawD3 = function(height, width) {

  // Debugging
  console.info("drawD3");
  console.info("height: " + height);
  console.info("width: " + width);

  // Clear all objects from div
  d3.selectAll("#chartDiv > *").remove();

  //boxPlot();
};

// FUNCTION: drawChart
// Call to draw the chart
var drawChart = function() {

    // Get current dimensions of the window
    winWidth = $("body").width();
    winHeight = $("body").height();

    // Debugging
    console.info("winWidth: " + winWidth; console.info("winHeight: " + winHeight;

          clearTimeout(wait);

          wait = setTimeout(drawD3(winHeight, winWidth), 500);

        };

        <
        /script>

        <!-- EXECUTE SCRIPT -->
        <
        script >
        /* MAIN EXECUTE SCRIPT - NO MODIFICATION NEEDED */

        /* VARIABLES */

        // Get default window dimensions
        var winWidth = $("body").width();
        var winHeight = $("body").height();

        // Wait time for redraw
        var wait;

        // For passing data in expected chart format
        var chartData;

        // FUNCTION: birstEventHandler
        // Birst Event Handler
        var birstEventHandler = function(e) {

          // Birst Filter operation
          if (e.data.operation === "setFilters") {
            console.log("setFilters");

            filterState = e.data.filters;

            runQuery();
          }

          // Birst Query operation
          if (e.data.operation === "executeQueryResult") {

            console.log("executeQuery");

            // Get results of BQL query
            var bqlData = e.data.result.rows;

            // Call the result function to translate BQL query to chart format
            chartData = translateData(bqlData);

            // Draw chart
            drawChart();

          }
        };

        // FUNCTION: mainCallBack
        // Main callback function
        var mainCallBack = function() {
          console.log("mainCallBack");

          // Birst event handler declaration
          BirstConfig.callBack(birstEventHandler);

          // Run the Birst query
          runQuery();
        };

        // DOCUMENT READY
        $(document).ready(function() {
          console.log("Document loaded.");

          mainCallBack();

        });

        // FUNCTION ON RESIZE
        // Checks for window resize and calls the draw code
        $(window).resize(function() {

          drawChart();

        });
