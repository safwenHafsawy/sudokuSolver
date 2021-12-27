const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzles = require("../controllers/puzzle-strings").puzzlesAndSolutions;

chai.use(chaiHttp);
const puzzle = puzzles[0][0];
const puzzleSol = puzzles[0][1];
var document, window;
suite("Functional Tests", () => {
  suite("testing the solve method", function() {
    test("Solve a puzzle with valid puzzle string", function(done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle})
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.solution, puzzleSol);
          done();
        });
    });
    test("Solve a puzzle with missing puzzle string", function(done) {
      const missingpuzzle = puzzle.slice(10);
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: missingpuzzle})
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Solve a puzzle with invalid characters", function(done) {
      const invalidCharPuzzle = puzzle.slice(1) + "$";
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: invalidCharPuzzle})
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Solve a puzzle with incorrect length", function(done) {
      const longPuzzle = puzzle + "123445";
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: longPuzzle})
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Solve a puzzle that cannot be solved", function(done) {
      const notPuzzle = puzzle.slice(9) + "123456789";
      chai
        .request(server)
        .post("/api/solve")
        .send({puzzle: notPuzzle})
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });
  suite("Testing the check method", function() {
    test("Check a puzzle placement with all fields", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "A1",
          value: "1"
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });
    test("Check a puzzle placement with single placement conflict", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "b5",
          value: 6
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row"]);
          done();
        });
    });
    test("Check a puzzle placement with multiple placement conflicts", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "A1",
          value: 8
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column"]);
          done();
        });
    });
    test("Check a puzzle placement with all placement conflicts", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "G8",
          value: 7
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
          done();
        });
    });
    test("Check a puzzle placement with missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          value: 7
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.deepEqual(res.body, {error: "Required field(s) missing"});
          done();
        });
    });
    test("Check a puzzle placement with invalid characters", function(done) {
      const invalidCharPuzzle = puzzle.slice(1) + "%";
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidCharPuzzle,
          coordinate: "G8",
          value: 7
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Check a puzzle placement with incorrect length", function(done) {
      const invalidCharPuzzle = puzzle + "1231213412";
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidCharPuzzle,
          coordinate: "G8",
          value: 7
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Check a puzzle placement with invalid placement coordinate", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "L10",
          value: 7
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.error, "Invalid coordinate");
          done();
        });
    });
    test("Check a puzzle placement with invalid placement value", function(done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "A1",
          value: 18
        })
        .end(function(err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.strictEqual(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
