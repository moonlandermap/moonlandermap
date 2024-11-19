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
var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

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

var position = new WorldWind.Position(-15.5, -130.7, 0); // Latitude, Longitude, Altitude
var placemark = new WorldWind.Placemark(position, false, usaLander);
placemark.label = "Ranger 4";
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);
wwd.addLayer(placemarkLayer);

// Add other useful layers (optional)
wwd.addLayer(new WorldWind.CompassLayer());

//add back if doing custom elevation stuff
//wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

//stars
// Add the star field layer
var starFieldLayer = new WorldWind.StarFieldLayer();
wwd.addLayer(starFieldLayer);


wwd.addEventListener("click", function (event) {
    var x = event.clientX;
    var y = event.clientY;
    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

    if (pickList.objects.length > 0) {
        pickList.objects.forEach(function (pickedObject) {
            if (pickedObject.userObject instanceof WorldWind.Placemark) {
                var clickedPlacemark = pickedObject.userObject;
                replaceDesc(clickedPlacemark);
                //alert("You clicked on: " + clickedPlacemark.label);
                // Navigate to a link (optional)
                // window.location.href = "https://example.com/landing-site";
            }
        });
    }
});

function replaceDesc(landerName) {
    const descDiv = document.getElementById('desc')
    var country = ""
    var location = ""
    var desc = ""
    descDiv.innerHTML = `<h1>${landerName.label}</h1><h3>Country: ${country}</h3><h3>Location: ${location}</h3><p>${desc}</p>`
}
