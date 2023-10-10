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


// if this that doesnt work then remove the comment from here till 130 line
// Button event listeners to mimic arrow keys
/*
const moveUpButton = document.getElementById("move-up");
moveUpButton.addEventListener("mousedown", () => {
    handleArrowKey(38); // Simulate the up arrow key press
});
*/

// this is try and guess what it worked
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

// this is try 
/*
moveUpButton.addEventListener("mouseout", () => {
    // Stop the action if the mouse pointer moves out of the button while the button is pressed
    clearInterval(moveUpInterval);
})
*/
/*
const moveDownButton = document.getElementById("move-down");
moveDownButton.addEventListener("mousedown", () => {
    handleArrowKey(40); // Simulate the down arrow key press
});
*/
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

/*

const moveLeftButton = document.getElementById("move-left");
moveLeftButton.addEventListener("mousedown", () => {
    handleArrowKey(37); // Simulate the left arrow key press
});
*/

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


/*
const moveRightButton = document.getElementById("move-right");
moveRightButton.addEventListener("mousedown", () => {
    handleArrowKey(39); // Simulate the right arrow key press
});
*/

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




// till here
// Button event listener to simulate firing a projectile (Rotate CCW)

/*
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
*/

// try
const rotateCCWButton = document.getElementById("rotate-ccw");
let isMouseDownCCW = false;

rotateCCWButton.addEventListener("mousedown", () => {
    isMouseDownCCW = true;

    // Continuously perform the action as long as the mouse button is held down
    const intervalIdCCW = setInterval(() => {
        if (!isMouseDownCCW) {
            clearInterval(intervalIdCCW); // Stop the action when the mouse button is released
        } else {
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
        }
    }, 100); // Adjust the interval duration as needed
});

// Stop the action when the mouse button is released
rotateCCWButton.addEventListener("mouseup", () => {
    isMouseDownCCW = false;
});


//try

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

/*
// this is again try
function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.newPos();
  myGamePiece.update();
}


function moveup() {
  myGamePiece.speedY -= 1;
}

function movedown() {
  myGamePiece.speedY += 1;
}

function moveleft() {
  myGamePiece.speedX -= 1;
}

function moveright() {
  myGamePiece.speedX += 1;
}
*/
// try ends here


updateArrowIndicatorRotation(playerRotation);
updatePlayerPosition();
updateArrowIndicatorPosition();
