// All Hail Ye Report
//
// The idea was this would be a print page, because try as I might I can't convince
// people that burning your screen into pressed tree pulp in 2014 is a bad idea.
// But I figured I could format it well for printing and display so it could be a
// "nice feature".
//
// Because it's very printer/designer-y, it's mostly hard coded to our data.
// Sorry - I can't figure out a generic way to do what we wanted.
//
// Imagine my face while coding up a print page. IMAGINE MY FACE.



// ****************************************
// Globals
// ****************************************
var theFilter = ["434","372","232"],        // default list of neighborhoods if none passed
    theData,
    theMetadata,                                // global for fetched raw data
    model = {};

_.templateSettings.variable = "rc";


// ****************************************
// get the year(s) for each metric
// ****************************************
function getYear(m) {
	// console.log("getYear m = "+JSON.stringify(m));
	// console.log("getYear theData = "+ JSON.stringify(theData));
	//console.log("getYear m.metric = "+JSON.stringify(m.metric));
	// console.log("m = "+JSON.stringify(m));
    switch(metricConfig[m].type) {
        case 'sum': case 'normalize':
        	// console.log('m.metric = '+JSON.stringify(m.metric));
        	// console.log("theData['r' + metricConfig[m].metric][0] = "+JSON.stringify(theData['r' + metricConfig[m].metric][0]));
            // console.log(m +" "+"m.type = "+m.type);
            // console.log("_.without(_.keys(theData['r' + metricConfig[m].metric][0]), 'id' = "+_.without(_.keys(theData['r' + metricConfig[m].metric][0]), 'id'));
            // console.log("theData['r' + metricConfig[m].metric][0] = "+theData['r' + metricConfig[m].metric][0]);
            return _.without(_.keys(theData['r' + metricConfig[m].metric][0]), 'id');
            break;
        case 'mean':
            //console.log(m +" "+"m.type = "+m.type);
            // console.log("theData['n' + metricConfig[m].metric][0]"+theData['n' + metricConfig[m].metric][0]);
            return _.without(_.keys(theData['n' + metricConfig[m].metric][0]), 'id');
            break;
    }
}

// ****************************************
// set model variable as needed from data type
// ****************************************
function setModel(m) {
    model.metricId = m;
    switch(metricConfig[m].type) {
        case 'sum':
            model.metric = theData['r' + metricConfig[m].metric];
            break;
        case 'mean':
            model.metric = theData['n' + metricConfig[m].metric];
            if (metricConfig[m].raw_label) {
                model.metricRaw = theData['r' + metricConfig[m].metric];
            }
            break;
        case 'normalize':
            model.metricRaw = theData['r' + metricConfig[m].metric];
            model.metricDenominator = theData['d' + metricConfig[m].metric];

            var calcMetric = $.extend(true, {}, model.metricRaw);
            var keys = _.without(_.keys(model.metricRaw[0]), "id");

            // this next bit can get taken out when the normalize capabilities are complete
             _.each(calcMetric, function(theval, i) {
                _.each(keys, function(key) {
                    theRaw = model.metricRaw[i][key];
                    theDemoninator = model.metricDenominator[i][key];
                    theval[key] = theRaw / theDemoninator;
                });
            });
            //console.log("calcMetric = "+JSON.stringify(calcMetric));
            model.metric = calcMetric;
            // end bit

            break;
    }
}


