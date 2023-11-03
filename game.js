const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const arrowIndicator = document.getElementById("arrow-indicator");
const projectileContainer = document.getElementById("projectile-container"); // Container for projectiles
const obstacles = document.querySelectorAll('.obstacle');
const projectiles = []; // Array to store projectiles
const maxProjectiles = 12; // Maximum number of projectiles that can be shot continuously
let projectilesFired = 0; // Counter for projectiles fired
let reloading = false; // Flag to indicate reloading state
const reloadingTime = 1500; // 1.5 seconds in milliseconds
const reloadingMessage = document.getElementById("reloading-message");
const projectilesLeftCounter = document.getElementById("projectiles-lefts-counter");
let enemiesKilled = 0;
const enemiesKilledCounter = document.getElementById("enemies-killed-counter");

// try 2 nov

//try 2 nov


const modal = document.getElementById("myModal");
const durationSelect = document.getElementById("duration");
const startButton = document.getElementById("start-button");

// Display the modal when the page loads
modal.style.display = "block";

startButton.addEventListener("click", () => {
    const gameDuration = parseInt(durationSelect.value);
    modal.style.display = "none"; // Hide the modal
    startGameCountdown(gameDuration);
    startButton.disabled = true;
    durationSelect.disabled = true;
});


const timerDisplay = document.getElementById("timer-display");
const gameDurationSelect = document.getElementById("duration");
const timerContainer = document.getElementById("timer");
let gameDuration = parseInt(gameDurationSelect.value);
let timer;

gameDurationSelect.addEventListener("change", () => {
    gameDuration = parseInt(gameDurationSelect.value);
});

function startGameCountdown(duration) {
    clearInterval(timer);
    const endTime = Date.now() + duration * 1000;

    function updateTimerDisplay() {
        const currentTime = Math.max(0, endTime - Date.now());
        const minutes = Math.floor(currentTime / 60000);
        const seconds = Math.floor((currentTime % 60000) / 1000);

        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (currentTime <= 30000) {
            timerContainer.classList.add("timer-red");
        }

        if (currentTime <= 0) {
            clearInterval(timer);
            showResult();
        }
    }

    updateTimerDisplay(); // Initialize the timer display
    timer = setInterval(updateTimerDisplay, 1000); // Update the timer every second
}

function showResult() {
    // Implement the logic to display the results (e.g., enemies killed)
    const resultPopup = document.getElementById("result-popup");
    const enemiesKilledText = document.getElementById("enemies-killed-text");

    // Calculate the number of enemies killed
    const maxEnemiesKilled = 10; // Replace with the actual number
    enemiesKilledText.textContent = `Max Players Killed: ${enemiesKilled}`;
    resultPopup.style.display = "block";
}
const restartButton = document.getElementById("restart-button");

restartButton.addEventListener("click", () => {
    // Reset the game or navigate to the game setup screen
    location.reload(); // Refresh the page to restart the game
});


// try to add timer and display result start
// try to add timer and display result start







const enemyElements = [];
// Function to generate random non-overlapping coordinates for enemies
function generateRandomCoordinates() {
    const enemyWidth = 30; // Adjust the width of the enemy square as needed
    const enemyHeight = 30; // Adjust the height of the enemy square as needed
    const margin = 10; // Adjust the margin to ensure no overlap

    let x, y;
    let validLocation = false;

    while (!validLocation) {
        x = Math.random() * (gameContainer.clientWidth - enemyWidth);
        y = Math.random() * (gameContainer.clientHeight - enemyHeight);

        // Check for overlaps with obstacles
        let obstacleOverlap = false;
        obstacles.forEach((obstacle) => {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (
                x + enemyWidth + margin > obstacleRect.left &&
                x - margin < obstacleRect.right &&
                y + enemyHeight + margin > obstacleRect.top &&
                y - margin < obstacleRect.bottom
            ) {
                obstacleOverlap = true;
            }
        });

        // Check for overlaps with the player
        const playerRect = player.getBoundingClientRect();
        if (
            x + enemyWidth + margin > playerRect.left &&
            x - margin < playerRect.right &&
            y + enemyHeight + margin > playerRect.top &&
            y - margin < playerRect.bottom
        ) {
            obstacleOverlap = true;
        }

        // Check for overlaps with other enemies
        let enemyOverlap = false;
        enemies.forEach((enemy) => {
            const enemyRect = enemy.getBoundingClientRect();
            if (
                x + enemyWidth + margin > enemyRect.left &&
                x - margin < enemyRect.right &&
                y + enemyHeight + margin > enemyRect.top &&
                y - margin < enemyRect.bottom
            ) {
                enemyOverlap = true;
            }
        });

        // If no overlaps, it's a valid location
        if (!obstacleOverlap && !enemyOverlap) {
            validLocation = true;
        }
    }

    return { x, y };
}


