/**
 * This is the primary class that drives our app
 */
class BioBotBoard {

    state = 'waiting';
    img_arrow = "url('assets/img/arrow-80.webp')";
    img_arrow_exit = "url('assets/img/arrow-80-exit.webp')";
    wall_count = 0;
    bad_count = 0;
    good_count = 0;

    /**
     *
     */
    constructor() {
        this.resetBoard();
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
        this.pixels = document.getElementById( 'pixels' ).value;
        document.getElementById( 'container' ).style.width = this.pixels + 'px';
        document.getElementById( 'container' ).style.height = this.pixels + 'px';
    }

    /**
     * Enforce min/max values of container field value
     *
     * @returns {boolean}
     */
    testContainerSize = () => {
        let el = document.getElementById('pixels');
        let min = parseInt( el.attributes.getNamedItem('min').value );
        let max = parseInt ( el.attributes.getNamedItem('max').value );

        if ( parseInt( el.value ) < min || parseInt( el.value ) > max ) {
            alert( 'Container size must be between ' + min + ' and ' + max + ' pixels.' );
            return false;
        }

        return true;
    }

    /**
     * Reset page to defaults
     */
    resetBoard = () => {
        if ( ! this.testContainerSize() ) { return; }
        this.state = 'waiting';
        this.resetResults();

        this.setUpGrids();

        this.clearBoard();
        this.resizeContainer();
        this.drawBoard();
    }

    /**
     * Empty & hide the results pane
     */
    resetResults = () => {
        this.resetCounts();
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
        this.grids = new Array( parseInt( this.size ) + 1 );
        for ( let i = 0; i <= this.size; i++ ) {
            this.grids[i] = new Array( parseInt( this.size ) + 1 );
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
        for ( let y = this.size; y >= 0; y -- ) {
            for ( let x = 0; x <= this.size; x ++ ) {
                // Make our grid object to store in the board object
                this.grids[x][y] = new BioBotGrid( x, y );

                // Only add DOM elements when NOT dealing with our top/right walls
                if ( parseInt( y ) === parseInt( this.size ) || parseInt( x ) === parseInt( this.size ) ) {
                    this.grids[x][y].setWall( true );
                } else {
                    // Make our grid square in the DOM
                    let newEl = this.buildEl( x, y );
                    document.getElementById( 'container' ).appendChild( newEl );
                }
            }
        }
        this.sizeGrids();
        this.addImages();
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

        if ( 'run' === this.state ) {
            this.clearChecks();
        }
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
            el.style.backgroundImage = ( ! el.style.backgroundImage.includes( 'arrow' ) ) ? '' : "url('assets/img/arrow-80.webp')";
            this.grids[x][y].setWall( false );
            return;
        }

        el.classList.add( 'wall' );
        this.set_dom_element_to( 'wall', x, y );

        this.grids[x][y].setWall( true );

    }

