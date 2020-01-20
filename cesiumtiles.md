# Cesium Tiles

Cesium GS probvide a free to use, under a non open licence, [Cesium World Terrain tile set](https://cesium.com/content/#cesium-world-terrain) covering the entire globe at variable resolutions in a triangulated mesh format. These tiles provided using the  EPSG:4326 coordinate reference system (CRS). Overlay imagery must also use this CRS.

## Obtain an access token

To use Cesium tiles, you need to register as a user and obtain an access token from the [Cesium site](https://cesium.com).

## Configure CaveView to use Cesium terrain tiles

Two configuration properties must be set:

1. displayCRS: 'ORIGINAL'
2. cesiumAccessToken: `<your access token string>`

```javascript
	CV.UI.init( "scene", {
		surveyDirectory: "/surveys/",
		home: "/CaveView/",
		displayCRS: 'ORIGINAL',
		cesiumAccessToken: '<your cesium access token>'
	} );
```