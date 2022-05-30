//Main game variables
let gameOver = false
let lastRenderTime = 0

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