    /**
     * Preserve our walls, but clear all other grid objects
     */
    clearChecks = () => {
        this.state = 'waiting';
        this.resetResults();

        for ( let x = 0; x < this.size; x++ ) {
            for ( let y = 0; y < this.size; y++ ) {
                if ( ! this.grids[x][y].isWall() ) {
                    this.grids[x][y].reset();
                    document.getElementById( x + '_' + y ).classList.remove('good');
                    document.getElementById( x + '_' + y ).classList.remove('bad');
                }
            }
        }

        this.resetNonWallImages();
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
     * Main worker when you say to run the tests
     */
    runTest = () => {
        this.state = 'run';
        this.resetCounts();
        this.setWallCount();
        this.testAllGrids();
        this.displayResults();
    }

    /**
     * Output the results to the display area
     */
    displayResults = () => {

        let results = '<h1 style="margin:0;">Results</h1>';
        results += '<ul>';
        results += '<li>Number of walls: ' + this.wall_count + '</li>';
        results += '<li>Number of Good squares: ' + this.good_count + '</li>';
        results += '<li>Number of Bad squares: ' + this.bad_count + '</li>';
        results += '</ul>';

        let el = document.getElementById( 'results' );
        el.style.display = 'block';
        el.innerHTML = results;
    }

    /**
     * Counts number of walls on the board
     */
    setWallCount = () => {
        let walls = document.getElementsByClassName('wall' );
        this.wall_count = walls.length;
    }

    img_wall = () => {
        let random_number = Math.floor(Math.random() * 3) + 1;
        return "url('assets/img/wall_" + random_number + ".webp')";
    }

    img_good = () => {
        let random_number = Math.floor(Math.random() * 4) + 1;
        return "url('assets/img/good_" + random_number + ".webp')";
    }

    img_bad = () => {
        let random_number = Math.floor(Math.random() * 4) + 1;
        return "url('assets/img/bad_" + random_number + ".webp')";
    }

    /**
     * Handles logic to add good/bad class to grid element, and either set or ADD a background-image to the element
     *
     * @param type
     * @param x
     * @param y
     */
    set_dom_element_to = ( type, x, y ) => {
        let el = document.getElementById( x + '_' + y );
        el.classList.add(type);

        // Figure out which background image we need
        let img = '';
        if ( 'good' === type ) {
            img = this.img_good();
        } else if ( 'bad' === type ) {
            img = this.img_bad();
        } else if ( 'wall' === type ) {
            img = this.img_wall();
        }

        // Add or append background image to grid element
        if ( el.style.backgroundImage ) {
            el.style.backgroundImage += ", " + img;
        } else {
            el.style.backgroundImage = img;
        }

    }

    /**
     * Loop through all the grids and find out what's good & what's not
     */
    testAllGrids = () => {

        for ( let y = this.size-1; y >= 0; y -- ) {
            for ( let x = this.size-1; x >= 0; x -- ) {

                // Make sure the Exit square is always marked Good
                if ( parseInt( x ) === parseInt( this.size-1 ) && parseInt( y ) === parseInt( this.size-1 ) ) {
                    this.set_dom_element_to( 'good', x, y );
                    this.good_count++;
                    continue;
                }

                // Test the grid
                if ( 'bad' === this.testGrid(x, y) ) {
                    this.set_dom_element_to( 'bad', x, y );
                    this.bad_count++;
                } else if ( 'good' === this.testGrid(x, y) ) {
                    this.set_dom_element_to( 'good', x, y );
                    this.good_count++;
                }

            }
        }

    }

    /**
     * Runs a test against a single x,y coordinate
     *
     * @param x
     * @param y
     * @returns {string}
     */
    testGrid = (x, y) => {
        if ( this.grids[x][y].isWall() ) {
            return 'wall';
        }

        if ( this.grids[x+1][y].isBlocked() && this.grids[x][y+1].isBlocked() ) {
            this.grids[x][y].setBad(true);
            return 'bad';
        }

        this.grids[x][y].setGood(true);
        return 'good';
    }

    /**
     * Handles adding images to the grid along the diagonal line to the Exit
     */
    addImages = () => {
        for ( let i = 0; i < this.size; i++ ) {
            let el = document.getElementById( i + '_' + i );
            // Only reset the image if it does NOT already contain a wall
            if ( ! el.style.backgroundImage.includes('wall') ) {
                el.style.backgroundImage = ( i === this.size-1 ) ? this.img_arrow_exit : this.img_arrow;
                el.style.backgroundPosition = 'center';
                el.style.backgroundSize = '100%';
            }
        }

    }

    resetNonWallImages = () => {
        for ( let x = 0; x < this.size; x++ ) {
            for ( let y = 0; y < this.size; y++ ) {
                let el = document.getElementById( x + '_' + y );
                if ( ! el.style.backgroundImage.includes('wall') ) {
                    el.style.backgroundImage = '';
                }
            }
        }
        this.addImages();
    }

}