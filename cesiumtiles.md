# Cesium Tiles

Cesium GS provide a free to use, under a non open licence, [Cesium World Terrain tile set](https://cesium.com/content/#cesium-world-terrain) covering the entire globe at variable resolutions in a triangulated mesh format. These tiles are provided using the EPSG:4326 coordinate reference system (CRS). Any overlay imagery must also use this CRS.

The maxmium resoluion available is dependant on the availablity of suitable DTM data and varies by country and region. These tiles are less accurate than full DTM grid tiles and may show artifacts from the tile creation process (banding etc).

Two steps are required to use Cesium terrain tiles:

## Obtain an access token

To use Cesium tiles, you need to register as a user and obtain an access token from the [Cesium site](https://cesium.com).

## Configure CaveView to use Cesium terrain tiles

Two configuration properties must be set:

1. displayCRS: 'ORIGINAL'
2. cesiumAccessToken: `<your access token string>`

This assumes that you are using a cave model that has a defined CRS (available for Survex .3d models using the *CS command) or have specified the Proj4 string for the correct CRS using the 'defaultCRS' parameter. This is shown in the following example.

The Therion .lox format does not specifiy a CRS.

Example:

```javascript
	CV.UI.init( "scene", {
		surveyDirectory: "/surveys/",
		home: "/CaveView/",
		displayCRS: "ORIGINAL",
		cesiumAccessToken: "<your cesium access token>",
		defaultCRS: "+proj=utm +zone=30 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
	} );
```