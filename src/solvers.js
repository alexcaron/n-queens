/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

// Returns an array of ALL solutions to n-rooks problem
// Approach: Recursively get the solutions for the smaller n boards
// For each solution in that array:
// 1. create a board with that smaller board at its four corners
// 2. for each of those 4 boards, check all of the possible placements
// 3. if a new placement is valid, add it to the solution array
// return the solutions
window.getAllNRooksSolutions = function(n) {
  // invalid input
  if (n < 1) {
    return undefined;
  }

  // base case
  if (n === 1) {
    return [[[1]]];
  }

  var solutions = [];
  var smallerBoardSolutions = getAllNRooksSolutions(n - 1);
  for (var correctSmallerBoardSolution of smallerBoardSolutions) {
    var smallerBoard = new Board(correctSmallerBoardSolution);

    // check BOTTOM RIGHT
    var bottomRightBoard = smallerBoard.generateLargerBoardAt('bottom-right');
    bottomRightBoard.togglePiece(0, 0);

    // check first column
    for (var rowIndex = 0; rowIndex < n; rowIndex++) {
      bottomRightBoard.togglePiece(rowIndex, 0);
      if (!(bottomRightBoard.hasAnyRooksConflicts())) {
        solutions.push(bottomRightBoard.rows());
      }
      bottomRightBoard.togglePiece(rowIndex, 0);
    }

    // check top row
    for (var colIndex = 1; colIndex < n; colIndex++) {
      bottomRightBoard.togglePiece(0, colIndex);
      if (!(bottomRightBoard.hasAnyRooksConflicts())) {
        solutions.push(bottomRightBoard.rows());
      }
      bottomRightBoard.togglePiece(0, colIndex);
    }

    // check TOP RIGHT
    var topRightBoard = smallerBoard.generateLargerBoardAt('top-right');
    topRightBoard.togglePiece(n - 1, 0);

    // check bottom row
    for (var colIndex = 0; colIndex < n; colIndex++) {
      topRightBoard.togglePiece(0, colIndex);
      if (!(topRightBoard.hasAnyRooksConflicts())) {
        solutions.push(topRightBoard.rows());
      }
      topRightBoard.togglePiece(0, colIndex);
    }
    // check first column
    for (var rowIndex = 0; rowIndex < n - 1; rowIndex++) {
      topRightBoard.togglePiece(rowIndex, 0);
      if (!(topRightBoard.hasAnyRooksConflicts())) {
        solutions.push(topRightBoard.rows());
      }
      topRightBoard.togglePiece(rowIndex, 0);
    }

    // check BOTTOM LEFT
    var bottomLeftBoard = smallerBoard.generateLargerBoardAt('bottom-left');
    bottomLeftBoard.togglePiece(0, n - 1);

    // check last column
    for (var rowIndex = 0; rowIndex < n; rowIndex++) {
      bottomLeftBoard.togglePiece(rowIndex, n - 1);
      if (!(bottomLeftBoard.hasAnyRooksConflicts())) {
        solutions.push(bottomLeftBoard.rows());
      }
      bottomLeftBoard.togglePiece(rowIndex, n - 1);
    }

    // check top row
    for (var colIndex = 0; colIndex < n - 1; colIndex++) {
      bottomLeftBoard.togglePiece(0, colIndex);
      if (!(bottomLeftBoard.hasAnyRooksConflicts())) {
        solutions.push(bottomLeftBoard.rows());
      }
      bottomLeftBoard.togglePiece(0, colIndex);
    }

    // check TOP LEFT
    var topLeftBoard = smallerBoard.generateLargerBoardAt('top-left');
    topLeftBoard.togglePiece(n - 1, n - 1);

    // check last column (from bottom to top)
    for (var rowIndex = n - 1; rowIndex >= 0; rowIndex--) {
      topLeftBoard.togglePiece(rowIndex, n - 1);
      if (!(topLeftBoard.hasAnyRooksConflicts())) {
        solutions.push(topLeftBoard.rows());
      }
      topLeftBoard.togglePiece(rowIndex, n - 1);
    }

    // check bottom row
    for (var colIndex = 0; colIndex < n - 1; colIndex++) {
      topLeftBoard.togglePiece(0, colIndex);
      if (!(topLeftBoard.hasAnyRooksConflicts())) {
        solutions.push(topLeftBoard.rows());
      }
      topLeftBoard.togglePiece(0, colIndex);
    }
  }
  //   for (var row = 0; row < n; row++) {
  //     bottomRightBoard.togglePiece(row, 0);
  //     var test = new Board(bottomRightBoard.rows());
  //     if (!(test.hasAnyRooksConflicts())) {
  //       solutions.push(test.rows());
  //     }
  //     bottomRightBoard.togglePiece(row, 0);
  //   }
  // }
  var condensedSolutions = [];
  for (var solution of solutions) {
    var toAdd = true;
    for (var shortlisted of condensedSolutions) {
      toAdd = toAdd && !twoMatricesAreSame(solution, shortlisted);
    }
    if (toAdd) {
      condensedSolutions.push(solution);
    }
  }
  return condensedSolutions;
};

