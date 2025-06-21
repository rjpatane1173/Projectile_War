// Game State
const gameState = {
    playerName: '',
    highScores: [],
    currentHighScore: 0,
    playerX: window.innerWidth / 2,
    playerY: window.innerHeight / 2,
    playerSpeed: 5,
    rotation: 0,
    projectiles: [],
    enemies: [],
    ammo: 12,
    maxAmmo: 12,
    reloading: false,
    reloadTime: 1500,
    score: 0,
    gameTime: 120,
    gameActive: false,
    lastEnemySpawn: 0,
    enemySpawnRate: 3000,
    obstacles: [],
    activeDirections: {
        up: false,
        down: false,
        left: false,
        right: false
    }
};

// DOM Elements
const elements = {
    player: document.getElementById('player'),
    arrowIndicator: document.getElementById('arrow-indicator'),
    projectileContainer: document.getElementById('projectile-container'),
    reloadingMessage: document.getElementById('reloading-message'),
    ammoCounter: document.getElementById('ammo-counter'),
    scoreDisplay: document.getElementById('score-display'),
    timerDisplay: document.getElementById('timer'),
    gameOverModal: document.getElementById('game-over-modal'),
    finalScoreDisplay: document.getElementById('final-score'),
    highScoreMessage: document.getElementById('high-score-message'),
    highScoresList: document.getElementById('high-scores-list'),
    startMenu: document.getElementById('start-menu'),
    restartButton: document.getElementById('restart-button'),
    startButton: document.getElementById('start-button'),
    gameDurationSelect: document.getElementById('game-duration'),
    gameContainer: document.getElementById('game-container'),
    playerNameInput: document.getElementById('player-name'),
    moveUpBtn: document.getElementById('move-up'),
    moveDownBtn: document.getElementById('move-down'),
    moveLeftBtn: document.getElementById('move-left'),
    moveRightBtn: document.getElementById('move-right'),
    fireBtn: document.getElementById('fire-button'),
    reloadBtn: document.getElementById('reload-button')
};

// Load high scores from localStorage
function loadHighScores() {
    try {
        const savedScores = localStorage.getItem('obstacleShooterHighScores');
        gameState.highScores = savedScores ? JSON.parse(savedScores) : [];
        gameState.currentHighScore = gameState.highScores.length > 0 
            ? Math.max(...gameState.highScores.map(score => score.score))
            : 0;
    } catch (e) {
        console.error("Error loading high scores:", e);
        gameState.highScores = [];
        gameState.currentHighScore = 0;
    }
}

// Initialize obstacles
function initObstacles() {
    gameState.obstacles = Array.from(document.querySelectorAll('.obstacle')).map(obstacle => {
        const rect = obstacle.getBoundingClientRect();
        return {
            element: obstacle,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
        };
    });
}