// ****************************************
// Create charts
// ****************************************
function createCharts() {
    // var colors = ["#5C2B2D", "#7A9993", "#959BA9", "#FAFBDD", "#C3DBDE"];
// 
    // // doughnut charts
    // $(".chart-doughnut").each(function() {
        // var data = [];
        // var selector = $(this).data("selector");
        // _.each($(this).data('chart').split(','), function(el, i) {
            // dataTypeKey = el;
            // data.push({
                // value: Number($(".data-" + el).data(selector)),
                // color: colors[i],
                // label: $(".label-" + el).data("val").replace('Race/Ethnicity - ', '')
            // });
        // });
        // ctx = document.getElementById($(this).prop("id")).getContext("2d");
        // var chart = new Chart(ctx).Doughnut(data, {
            // showTooltips: true,
            // legendTemplate : '<% for (var i=0; i<segments.length; i++){%><span style="border-color:<%=segments[i].fillColor%>" class="title"><%if(segments[i].label){%><%=segments[i].label%><%}%></span><%}%>',
            // tooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
            // multiTooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
        // });
        // $("#" + $(this).prop("id") + "-legend").html(chart.generateLegend());
    // });
// 
    // // bar charts
    // $(".chart-bar").each(function() {
        // // prep the data
        // var data = {};
        // var dataTypeKey = "";
// 
        // datasets = [
            // {
                // fillColor: "rgba(151,187,205,0.5)",
                // strokeColor: "rgba(151,187,205,0.8)",
                // data: [],
                // label: "Selected " + neighborhoodDescriptor + "s"
            // },
            // {
                // fillColor: "rgba(220,220,220,0.5)",
                // strokeColor: "rgba(220,220,220,0.8)",
                // data: [],
                // label: "County"
            // }
        // ];
// 
        // data.labels = $(this).data('labels').split(",");
// 
        // _.each($(this).data('chart').split(','), function(el) {
            // datasets[0].data.push($(".data-" + el).data("selected-val"));
            // datasets[1].data.push($(".data-" + el).data("county-val"));
            // dataTypeKey = el;
        // });
// 
        // if (!$.isNumeric(datasets[0].data[0])) {
            // datasets.shift();
        // }
// 
        // data.datasets = datasets;
// 
        // ctx = document.getElementById($(this).prop("id")).getContext("2d");
        // var chart = new Chart(ctx).Bar(data, {
            // showTooltips: true,
            // legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="border-color:<%=datasets[i].strokeColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>',
            // scaleLabel: "<%= dataFormat(dataRound(Number(value), 2), '" + dataTypeKey + "') %>",
            // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= dataPretty(value, '" + dataTypeKey + "') %>",
            // multiTooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
        // });
// 
        // $("#" + $(this).prop("id") + "-legend").html(chart.generateLegend());
// 
    // });
// 
    // // line charts
    // $(".chart-line").each(function() {
        // var m = $(this).data("chart"),
            // npaMean = [],
            // countyMean = [];
// 
        // setModel(m);
        // keys = getYear(m);
// 
        // // stats
        // _.each(keys, function(year) {
            // countyMean.push(dataCrunch(year));
            // npaMean.push(dataCrunch(year, theFilter));
            // dataTypeKey = m;
        // });
// 
        // // make sure selected stuff really has a value
        // _.each(npaMean, function(el) {
            // if (!$.isNumeric(el)) {
                // npaMean = null;
            // }
        // });
// 
        // var data = {
            // labels: [],
            // datasets: [
                // {
                    // fillColor: "rgba(151,187,205,0.2)",
                    // strokeColor: "rgba(151,187,205,1)",
                    // pointColor: "rgba(151,187,205,1)",
                    // pointStrokeColor: "#fff",
                    // data: [],
                    // label: "Selected " + neighborhoodDescriptor + "s"
                // },
                // {
                    // fillColor: "rgba(220,220,220,0.2)",
                    // strokeColor: "rgba(220,220,220,1)",
                    // pointColor: "rgba(220,220,220,1)",
                    // pointStrokeColor: "#fff",
                    // data: [],
                    // label: "County"
                // }
            // ]
        // };
// 
        // _.each(countyMean, function(el, i) {
            // data.labels.push(keys[i].replace("y_", ""));
            // if (npaMean !== null) { data.datasets[0].data.push(Math.round(npaMean[i] * 10) / 10); }
            // data.datasets[1].data.push(Math.round(el * 10) / 10);
        // });
// 
        // // remove select mean if no values are there
        // if (!npaMean || npaMean === null) { data.datasets.shift(); }
// 
        // ctx = document.getElementById($(this).prop("id")).getContext("2d");
        // var chart = new Chart(ctx).Line(data, {
            // showTooltips: true,
            // legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="border-color:<%=datasets[i].strokeColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>',
            // scaleLabel: "<%= dataFormat(dataRound(Number(value), 2), '" + m + "') %>",
            // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= dataPretty(value, '" + dataTypeKey + "') %>",
            // multiTooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
        // });
// 
        // if ($("#" + $(this).prop("id") + "-legend").length > 0) {
            // $("#" + $(this).prop("id") + "-legend").html(chart.generateLegend());
        // }
    // });
}

// ****************************************
// Return the nth instance of a substring
// ****************************************
function GetSubstringIndex(str, substring, n) {
    var times = 0, index = null;
    while (times < n && index !== -1) {
        index = str.indexOf(substring, index+1);
        times++;
    }
    return index;
}
// ****************************************
// Create the metric blocks and table values
// ****************************************