const enemies = [];

// Create and append enemy squares
for (let i = 0; i < 5; i++) {
    const enemy = document.createElement("div");
    enemy.className = "enemy";
    const { x, y } = generateRandomCoordinates();
    enemy.style.left = `${x}px`;
    enemy.style.top = `${y}px`;
    gameContainer.appendChild(enemy);
        
    // add the elemrnts to enemyElemts array
    enemyElements.push(enemy);
}
// try start 
function spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
        const enemy = document.createElement("div");
        enemy.className = "enemy";
        const { x, y } = generateRandomCoordinates();
        enemy.style.left = `${x}px`;
        enemy.style.top = `${y}px`;
        gameContainer.appendChild(enemy);
        enemyElements.push(enemy);
    }
}

// try ends

// Function to check if a projectile hits an enemy
function checkProjectileEnemyCollision() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        const projectileRect = projectile.getBoundingClientRect();

        for (let j = enemyElements.length - 1; j >= 0; j--) {
            const enemy = enemyElements[j];
            const enemyRect = enemy.getBoundingClientRect();

            if (
                projectileRect.left < enemyRect.right &&
                projectileRect.right > enemyRect.left &&
                projectileRect.top < enemyRect.bottom &&
                projectileRect.bottom > enemyRect.top
            ) {
                // Collision detected with an enemy

                enemiesKilled++;     // to display the scroe
                enemiesKilledCounter.textContent = `Enemies Killed: ${enemiesKilled}`;
                // Remove the projectile and enemy
                projectileContainer.removeChild(projectile);
                projectiles.splice(i, 1);

                gameContainer.removeChild(enemy);
                enemyElements.splice(j, 1);
            }
        }
    }
}

// try for enemy swapning and killing ends here



// Add a counter element for displaying the number of projectiles left
let playerX = 150; // Initial player position (X-coordinate) within the game container
let playerY = 150; // Initial player position (Y-coordinate) within the game container
const playerSpeed = 5; // Adjust the player's movement speed as needed
const projectileSpeed = 10; // Speed of projectiles (adjust as needed)
let playerRotation = 0; // Player's rotation angle (in degrees)

function checkProjectileObstacleCollision() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        const projectileRect = projectile.getBoundingClientRect();

        obstacles.forEach((obstacle) => {
            const obstacleRect = obstacle.getBoundingClientRect();

            if (
                projectileRect.left < obstacleRect.right &&
                projectileRect.right > obstacleRect.left &&
                projectileRect.top < obstacleRect.bottom &&
                projectileRect.bottom > obstacleRect.top
            ) {
                // Collision detected with an obstacle

                // Remove the projectile
                projectileContainer.removeChild(projectile);
                projectiles.splice(i, 1);
            }
        });
    }
}



function updatePlayerPosition() {
    playerX = Math.max(0, Math.min(gameContainer.clientWidth - player.clientWidth, playerX));
    playerY = Math.max(0, Math.min(gameContainer.clientHeight - player.clientHeight, playerY));

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

}




function updateArrowIndicatorPosition() {
    arrowIndicator.style.left = `${playerX}px`;
    arrowIndicator.style.top = `${playerY}px`;
}

function updateArrowIndicatorRotation(rotation) {
    arrowIndicator.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}



function handleArrowKey(keyCode) {
    let radians;

    switch (keyCode) {
        case 37: // Left arrow key

            if (playerRotation !== 180) {
                playerRotation = 180; // Rotate counterclockwise
                updateArrowIndicatorRotation(playerRotation);
            } else {
                playerX -= playerSpeed; // Move left
                updatePlayerPosition();
                updateArrowIndicatorPosition();
                

            }
            break;

        case 39: // Right arrow key
            if (playerRotation !== 0) {
                playerRotation = 0; // Rotate clockwise
                updateArrowIndicatorRotation(playerRotation);
            } else {
                playerX += playerSpeed; // Move right
                updatePlayerPosition();
                updateArrowIndicatorPosition();
            }
            break;

        case 38: // Up arrow key
            if (playerRotation !== -90) {
                playerRotation = -90; // Rotate counterclockwise
                updateArrowIndicatorRotation(playerRotation);
            } else {
                playerY -= playerSpeed; // Move up
                updatePlayerPosition();
                updateArrowIndicatorPosition();
            }
            break;

        case 40: // Down arrow key
            if (playerRotation !== 90) {
                playerRotation = 90; // Rotate clockwise
                updateArrowIndicatorRotation(playerRotation);
            } else {
                playerY += playerSpeed; // Move down
                updatePlayerPosition();
                updateArrowIndicatorPosition();
            }
            break;

    }
        updatePlayerPosition();
        updateArrowIndicatorPosition();
}



