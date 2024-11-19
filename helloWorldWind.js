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

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
placemarkAttributes.imageSource = "flags/usa.png";
placemarkAttributes.imageScale = 0.02;
placemarkAttributes.labelAttributes.color = WorldWind.Color.WHITE;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0
);

var position = new WorldWind.Position(-15.5, -130.7, 0); // Latitude, Longitude, Altitude
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
placemark.label = "Ranger 4";
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);
wwd.addLayer(placemarkLayer);

// Add other useful layers (optional)
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
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
                alert("You clicked on: " + clickedPlacemark.label);
                // Navigate to a link (optional)
                // window.location.href = "https://example.com/landing-site";
            }
        });
    }
});