var featureIndex = 0;


function createData(featureSet) {
	var template = _.template($("script.template-metric").html()), categories = _.uniq(_.pluck(metricConfig, 'category'));
	//console.log("categories = " + JSON.stringify(categories));
	model.selected = featureSet;
	var lineCharts = [];
	var metricMetadatas = [];
	var tdata = {
		"id" : "",
		"title" : "",
		"year" : "",
		"typeValues" : "",
		"about" : "",
		"important" : "",
		"additionalResources" : "",
		"selectedVal" : "",
		"selectedRaw" : "",
		"selectedNVal" : "",
		"countyVal" : "",
		"countyRaw" : "",
		"countyNVal" : ""
	};
	var m;
	_.each(categories, function(dim) {
		// var theTable = $(".table-" + feature + "-" + dim.toLowerCase().replace(/\s+/g, "-") + " tbody");
		var theTable = $(".table-" + dim.toLowerCase().replace(/\s+/g, "-") + " tbody");
		var theMetrics = _.filter(metricConfig, function(el) {
			return el.category.toLowerCase() === dim.toLowerCase();
		});
		//console.log("theMetrics = " + JSON.stringify(theMetrics));
		_.each(theMetrics, function(val) {
			metricMetadatas.push(val);
			m = 'm' + val.metric;
			tdata.id = m;
			var aboutHTML;
			var importance;
			var metricTitle;
			var additionalResourcesLinks;
			var additionalResourcesHTML;
			$.ajax({
				url : 'data/meta/' + m + '.html',
				type : 'GET',
				dataType : 'text',
				success : function(data) {
					//console.log("data = " + JSON.stringify(data));
					metricTitle = data.substring(GetSubstringIndex(data, '</p>', 1), GetSubstringIndex(data, '<p', 1) + 3);
					tdata.title = metricTitle;
					// console.log("GetSubstringIndex(data, '<h3', 3) = "+GetSubstringIndex(data, '<h3', 3));
					aboutHTML = data.substring(GetSubstringIndex(data, '</h3>', 2) + 5, GetSubstringIndex(data, '<h3', 3));
					tdata.about = aboutHTML;
					// console.log("data = " + data);
					// console.log("aboutHTML = " + aboutHTML);
					importance = data.substring(GetSubstringIndex(data, '</p>', 2), GetSubstringIndex(data, '<p', 2) + 3);
					tdata.important = importance;
					//console.log("importance = "+importance);
					//var additionalResourcesHTML = data.substring(GetSubstringIndex(data, '</tbody>', 1),GetSubstringIndex(data, '<tbody', 1));
					additionalResourcesHTML = "<table><thead></thead>" + data.substring(GetSubstringIndex(data, '</tbody>', 1) + 8, GetSubstringIndex(data, '<tbody', 1)) + "</body>";
					// console.log("additionalResourcesHTML = " + additionalResourcesHTML);
					var parser = new DOMParser();
					var parserDoc = parser.parseFromString(additionalResourcesHTML, "text/html");
					//var table = parserDoc.getElementsByTagName('table');
					var tableTRs = parserDoc.getElementsByTagName("tr");
					var trTDs;
					var additionalResourceLink;
					additionalResourcesLinks = "";
					//console.log("outside");
					for (var i = 0; i < tableTRs.length; i++) {
						//console.log("tableTRs iteration = " + i);
						//console.log('tableTRs[i].innerHTML = '+tableTRs[i].innerHTML);
						parserDoc = parser.parseFromString("<table><tr>" + tableTRs[i].innerHTML + "</tr></table>", "text/html");
						trTDs = parserDoc.getElementsByTagName("td");
						//console.log('trTDs[0].innerHTML = '+trTDs[0].innerHTML);
						additionalResourceLink = "<div>" + [trTDs[0].innerHTML.slice(0, 3), 'title="' + trTDs[1].innerHTML + '"', trTDs[0].innerHTML.slice(3)].join('') + "</div>";
						//console.log("additionalResourceLink = "+ additionalResourceLink);
						additionalResourcesLinks += additionalResourceLink;
						//console.log("additionalResourcesLinks = "+ i + " "+ additionalResourcesLinks);
						// for (var ii=0; ii<trTDs.length; ii++){
						// console.log('trTDs[i].innerHTML = '+trTDs[i].innerHTML);
						// }
					}
					tdata.additionalResources = additionalResourcesLinks;
				},
				error : function(error, status, desc) {
					//console.log(status, desc);
				},
				complete : function() {
					theTable.append(template(tdata));

					// make multidimensional array of IDs metricFields, values and years 
					// graphingObject = [
						// featureID, field, [years,...],[values,...] 
					// ]
					// loop over each feature{
						// populate metricField, feature id, years, values
					// }
					// loop over each object in graphingObject{
						// ajax call to graph 
					// }
					
					//console.log("metricMetadatas = " + JSON.stringify(metricMetadatas));
					var graphingObject = [], metricObject = [], metricField, featureObject = [], featureID, metricYears = [],metricValues;
					_.each(metricMetadatas, function(metricMetadata) {
					
						// console.log("JSON.stringify(metricMetadata) = "+JSON.stringify(metricMetadata));
						var metricName = "m" + metricMetadata.metric;
						setModel(metricName);
						metricField = metricName;
						//console.log("metricMetadata getYear");
						var keys = getYear(metricName);
						//console.log("keys = "+keys);
						var yearTDs = "";
						var types = [];
						model.metricID = metricMetadata;
						model.prefix = getPrefix(metricName);
						model.suffix = getSuffix(metricName);
						
						_.each(featureSet, function(feature) {
							var theYear;
							var yeariii;
							var iii;
							var years = [];
							var featureValue;
							var featureNValue;
							var featureValues = [];
							var selectedValues = [];
							var countyValues = [];
							metricValues = [];
							featureID = feature;
							
							for ( iii = 0; iii < keys.length; iii++) {
								theYear = keys[iii];
								model.years = keys;
								//*****Can I use dataPretty here?
								//console.log("model.metric = " + JSON.stringify(model.metric));
								// console.log("feature = " + JSON.stringify(feature));
								// console.log("theYear = " + theYear);
								featureNValue = metricValuesByIDYear(model.metric, feature, theYear, metricMetadata);
								// console.log("featureNValue = " + featureNValue);
								// console.log("metricMetadata = " + JSON.stringify(metricMetadata));
								featureValue = dataPretty(featureNValue, metricName);
								//console.log("Metric = " + metricMetadata + " theYear = "+theYear+ " feature = "+feature+" featureValue = " + featureValue);
								yeariii = keys[iii].replace('y_', '');
								// console.log("yeariii = " + yeariii);
								tdata.countyNVal = dataCrunch('y_' + yeariii);
								tdata.selectedNVal = dataCrunch('y_' + yeariii, theFilter);
								//console.log("val.suffix = " + val.suffix);
								model.suffix = metricMetadata.suffix;
								if (model.suffix == "%") {
									featureValue = dataPretty(featureNValue * 100, metricName);
									//console.log("val.suffix = " + val.suffix);
									featureNValue = featureNValue * 100;
								}
								years.push(yeariii);
								//console.log("featureNValue, metricMetadata.decimals = " + featureNValue + ", " + metricMetadata.decimals);
								if (metricMetadata.decimals > 1) {
									//console.log("metricField = " + metricField + " featureNValue = " + featureNValue + " metricMetadata.decimals = "+ metricMetadata.decimals);
									featureValues.push(dataRound(featureNValue, metricMetadata.decimals));
									//console.log("metricField = " + metricField + " featureValue = " + featureValue + " metricMetadata.decimals = "+ metricMetadata.decimals);
									featureValue = dataRound(featureNValue, metricMetadata.decimals);
									selectedValues.push(dataRound(tdata.selectedNVal, metricMetadata.decimals));
									countyValues.push(dataRound(tdata.countyNVal, metricMetadata.decimals));
								}
								metricValues.push(featureValue);
								metricYears = years;
								//var graphingObject = [], metricObject = [], metricField, featureObject = [], featureID, metricYears = [],metricValues;
								
								console.log(" metricField, featureID, metricYears, featureValues = "+metricField+", "+ featureID+", "+ metricYears+", "+metricValues);
							}
							featureObject.push (featureID, metricYears, metricValues);
							console.log("featureObject = " + featureObject);
								
							if (years.length > 1) {
								lineChartObject.years = years;
								lineChartObject.featurevalues = featureValues;
								lineChartObject.selectedvalues = selectedValues;
								lineChartObject.countyvalues = countyValues;
								lineCharts.push(lineChartObject);
							}
							if (iii > 0) {
								//createLineChart(lineCharts);
							}
						});
					});
				}
			});
		});
	});
}





