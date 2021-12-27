"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function(app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    //getting the data from the req body
    const {puzzle, coordinate, value} = req.body;
    //checking if all fields are there
    if (
      puzzle === undefined ||
      coordinate === undefined ||
      value === undefined
    ) {
      res.json({error: "Required field(s) missing"});
    }
    //getting the row name and column index
    const row = coordinate[0].toUpperCase();
    const column = coordinate[1];
    //checking if the puzzle string given, row ,col and value are valid
    //checking if value is between 1 and 9
    if (parseInt(value) > 9 || parseInt(value) < 1)
      return res.json({error: "Invalid value"});
    //puzzle validation
    const isValid = solver.validate(puzzle);
    if (isValid) {
      return res.json({error: isValid});
    }
    //checking the row,region and col placement of the givin value
    const rowPlacement = solver.checkRowPlacement(puzzle, row, column, value);
    const colPlacement = solver.checkColPlacement(puzzle, row, column, value);
    //checking if the coordinate are valid
    if (rowPlacement === "invalid row" || colPlacement === "invalid column")
      return res.json({error: "Invalid coordinate"});
    const regionPlacement = solver.checkRegionPlacement(
      puzzle,
      row,
      column,
      value
    );

    //checking if there a conflict
    const conflict = [rowPlacement, colPlacement, regionPlacement].filter(
      ele => ele !== true
    );
    //returning the results of the check
    if (conflict.length > 0) return res.json({valid: false, conflict});
    return res.json({valid: true});
  });

  app.route("/api/solve").post((req, res) => {
    const puzzstring = req.body.puzzle;
    //checking if puzzle exits
    if (puzzstring === undefined) {
      res.json({error: "Required field missing"});
    }
    //checking if the puzzle string is valid
    const isValid = solver.validate(puzzstring);
    if (isValid) {
      return res.json({error: isValid});
    }
    //solving the puzzle
    const solution = solver.solve(puzzstring);
    if (!solution) {
      return res.json({error: "Puzzle cannot be solved"}); //if puzzle could not be solved
    }
    return res.json({solution}); //if puzzle is solved
  });
};
