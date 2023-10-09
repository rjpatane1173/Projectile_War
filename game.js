const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const arrowIndicator = document.getElementById("arrow-indicator");

let playerX = 150; // Initial player position (X-coordinate) within the game container
let playerY = 150; // Initial player position (Y-coordinate) within the game container
const playerSpeed = 5; // Adjust the player's movement speed as needed
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
            playerRotation -= 15; // Rotate counterclockwise
            updateArrowIndicatorRotation(playerRotation);
            break;

        case 39: // Right arrow key
            playerRotation += 15; // Rotate clockwise
            updateArrowIndicatorRotation(playerRotation);
            break;

        case 38: // Up arrow key
            radians = (playerRotation * Math.PI) / 180;
            playerX += playerSpeed * Math.cos(radians);
            playerY -= playerSpeed * Math.sin(radians);
            updatePlayerPosition();
            updateArrowIndicatorPosition();
            break;

        case 40: // Down arrow key
            radians = (playerRotation * Math.PI) / 180;
            playerX -= playerSpeed * Math.cos(radians);
            playerY += playerSpeed * Math.sin(radians);
            updatePlayerPosition();
            updateArrowIndicatorPosition();
            break;
    }
}

document.addEventListener("keydown", (event) => {
    handleArrowKey(event.keyCode);
});

updateArrowIndicatorRotation(playerRotation);
updatePlayerPosition();
updateArrowIndicatorPosition();