document.addEventListener("keydown", (event) => {
    handleArrowKey(event.keyCode);

    // Add projectile (circle) when Spacebar is pressed
    if (event.keyCode === 32) { // Spacebar
        if (projectilesFired < maxProjectiles && !reloading) {

            const projectile = document.createElement("div");
            projectile.className = "projectile";
            const radians = (playerRotation * Math.PI) / 180;

            // Calculate the initial position of the projectile relative to the player's center
            const projectileRadius = 5; // Adjust the radius of the projectile as needed
            const projectileX = playerX - projectileRadius;
            const projectileY = playerY - projectileRadius;

            projectile.style.left = `${projectileX}px`;
            projectile.style.top = `${projectileY}px`;

            // Calculate the speed components based on player rotation
            const xSpeed = projectileSpeed * Math.cos(radians); // Adjust the sign here
            const ySpeed = projectileSpeed * Math.sin(radians); // Adjust the sign here

            // Append the projectile to the container
            projectileContainer.appendChild(projectile);

            // Add the projectile to the array
            projectiles.push(projectile);

            // Move the projectile in the direction of the player's rotation
            moveProjectile(projectile, xSpeed, ySpeed);

            projectilesFired++;
            // Calculate the number of projectiles left

            // Check if the limit has been reached
            if (projectilesFired >= maxProjectiles) {
                // Start reloading
                reloading = true;
                // Display reloading message
                reloadingMessage.style.display = "block";
                // Set a timeout to end the reloading after 1.5 seconds
                setTimeout(() => {
                    reloading = false;
                    projectilesFired = 0; // Reset the counter
                    const projectilesLeft = 12; // Set it to 12
                    const projectilesLeftText = projectilesLeft.toString().padStart(2, '0');
                    projectilesLeftCounter.textContent = `Projectiles Left: ${projectilesLeftText}`;
                    reloadingMessage.style.display = "none"; // Hide the reloading message
                }, reloadingTime);
            }

        }
    }


    const projectilesLeft = maxProjectiles - projectilesFired;
    const projectilesLeftText = projectilesLeft.toString().padStart(2, '0');
    projectilesLeftCounter.textContent = `Projectiles Left: ${projectilesLeftText}`;
    projectilesLeftCounter.style.display = "block";
    // Add an event listener for the "R" key (for resetting the projectile array)


    if (event.key === "r") {
        if (!reloading) {
            reloading = true;
            reloadingMessage.style.display = "block";
            // try for displaying reloading mech start



            // try for displaying reloading mech end

            // Set a timeout to reset the projectile array and end reloading after 1.5 seconds
            setTimeout(() => {
                reloading = false;
                projectilesFired = 0;
                const projectilesLeft = 12; // Set it to 12
                const projectilesLeftText = projectilesLeft.toString().padStart(2, '0');
                projectilesLeftCounter.textContent = `Projectiles Left: ${projectilesLeftText}`;

                reloadingMessage.style.display = "none";
                // try for displaying reloading mech start

                projectilesLeftCounter.style.display = "block";
                // try for displaying reloading mech start

                // Reset the projectile array
                for (const projectile of projectiles) {
                    if (projectileContainer.contains(projectile)) {
                        projectileContainer.removeChild(projectile);
                    }
                }
                projectiles.length = 0;
            }, reloadingTime);
        }
    }
    // try for R reloading mech end

});



const moveUpButton = document.getElementById("move-up");
let isMouseDown = false;

moveUpButton.addEventListener("mousedown", () => {
    isMouseDown = true;

    // Start the action immediately when the mouse button is pressed
    handleArrowKey(38);

    // Repeatedly perform the action as long as the mouse button is held down
    const intervalId = setInterval(() => {
        if (isMouseDown) {
            handleArrowKey(38); // Simulate the up arrow key press
        } else {
            clearInterval(intervalId); // Stop the action when the mouse button is released
        }
    }, 100); // Adjust the interval duration as needed
});

moveUpButton.addEventListener("mouseup", () => {
    isMouseDown = false;
});


const moveDownButton = document.getElementById("move-down");
let isMouseDownDown = false;

moveDownButton.addEventListener("mousedown", () => {
    isMouseDownDown = true;

    // Start the action immediately when the mouse button is pressed
    handleArrowKey(40);

    // Repeatedly perform the action as long as the mouse button is held down
    const intervalIdDown = setInterval(() => {
        if (isMouseDownDown) {
            handleArrowKey(40); // Simulate the down arrow key press
        } else {
            clearInterval(intervalIdDown); // Stop the action when the mouse button is released
        }
    }, 100); // Adjust the interval duration as needed
});

moveDownButton.addEventListener("mouseup", () => {
    isMouseDownDown = false;
});


const moveLeftButton = document.getElementById("move-left");
let isMouseDownLeft = false;

