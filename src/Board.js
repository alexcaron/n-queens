// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

/* Methods

- rows = returns an array of rows representing the board
- togglePiece(row, col) = switches the piece on/off at a specific position on the board
- hasAnyRooksConflicts = returns whether there are any rook-style conflicts on the board
- hasAnyQueensConflicts = returns whether there are any queen-style conflicts (i.e., rook-style + major + minor diagonals) on the board
- hasRowConflictAt(rowIndex) = returns whether a row has two pieces
- hasColConflictAt(colIndex) = returns whether a column has two pieces
- hasAnyRowConflicts = returns whether the board has any horizontal conflicts
- hasAnyColConflicts = returns whether the board has any vertical conflicts
- hasMajorDiagonalConflictAt(colIndexOfFirstRow) = returns whether there is a left-to-right diagonal conflict starting at that column
- hasAnyMajorDiagonalConflicts = returns whether there are any left-to-right diagonal conflicts on the board
- hasMinorDiagonalConflictAt(colIndexOfFirstRow) = returns whether there is a right-to-left diagonal conflict starting at that column
- hasAnyMinorDiagonalConflicts = returns whether there are any right-to-left diagonal conflicts on the board

*/
(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    // input - row index number
    // output - a boolean of whether there is a conflict in this specific row
    // edge cases - if the row index is invalid (e.g., that row doesn't exist), return undefined
    // approach: sum up the squares (each square is either 1 or 0); return true if greater than 1

    hasRowConflictAt: function(rowIndex) {
      var row = this.rows()[rowIndex];
      // check that there is a row at the given index
      if (!row) {
        return undefined;
      }
      var totalPiecesInRow = row.reduce(function(count, square) {
        return count + square;
      }, 0);
      return totalPiecesInRow > 1; // fixme
    },

    // test if any rows on this board contain conflicts
    // input - none
    // output - boolean for whether this board has a conflict in any row (one conflict means return true)
    // approach - iterate through the number of rows (0 -> n), checking whether there is a conflict at that row number.
    // as soon as a conflict is found, return true. otherwise, at the end, return false.
    hasAnyRowConflicts: function() {
      var numberOfRows = this.get('n');
      for (var rowNumber = 0; rowNumber < numberOfRows; rowNumber++) {
        if (this.hasRowConflictAt(rowNumber)) {
          return true;
        }
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    // input - a column index number
    // output - a boolean, true if there is more than one piece in that column
    // edge cases - if the column number is invalid (too large, not a number), return undefined
    // approach - set a variable for the count
    // get all of the row arrays. loop through each array, and check the appropriate index that represents the column's squares.
    // add to the count each time. if the count is ever greater than 1, return true.
    // at the end, return false
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      // check that the column index is valid: less than length of first row & a number
      if (colIndex < rows[0].length || typeof colIndex !== 'number') {
        return undefined;
      }
      var count = 0;
      for (var row of rows) {
        count += row[colIndex];
        if (count > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
