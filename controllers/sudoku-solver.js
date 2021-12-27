const possibleRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

class SudokuSolver {
  validate(puzzleString) {
    let result;
    const validPatt = /([1-9])|(\.)/;
    const currentState = puzzleString.split("");
    if (puzzleString.length === 81) {
      if (!currentState.every(ele => validPatt.test(ele)))
        return "Invalid characters in puzzle";
    } else {
      return "Expected puzzle to be 81 characters long";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    column = parseInt(column);
    //checking if row is valid
    if (possibleRows.indexOf(row) === -1) return "invalid row";
    //extracting the row debut and the row end
    let rowDebutIndex = possibleRows.findIndex(ele => ele === row) * 9;
    const rowEndIndex = rowDebutIndex + 9;
    //extracting the row
    let currentState = puzzleString.split("").slice(rowDebutIndex, rowEndIndex);
    //checking if the row contains the value
    if (
      currentState.findIndex(ele => ele === value.toString()) !== -1 &&
      currentState[column - 1] != value //skipping the cell if it contains the same value
    )
      return "row";

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    column = parseInt(column);
    //cheking if column is valid
    if (column > 9 || column < 1) return "invalid column";
    //getting the row of where the cell is located
    let rowDebutIndex = possibleRows.findIndex(ele => ele === row) * 9;
    for (let i = 0; i < puzzleString.length; i += 9) {
      if (i == rowDebutIndex) continue;
      let temp = puzzleString.slice(i, i + 9).split("");

      if (temp[column - 1] == value) {
        return "column";
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowDebutIndex = possibleRows.findIndex(ele => ele === row) * 9;
    if (puzzleString[rowDebutIndex + parseInt(column - 1)] == value)
      return true;
    let REGION = new Array(),
      regRowNumbers = new Array(),
      regColNumbers = new Array();
    //all the possible row regions
    const rowRegions = [
        [{A: 0}, {B: 1}, {C: 2}],
        [{D: 3}, {E: 4}, {F: 5}],
        [{G: 6}, {H: 7}, {I: 8}]
      ],
      //all the possbile col region
      columnRegion = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
    //getting the row region of the cell
    rowRegions.forEach(reg => {
      reg.forEach((obj, index) => {
        if (obj.hasOwnProperty(row)) {
          regRowNumbers = [...reg];
        }
      });
    });
    regRowNumbers = [...regRowNumbers.map(obj => Object.values(obj) * 9)];

    //getting the col region of the cell
    regColNumbers = columnRegion.filter(
      ele => ele.indexOf(parseInt(column)) !== -1
    );
    for (
      let cteRow = regRowNumbers[0];
      cteRow < Math.max(...regRowNumbers) + 9;
      cteRow += 9
    ) {
      let cteColDebut = Math.min(...regColNumbers[0]) - 1;
      let cteColEnd = Math.max(...regColNumbers[0]) - 1;
      let tempStr = puzzleString.slice(cteRow, cteRow + 9);
      while (cteColDebut <= cteColEnd) {
        REGION.push(tempStr[cteColDebut]);
        cteColDebut++;
      }
    }

    //cheking if there is region conflict
    for (let i = 0; i < REGION.length; i++) {
      if (REGION[i] == value) {
        return "region";
      }
    }
    return true;
  }

  /**
   *
   *
   *                        SOLVE THE SUDOKU
   *
   *
   */

  //generating all the possible condiadates for a given cell
  checkCondidateValidity(str, row, col) {
    let result = new Array();
    const possibleCon = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < possibleCon.length; i++) {
      if (
        this.checkRegionPlacement(str, row, col, possibleCon[i]) !== "region" &&
        this.checkColPlacement(str, row, col, possibleCon[i]) !== "column" &&
        this.checkRowPlacement(str, row, col, possibleCon[i]) !== "row"
      ) {
        result.push(possibleCon[i]);
      }
    }
    return result;
  }

  searchSol(puzzArr) {
    let row, col;
    const index = puzzArr.indexOf("."); //index of cell to change
    //checking if there are any cells to change
    if (index !== -1) {
      row = possibleRows[Math.floor(index / 9)]; //row of cell
      col = ((index % 9) + 1).toString(); //column of cell
    } else {
      return true; //will return true if the puzzle is solved
    }
    //getting candidates
    let candidates = this.checkCondidateValidity(puzzArr.join(""), row, col);
    //checking if there are valid candidates if return false
    if (candidates.length === 0) return false;
    //backtracking
    let i = 0;
    while (i < candidates.length) {
      puzzArr[index] = candidates[i];
      if (this.searchSol(puzzArr)) {
        return true;
      } else {
        puzzArr[index] = "."; //remove value
      }
      i++;
    }
    return false;
  }

  solve(puzzleString) {
    const puzzleArr = puzzleString.split("");
    let result = true;
    if (this.searchSol(puzzleArr)) {
      puzzleArr.forEach((ele, index) => {
        const row = possibleRows[Math.floor(index / 9)]; //row of cell
        const col = ((index % 9) + 1).toString(); //column of cell
        if (
          this.checkRegionPlacement(puzzleArr.join(""), row, col, ele) ==
            "region" &&
          this.checkColPlacement(puzzleArr.join(""), row, col, ele) ==
            "column" &&
          this.checkRowPlacement(puzzleArr.join(""), row, col, ele) == "row"
        ) {
          result = false;
        }
      });
    } else {
      result = false;
    }
    if (result) return puzzleArr.join("");
    return result;
  }
}

module.exports = SudokuSolver;
