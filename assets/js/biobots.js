document.addEventListener( "DOMContentLoaded", () => {
	let my_board = new BioBotBoard( document.getElementById( 'pixels' ).value );

	document.getElementById( 'settings-save' ).addEventListener( 'click', my_board.resetBoard );
	document.getElementById( 'run-test' ).addEventListener( 'click', my_board.runTest );
} );
