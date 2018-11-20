'use strict';

var fs = require( 'fs' );

const lib = require( './CVTlib' );
const MAXINT = 65536;

function createRasters( tileSet, raster, mapSet ) {

	const divisions = tileSet.divisions;
	const halfMapExtent = lib.halfMapExtent;

	var n, s, e, w, zoom;
	var maxTileWidth = lib.zoomWidth( tileSet.minZoom );

	var sourceRaster = raster + '@' + mapSet;

	var b = lib.runCmd( 'r.info -g -r map=' + sourceRaster );

	const lines = b.split( '\r\n' );

	const srcInfo = {};

	lines.forEach( function ( e ) {

		const parts = e.split( '=' );

		srcInfo[ parts[ 0 ] ] = parts [ 1 ];

	} );

	const srcRes = + srcInfo.nsres;
	const maxHeight = + srcInfo.max;

	console.log( 'input resolution: ' + srcRes + ' m' );
	console.log( 'max height: ' + maxHeight + ' m' );

	for ( zoom = 20; zoom >= tileSet.minZoom; zoom-- ) {

		const resolution = lib.zoomWidth( zoom ) / divisions;
		const diff = Math.abs( srcRes - resolution ) / resolution;

		if ( diff < 0.5 ) break;

	}

	console.log( 'selected max zoom: ' + zoom );

	tileSet.maxZoom = zoom;

	const dtmScale = Math.floor( MAXINT / maxHeight );

	console.log( 'selected dtm scale: ' + dtmScale );

	tileSet.dtmScale = dtmScale;
	tileSet.encoding = "dzz";

	for ( zoom = tileSet.maxZoom; zoom >= tileSet.minZoom; zoom-- ) {

		var tileWidth = lib.zoomWidth( zoom );
		var resolution = tileWidth / tileSet.divisions; // note: tile area extended by resolution/2 all round giving 129 sample row & columns
		var offset = resolution / 2;

		n =   halfMapExtent - tileSet.minY * maxTileWidth + offset;
		s =   halfMapExtent - ( tileSet.maxY + 1) * maxTileWidth - offset;

		e = - halfMapExtent + ( tileSet.maxX + 1 ) * maxTileWidth + offset;
		w = - halfMapExtent + tileSet.minX * maxTileWidth - offset;

		// define region
		lib.runCmd( 'g.region n=' + n + ' s=' + s + ' w=' +  w + ' e=' + e + ' nsres=' + resolution + ' ewres=' + resolution );

		var tempFile = 'DTM' + zoom + 'M@' + mapSet;

		if ( zoom === tileSet.maxZoom ) {

			lib.runCmd( 'r.resamp.interp --verbose --o input=' + sourceRaster + ' output=' + tempFile );

		} else {

			// produce downres of higher resolution DTM

			lib.runCmd( 'r.resamp.stats --verbose --o input=' + sourceRaster + ' output=' + tempFile );

		}

		sourceRaster = tempFile;

		// scale by dtmScale to increase resolution as a 16b integer (smaller files and type usable by OpenGL)

		lib.runCmd( 'r.mapcalc --o "DTM' + zoom + 'X=round(' + tempFile + ' * ' + dtmScale + ')"' );

		// lib.runCmd( 'g.remove -f type=raster name=' + tempFile );

	}

	fs.writeFileSync( 'tileSetEntry.json', JSON.stringify( tileSet, null, '\r\t' ) );

}

if ( process.argv.length === 3 ) {

	const rasterComponents = process.argv[ 2 ].split ( '@' );

	if ( rasterComponents.length === 2 ) {

		var tileSetEntry = fs.readFileSync( 'tileSetEntry.json' );
		createRasters( JSON.parse( tileSetEntry ), rasterComponents[ 0 ], rasterComponents[ 1 ] );

	} else {

		console.log( 'makeRaster: invalid raster name [' + process.argv[ 2 ]  + ' ]' );

	}

} else {

	console.log( 'makeRaster: incorrect number of parameters' );
	console.log( 'makeRaster: input raster name required' );

}

// EOF