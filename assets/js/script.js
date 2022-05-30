//Main game variables
let gameOver = false
let lastRenderTime = 0
const gameBoard = document.getElementById('game-board')
//Snake variables
const SNAKE_SPEED = 5

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