// Game Initialization
function initGame() {
    gameState.playerName = elements.playerNameInput.value.trim() || 'Player';
    
    // Reset game state
    gameState.playerX = window.innerWidth / 2;
    gameState.playerY = window.innerHeight / 2;
    gameState.rotation = 0;
    gameState.projectiles = [];
    gameState.enemies = [];
    gameState.ammo = gameState.maxAmmo;
    gameState.reloading = false;
    gameState.score = 0;
    gameState.gameActive = true;
    gameState.lastEnemySpawn = 0;
    
    // Reset active directions
    Object.keys(gameState.activeDirections).forEach(key => {
        gameState.activeDirections[key] = false;
    });
    
    // Clear active button states
    document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
    
    // Initialize obstacles
    initObstacles();
    
    // Clear projectiles and enemies
    elements.projectileContainer.innerHTML = '';
    document.querySelectorAll('.enemy').forEach(enemy => enemy.remove());
    
    // Spawn initial enemies
    for (let i = 0; i < 3; i++) {
        spawnEnemy();
    }
    
    // Update UI
    updateAmmoCounter();
    updateScoreDisplay();
    elements.startMenu.style.display = 'none';
    elements.gameOverModal.style.display = 'none';
    elements.reloadingMessage.style.display = 'none';
    elements.timerDisplay.style.color = 'white';
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop(timestamp) {
    if (!gameState.gameActive) return;
    
    // Spawn enemies regularly
    if (timestamp - gameState.lastEnemySpawn > gameState.enemySpawnRate) {
        spawnEnemy();
        gameState.lastEnemySpawn = timestamp;
    }
    
    // Move projectiles
    moveProjectiles();
    
    // Process movement
    movePlayer();
    
    // Move enemies
    moveEnemies();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    updatePlayerPosition();
    
    requestAnimationFrame(gameLoop);
}

// Player Movement with obstacle collision
function movePlayer() {
    if (!gameState.gameActive) return;

    let moveX = 0;
    let moveY = 0;
    const speed = gameState.playerSpeed;

    // Calculate movement based on active directions
    if (gameState.activeDirections.up) moveY -= speed;
    if (gameState.activeDirections.down) moveY += speed;
    if (gameState.activeDirections.left) moveX -= speed;
    if (gameState.activeDirections.right) moveX += speed;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
        moveX *= Math.SQRT1_2;
        moveY *= Math.SQRT1_2;
    }

    const newX = gameState.playerX + moveX;
    const newY = gameState.playerY + moveY;

    // Check obstacle collision
    const playerSize = 30;
    const playerRect = {
        left: newX,
        right: newX + playerSize,
        top: newY,
        bottom: newY + playerSize
    };

    let canMove = true;
    for (const obstacle of gameState.obstacles) {
        if (rectCollision(playerRect, obstacle)) {
            canMove = false;
            break;
        }
    }

    if (canMove) {
        gameState.playerX = Math.max(0, Math.min(window.innerWidth - playerSize, newX));
        gameState.playerY = Math.max(0, Math.min(window.innerHeight - playerSize, newY));
        
        // Update rotation based on primary direction
        if (moveX !== 0 || moveY !== 0) {
            if (Math.abs(moveX) > Math.abs(moveY)) {
                gameState.rotation = moveX > 0 ? 0 : 180;
            } else {
                gameState.rotation = moveY > 0 ? 90 : -90;
            }
        }
    }

    updatePlayerPosition();
}

// Control button setup
function setupControlButton(button, direction) {
    const setActive = (active) => {
        gameState.activeDirections[direction] = active;
        button.classList.toggle('active', active);
    };

    // Touch events
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setActive(true);
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        setActive(false);
    });
    
    // Mouse events
    button.addEventListener('mousedown', () => setActive(true));
    button.addEventListener('mouseup', () => setActive(false));
    button.addEventListener('mouseleave', () => setActive(false));
}

// Initialize control buttons
setupControlButton(elements.moveUpBtn, 'up');
setupControlButton(elements.moveDownBtn, 'down');
setupControlButton(elements.moveLeftBtn, 'left');
setupControlButton(elements.moveRightBtn, 'right');

function updatePlayerPosition() {
    elements.player.style.left = `${gameState.playerX}px`;
    elements.player.style.top = `${gameState.playerY}px`;
    elements.arrowIndicator.style.left = `${gameState.playerX}px`;
    elements.arrowIndicator.style.top = `${gameState.playerY}px`;
    elements.arrowIndicator.style.transform = `rotate(${gameState.rotation}deg)`;
}

// Projectile System
function fireProjectile() {
    if (gameState.reloading || gameState.ammo <= 0 || !gameState.gameActive) return;
    
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    projectile.style.left = `${gameState.playerX + 15}px`;
    projectile.style.top = `${gameState.playerY + 15}px`;
    elements.projectileContainer.appendChild(projectile);
    
    const radians = (gameState.rotation * Math.PI) / 180;
    const velocity = {
        x: Math.cos(radians) * 10,
        y: Math.sin(radians) * 10
    };
    
    gameState.projectiles.push({
        element: projectile,
        x: gameState.playerX + 15,
        y: gameState.playerY + 15,
        velocity
    });
    
    gameState.ammo--;
    updateAmmoCounter();
    
    if (gameState.ammo <= 0) {
        reload();
    }
}

function moveProjectiles() {
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        const projectile = gameState.projectiles[i];
        const newX = projectile.x + projectile.velocity.x;
        const newY = projectile.y + projectile.velocity.y;
        
        // Check obstacle collision
        const projectileRect = {
            left: newX,
            right: newX + 8,
            top: newY,
            bottom: newY + 8
        };
        
        let hitObstacle = false;
        for (const obstacle of gameState.obstacles) {
            if (rectCollision(projectileRect, obstacle)) {
                hitObstacle = true;
                break;
            }
        }
        
        if (hitObstacle) {
            elements.projectileContainer.removeChild(projectile.element);
            gameState.projectiles.splice(i, 1);
            continue;
        }
        
        projectile.x = newX;
        projectile.y = newY;
        projectile.element.style.left = `${projectile.x}px`;
        projectile.element.style.top = `${projectile.y}px`;
        
        // Remove off-screen projectiles
        if (projectile.x < 0 || projectile.x > window.innerWidth || 
            projectile.y < 0 || projectile.y > window.innerHeight) {
            elements.projectileContainer.removeChild(projectile.element);
            gameState.projectiles.splice(i, 1);
        }
    }
}

