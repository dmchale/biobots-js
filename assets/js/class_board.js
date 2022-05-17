/**
 * This is the primary class that drives our app
 */
class BioBotBoard {

    /**
     * @param pixels
     */
    constructor( pixels = 0 ) {
        // Initialize some class variables
        this.initializeVariables( pixels );

        // Do things in the DOM
        this.resizeContainer();
        this.resetBoard();
    }

    /**
     * @param pixels
     */
    initializeVariables = ( pixels = 0 ) => {
        this.pixels = ( pixels > 0 ) ? pixels : 720;
        this.resetCounts();
    }

    /**
     * Does what it says
     */
    resetCounts = () => {
        this.wall_count = 0;
        this.bad_count = 0;
        this.good_count = 0;
    }

    /**
     * Resize DOM container for the grids
     */
    resizeContainer = () => {
        document.getElementById( 'container' ).style.width = this.pixels + 'px';
        document.getElementById( 'container' ).style.height = this.pixels + 'px';
    }

    /**
     * Reset page to defaults
     */
    resetBoard = () => {
        this.resetCounts();
        this.resetResults();

        this.setUpGrids();

        this.clearBoard();
        this.drawBoard();
    }

    /**
     * Empty & hide the results pane
     */
    resetResults = () => {
        document.getElementById( 'results' ).style.display = 'none';
        document.getElementById( 'results' ).innerHTML = '';
    }

    /**
     * Define our board size and (re)instantiate the array of grids in the object
     */
    setUpGrids = () => {
        this.size = document.getElementById( 'board-size' ).value;

        // Initialize the array that will hold our grid objects
        // Loop through it to create empty 2d arrays
        this.grids = new Array( this.size );
        for ( let i = 0; i < this.size; i++ ) {
            this.grids[i] = new Array( this.size );
        }
    }

    /**
     * Unbind click handlers from the DOM elements and remove them from the DOM
     */
    clearBoard = () => {
        this.unbindClicks();
        Array.from( document.querySelectorAll( 'div.grid' ) ).forEach( function ( grid ) {
            grid.remove();
        } );
    }

    /**
     * Loop through to make our grid objects, store them in this object, and create our grid blocks in the DOM
     */
    drawBoard = () => {
        for ( let y = this.size-1; y >= 0; y -- ) {
            for ( let x = 0; x < this.size; x ++ ) {
                // Make our grid object to store in the board object
                this.grids[x][y] = new BioBotGrid( x, y );

                // Make our grid square in the DOM
                let newEl = this.buildEl( x, y );
                document.getElementById( 'container' ).appendChild( newEl );
            }
        }
        this.sizeGrids();
        this.bindClicks();
    }

    /**
     * Build a DOM element and return it
     *
     * @param x
     * @param y
     * @returns {HTMLDivElement}
     */
    buildEl = function( x, y ) {
        let newEl = document.createElement('div');
        newEl.className = 'grid';
        newEl.id = x + '_' + y;
        newEl.title = x + ', ' + y;
        return newEl;
    }

    /**
     * Resize grid elements based on their desired size
     */
    sizeGrids = function() {
        Array.from( document.querySelectorAll( '.grid' ) ).forEach( ( grid ) => {
            grid.style.width = ( this.pixels / this.size ) + 'px';
        } );
        Array.from( document.querySelectorAll( '.grid' ) ).forEach( ( grid ) => {
            grid.style.height = ( this.pixels / this.size ) + 'px';
        } );
    }

    /**
     * Handle the click event on a grid
     *
     * @param event
     */
    gridClick = (event) => {

        let el = event.target;
        let xy = el.id.split('_');
        if ( xy.length !== 2 ) { return; }

        let x = parseInt( xy[0] );
        let y = parseInt( xy[1] );

        if ( this.size-1 === x && this.size-1 === y ) {
            alert( 'You can\'t make the exit square a wall' );
            return;
        }

        if ( this.grids[x][y].isWall() ) {
            el.classList.remove( 'wall' );
            this.grids[x][y].setWall( false );
            return;
        }

        el.classList.add( 'wall' );
        this.grids[x][y].setWall( true );

    }

    /**
     * Bind click events to all grid elements
     */
    bindClicks = () => {
        document.querySelectorAll('div.grid').forEach(element => {
            element.addEventListener('click', this.gridClick);
        });
    }

    /**
     * UnBind click events to all grid elements
     */
    unbindClicks = () => {
        document.querySelectorAll('div.grid').forEach(element => {
            element.removeEventListener('click', this.gridClick);
        });
    }

    /**
     *
     */
    runTest = () => {
        this.set_wall_count();
        this.test_grids();

        document.getElementById( 'results' ).style.display = 'block';
        document.getElementById( 'results' ).innerHTML = '<h1 style="margin:0;">Results</h1>';
        document.getElementById( 'results' ).innerHTML += '<ul>';
        document.getElementById( 'results' ).innerHTML += '<li>Number of walls: ' + this.wall_count + '</li>';
        document.getElementById( 'results' ).innerHTML += '<li>Number of Good squares: ' + this.good_count + '</li>';
        document.getElementById( 'results' ).innerHTML += '<li>Number of Bad squares: ' + this.bad_count + '</li>';
        document.getElementById( 'results' ).innerHTML += '</ul>';

    }

    /**
     * does what it says
     */
    set_wall_count = () => {
        let walls = document.getElementsByClassName('wall' );
        this.wall_count = walls.length;
    }

    /**
     * Loop through all the grids and find out what's good & what's not
     */
    test_grids = () => {
        // TODO: loop through all the grids and find out what's good & what's not
    }

}