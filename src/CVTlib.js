'use strict';

const fs = require( 'fs' );
const { execSync } = require( 'child_process' );

exports.halfMapExtent = 6378137 * Math.PI; // from EPSG:3875 definition

exports.runCmd = function runCmd( cmd ) {

	console.log( cmd );
	return execSync( cmd, { encoding: 'utf8' } );

}

exports.zoomWidth = function zoomWidth( zoom ) {

	return exports.halfMapExtent / Math.pow( 2, zoom - 1 );

}

function toZigzag ( n, buffer ) {

	var z = ( n << 1 ) ^ ( n >> ( 16 - 1 ) ); // where the actual "zig-zag" occurs

	while ( z > 127 ) {

		buffer.push( (z & 0x7F) | 0x80 );
		z >>= 7;

	}

	buffer.push( z );

}

exports.dzzEncode = function dzzEncode( file ) {

	const buffer = fs.readFileSync( file );

	const outbuf = [];
	const length = buffer.length;

	var last = 0, i;

	for ( i = 0; i < length; i += 2 ) {

		const z = buffer.readUInt16LE( i );
		toZigzag( z - last, outbuf );

		last = z;

	}

	fs.writeFileSync( file + '.dzz', Buffer.from( outbuf ) );

	console.log( 'writing file: ' + file + ', compression: ' + Math.round( 100 * outbuf.length / buffer.length ) + '%' );

}

