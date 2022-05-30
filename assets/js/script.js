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
//Starts the food on a random position
let food = getRandomFoodPosition()
//Rate the snake grows when it eats the food
const EXPANSION_RATE = 1

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
  
/**
 * Get the position of the food and compare with the snake segments
 * 
 */
function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        //ignores if the snake head is on the snake head
      if (ignoreHead && index === 0) return false
      return equalPositions(segment, position)
    })
  }







  
// Functions for the snake's food

/**
 * Update the snake based on the expansion rate and get a new position for the food 
 */
function updateFood() {
    if (onSnake(food)) {
      expandSnake(EXPANSION_RATE)
      food = getRandomFoodPosition()
    }
  }
  
  /**
   * Draw the food on the screen based with the update loop
   * 
   */
  function drawFood(gameBoard) {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)
  }
  
  /**
   * Get a random position to get the food
   * that is not on the body of the snake
   */
  function getRandomFoodPosition() {
    let newFoodPosition
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
      newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
  }
  
// Functions to create a random position for the food
//size of the game
const GRID_SIZE = 20
/**
 * Gives a random position inside the grid
 */
function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * 21) + 1,
    y: Math.floor(Math.random() * 21) + 1
  }
}
/**
 * Return true or false if the element is outside the grid
 */
function outsideGrid(position) {
  return (
    position.x < 1 || position.x > GRID_SIZE ||
    position.y < 1 || position.y > GRID_SIZE
  )
}

  