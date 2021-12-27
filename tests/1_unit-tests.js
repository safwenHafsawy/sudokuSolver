const chai = require("chai");
const assert = chai.assert;
const puzzles = require("../controllers/puzzle-strings").puzzlesAndSolutions;
const Solver = require("../controllers/sudoku-solver.js");

let solver = new Solver();

const puzzleString = puzzles[0][0];
const puzzleSolution = puzzles[0][1];

suite("UnitTests", () => {
  suite("Solver Validate method tests", function() {
    test("Logic handles a valid puzzle string of 81 characters", function() {
      puzzles.forEach(puzzle => {
        assert.strictEqual(solver.validate(puzzle[0]), undefined);
      });
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function() {
      const invalidEle = ["$", "@", "&", "A", "/"];
      puzzles.forEach((puzzle, index) => {
        const temp = puzzle[0].replace(".", invalidEle[index]);
        assert.strictEqual(
          solver.validate(temp),
          "Invalid characters in puzzle"
        );
      });
    });
    test("Logic handles a puzzle string that is not 81 characters in length", function() {
      const longPuzzle = puzzleString + "123";
      const shortPuzzle = puzzleString.slice(10);
      assert.strictEqual(
        solver.validate(longPuzzle),
        "Expected puzzle to be 81 characters long"
      );

      assert.strictEqual(
        solver.validate(shortPuzzle),
        "Expected puzzle to be 81 characters long"
      );
    });
  });
  suite("Solver checkRowPlacement method", function() {
    test("Logic handles a valid row placement", function() {
      assert.strictEqual(
        solver.checkRowPlacement(puzzleString, "A", "2", "9"),
        true
      );
    });

    test("Logic handles an invalid row placement", function() {
      assert.strictEqual(
        solver.checkRowPlacement(puzzleString, "A", "2", "1"),
        "row"
      );
    });
  });
  suite("Solver checkColPlacement method", function() {
    test("Logic handles a valid row placement", function() {
      assert.strictEqual(
        solver.checkColPlacement(puzzleString, "A", "2", "8"),
        true
      );
    });

    test("Logic handles an invalid row placement", function() {
      assert.strictEqual(
        solver.checkColPlacement(puzzleString, "A", "2", "9"),
        "column"
      );
    });
  });
  suite("Solver checkRegion method", function() {
    test("Logic handles a valid row placement", function() {
      assert.strictEqual(
        solver.checkRegionPlacement(puzzleString, "A", "2", "8"),
        true
      );
    });

    test("Logic handles an invalid row placement", function() {
      assert.strictEqual(
        solver.checkRegionPlacement(puzzleString, "A", "2", "1"),
        "region"
      );
    });
  });
  suite("solver solve method", function() {
    test("valid puzzle pass the solver", function() {
      puzzles.forEach(puzzle => {
        assert.isString(solver.solve(puzzle[0]));
        assert.lengthOf(solver.solve(puzzle[0]), 81);
      });
    });

    test("Invalid puzzle strings fail the solver", function() {
      puzzles.forEach(puzzle => {
        const temp = "123456789" + puzzle[0].slice(9);
        assert.isFalse(solver.solve(temp));
      });
    });
    test("Solver returns the expected solution for an incomplete puzzle", function() {
      puzzles.forEach(puzzle => {
        assert.strictEqual(solver.solve(puzzle[0]), puzzle[1]);
      });
    });
  });
});
