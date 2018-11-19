---
title: Tile Set Entry format
---
# Tile Set Entry format

The tile sets available to CaveView are defined in the file tileSets.json which is located in the directory specified by terrainDirectory configuration property.

The tileSets.json file contains an array of tileSetEntries which are defined as follows:

```javascript
	{
		"title": "Peak District", // title of the tile set
		"overlayMaxZoom": 19, // maximum zoom level for image overlays - may be removed in future
		"minZoom": 11, // minimum zoom level for terrain tiles
		"maxZoom": 14, // maximum zoom level for terrain tiles
		"divisions": 128, // default grid size
		"subdirectory": "<directory name", // directory containing tile files
		"dtmScale": 64,  // scaling factor between 16 bit integers and metres.
		"minX": 1013, // miminmum x tile coordinate ( at zoom level minZoom )
		"maxX": 1014, // maximum x tile coordinate ( at zoom level minZoom )
		"minY": 663, // miminmum y tile coordinate ( at zoom level minZoom )
		"maxY": 665, // maximum y tile coordinate ( at zoom level minZoom )
		"attributions": [ // text to display to credit the source of the DTM data if required
			"attribution of data line 1", 
			"attribution of data line 2" 
 		],
		"log": true // display load: [ z/x/y ] messages in console
	}
```

Note: comments are not allowed in JSON files, and are shown above to aid documentation.

