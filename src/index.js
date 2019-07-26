var board;
var playerMove;

var playerFirst;
var playerChar;
var aiChar;

var MAX_DEPTH = 100;

var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

function createBoard() {
  board = [];
  var boardContainer = $('#board-container');
  boardContainer.innerHTML = '';
  for (var i = 0; i < 3; i++) {
    var row = [];
    for (var j = 0; j < 3; j++) {
      row.push('');
      boardContainer.innerHTML += `<div class='cell' id='cell-${i}${j}' data-x='${i}' data-y='${j}'></div>`;
    }
    board.push(row);
  }

  $$('.cell').forEach(function(cell) {
    cell.addEventListener('click', function() {
      if (playerMove && cell.innerHTML == '') {
        cell.innerHTML = playerChar;
        var x = parseInt(cell.getAttribute('data-x'));
        var y = parseInt(cell.getAttribute('data-y'));
        board[x][y] = playerChar;
        playerMove = false;
        if (won(playerChar)) {
          alert('You won!');
          return;
        }
        playBestMove();
      }
    });
  });
}


function playBestMove() {
  var move = bestMove(aiChar);
  var x = move[1];
  var y = move[2];
  board[x][y] = aiChar;
  console.log(x + " " + y);
  $(`#cell-${x}${y}`).innerHTML = aiChar;
  if (won(aiChar)) {
    alert('You lost :(');
    return;
  }
  playerMove = true;
}


function initGame() {
  createBoard();
  aiChar = '🍌';
  playerChar = '🐍';
  if (playerFirst) playerMove = true;
  else playBestMove();
}


function won(p) {
  for (var i = 0; i < 3; i++) {
    var r = true;
    for (var j = 0; j < 3; j++) {
      if (board[i][j] != p) r = false;
    }
    if (r) return true;
  }

  for (var i = 0; i < 3; i++) {
    var r = true;
    for (var j = 0; j < 3; j++) {
      if (board[j][i] != p) r = false;
    }
    if (r) return true;
  }

  var r = true;
  for (var i = 0; i < 3; i++) {
    if (board[i][i] != p) r = false;
  }
  if (r) return true;

  r = true;
  for (var i = 0; i < 3; i++) {
    if (board[2 - i][i] != p) r = false;
  }

  return r;
}


function hasNextMove() {
  if (won(playerChar)) return false;
  if (won(aiChar)) return false;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] == '') return true;
    }
  }
  return false;
}


function bestMove(p, d=0) {
  if (won(playerChar)) return [-1, -1, -1];
  if (won(aiChar)) return [1, -1, -1];
  if (!hasNextMove()) return [0, -1, -1];

  if (d > MAX_DEPTH) return [0, -1, -1];

  var results = [];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] != '') continue;
      board[i][j] = p;
      var r;
      if (p == playerChar) {
        r = bestMove(aiChar, d=d+1);
      } else {
        r = bestMove(playerChar, d=d+1);
      }
      results.push([r[0], i, j]);
      board[i][j] = '';
    }
  }

  if (p == playerChar) {
    return minArray(results);
  }

  return maxArray(results);
}


function minArray(arr) {
  var r = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (r[0] > arr[i][0]) r = arr[i];
  }
  return r;
}


function maxArray(arr) {
  var r = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (r[0] < arr[i][0]) r = arr[i];
  }
  return r;
}


window.onload = function() {
  $('#form').onsubmit = function(e) {
    e.preventDefault();
    var mode = $('#mode').value;
    var first = $('#first').value;
    MAX_DEPTH = parseInt(mode);
    playerFirst = first === 'player';
    initGame();
  }
}