// ****************************************
// Initialize the map
// Neighborhoods labled with leaflet.label
// ****************************************
function createMap(data){
    // set up map
    L.Icon.Default.imagePath = './images';
    var smallMap = L.map("smallmap", {
            attributionControl: false,
            zoomControl: false,
            touchZoom: false
        }).setView(mapGeography.center, mapGeography.defaultZoom - 1);
    
    // Disable drag and zoom handlers.
    smallMap.dragging.disable();
    smallMap.touchZoom.disable();
    smallMap.doubleClickZoom.disable();
    smallMap.scrollWheelZoom.disable();
    var selectedFeatures = [], 
    selectedIDs = [];
    // add data filtering by passed neighborhood id's
    geom = L.geoJson(topojson.feature(data, data.objects[neighborhoods]), {
        style: {
            "color": "#FFA400",
            "fillColor": "#FFA400",
            "weight": 2,
            "opacity": 1
        },
        filter: function(feature, layer) {
            return theFilter.indexOf(feature.id.toString()) !== -1;
        },
        onEachFeature: function(feature, layer) {
            selectedFeatures.push(feature);
            selectedIDs.push(feature.id);
        }
    }).addTo(smallMap);
    //console.log("geom.style = " + geom);
    // add base tiles at the end so no extra image grabs/FOUC
    L.tileLayer(baseTilesURL).addTo(smallMap);
    
    //console.log("selectedFeature = "+JSON.stringify(selectedFeatures[0]));
    //console.log("selectedIDs = "+selectedIDs[0]+","+selectedIDs[1]);
    // scaffold in category pages
    pageTemplates(geom,selectedFeatures,selectedIDs);
}

