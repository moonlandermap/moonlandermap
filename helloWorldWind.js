// Create a WorldWind instance
var wwd = new WorldWind.WorldWindow("canvasOne");

// Load and apply Moon texture
var moonLayer = new WorldWind.RenderableLayer("Moon");
var moonTexture = new WorldWind.SurfaceImage(
    new WorldWind.Sector(-90, 90, -180, 180), // Covers the whole globe
    "moon.jpg" // Replace with the actual path to your Moon texture
);
moonLayer.addRenderable(moonTexture);

// Add the Moon layer to the WorldWind instance
wwd.addLayer(moonLayer);

// Add other useful layers (optional)
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
