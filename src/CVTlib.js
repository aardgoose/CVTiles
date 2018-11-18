'use strict';

const { execSync } = require( 'child_process' );

exports.halfMapExtent = 6378137 * Math.PI; // from EPSG:3875 definition

exports.runCmd = function runCmd( cmd ) {

	console.log( cmd );
	return execSync( cmd, { encoding: 'utf8' } );

}

exports.zoomWidth = function zoomWidth( zoom ) {

	return exports.halfMapExtent / Math.pow( 2, zoom - 1 );

}