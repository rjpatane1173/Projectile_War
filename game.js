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


// try start for displaying projectles left for reloading


projectilesLeftCounter.textContent = `Projectiles Left: ${maxProjectiles}`;
projectilesLeftCounter.style.display = "block";
// Add an event listener for the "R" key (for resetting the projectile array)


// Add a counter element for displaying the number of projectiles left


// try end for displaying projectles left for reloading


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
                checkCollisions();

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

rotateCCWButton.addEventListener("mousedown", () => {
    isMouseDownCCW = true;
    startRotation(); // Start rotation when the mouse button is pressed
});

rotateCCWButton.addEventListener("mouseup", () => {
    isMouseDownCCW = false;
    stopRotation(); // Stop rotation when the mouse button is released
});

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


updateArrowIndicatorRotation(playerRotation);
updatePlayerPosition();
updateArrowIndicatorPosition();
checkProjectileObstacleCollision(); // Check for projectile-obstacle collisions
requestAnimationFrame(gameLoop); // Continue the loop


// try start 10 oct

// Other game-related functions and variables

function gameLoop() {
    updateArrowIndicatorRotation(playerRotation);
    updatePlayerPosition();
    updateArrowIndicatorPosition();
    checkProjectileObstacleCollision(); // Check for projectile-obstacle collisions
    // ... Other game-related logic ...

    requestAnimationFrame(gameLoop); // Continue the loop
}

// Start the game loop
gameLoop();
