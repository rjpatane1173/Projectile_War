const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");

let playerX = 50; // Initial player position (X-coordinate)
let playerY = 50; // Initial player position (Y-coordinate)
const playerSpeed = 5; // Adjust the player's movement speed as needed

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function handleArrowKey(keyCode) {
    // Arrow key codes: Left (37), Up (38), Right (39), Down (40)
    switch (keyCode) {
        case 37:
            playerX -= playerSpeed;
            break;
        case 38:
            playerY -= playerSpeed;
            break;
        case 39:
            playerX += playerSpeed;
            break;
        case 40:
            playerY += playerSpeed;
            break;
    }
    updatePlayerPosition();
}

document.addEventListener("keydown", (event) => {
    handleArrowKey(event.keyCode);
});

updatePlayerPosition();
