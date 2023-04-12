document.addEventListener('DOMContentLoaded' , () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const highestScoreDisplay = document.querySelector('#highest-score')
    const startButton = document.querySelector('#start-button')
    const newButton = document.querySelector('.new-game')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const NO_OF_HIGH_SCORES = 10;
    const HIGH_SCORES = 'highScores';

     //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  function control(e){
    if(e.keyCode === 37){
        moveLeft()
    } else if(e.keyCode === 32){
        rotate()
    } else if(e.keyCode === 39){
        moveRight()
    } else if(e.keyCode === 40){
        moveDown()
    }
  }

  document.addEventListener('keydown', control)

  let currentPosition = 4
  let currentRotation = 0

  //random picking of shapes
  let random = Math.floor(Math.random()*theTetrominoes.length)
  //console.log(random) 
  let current = theTetrominoes[random][currentRotation]

  //draw the shapes
  function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    })
  }
  draw()
  //Undraw the shape
  function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
    }
    draw()
  }

  function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isAtRightEdge) currentPosition += 1
    
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -= 1
    }
    draw()
  }

  function rotate(){
    undraw()
    currentRotation ++
    if (currentRotation === current.length){
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  function displayShape(){
    displaySquares.forEach(squares =>{
      squares.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index =>{
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  startButton.addEventListener('click', () => {
    if(timerId){
      clearInterval(timerId)
      timerId = null
    }else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })
  
  newButton.addEventListener('click' , () => {
    //TODO
    location.reload()
    return false
  })

  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;
    
    if (score > lowestScore) {
      saveHighScore(score, highScores); // TODO
      //showHighScores(); // TODO
    }
  }

  function saveHighScore(score, highScores) {
    const name = prompt('You got a highscore! Enter name :');
    const newScore = { score, name };
    
    // 1. Add to list
    highScores.push(newScore);
  
    // 2. Sort the list
    highScores.sort((a, b) => b.score - a.score);
    
    // 3. Select new list
    highScores.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  };
  //Better Inside a function
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const highScoreList = document.getElementById(HIGH_SCORES);
    highScoreList.innerHTML = highScores
      .map((score) => `<li>${score.score} - ${score.name}`)
      .join('');
//-----------------


  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'End'
      clearInterval(timerId)
      checkHighScore(score)
    }
  }
})