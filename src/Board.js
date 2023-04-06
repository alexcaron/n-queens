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
      // check that the column index is valid: less than size of board & a number
      if (colIndex >= this.get('n') || typeof colIndex !== 'number') {
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
    // input - none
    // output - boolean of whether the board has any vertical conflicts (any columns with multiple pieces)
    // approach - loop from 0 to n - 1. run the column check function. if it returns true for any column, return true. otherwise, return false
    hasAnyColConflicts: function() {
      var numberOfColumns = this.get('n');
      for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        if (this.hasColConflictAt(columnIndex)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // input - column index that would cross the first row: ranges from -(n - 2) -> (n - 2)
    // example: n = 4 will need to check the indices marked with stars below
    //  -2  -1  0   1   2   3
    //         _______________
    //   *  * |_*_|_*_|_*_|___|
    //        |___|___|___|___|
    //        |___|___|___|___|
    //        |_x_|___|___|___|
    //
    // output - a boolean of whether there are two pieces in a specific diagonal
    // edge cases - need to consider how to deal with shorter/longer diagonals
    // if it is a "corner", return false
    // if it is beyond the board's diagonals (-(n-1) to (n-1)), return undefined
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      if (majorDiagonalColumnIndexAtFirstRow < -(size - 1) || majorDiagonalColumnIndexAtFirstRow > (size - 1)) {
        return undefined;
      }
      var rows = this.rows();
      var totalPiecesInDiagonal = 0;
      var rowIndex = 0;
      for (var colIndex = majorDiagonalColumnIndexAtFirstRow; colIndex < majorDiagonalColumnIndexAtFirstRow + size; colIndex++) {
        // confirm that we are inbounds of our arrays
        if (colIndex >= 0 && colIndex < size && rowIndex >= 0 && rowIndex < size) {
          totalPiecesInDiagonal += rows[rowIndex][colIndex];
        }
        rowIndex += 1;
      }
      return totalPiecesInDiagonal > 1;
    },

    // test if any major diagonals on this board contain conflicts
    // input - none
    // output - boolean of whether there are any major diagonal conflicts
    // approach: run the major diagonal checker function for column indices that go from -(n-1) to (n-1) [see notes at that function]
    hasAnyMajorDiagonalConflicts: function() {
      var size = this.get('n');
      var columnIndexToCheck = -size + 1;
      while (columnIndexToCheck < size) {
        if (this.hasMajorDiagonalConflictAt(columnIndexToCheck)) {
          return true;
        }
        columnIndexToCheck += 1;
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    // input - column index that would cross the first row: ranges from 1 -> (2(n-1) - 1)
    // example: n = 4 will need to check the indices marked with stars below
    //     0   1   2   3   4   5
    //    _______________
    //   |___|_*_|_*_|_*_| *   *
    //   |___|___|___|___|
    //   |___|___|___|___|
    //   |___|___|___|___|
    //
    // output - a boolean of whether there are two pieces in a specific diagonal
    // edge cases - need to consider how to deal with shorter/longer diagonals
    // if it is a "corner", return false
    // if it is beyond the board's diagonals (-(n-1) to (n-1)), return undefined
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      if (minorDiagonalColumnIndexAtFirstRow < 0 || minorDiagonalColumnIndexAtFirstRow > 2 * (size - 1)) {
        return undefined;
      }
      var rows = this.rows();
      var totalPiecesInDiagonal = 0;
      var rowIndex = 0;
      for (var colIndex = minorDiagonalColumnIndexAtFirstRow; colIndex > 0; colIndex--) {
        // confirm that we are inbounds of our arrays
        if (colIndex >= 0 && colIndex < size && rowIndex >= 0 && rowIndex < size) {
          totalPiecesInDiagonal += rows[rowIndex][colIndex];
        }
        rowIndex += 1;
      }
      return totalPiecesInDiagonal > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    // input - none
    // output - boolean of whether there are any minor diagonal conflicts
    // approach: run the minor diagonal checker function for column indices that go from 1 to 2(n-1)-1 [see notes at that function]
    hasAnyMinorDiagonalConflicts: function() {
      var size = this.get('n');
      for (var colIndex = 1; colIndex < 2 * (size - 1); colIndex++) {
        if (this.hasMinorDiagonalConflictAt(colIndex)) {
          return true;
        }
      }
      return false;
    },

    // create a new board that contains the current board that is size n + 1 at the given corner
    // input - a corner placement string (top-left, top-right, bottom-left, bottom-right)
    // output - a new board that includes the old board and then all empty squares. It is size n + 1 x n + 1
    generateLargerBoardAt: function(corner) {
      var newSize = this.get('n') + 1;
      var newBoardRows = [];
      var [topOrBottom, leftOrRight] = corner.split('-');
      var emptyRow = Array(newSize).fill(0);
      if (leftOrRight === 'left') {
        for (var row of this.rows()) {
          newBoardRows.push(row.concat([0]));
        }
      }
      if (leftOrRight === 'right') {
        for (var row of this.rows()) {
          newBoardRows.push([0].concat(row));
        }
      }
      if (topOrBottom === 'top') {
        newBoardRows.push(emptyRow);
      }
      if (topOrBottom === 'bottom') {
        newBoardRows = [emptyRow].concat(newBoardRows);
      }
      return new Board(newBoardRows);
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
