document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
}, false);


// add specific color for each 1 - 8 numbers for around bomb
const divContainer = document.querySelector("div.container");
const cells = new Array(10);
const bombs = [];
const flags = [];
let numberOfFlags;
let gameOverBoolean = false;




function Bomb(i, j) {
  this.i = i;
  this.j = j;
}

function Cell(id, bombHere, bombAround, checked, flagHere) {
  this.id = id; // It should be number between 0 and 99
  this.bombHere = bombHere; // It should be true or false
  this.bombAround = bombAround; // It should be function that I must generate that.
  this.checked = checked;
  this.flagHere = flagHere;
}

function showSituation(obj) {
  if (gameOverBoolean) return;
  let id;
  let row;
  let column;
  let div;
  let bombIcon = document.createElement("i");
  bombIcon.classList.add("fas", "fa-bomb");
  bombIcon.style.color = "red";


  // find row and column
  if (parseInt(obj.id) < 10) {
    row = 0;
    column = parseInt(obj.id);
  }
  else {
    row = parseInt(obj.id[0]);
    column = parseInt(obj.id[1]);
  }

  if (cells[row][column].flagHere === true) return;

  // bomb here !!!!!
  if (cells[row][column].bombHere === true) {
    showAllBombs();
    setTimeout(gameOver(false), 5000);
    return;
  }

  obj.style.backgroundColor = "white";

  if (cells[row][column].checked === false) {
    cells[row][column].checked = true;
    if (cells[row][column].bombAround().length !== 0) {
      // this is a number (not zero)
      obj.innerHTML = cells[row][column].bombAround().length;
      return;

    }

    if (cells[row][column].bombAround().length === 0) {
      cells[row][column].checked = true;
      for (let k = row - 1; k <= row + 1; k++) {
        for (let l = column - 1; l <= column + 1; l++) {
          if ((k === row && l === column) || k > 9 || k < 0 || l > 9 || l < 0) continue;
          (k == 0) ? id = l : id = k * 10 + l;
          div = document.getElementById(`${id}`);
          showSituation(div);
        }
      }
    }

  }

}

function gameOver(winBoolean) {
  if (!gameOverBoolean) {
    let divMessage = document.querySelector(".message");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p1Text;
    let p2Text;
    switch (winBoolean) {
      case true: 
        p1Text = document.createTextNode("You");
        p2Text = document.createTextNode("Win");
        break;
      case false:
        p1Text = document.createTextNode("Game");
        p2Text = document.createTextNode("Over");
    }
    p1.appendChild(p1Text);
    p2.appendChild(p2Text);
    divMessage.appendChild(p1);
    divMessage.appendChild(p2);

    document.getElementById('tudo').innerHTML += `<div class="new-game">
                                                  <div class="new-game-btn"> 
                                                    <a href="#" onclick="location.reload()">
                                                     New game 
                                                    </a>  
                                                  </div>
                                                </div>`;
    $("#tudo").show(4000);
    gameOverBoolean = true;
    $(".cell").css('cursor', "context-menu");
  }

}


function bombsAndFlagsAreEqual(bombsInstance, flagsInctance) {
  // we know both array has same size.
  let counter = 0;
  for (let i = 0; i < bombsInstance.length; i++) {
    for (let j = 0; j < flagsInctance.length; j++) {
      if (flagsInctance[i].i === bombsInstance[j].i && flagsInctance[i].j === bombsInstance[j].j) {
        counter++;
      }
    }
  }

  if (counter === bombsInstance.length)
    return true;

  return false;
}


