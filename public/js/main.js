function initMap() {


    //this will create a new google maps instance
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 39.8282, lng: -95.5795},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    map.data.setStyle({
        fillColor: 'green',
        strokeWeight: 1
    });


    /*
    This will load the state data and store it in statesObject
     */
    var xhReq = new XMLHttpRequest();
    xhReq.addEventListener("load", statesLoaded);
    xhReq.open("GET","/api/getStatesJson" , true);
    xhReq.send(null);

    function statesLoaded() {
        var statesObject = JSON.parse(xhReq.responseText);
        map.data.addGeoJson(statesObject);

        //var bounds = new google.maps.LatLngBounds();
        zoomInOnUS();


    }
    //
    //// zoom to show all the states in the map
    //var bounds = new google.maps.LatLngBounds();
    //map.data.addListener('addfeature', function(e) {
    //    statesLoaded++;
    //    //if(statesLoaded == 52){
    //    //    console.log("Zooming into USA");
    //        processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    //        map.fitBounds(bounds);
    //    //}
    //});

    //the below line is an alternative, but then you will have to load the data everytime you go
    //back out a level and we dont want to do that
    //map.data.loadGeoJson("/api/getStatesJson");



    /*
        LEVELS
        0 - The map displays all the states
        1 - The map displays the counties for a single state
        3 - The map display a single county in a single state
     */
    var level = 0;






    // If the user doesn't click on any data - rather an empty space, zoom them back out to the us
    map.addListener('click', function(event) {
        level = 0;
        deleteMapData();
        statesLoaded();

    });


    // zoom to the clicked feature
    map.data.addListener('click', function(e) {
        console.log("---------------------");
        console.log("Element that got clicked on: ");
        console.log(e.feature);


        e.feature.toGeoJson(function(areaClicked){
            map.data.overrideStyle(event.feature, {fillColor: 'red'});

            //the area clicked is a county
            if(areaClicked.properties.COUNTY){
                level = 2;
                console.log("zooming in a single county");
                zoomInOnElement(e);

            }
            else{ //the area clicked is a state
                level = 1;
                console.log("zooming in on a state: " + areaClicked.properties.NAME);
                zoomInOnElement(e);


                console.log("Querying to get counties");
                deleteMapData();
                map.data.loadGeoJson("/api/getCountiesJson?state=" + areaClicked.properties.STATE);
            }

        })

    });


    function zoomInOnElement(e){
        var bounds = new google.maps.LatLngBounds();
        processPoints(e.feature.getGeometry(), bounds.extend, bounds);
        map.fitBounds(bounds);
    }


    function processPoints(geometry, callback, thisArg) {
        if (geometry instanceof google.maps.LatLng) {
            callback.call(thisArg, geometry);
        } else if (geometry instanceof google.maps.Data.Point) {
            callback.call(thisArg, geometry.get());
        } else {
            geometry.getArray().forEach(function(g) {
                processPoints(g, callback, thisArg);
            });
        }
    }

    function deleteMapData(){
        map.data.forEach(function(feature) {
            //If you want, check here for some constraints.
            map.data.remove(feature);

        });
    }

    function zoomInOnUS(){
        console.log("zooming in on US");
        map.setZoom(4);
        map.setCenter({lat: 39.8282, lng: -95.5795});
    }


}
