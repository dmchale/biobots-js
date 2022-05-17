/**
 *
 */
class BioBotGrid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.wall = null;
        this.good = null;
        this.bad = null;
    }

    /**
     * WALLS
     *
     * @returns {null}
     */
    isWall = () => {
        this.wall = (document.getElementById(this.x + '_' + this.y).classList.contains('wall'));
        return this.wall;
    }
    setWall = ( newVal ) => {
        this.wall = newVal;
    }

    /**
     * BAD
     *
     * @returns {null}
     */
    isBad = () => {
        if ( this.bad ) { return this.bad; }
    }
    setBad = ( newVal ) => {
        this.bad = newVal;
    }

    /**
     * GOOD
     *
     * @returns {null}
     */
    isGood = () => {
        if ( this.good ) { return this.good; }
    }
    setGood = ( newVal ) => {
        this.good = newVal;
    }

}