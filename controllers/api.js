var _ = require('lodash');
var async = require('async');
var request = require("request-promise");

//var censusLink = "http://eric.clst.org/wupl/Stuff/gz_2010_us_040_00_500k.json";
//var censusLink = "http://eric.clst.org/wupl/Stuff/gz_2010_us_outline_5m.json";
var censusStatesLink = "http://eric.clst.org/wupl/Stuff/gz_2010_us_040_00_20m.json";
var censusCountiesLink = "http://eric.clst.org/wupl/Stuff/gz_2010_us_050_00_5m.json";

//request({
//    url: censusLink,
//    json: true
//}, function (error, response, body) {
//
//    if (!error && response.statusCode === 200) {
//        console.log(body);
//        censusData = body;
//        //res.send(body) // Print the json response
//    }else{
//        //res.statusCode = 500;
//        //res.send("US Census state GeoJSON not found");
//        console.error("US State Census data fetch error");
//    }
//});

var stateOptions = {
    method: 'GET',
    uri: censusStatesLink,
    json: true // Automatically stringifies the body to JSON
};

var countyOptions = {
    method: 'GET',
    uri: censusCountiesLink,
    json: true // Automatically stringifies the body to JSON
};

var stateRequest = request(stateOptions)
    .then(function(parsedBody){
        return formatStateData(parsedBody);
    });

var countyRequest = request(countyOptions)
    .then(function(parsedBody){
        return formatCountyData(parsedBody);
    });

function formatStateData(myData){
    ////console.log(myData.features);
    //var formattedData = {};
    ////parse the census data
    //
    ////this will loop through the states
    //for(state in myData.features){
    //    //console.log(myData.features[state].properties.NAME);
    //    //console.log(myData.features[state].geometry.coordinates);
    //    var currentState = myData.features[state];
    //    var currentStateName = currentState.properties.NAME;
    //    formattedData[currentStateName] = currentState.geometry.coordinates;
    //
    //    //console.log(formattedData[currentStateName])
    //    for (coordinate in formattedData[currentStateName]){
    //        console.log(coordinate[0]);
    //    }
    //
    //
    //}v
    //
    //return formattedData;

    //var returnData = {};
    //
    //for(state in myData.features){
    //    returnData[myData.features[state].properties.NAME] = myData.features[state].geometry.coordinates;
    //}
    //console.log(returnData);
    //console.log(myData);
    return myData;
};


function formatCountyData(myData){
    console.log("received county data");
    //console.log(myData.features[0]);

    var returnData = {};
    for(state in myData.features){

        var currentState = myData.features[state].properties.STATE;
        //console.log("### current state = " + currentState);
        //if it doesnt exist, create it
        if( !returnData[currentState]){
            returnData[currentState] = {
                type: "FeatureCollection",
                features: []
            };

        }
        //append the current county to the feature list
        returnData[myData.features[state].properties.STATE].features.push(myData.features[state])
    }


    return returnData;
}
/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};


exports.getStatesJson = function(req, res, next){

    stateRequest.then(function(response){
        res.send(response);
    });


};

exports.getCountiesJson = function(req, res, next){
    console.log("Getting counties for state: " + req.query.state);
    countyRequest.then(function(response){
        console.log("sending data");
        //console.log(response);
        res.send(response[req.query.state]);
    });


};

