const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const arrowIndicator = document.getElementById("arrow-indicator");
const projectileContainer = document.getElementById("projectile-container"); // Container for projectiles

let playerX = 150; // Initial player position (X-coordinate) within the game container
let playerY = 150; // Initial player position (Y-coordinate) within the game container
const playerSpeed = 5; // Adjust the player's movement speed as needed
const projectileSpeed = 10; // Speed of projectiles (adjust as needed)
let playerRotation = 0; // Player's rotation angle (in degrees)

function updatePlayerPosition() {
    playerX = Math.max(0, Math.min(gameContainer.clientWidth - player.clientWidth, playerX));
    playerY = Math.max(0, Math.min(gameContainer.clientHeight - player.clientHeight, playerY));

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateArrowIndicatorRotation(rotation) {
    arrowIndicator.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}

function updateArrowIndicatorPosition() {
    arrowIndicator.style.left = `${playerX}px`;
    arrowIndicator.style.top = `${playerY}px`;
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
}

document.addEventListener("keydown", (event) => {
    handleArrowKey(event.keyCode);

    // Add projectile (circle) when Spacebar is pressed
    if (event.keyCode === 32) { // Spacebar
        const projectile = document.createElement("div");
        projectile.className = "projectile";
        const radians = (playerRotation * Math.PI) / 180;

        // Calculate the initial position of the projectile relative to the player's center
        const projectileRadius = 5; // Adjust the radius of the projectile as needed
        const projectileX = playerX  - projectileRadius;
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
});

// Button event listeners to mimic arrow keys
const moveUpButton = document.getElementById("move-up");
moveUpButton.addEventListener("click", () => {
    handleArrowKey(38); // Simulate the up arrow key press
});

const moveDownButton = document.getElementById("move-down");
moveDownButton.addEventListener("click", () => {
    handleArrowKey(40); // Simulate the down arrow key press
});

const moveLeftButton = document.getElementById("move-left");
moveLeftButton.addEventListener("click", () => {
    handleArrowKey(37); // Simulate the left arrow key press
});

const moveRightButton = document.getElementById("move-right");
moveRightButton.addEventListener("click", () => {
    handleArrowKey(39); // Simulate the right arrow key press
});

// Button event listener to simulate firing a projectile (Rotate CCW)
const rotateCCWButton = document.getElementById("rotate-ccw");
rotateCCWButton.addEventListener("click", () => {
    // Simulate the Spacebar press to fire a projectile
    const radians = (playerRotation * Math.PI) / 180;
    const projectile = document.createElement("div");
    projectile.className = "projectile";

    // Calculate the initial position of the projectile relative to the player's center
    const projectileRadius = 5; // Adjust the radius of the projectile as needed
    const projectileX = playerX  - projectileRadius;
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
});

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
            projectileContainer.removeChild(projectile);
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
