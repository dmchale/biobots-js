document.addEventListener( "DOMContentLoaded", () => {
	let my_board = new BioBotBoard( 600 );

	document.getElementById( 'settings-save' ).addEventListener( 'click', my_board.resetBoard );
	document.getElementById( 'run-test' ).addEventListener( 'click', my_board.runTest );
} );