function createLargeMaps(geom){
	// onEachFeature: function(feature, layer) {
            // var pt = L.geoJson(feature).getBounds().getCenter();
            // label = new L.Label();
            // label.setContent(feature.id.toString());
            // label.setLatLng(pt);
            // largeMap.showLabel(label);
        // }
    // var largeMap = L.map("largemap", {
        // attributionControl: false,
        // zoomControl: false,
        // touchZoom: false
    // });
	// // Disable drag and zoom handlers.
    // largeMap.dragging.disable();
    // largeMap.touchZoom.disable();
    // largeMap.doubleClickZoom.disable();
    // largeMap.scrollWheelZoom.disable();
//     
    // // zoom large map
    // largeMap.fitBounds(geom.getBounds());
    // // add base tiles at the end so no extra image grabs/FOUC
    // L.tileLayer(baseTilesURL).addTo(largeMap);
}
// ****************************************
// get pages in for data categories
// ****************************************
function pageTemplates(layer,geoms,IDs) {
    var template = _.template($("#template-category").html()),
    	// mapTemplate = _.template($("#template-bigMap").html()),
        categories = _.uniq(_.pluck(metricConfig, 'category')),
        pages = $(".category-pages");
        
        //console.log("categories = "+ categories);
		
		//console.log('geoms = '+JSON.stringify(geoms));
	// var mapEle;
	// var ticker = 0;
	// _.each(geoms, function(geom){
		// var geomID = geom.id;	
// 	 	
	 	// var poly = L.polygon(geom.geometry.coordinates);
		// //console.log('L.poly.getbounds = '+ JSON.stringify(poly.getBounds()));
		// var polyBounds = poly.getBounds();
		// //console.log('polyBounds._southWest.lat = '+polyBounds._southWest.lat);
		// var swLng = polyBounds._southWest.lat,
		// swLat = polyBounds._southWest.lng,
		// neLng = polyBounds._northEast.lat,
		// neLat = polyBounds._northEast.lng;
		//console.log('swLat = '+swLat);
		//console.log('swLng = '+swLng);
		//console.log('neLat = '+neLat);
		//console.log('neLng = '+neLng);
		
		// mapEle = document.createElement('div');
// 	 	
		// mapEle = document.createElement('div');
		// // mapEle.setAttribute("id", "mapPage");
		// mapEle.setAttribute("class", "page page-category");
// 		
		// mapEle.innerHTML = '<div><h3>'+geomID+'</h3></div><div class="row text-center"><div id="bigMap'+ticker+'"></div></div>';
		// pages.append(mapEle);
// 		
		// var bigMap = document.getElementById('bigMap'+ticker);
		// bigMap.style.width = '670px';
		// bigMap.style.height = '900px';
		// bigMap.style.margin = 'auto';
// 		
		// //console.log("bigmap.id = " + bigMap.id);
		// var largeMap = L.map('bigMap'+ticker,{
	        // attributionControl: false,
	        // zoomControl: false,
	        // touchZoom: false
	    // });
	    // largeMap.fitBounds([[swLat,swLng],[neLat,neLng]]);
// 		
	    // // largeMp.fitBounds(polyBounds);
	    // largeMap.dragging.disable();
	    // largeMap.touchZoom.disable();
	    // largeMap.doubleClickZoom.disable();
	    // largeMap.scrollWheelZoom.disable();
		// var feature = L.geoJson(geom, {
	        // style: {
	            // "color": "#FFA400",
	            // "fillColor": "rgba(255,164,0,0.3)",
	            // "weight": 2,
	            // "opacity": 1
	        // },
	        // filter: function(feature, layer) {
	            // return theFilter.indexOf(feature.id.toString()) !== -1;
	        // },
	        // onEachFeature: function(feature, layer) {
	            // var pt = L.geoJson(feature).getBounds().getCenter();
	            // label = new L.Label();
	            // label.setContent(feature.id.toString());
	            // label.setLatLng(pt);
	            // largeMap.showLabel(label);
	        // }
	    // }).addTo(largeMap);
		// L.tileLayer(baseTilesURL).addTo(largeMap);
		
		//console.log("layoutMap.id = "+mapEle.id);
	 	// ticker ++;
	 	_.each(categories, function(el) {
	        cat = el.toLowerCase();
	        //console.log("cat = " + cat);
	
	        // get vis if available
	        if ($("#template-vis-" + cat).length > 0) {
	            vis = _.template($("#template-vis-" + cat.replace(/\s+/g, "-")).html());
	        } else {
	            vis = "";
	        }
	
	        // drop in category page
	        pages.append(template({ "vis": vis, "category": cat}));
	    });
	 // });
}
function lineChartData(lineChartLegend) {
    //console.log("lineChartLegend = " + JSON.stringify(lineChartLegend));
    var featureValues = lineChartLegend.featurevalues,
    	npaMean = lineChartLegend.selectedvalues,
        countyMean = lineChartLegend.countyvalues,
        keys = _.without(_.keys(model.metric[0]), "id");
	// get stats
    // _.each(lineChartLegend.year, function(year) {
        // countyMean.push(dataCrunch(year));
       	// npaMean.push(dataCrunch(year, lineChartLegend.selectedvalues));
       	// featureValues.push(dataCrunch(year, model.featurevalues));
    // });
    //console.log("countyMean = " + countyMean);
	//console.log("npaMean = "+npaMean);
    //console.log("featureValues = "+featureValues);
    // console.log("model.fgeatureValue = "+model.featurevalues);
    // make sure selected stuff really has a value
    // _.each(npaMean, function(el) {
        // if (!$.isNumeric(el)) {
            // npaMean = null;
        // }
    // });
//     
    // _.each(featureValues, function(el) {
        // if (!$.isNumeric(el)) {
            // featureValues = null;
        // }
    // });

    var data = {
        labels: [],
        datasets: [
        	{
                label: 'Feature',
                fillColor : "rgba(239,223,0,0.2)",
                strokeColor : "rgba(239,223,0,1)",
                pointColor : "rgba(239,223,0,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(239,223,0,1)",
                data :[]
            },
            {
                label: 'Selected',
                fillColor : "rgba(81,164,75,0.2)",
                strokeColor : "rgba(81,164,75,1)",
                pointColor : "rgba(81,164,75,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(81,164,75,1)",
                data :[]
            },
            {
                label: "County",
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : []
            }
        ]
    };
	//console.log("npaMean = "+npaMean);
	
	//console.log("featureValues = "+featureValues);
	_.each(featureValues, function(el, i){
		//console.log("each featureValues");
		//console.log("model.metricID el = "+el);
		data.datasets[0].data.push(el);
	});
	_.each(npaMean, function(el, i){
		//console.log("each NPAmean");
		if (npaMean !== null) { data.datasets[1].data.push(Math.round(npaMean[i] * 10) / 10); };
    });
    //console.log("countyMean = "+countyMean);
    _.each(countyMean, function(el, i) {
		//console.log("each Countymean");
        data.labels.push(lineChartLegend.years[i].replace("y_", ""));
        data.datasets[2].data.push(Math.round(el * 10) / 10);        
    });
    // console.log(model.metricID + " " + model.feature);
	// console.log("data.datasets[0;1;&2].data = "+ data.datasets[0].data +"; "+data.datasets[1].data +";& "+data.datasets[2].data);
    // remove select mean if no values are there
    if (!npaMean || npaMean === null) { data.datasets.shift(); }
	//console.log("data = "+ JSON.stringify(data));
    return data;
}
var thePrefix, theSuffix;
function createLineChart(lineCharts) {
    // console.log("createLineChart id = " + id);
   	// console.log("createLineChart label = " + label);
   	// console.log("createLineChart model.metricID = " + model.metricId);
   	// console.log("createLineChart value = " + value);
   	// console.log("createLineChart title = " + title);
   	//console.log("lineCharts = "+ JSON.stringify(lineCharts));
   	// dataFormat(dataRound(Number(value), 2), model.metricId);
	_.each(lineCharts, function(lineChartLegend, i){   	
		thePrefix = lineChartLegend.prefix;
        theSuffix = lineChartLegend.suffix;
	    if (window.myLine) { window.myLine.destroy(); }
	    lineChartData(lineChartLegend);
	    //console.log('linchartCreate id =  '+"lineChartLegend"+lineChartLegend.id+lineChartLegend.feature);
	    var ctx = document.getElementById("lineChartLegend"+lineChartLegend.id).getContext("2d");
	    window.myLine = new Chart(ctx).Line(lineChartData(lineChartLegend), {
	        responsive: true,
	        maintainAspectRatio: true,
	        showTooltips: true,
	        animation: true,
	        animationSteps: 1,
	        tooltipEvents: ["mousemove", "touchstart", "touchmove"],
	        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
	        multiTooltipTemplate: "<%= value %>",
	        //scaleLabel: "<%= '$'+value+'%'%>",
	        scaleLabel: '<%= thePrefix + value + theSuffix %>',
	        //scaleLabel: "<%console.log('model.metricId = '+model.metricId+' dataFormat(dataRound(Number(value), 2), model.metricId)  = '+dataFormat(dataRound(Number(value), 2), model.metricId) );%><%= dataFormat(dataRound(Number(value), 2), model.metricId) %>",
	        legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="background-color:<%=datasets[i].strokeColor%>; margin-right: 5px">&nbsp;&nbsp;&nbsp;</span><span class="title"  style="margin-right: 5px"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>'
	    	//legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
	    });
	    $("#chartLegend"+lineChartLegend.id+lineChartLegend.feature).html(myLine.generateLegend());
	});
}
// ****************************************
// Document ready kickoff
// ****************************************
$(document).ready(function() {
    
    // $.ajax({
		// url : 'data/meta/merge_cb.json',
		// type : 'GET',
		// dataType : 'json',
		// success : function(data) {
			// theMetadata = data;
		// }
	// });
    
    // fetch map data and make map
    $.get(activeTOPOJSON, function(data) {
        createMap(data);
    });
    
    // ye customizable subtitle
    $(".subtitle").on("click", function() { $(this).select(); });

    // grab the neighborhood list from the URL to set the filter
    if (getURLParameter("n") !== "null") {
    	//console.log('theFilter = '+theFilter);
        theFilter = getURLParameter("n").split(",");
    }

    // populate the neighborhoods list on the first page
    // if too long to fit one one line it lists the number of neighborhoods instead
    var theNeighborhoods = theFilter.join(", ");
    if (theNeighborhoods.length > 85) {
        theNeighborhoods = theFilter.length;
        $(".neighborhoods").text(theNeighborhoods.commafy() + " " + neighborhoodDescriptor + "s");
    } else {
        $(".neighborhoods").text(neighborhoodDescriptor + ": " + theNeighborhoods.commafy());
    }

    // fetch the metrics and make numbers and charts
    //console.log("activeMergeJSON = " + activeMergeJSON);
    $.get(activeMergeJSON, function(data) {
    	//console.log("activeMergeJSON data = "+JSON.stringify(data));
        theData = data;
        // console.log("theData = "+ JSON.stringify(theData));
        createData(theFilter);
        createCharts();
    });

});