var twoMatricesAreSame = function(a, b) {
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < a[0].length; j++) {
      if (a[i][j] !== b[i][j]) {
        return false;
      }
    }
  }
  return true;
};
//   var solutions = [];
//   var smallerBoardSolutions = getAllNRooksSolutions(n - 1);
//   for (var correctSmallerBoardSolution of smallerBoardSolutions) {
//     var smallerBoard = new Board(correctSmallerBoardSolution);
//     // create four boards to check

//     // top left board
//     var topLeftBoard = smallerBoard.generateLargerBoardAt('top-left');
//     var topRightBoard = smallerBoard.generateLargerBoardAt('top-right');
//     var bottomLeftBoard = smallerBoard.generateLargerBoardAt('bottom-left');
//     var bottomRightBoard = smallerBoard.generateLargerBoardAt('bottom-right');

//     for (var rowIndex = 0; rowIndex < 1; rowIndex++) {
//       console.log(topLeftBoard.rows());
//       topLeftBoard.togglePiece(rowIndex, 1);
//       var rows = topLeftBoard.rows();
//       topLeftBoard.togglePiece(rowIndex, 1);
//     }
//     console.log(rows);
//     console.log(topLeftBoard.rows());
    // // check right column
    // var rowIndex = 0;
    // console.log(topLeftBoard.rows());
    // console.log(topLeftBoard.rows());
    // topLeftBoard.togglePiece(rowIndex, n - 1);
    // console.log(topLeftBoard.rows());
    // while (rowIndex < 1) {
    //   console.log(topLeftBoard.rows());
    //   topLeftBoard.togglePiece(rowIndex, n - 1);
    //   console.log(topLeftBoard.rows());
    //   topLeftBoard.togglePiece(rowIndex, n - 1);
    //   rowIndex += 1;
    // }
    // for (var rowIndex = 0; rowIndex < n; rowIndex++) {

    //   console.log(topLeftBoard.rows());
    //   topLeftBoard.togglePiece(rowIndex, n - 1);
    // }
    // topLeftBoard.togglePiece(0, n - 1);
    // topLeftBoard.togglePiece(0, n - 1);
    // topLeftBoard.togglePiece(1, n - 1);
    // console.log(!(topLeftBoard.hasAnyRooksConflicts()));
  //}
  //   var topRightBoard = smallerBoard.generateLargerBoardAt('top-right');
  //   var bottomLeftBoard = smallerBoard.generateLargerBoardAt('bottom-left');
  //   var bottomRightBoard = smallerBoard.generateLargerBoardAt('bottom-right');
  //   console.log('clean new board');
  //   console.log(topLeftBoard.rows());
  //   topLeftBoard.togglePiece(0, n - 1);
  //   console.log(topLeftBoard.rows());
  //   // check right column of two LEFT boards
  //   for (var rowIndex = 0; rowIndex < n; rowIndex++) {
  //     console.log(topLeftBoard instanceof Board);
  //     console.log('board before toggle');
  //     console.log(topLeftBoard.rows());
  //     console.log("rowIndex = " + rowIndex);
  //     console.log(n - 1);
  //     topLeftBoard.togglePiece(rowIndex, n - 1);
  //     console.log('board after toggle');
  //     console.log(topLeftBoard.rows());
  //     var rowsToPush = topLeftBoard.rows();
  //     if (!topLeftBoard.hasAnyRooksConflicts()) {
  //       solutions.push(rowsToPush);
  //     }
  //     topLeftBoard.togglePiece(rowIndex, n - 1);

  //     bottomLeftBoard.togglePiece(rowIndex, n - 1);
  //     var rowsToPush = bottomLeftBoard.rows();
  //     if (!bottomLeftBoard.hasAnyRooksConflicts()) {
  //       console.log(rowsToPush);
  //       solutions.push(rowsToPush);
  //     }
  //     bottomLeftBoard.togglePiece(rowIndex, n - 1); // switch piece back
  //   }

  //   // check left column of two RIGHT boards
  //   for (var rowIndex = 0; rowIndex < n; rowIndex++) {
  //     topLeftBoard.togglePiece(rowIndex, 0);
  //     if (!topLeftBoard.hasAnyRooksConflicts()) {
  //       solutions.push(topLeftBoard.rows());
  //     }
  //     topLeftBoard.togglePiece(rowIndex, 0); // switch piece back


  //     bottomLeftBoard.togglePiece(rowIndex, 0);
  //     if (!bottomLeftBoard.hasAnyRooksConflicts()) {
  //       solutions.push(bottomLeftBoard.rows());
  //     }
  //     bottomLeftBoard.togglePiece(rowIndex, 0); // switch piece back
  //   }

  //   // check bottom row of two TOP boards
  //   for (var colIndex = 0; colIndex < n; colIndex++) {
  //     topLeftBoard.togglePiece(n - 1, colIndex);
  //     if (!topLeftBoard.hasAnyRooksConflicts()) {
  //       solutions.push(topLeftBoard.rows());
  //     }
  //     topLeftBoard.togglePiece(n - 1, colIndex); // switch piece back


  //     topRightBoard.togglePiece(n - 1, colIndex);
  //     if (!topRightBoard.hasAnyRooksConflicts()) {
  //       solutions.push(topRightBoard.rows());
  //     }
  //     topRightBoard.togglePiece(n - 1, colIndex); // switch piece back
  //   }

  //   // check top row of two BOTTOM boards
  //   for (var colIndex = 0; colIndex < n; colIndex++) {
  //     bottomLeftBoard.togglePiece(0, colIndex);
  //     if (!bottomLeftBoard.hasAnyRooksConflicts()) {
  //       solutions.push(bottomLeftBoard.rows());
  //     }
  //     bottomLeftBoard.togglePiece(0, colIndex); // switch piece back


  //     bottomRightBoard.togglePiece(0, colIndex);
  //     if (!bottomRightBoard.hasAnyRooksConflicts()) {
  //       solutions.push(bottomRightBoard.rows());
  //     }
  //     bottomRightBoard.togglePiece(0, colIndex); // switch piece back
  //   }
  // }
  // return solutions;
//};

// Call function above and return
window.findNRooksSolution = function(n) {

  var solution = getAllNRooksSolutions(n)[0];

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = getAllNRooksSolutions(n).length; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.getAllNQueensSolutions = function(n) {
  var nRooksSolutions = getAllNRooksSolutions(n);
  return nRooksSolutions.filter(function(solutionRows) {
    var boardToCheck = new Board(solutionRows);
    return !boardToCheck.hasAnyQueensConflicts();
  });
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = getAllNQueensSolutions(n)[0];
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = getAllNQueensSolutions(n).length;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};