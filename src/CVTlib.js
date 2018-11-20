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

	var z = ( n << 1 ) ^ ( n >> 31 ); // where the actual "zig-zag" occurs

	while ( z > 127 ) {

		buffer.push( ( z & 0x7F ) | 0x80 );
		z >>= 7;

	}

	buffer.push( z );

}

function fromZigzag( buffer, original ) {

	var last = 0, i, outPos = 0;

	for ( i = 0; i < buffer.length; i++ ) {

		var z = 0, shift = 0;
		var b = buffer[ i ];

		while ( b & 0x80 ) {

			z |= ( b & 0x7F ) << shift;
			shift += 7;
			b = buffer[ ++i ];

		}

		z |= b << shift;

		var v = ( z & 1 ) ? ( z >> 1 ) ^ -1 : ( z >> 1 );

		last += v;

		if ( last != original.readUInt16LE( outPos ) ) throw "error checking encoding";

		outPos += 2;

	}

}

exports.dzzEncode = function dzzEncode( file ) {

	const buffer = fs.readFileSync( file );
	console.log( 'cc', buffer.length / 2 );
	const outbuf = [];
	const length = buffer.length;

	var last = 0, i;

	for ( i = 0; i < length; i += 2 ) {

		const z = buffer.readUInt16LE( i );
		toZigzag( z - last, outbuf );

		last = z;

	}

	fs.writeFileSync( file, Buffer.from( outbuf ) );

	console.log( 'writing file: ' + file + ', compression: ' + Math.round( 100 * outbuf.length / buffer.length ) + '%' );

}