moveLeftButton.addEventListener("mousedown", () => {
    isMouseDownLeft = true;

    // Start the action immediately when the mouse button is pressed
    handleArrowKey(37);

    // Repeatedly perform the action as long as the mouse button is held down
    const intervalIdLeft = setInterval(() => {
        if (isMouseDownLeft) {
            handleArrowKey(37); // Simulate the left arrow key press
        } else {
            clearInterval(intervalIdLeft); // Stop the action when the mouse button is released
        }
    }, 100); // Adjust the interval duration as needed
});

moveLeftButton.addEventListener("mouseup", () => {
    isMouseDownLeft = false;
});



const moveRightButton = document.getElementById("move-right");
let isMouseDownRight = false;

moveRightButton.addEventListener("mousedown", () => {
    isMouseDownRight = true;

    // Start the action immediately when the mouse button is pressed
    handleArrowKey(39);

    // Repeatedly perform the action as long as the mouse button is held down
    const intervalIdRight = setInterval(() => {
        if (isMouseDownRight) {
            handleArrowKey(39); // Simulate the right arrow key press
        } else {
            clearInterval(intervalIdRight); // Stop the action when the mouse button is released
        }
    }, 100); // Adjust the interval duration as needed
});

moveRightButton.addEventListener("mouseup", () => {
    isMouseDownRight = false;
});



//try start for fire button 11:20pm
const rotateCCWButton = document.getElementById("rotate-ccw");
let isMouseDownCCW = false;
let isTouchStartCCW = false;

rotateCCWButton.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent default touch behavior
    isTouchStartCCW = true;
    startRotation(); // Start rotation when touch starts
});

rotateCCWButton.addEventListener("touchend", () => {
    isTouchStartCCW = false;
    stopRotation(); // Stop rotation when touch ends
});

function startRotation() {
    // Continuously perform the action as long as the button is pressed or touched
    const intervalIdCCW = setInterval(() => {
        if (!isMouseDownCCW && !isTouchStartCCW) {
            clearInterval(intervalIdCCW); // Stop the action when the button is released or touch ends
        } else {
            // Simulate the Spacebar press to fire a projectile
            const radians = (playerRotation * Math.PI) / 180;
            const projectile = document.createElement("div");
            projectile.className = "projectile";

            // Calculate the initial position of the projectile relative to the player's center
            const projectileRadius = 5; // Adjust the radius of the projectile as needed
            const projectileX = playerX - projectileRadius;
            const projectileY = playerY - projectileRadius;

            projectile.style.left = `${projectileX}px`;
            projectile.style.top = `${projectileY}px`;

            // Calculate the speed components based on player rotation
            const xSpeed = projectileSpeed * Math.cos(radians); // Adjust the sign here
            const ySpeed = projectileSpeed * Math.sin(radians); // Adjust the sign here

            // Append the projectile to the container
            projectileContainer.appendChild(projectile);

            // Move the projectile in the direction of the player's rotation
            moveProjectile(projectile, xSpeed, ySpeed);
        }
    }, 100); // Adjust the interval duration as needed
}

function stopRotation() {
    // Stop the action when the button is released or touch ends
    isMouseDownCCW = false;
    isTouchStartCCW = false;
}

// try ends

const rotateCWButton = document.getElementById("rotate-cw");
rotateCWButton.addEventListener("click", () => {
    handleArrowKey(39); // Simulate the right arrow key press to rotate clockwise
});

// Function to move the projectile
function moveProjectile(projectile, xSpeed, ySpeed) {
    let posX = parseFloat(projectile.style.left);
    let posY = parseFloat(projectile.style.top);

    const moveInterval = setInterval(() => {
        posX += xSpeed;
        posY += ySpeed;

        // Check if the projectile is outside the game container
        if (posX < 0 || posY < 0 || posX >= gameContainer.clientWidth || posY >= gameContainer.clientHeight) {
            // Remove the projectile when it goes out of bounds
            if (projectileContainer.contains(projectile)) {
                projectileContainer.removeChild(projectile);
            }
            clearInterval(moveInterval);
        } else {
            projectile.style.left = `${posX}px`;
            projectile.style.top = `${posY}px`;
        }
    }, 16); // Adjust the interval for smoother movement
}





// try start 10 oct

// Other game-related functions and variables

function gameLoop() {
    updateArrowIndicatorRotation(playerRotation);
    updatePlayerPosition();
    updateArrowIndicatorPosition();
    checkProjectileObstacleCollision(); // Check for projectile-obstacle collisions
    checkProjectileEnemyCollision(); // Check for projectile-enemy collisions


    if (enemyElements.length <= 3) {
        spawnEnemies(2); // Spawn 2 new enemies
    }


    requestAnimationFrame(gameLoop); // Continue the loop
}

// Start the game loop
gameLoop();