function reload() {
    if (gameState.reloading || gameState.ammo === gameState.maxAmmo) return;
    
    gameState.reloading = true;
    elements.reloadingMessage.style.display = 'block';
    
    setTimeout(() => {
        gameState.ammo = gameState.maxAmmo;
        gameState.reloading = false;
        elements.reloadingMessage.style.display = 'none';
        updateAmmoCounter();
    }, gameState.reloadTime);
}

// Enemy System
function spawnEnemy() {
    if (!gameState.gameActive) return;
    
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    
    // Position enemy at edge of screen
    let x, y;
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
        case 0: // Top
            x = Math.random() * window.innerWidth;
            y = -30;
            break;
        case 1: // Right
            x = window.innerWidth;
            y = Math.random() * window.innerHeight;
            break;
        case 2: // Bottom
            x = Math.random() * window.innerWidth;
            y = window.innerHeight;
            break;
        case 3: // Left
            x = -30;
            y = Math.random() * window.innerHeight;
            break;
    }
    
    enemy.style.left = `${x}px`;
    enemy.style.top = `${y}px`;
    elements.gameContainer.appendChild(enemy);
    
    gameState.enemies.push({
        element: enemy,
        x,
        y,
        speed: 1 + Math.random() * 2
    });
}

function moveEnemies() {
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        
        if (!enemy.element) {
            gameState.enemies.splice(i, 1);
            continue;
        }
        
        // Move toward player
        const dx = gameState.playerX - enemy.x;
        const dy = gameState.playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }
        
        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;
        
        // Remove far off-screen enemies
        if (enemy.x < -100 || enemy.x > window.innerWidth + 100 || 
            enemy.y < -100 || enemy.y > window.innerHeight + 100) {
            if (enemy.element.parentNode) {
                enemy.element.parentNode.removeChild(enemy.element);
            }
            gameState.enemies.splice(i, 1);
        }
    }
}

// Collision Detection
function checkCollisions() {
    // Projectile-Enemy collisions
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        const projectile = gameState.projectiles[i];
        
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
            const enemy = gameState.enemies[j];
            
            if (checkCollision(projectile, enemy)) {
                // Remove projectile
                if (projectile.element.parentNode) {
                    elements.projectileContainer.removeChild(projectile.element);
                }
                
                // Remove enemy
                if (enemy.element.parentNode) {
                    enemy.element.parentNode.removeChild(enemy.element);
                }
                
                gameState.projectiles.splice(i, 1);
                gameState.enemies.splice(j, 1);
                
                // Increase score
                gameState.score += 10;
                updateScoreDisplay();
                break;
            }
        }
    }
    
    // Player-Enemy collisions
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        
        if (checkPlayerCollision(enemy)) {
            if (enemy.element.parentNode) {
                enemy.element.parentNode.removeChild(enemy.element);
            }
            
            gameState.enemies.splice(i, 1);
            endGame();
            break;
        }
    }
}

