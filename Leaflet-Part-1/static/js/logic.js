// Define array to hold the earthquake markers
let quakeMarkers = [];

// Adding the tile layer

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(response) {

    //console.log(response);
    features = response.features;
  
    //console.log(features);
  
    // Comment this line in to render all 80,000 markers
    // let marker_limit = features.length;
    let marker_limit = 1000;
  
    for (let i = 0; i < marker_limit; i++) {
  
      let location = features[i].geometry;
      let feature = features[i];
      if(location){

        const date = new Date(feature.properties.time);
        
        if (feature.properties.tsunami == '0'){
            warning = "No";
        }
        else {
            warning = "Yes";
        }

        quakeMarkers.push(
            L.circle([location.coordinates[1], location.coordinates[0]], {
              stroke: false,
              fillOpacity: 1,
              color: "black",
              fillColor: markerColour(location.coordinates[2]),
              radius: markerSize(feature.properties.mag)
            }).bindPopup(`<h1>${feature.properties.title}</h1> <h3>Date/Time: ${date}</h3>
                         <hr> <h3>Magnitude: ${feature.properties.mag}</h3><h3>Depth: ${location.coordinates[2]}</h3>
                         <h3>Tsunami Warning: ${warning}</h3>`)
          );


      }
  
    }

    function markerSize(magnitude) {
        return magnitude * 25000;
      }

      function markerColour(depth) {
        if (depth < 10) {
            return "GreenYellow"
        }
        else if (depth < 30) {
            return "yellowgreen"
        }
        else if (depth < 50) {
            return "gold"
        }
        else if (depth < 70) {
            return "orange"
        }
        else if (depth < 90) {
            return "coral"
        }
        else {
            return "orangered"
        }
      };
      

    let earthquakes = L.layerGroup(quakeMarkers);

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

      let myMap = L.map("map", {
        center: [30, 0],
        zoom: 2,
        layers: [street, earthquakes]
      });


      
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColour(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    
  
  });


