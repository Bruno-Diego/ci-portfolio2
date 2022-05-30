//Main game variables
let gameOver = false
let lastRenderTime = 0
const gameBoard = document.getElementById('game-board')
//Snake variables
const SNAKE_SPEED = 5
//initial position for the snake
const snakeBody = [{ x: 11, y: 11 }]
let newSegments = 0
//initial position reference for user input
let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }

// Main game functions

/**
 * This function request an animation frame to update the game every second
 */
function main(currentTime) {
    if (gameOver) {
        if (confirm('GAME OVER! Press ok to try again.')) {
            window.location = './index.html'
        }
        return
    }

    //getting the frame to animate the game
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    //updates based on the snake speed
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return

    lastRenderTime = currentTime

    update()
    draw()
}

window.requestAnimationFrame(main)
/**
 * Moves the snake to the correct position but doesnt draw it
 * also says when the game is lost
 */
function update() {
  updateSnake()
  updateFood()
  checkDeath()
}
/**
 * Clear the previous segments and draw the new ones
 */
function draw() {
  gameBoard.innerHTML = ''
  drawSnake(gameBoard)
  drawFood(gameBoard)
}

/**
 * Check a failure.
 * Failure happens if the snake get out of the grid or touch itself
 */
 function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
  }

  
// Functions for the snake

/**
 * updates the position of the snake and the directions to move
 */
function updateSnake() {
    addSegments()
  
    const inputDirection = getInputDirection()
    //update every segment except the last one
    for (let i = snakeBody.length - 2; i >= 0; i--) {
      snakeBody[i + 1] = { ...snakeBody[i] }
    }
  
    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
  }

  
/**
 * Draws the snake after update the position
 */
function drawSnake(gameBoard) {
    snakeBody.forEach(segment => {
      const snakeElement = document.createElement('div')
      snakeElement.style.gridRowStart = segment.y
      snakeElement.style.gridColumnStart = segment.x
      snakeElement.classList.add('snake')
      gameBoard.appendChild(snakeElement)
    })
  }
  
  /**
   * Get a number of how much to expand the snake
   * increase the segment
   */
  function expandSnake(amount) {
    newSegments += amount
  }