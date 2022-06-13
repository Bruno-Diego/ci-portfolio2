
//Main game variables
let gameOver = false
let lastRenderTime = 0
let gameBoard = document.getElementsByClassName('game-board')[0]
let gameOverMessage = document.getElementsByClassName('game-over')[0]
let controlBtns = document.getElementsByClassName('touch-controls')[0]
//Snake variables
//Snake speed selected by user
const SNAKE_SPEED = () => document.querySelector('input[name="toggle"]:checked').value
//initial position for the snake
const SNAKE_BODY = [{ x: 11, y: 11 }]
let newSegments = 0
//initial position reference for user input
let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }
//Starts the food on a random position
let food = getRandomFoodPosition()
//Rate the snake grows when it eats the food
const EXPANSION_RATE = 1
//Score counter
let getScore = document.getElementsByClassName('score')[0]
let score = 0
let touchControls = document.getElementsByClassName('btnControls');
const GRID_SIZE = 20

window.addEventListener('DOMContentLoaded', (event) => {
    window.requestAnimationFrame(main)
    gameOverMessage.style.display = "none"
    for (let i = 0; i < touchControls.length; i++) {
        touchControls[i].addEventListener('click', touchControlsClicked);
    }
    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (lastInputDirection.y !== 0) break
                inputDirection = {
                    x: 0,
                    y: -1
                }
                break
            case 'ArrowDown':
                if (lastInputDirection.y !== 0) break
                inputDirection = {
                    x: 0,
                    y: 1
                }
                break
            case 'ArrowLeft':
                if (lastInputDirection.x !== 0) break
                inputDirection = {
                    x: -1,
                    y: 0
                }
                break
            case 'ArrowRight':
                if (lastInputDirection.x !== 0) break
                inputDirection = {
                    x: 1,
                    y: 0
                }
                break
        }
    })
});



// Main game functions

/**
 * This function request an animation frame to update the game every second
 */
function main(currentTime) {
    if (gameOver) {
        gameBoard.style.display = "none"
        controlBtns.style.display = "none"
        gameOverMessage.style.display = "block"
        // if (confirm('GAME OVER! Press ok to try again.')) {
        //     window.location = './index.html'
        // }
        // return
    }

    //getting the frame to animate the game
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    //updates based on the snake speed
    if (secondsSinceLastRender < 1 / SNAKE_SPEED()) return

    lastRenderTime = currentTime
    
    update()
    draw()
}


/**
 * Moves the snake to the correct position but doesnt draw it
 * also says when the game is lost
 */
function update() {
    getScore.innerHTML = score
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

//Function to Restart the game
function restart(){
    window.location = './index.html'
}

// Functions for the snake

/**
 * updates the position of the snake and the directions to move
 */
function updateSnake() {
    addSegments()
    const inputDirection = getInputDirection()
    //update every segment except the last one
    for (let i = SNAKE_BODY.length - 2; i >= 0; i--) {
        SNAKE_BODY[i + 1] = {
            ...SNAKE_BODY[i]
        }
    }

    SNAKE_BODY[0].x += inputDirection.x
    SNAKE_BODY[0].y += inputDirection.y
}


/**
 * Draws the snake after update the position
 */
function drawSnake(gameBoard) {
    SNAKE_BODY.forEach(segment => {
        
        let snakeElement = document.createElement('div')
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
function onSnake(position, {
    ignoreHead = false
    } = {}) {
    return SNAKE_BODY.some((segment, index) => {
        //ignores if the snake head is on the snake head
        if (ignoreHead && index === 0) return false
        return equalPositions(segment, position)
    })
}


/**
 * Get the position of the head of the snake 
 */
function getSnakeHead() {
    return SNAKE_BODY[0]
}

/**
 * Verify if the head of the snake touches the body 
 */
function snakeIntersection() {
    return onSnake(SNAKE_BODY[0], {
        ignoreHead: true
    })
}

/**
 * Verify if the position of the food and the snake match
 */
function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

/**
 * Take new segments and add to the bottom of the snake
 * every update
 */
function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        //takes the very last segment and duplicate on the end of the snake
        SNAKE_BODY.push({
            ...SNAKE_BODY[SNAKE_BODY.length - 1]
        })
    }
    //Avoid add more elements then its told to
    newSegments = 0
}

// User input and controls

//Listen to the user input with the arrow keys on the keyboard


//get the user input and change direction of the snake
function getInputDirection() {
    lastInputDirection = inputDirection
    return inputDirection
}

// Functions for the snake's food

/**
 * Update the snake and score based on the expansion rate and get a new position for the food 
 */
function updateFood() {
    if (onSnake(food)) {
        expandSnake(EXPANSION_RATE)
        score++
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

//Touch Controls functions

function touchControlsClicked() {
    if (this.getAttribute("id") === "btn-left") {
        if(lastInputDirection.x !== 0){
            return
        } else {
            inputDirection = {
                x: -1,
                y: 0
            }
            return
        }
    } else if (this.getAttribute("id") === "btn-right") {
       if(lastInputDirection.x !== 0){
        return
       } else {
        inputDirection = {
            x: 1,
            y: 0
        }
        return
       }
    } else if (this.getAttribute("id") === "btn-up") {
       if(lastInputDirection.y !== 0){
        return
       } else {
        inputDirection = {
            x: 0,
            y: -1
        }
        return
       }
    } else if (this.getAttribute("id") === "btn-down") {
        if(lastInputDirection.y !== 0){
            return
        } else {
            inputDirection = {
                x: 0,
                y: 1
            }
            return
        }
    }
}