function putFlag(obj) {
  if (gameOverBoolean) return;

  let row;
  let column;
  let flagIcon = document.createElement("i");
  flagIcon.classList.add("fas", "fa-flag");
  flagIcon.style.color = "red";



  // find row and column
  if (parseInt(obj.id) < 10) {
    row = 0;
    column = parseInt(obj.id);
  }
  else {
    row = parseInt(obj.id[0]);
    column = parseInt(obj.id[1]);
  }


  switch (cells[row][column].flagHere) {
    case true:
      cells[row][column].flagHere = false;
      obj.innerHTML = "";
      numberOfFlags++;
      for (let index = 0; index < flags.length; index++) {
        if (flags[index].i === row && flags[index].j === column) {
          flags.splice(index, 1);
          break;
        }
      }
      break;
    case false:
      if (obj.style.backgroundColor !== "white" && numberOfFlags >= 1) {
        flags.push(new Bomb(row, column));
        numberOfFlags--;
        cells[row][column].flagHere = true;
        obj.appendChild(flagIcon);
      }
  }

  if (numberOfFlags === 0)
    if (bombsAndFlagsAreEqual(bombs, flags))
      gameOver(true);
}

function showAllBombs() {
  let id;
  let bombIcon;
  let icon;
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      if (cells[i][j].bombHere === true) {
        (i === 0) ? id = j : id = i * 10 + j;
        div = document.getElementById(`${id}`);
        if (div.innerHTML === "") {
          bombIcon = document.createElement("i");
          bombIcon.classList.add("fas", "fa-bomb");
          bombIcon.style.display = "none";
          bombIcon.style.color = "red";
          bombIcon.setAttribute("id", `bomb${id}`);
          div.appendChild(bombIcon);
          $(`#bomb${id}`).show(1500);
        }
      }
    }
  }
}

function bombAroundFunction(i, j) {
  return () => {
    let bombAround = [];
    for (let k = i - 1; k <= i + 1; k++) {
      for (let l = j - 1; l <= j + 1; l++) {
        if ((k === i && l === j) || k > 9 || k < 0 || l > 9 || l < 0) continue;
        if (cells[k][l].bombHere) bombAround.push([k, l]);
      }
    }
    return bombAround;
  }
}

function createCellsStructure() {
  let countId = 0;
  let numbers;
  for (let i = 0; i < cells.length; i++) {
    cells[i] = new Array(10);
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      cells[i][j] = new Cell(countId, false, bombAroundFunction(i, j), false, false);
      countId++;
    }
  }
}

function createCellsDOM() {
  let div = document.createElement("div");
  div.classList.add("cell");
  div.setAttribute("onclick", "showSituation(this)");
  div.setAttribute("oncontextmenu", "putFlag(this)");
  for (let i = 0; i <= 99; i++) {
    div.setAttribute("id", i);
    divContainer.appendChild(div.cloneNode());
  }
}

function calculateBombLocations(numBombs) {
  let numbers = generateNsRandomNumber(numBombs);
  for (let i = 0; i < numbers.length; i++) {
    cells[Math.floor(numbers[i] / 10)][numbers[i] - Math.floor(numbers[i] / 10) * 10].bombHere = true;
    bombs.push(new Bomb(Math.floor(numbers[i] / 10), numbers[i] - Math.floor(numbers[i] / 10) * 10))
  }
}

function generateNsRandomNumber(n) {
  let numbers = [];
  let randomNumber;
  for (let i = 1; i <= n;) {
    randomNumber = Math.floor((Math.random() * 100));
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
      i++;
    }
  }
  return numbers;

}

function giveNumberOfBombs() {
  let numberOfBombs = prompt("Enter number Of bombs", "Between 1 and 100 (string assume as zero)");
  return numberOfBombs
}


$(document).ready(function () {
  let numberOfBombs = parseInt(giveNumberOfBombs());
  while (numberOfBombs > 100  || numberOfBombs <= 0) {
    alert("Please choose a valid number for bombs. ");
    numberOfBombs = parseInt(giveNumberOfBombs());
  }
  numberOfFlags = parseInt(numberOfBombs);
  createCellsDOM();
  createCellsStructure();
  calculateBombLocations(numberOfBombs);

  });

