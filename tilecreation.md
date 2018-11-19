---
title: Tile Creation
---
# Tile Creation

## Requirements

* A Survex cave model, with a specified coordinate reference system (CRS). Currently the CRS of the model must be a standard [proj4](https://proj4.org/) definition. The site [spatialreference.org](http://spatialreference.org/) is useful for finding PROJ4 strings for any CRS. The CRS of a model is specified by using the Survex "*CS OUT" command in a .svx file.
* A Digital Terrain Model (DTM) covering the area of your cave model.
* **GRASS GIS**: An open source GIS package available at [grass.osgeo.org](https://grass.osgeo.org/). Tested with version 7.4.
* **Node.js**: An open source Javascript runtime available from [nodejs.org](https://nodejs.org/). Tested with version 10.13.
* The two scripts: [makeRasters.js](https://github.com/aardgoose/CVTiles/blob/master/src/makeRasters.js) & [makeTiles.js](https://github.com/aardgoose/CVTiles/blob/master/src/makeRasters.js).

## Procedure

### 1. Tile Set Definition.

To define a tile set, you must determine the specifications of the Slippy Map tiles that will cover your cave model, at a suitable zoom level. CaveView displays the tiles required to cover your model in the Javascript console as:

`load: [ zoom/x/y ] `, where zoom, x and y are the tile zoom level, x and y coordinates.

Example:
```
load: [  16/32432/21247 ] ...
load: [  16/32432/21248 ] ...
load: [  16/32433/21247 ] ...
load: [  16/32433/21248 ] ...
```

The format of the tileSet.json file that is used to define a tile set is described [here](tileformat.md).

To aid this process CaveView 1.10.1 and greater allow a prototype file tileSetEntry.json to be automatically downloaded.  To obtain this file, load your model into CaveView and display the terrain. If no terrain is available and the model has a supported CRS, a flat terrain will be displayed and a download button will be shown in the 'Terrain' tab (not supported in Internet Explorer 11). Clicking this button will download the prototype file.

### 2. DTM Reprojection

The DTM used must be in the ESPG:3875 (WebMercator) CRS. If your DTM is already in this CRS this step can be ignored.

Convert the DTM with the GDAL 'gdalwarp' tool as follows (the GDAL tools are distributed with GRASS and other GIS applications):

`gdalwap -s_srs &lt;source CRS&gt; -t_srs EPSG:3875 -r bilinear &lt;source file&gt; &lt;output file&gt;`

This produces a GeoTIFF file.

### 3. Import the DTM into GRASS

Create a GRASS location using EPSG:3875 and a empty mapset within that location.

Import the DTM produced in step 2 into this mapset, this used the command r.in.gdal which can be located with the 'File->Import raster data->Import common raster formats'.

### 4. Tile Creation

Copy the files 'makeRasters.js' and 'makeTiles.js' into an empty directory with the tileSetEntry.json file described previously.

Create GRASS raster data in the required format:

`node makeRasters.js &lt;source raster&gt;@&lt;mapset&gt;`

where &lt;source raster&gt; is the name of the raster chosen in step 3 and &lt;mapset&gt; is the name of the map set created in step 3. The node command and location will vary according to the OS in use.

This creates a set of new GRASS rasters at the required resolutions and modifies the tileSetEntry.json file as needed.

To create the individual tiles:

`node makeTiles &lt;mapset&gt;`

This will create the subdirectory as specified in the tileSetEntry usbdirectory property, and populate this with subdirectories and tiles for each zoom level.

### 5. Install the Tile Set

Copy or move the subdirectory created in step 4 to the terrainDirectory location.
Create a file tileSets.json containing the object defined in the tileSetEntry.json file in an array. If this file already exists, the the new entry to the existing array.

### 6. Test

Reload the model and ensure that the terrain is displayed correctly. Any errors are reported in the browser Javascript console.



