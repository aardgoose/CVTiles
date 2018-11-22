
const lib = require( './CVTlib' );
const fs = require( 'fs' );

const dir = process.argv[ 2 ];

if ( dir !== undefined ) {

	const files = fs.readdirSync( dir );

	files.forEach( function( f ) {

		if ( f.match( '.*\.bin$' ) ) {

			console.log( f );
			lib.dzzEncode( dir + '\\' + f );

		}

	} );
}


