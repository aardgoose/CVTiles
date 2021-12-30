'use strict';

const fs = require( 'fs' );
const lib = require( './CVTlib' );

function makeDirectories( tileSet ) {

	const prefix = tileSet.subdirectory;

	var i;

	fs.mkdirSync( prefix );


	for ( i = tileSet.minZoom; i <= tileSet.maxZoom; i++ ) {

		fs.mkdirSync( prefix + '/' + i );

	}

}

function tileArea( mapSet, x, y, z, maxZoom, tileSet ) {

	const halfMapExtent = lib.halfMapExtent;

	var x1, y1, z1;
	var tileWidth = lib.zoomWidth( z );
	var resolution = tileWidth / tileSet.divisions; // note: tile area extended by resolution / 2 all round givving 256 sample row & columns
	var offset = resolution / 2;
	var outFile;

	var n, s, e, w;

	n = halfMapExtent - y * tileWidth + offset;
	s = halfMapExtent - ( y + 1 ) * tileWidth - offset;

	w = - halfMapExtent + x * tileWidth - offset;
	e = - halfMapExtent + ( x + 1 ) * tileWidth + offset;

	if ( z > 8 ) {

		lib.runCmd( 'g.region n=' + n + ' s=' + s + ' w=' +  w + ' e=' + e + ' nsres=' + resolution + ' ewres=' + resolution );

		outFile = tileSet.subdirectory + '\\' + z + '\\DTM-' + x + '-' + y + '.bin';

		lib.runCmd( 'r.out.bin bytes=2 input=DTM' + z + 'X@' + mapSet +  ' output=' + outFile );

		lib.dzzEncode( outFile );

	}

	if ( z < maxZoom ) {

		x1 = x * 2;
		y1 = y * 2;
		z1 = z + 1;

		tileArea( mapSet, x1,     y1,     z1, maxZoom, tileSet );
		tileArea( mapSet, x1 + 1, y1,     z1, maxZoom, tileSet );
		tileArea( mapSet, x1,     y1 + 1, z1, maxZoom, tileSet );
		tileArea( mapSet, x1 + 1, y1 + 1, z1, maxZoom, tileSet );

	}

}

// EPSG:3875 "Web Mercator" tile range

if ( process.argv.length === 3 ) {

	const mapSet = process.argv[ 2 ];

	const tileSetsText = fs.readFileSync( 'tileSetEntry.json' );
	const tileSet = JSON.parse( tileSetsText );

	var x, y;
	
	makeDirectories( tileSet );
	
	for ( x = tileSet.minX; x <= tileSet.maxX; x++ ) {
	
		for ( y = tileSet.minY; y <= tileSet.maxY; y++ ) {
	
			tileArea( mapSet, x, y, tileSet.minZoom, tileSet.maxZoom, tileSet );
	
		}
	
	}

} else {

	console.log( 'makeTiles: incorrect number of parameters' );
	console.log( 'makeTiles: mapset required' );

}