function rectCollision(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function checkCollision(projectile, enemy) {
    const projectileRect = {
        left: projectile.x,
        right: projectile.x + 8,
        top: projectile.y,
        bottom: projectile.y + 8
    };
    
    const enemyRect = {
        left: enemy.x,
        right: enemy.x + 30,
        top: enemy.y,
        bottom: enemy.y + 30
    };
    
    return rectCollision(projectileRect, enemyRect);
}

function checkPlayerCollision(enemy) {
    const playerRect = {
        left: gameState.playerX,
        right: gameState.playerX + 30,
        top: gameState.playerY,
        bottom: gameState.playerY + 30
    };
    
    const enemyRect = {
        left: enemy.x,
        right: enemy.x + 30,
        top: enemy.y,
        bottom: enemy.y + 30
    };
    
    return rectCollision(playerRect, enemyRect);
}

// Game Timer
function startGameTimer() {
    const endTime = Date.now() + gameState.gameTime * 1000;
    
    function updateTimer() {
        if (!gameState.gameActive) return;
        
        const remaining = Math.max(0, endTime - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        elements.timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (remaining <= 30000) {
            elements.timerDisplay.style.color = '#FF5722';
        }
        
        if (remaining <= 0) {
            endGame();
        } else {
            setTimeout(updateTimer, 1000);
        }
    }
    
    updateTimer();
}

// High Score System
function endGame() {
    gameState.gameActive = false;
    
    // Check for new high score
    const isNewHighScore = gameState.highScores.length < 5 || 
                          gameState.score > gameState.highScores[gameState.highScores.length - 1].score;
    
    if (isNewHighScore) {
        // Add to high scores
        gameState.highScores.push({
            name: gameState.playerName,
            score: gameState.score,
            date: new Date().toLocaleDateString()
        });
        
        // Sort and keep top 5
        gameState.highScores.sort((a, b) => b.score - a.score);
        gameState.highScores = gameState.highScores.slice(0, 5);
        gameState.currentHighScore = gameState.highScores[0].score;
        
        // Save to localStorage
        localStorage.setItem('obstacleShooterHighScores', JSON.stringify(gameState.highScores));
    }
    
    // Update display
    elements.finalScoreDisplay.textContent = `${gameState.playerName}'s Score: ${gameState.score}`;
    displayHighScores();
    
    // Show high score message if applicable
    if (isNewHighScore && gameState.score === gameState.currentHighScore) {
        elements.highScoreMessage.textContent = '🎉 New High Score! 🎉';
        elements.highScoreMessage.style.display = 'block';
    } else {
        elements.highScoreMessage.style.display = 'none';
    }
    
    elements.gameOverModal.style.display = 'flex';
}

function displayHighScores() {
    elements.highScoresList.innerHTML = '';
    
    if (gameState.highScores.length === 0) {
        elements.highScoresList.innerHTML = '<p>No high scores yet!</p>';
        return;
    }
    
    gameState.highScores.forEach((score, index) => {
        const scoreElement = document.createElement('div');
        scoreElement.className = 'high-score-entry';
        if (score.name === gameState.playerName && score.score === gameState.score) {
            scoreElement.classList.add('current-player');
        }
        scoreElement.innerHTML = `
            <span class="high-score-rank">${index + 1}.</span>
            <span class="high-score-name">${score.name}</span>
            <span class="high-score-value">${score.score}</span>
            <span class="high-score-date">${score.date}</span>
        `;
        elements.highScoresList.appendChild(scoreElement);
    });
}

// UI Updates
function updateAmmoCounter() {
    elements.ammoCounter.textContent = `Ammo: ${gameState.ammo}/${gameState.maxAmmo}`;
}

function updateScoreDisplay() {
    elements.scoreDisplay.textContent = `Score: ${gameState.score}`;
}

// Event Listeners
function setupEventListeners() {
    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (!gameState.gameActive) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                gameState.activeDirections.left = true;
                elements.moveLeftBtn.classList.add('active');
                break;
            case 'ArrowUp':
                gameState.activeDirections.up = true;
                elements.moveUpBtn.classList.add('active');
                break;
            case 'ArrowRight':
                gameState.activeDirections.right = true;
                elements.moveRightBtn.classList.add('active');
                break;
            case 'ArrowDown':
                gameState.activeDirections.down = true;
                elements.moveDownBtn.classList.add('active');
                break;
            case ' ':
                fireProjectile();
                break;
            case 'r':
                reload();
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                gameState.activeDirections.left = false;
                elements.moveLeftBtn.classList.remove('active');
                break;
            case 'ArrowUp':
                gameState.activeDirections.up = false;
                elements.moveUpBtn.classList.remove('active');
                break;
            case 'ArrowRight':
                gameState.activeDirections.right = false;
                elements.moveRightBtn.classList.remove('active');
                break;
            case 'ArrowDown':
                gameState.activeDirections.down = false;
                elements.moveDownBtn.classList.remove('active');
                break;
        }
    });

    // Button Controls
    elements.fireBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        fireProjectile();
    });
    elements.fireBtn.addEventListener('mousedown', () => fireProjectile());

    elements.reloadBtn.addEventListener('click', () => reload());

    // Game Start/Restart
    elements.startButton.addEventListener('click', () => {
        gameState.gameTime = parseInt(elements.gameDurationSelect.value);
        initGame();
        startGameTimer();
    });

    elements.restartButton.addEventListener('click', () => {
        initGame();
        startGameTimer();
    });
}

// Initialize
function init() {
    elements.startMenu.style.display = 'flex';
    initObstacles();
    loadHighScores();
    setupEventListeners();
}

// Start the game
init();
