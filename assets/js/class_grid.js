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

    reset = () => {
        this.wall = null;
        this.good = null;
        this.bad = null;
    }

    isBlocked = () => {
        if ( this.isWall() || this.isBad() ) { return true; }
        return false;
    }

    /**
     * WALLS
     *
     * @returns {null}
     */
    isWall = () => {
        if ( ! (document.getElementById(this.x + '_' + this.y) ) ) {
            return true;
        }
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