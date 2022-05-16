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
	for ( let rows = size-1; rows >= 0; rows -- ) {
		for ( let cols = 0; cols < size; cols ++ ) {
			let newEl = document.createElement('div');
			newEl.className = 'grid';
			newEl.id = cols + '_' + rows;
			newEl.title = cols + ', ' + rows
			document.getElementById( 'container' ).appendChild( newEl );
		}
	}
	resizeGrids( size );
	bindClicks();
}

function resizeGrids( size ) {
	Array.from( document.querySelectorAll( '.grid' ) ).forEach( function ( grid ) {
		grid.style.width = 720 / size;
	} );
	Array.from( document.querySelectorAll( '.grid' ) ).forEach( function ( grid ) {
		grid.style.height = 720 / size;
	} );
}

function bindClicks() {
	document.querySelectorAll('.grid').forEach( element => {
		element.addEventListener( 'click', () => {
			// do something
			element.classList.add( 'wall' );
		});
	});
}

// DOM Ready
document.addEventListener( "DOMContentLoaded", () => {
	document.getElementById( 'settings-save' ).addEventListener( 'click', resetBoard );

	resetBoard();
} );
