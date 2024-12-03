async function loadCSVToMap(csvFilePath) {
    const response = await fetch(csvFilePath);
    const csvText = await response.text();

    const rows = csvText.split("\n").map(row => row.split(","));

    // Create a Map, skipping the first 4 rows
    const csvMap = new Map();

    rows.forEach((row, index) => {
        if (index < 4 || row[0].trim() === "") return; // Skip header rows or empty keys
        const key = row[0].trim();
        const values = row.slice(1).map(val => val.trim()); // The rest of the row
        csvMap.set(key, values);
    });

    return csvMap;
}

async function loadTSVToMap(tsvFilePath) {
    const response = await fetch(tsvFilePath);
    const tsvText = await response.text();

    const rows = tsvText.split("\n").map(row => row.split("\t"));

    // Create a Map, skipping the first 4 rows
    const tsvMap = new Map();

    rows.forEach((row, index) => {
        if (index < 4 || row[0].trim() === "") return; // Skip header rows or empty keys
        const key = row[0].trim();
        const values = row.slice(1).map(val => val.trim()); // The rest of the row
        tsvMap.set(key, values);
    });

    return tsvMap;
}

function replaceDesc(landerName, map) {
    const descDiv = document.getElementById('desc')
    var data = map.get(landerName);
    var country = data[1];
    var location = data[8];
    var desc = data[11];
    var startDate = data[2];
    var type = data[0];
    descDiv.innerHTML = `<h1>${landerName}</h1><h3>Country: ${country}</h3><h3>Mission Start Date: ${startDate}</h3><h3>Type: ${type}</h3><h3>Location: ${location}</h3><p>${desc}</p>`
}


//set the yearBox value to first year in data set
var year = document.getElementById('year');
year.value = 1959;


// Create a WorldWind instance
var wwd = new WorldWind.WorldWindow("canvasOne");

// Load and apply Moon texture
var moonLayer = new WorldWind.RenderableLayer("Moon");
var moonTexture = new WorldWind.SurfaceImage(
    new WorldWind.Sector(-90, 90, -180, 180), // Covers the whole globe
    "moon8k.jpg" // Replace with the actual path to your Moon texture
);
moonLayer.addRenderable(moonTexture);

// Add the Moon layer to the WorldWind instance
wwd.addLayer(moonLayer);


//add markers to moon
//var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
//wwd.addLayer(placemarkLayer);

var placemarkYearMap = new Map();

var usaLander = new WorldWind.PlacemarkAttributes(null);
usaLander.imageSource = "flags/usa.png";
usaLander.imageScale = 0.02;
usaLander.labelAttributes.color = WorldWind.Color.WHITE;
usaLander.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0
);

var ussrLander = new WorldWind.PlacemarkAttributes(null);
ussrLander.imageSource = "flags/ussr.png";
ussrLander.imageScale = 0.05;
ussrLander.labelAttributes.color = WorldWind.Color.WHITE;
ussrLander.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0
);

var chinaLander = new WorldWind.PlacemarkAttributes(null);
chinaLander.imageSource = "flags/china.png";
chinaLander.imageScale = 0.08;
chinaLander.labelAttributes.color = WorldWind.Color.WHITE;
chinaLander.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0
);

var japanLander = new WorldWind.PlacemarkAttributes(null);
japanLander.imageSource = "flags/japan.png";
japanLander.imageScale = 0.03;
japanLander.labelAttributes.color = WorldWind.Color.WHITE;
japanLander.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0
);

var indiaLander = new WorldWind.PlacemarkAttributes(null);
indiaLander.imageSource = "flags/india.png";
indiaLander.imageScale = 0.06;
indiaLander.labelAttributes.color = WorldWind.Color.WHITE;
indiaLander.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0
);

// Add other useful layers (optional)
wwd.addLayer(new WorldWind.CompassLayer());

//add back if doing custom elevation stuff
//wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

//stars
// Add the star field layer
var starFieldLayer = new WorldWind.StarFieldLayer();
wwd.addLayer(starFieldLayer);


loadTSVToMap("data.tsv")
    .then(map => {
        console.log(map);
        map.forEach((value, key) => {
            //console.log(key)
            var position = new WorldWind.Position(parseFloat(value[6]), parseFloat(value[7]), 0); // Latitude, Longitude, Altitude
            var landerCountry = usaLander;
            switch(value[1]) {
                case "USA":
                    landerCountry = usaLander;
                    break;
                case "USSR":
                    landerCountry = ussrLander;
                    break;
                case "China":
                    landerCountry = chinaLander;
                    break;
                case "India":
                    landerCountry = indiaLander;
                    break;
                case "Japan":
                    landerCountry = japanLander;
                    break;
            }
            //parse year here
            var date = value[2];
            var date_components = date.split(" ");
            var year_str = date_components[date_components.length - 1];
            var year = parseInt(year_str);
            var placemark = new WorldWind.Placemark(position, false, landerCountry);
            placemark.label = key;
            placemark.alwaysOnTop = true;
            if (placemarkYearMap.has(year)) {
                var layer = placemarkYearMap.get(year);
                layer.addRenderable(placemark);
            } else {
                var layer = new WorldWind.RenderableLayer("" + year);
                placemarkYearMap.set(year, layer);
                layer.addRenderable(placemark);
                wwd.addLayer(layer);
            }

            //placemarkLayer.addRenderable(placemark);    

        });
        yearBox = document.getElementById('year');
        yearBox.addEventListener('input', () => {
            //console.log(`${yearBox.value}`)
            placemarkYearMap.forEach(element => {
                if (parseInt(element.displayName) <= yearBox.value) {
                    element.enabled = true;
                } else {
                    element.enabled = false;
                }
            });
        });
        placemarkYearMap.forEach(element => {
            if (parseInt(element.displayName) <= yearBox.value) {
                element.enabled = true;
            } else {
                element.enabled = false;
            }
        });
        wwd.addEventListener("click", function (event) {
            var x = event.clientX;
            var y = event.clientY;
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
        
            if (pickList.objects.length > 0) {
                pickList.objects.forEach(function (pickedObject) {
                    if (pickedObject.userObject instanceof WorldWind.Placemark) {
                        var clickedPlacemark = pickedObject.userObject;
                        replaceDesc(clickedPlacemark.label, map);
                        //alert("You clicked on: " + clickedPlacemark.label);
                        // Navigate to a link (optional)
                        // window.location.href = "https://example.com/landing-site";
                    }
                });
            }
        });
    })
    .catch(err => console.error("Error loading CSV:", err));
