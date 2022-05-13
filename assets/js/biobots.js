function resetBoard() {
	clearBoard();
	drawBoard();
}

function clearBoard() {
	Array.from( document.querySelectorAll( '.grid' ) ).forEach( function ( grid ) {
		grid.remove();
	} );
}

function drawBoard( size = 0 ) {
	if ( size <= 0 ) {
		size = document.getElementById( 'board-size' ).value;
	}
	for ( let rows = 0; rows < size; rows ++ ) {
		for ( let cols = 0; cols < size; cols ++ ) {
			let newEl = document.createElement('div');
			newEl.className = 'grid';
			document.getElementById( 'container' ).appendChild( newEl );
		}
	}
	resizeGrids( size );
}

function resizeGrids( size ) {
	Array.from( document.querySelectorAll( '.grid' ) ).forEach( function ( grid ) {
		grid.style.width = 720 / size;
	} );
	Array.from( document.querySelectorAll( '.grid' ) ).forEach( function ( grid ) {
		grid.style.height = 720 / size;
	} );
}

// DOM Ready
document.addEventListener( "DOMContentLoaded", () => {
	document.getElementById( 'settings-save' ).addEventListener( 'click', resetBoard );

	drawBoard();
} );