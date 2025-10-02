// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Pig image variables
let piggyImage = new Image();
let imageLoaded = false;

// Background image variables
let backgroundImage = new Image();
let backgroundLoaded = false;

// Hammer image variables
let hammerImage = new Image();
let hammerLoaded = false;

// Coin image variables
let coinImage = new Image();
let coinLoaded = false;

// Dollar bill image variables
let dollarBillImage = new Image();
let dollarBillLoaded = false;

// Load the pig image
piggyImage.onload = function() {
    imageLoaded = true;
};
piggyImage.src = 'pig.png'; // Your pig PNG file

// Load the background image
backgroundImage.onload = function() {
    backgroundLoaded = true;
};
backgroundImage.src = 'background.png'; // Your background PNG file

// Load the hammer image
hammerImage.onload = function() {
    hammerLoaded = true;
};
hammerImage.src = 'hammer.svg'; // Your hammer SVG file

// Load the coin image
coinImage.onload = function() {
    coinLoaded = true;
};
coinImage.src = 'coin.png'; // Your coin PNG file

// Load the dollar bill image
dollarBillImage.onload = function() {
    dollarBillLoaded = true;
};
dollarBillImage.src = 'dollarbill.png'; // Your dollar bill PNG file

// Game state
let gameRunning = false; // Start with false - wait for name input
let score = 0;
let gameSpeed = 1;
let currentRound = 1;
let hammerHits = 0;
let gameWon = false;
let playerName = '';

// Round thresholds
const ROUND_2_THRESHOLD = 300;
const ROUND_3_THRESHOLD = 600;
const WIN_THRESHOLD = 1000;
const MAX_HAMMER_HITS = 3;

// Piggy bank object
const piggyBank = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 90,
    width: 110,
    height: 70,
    speed: 5,
    color: '#FF69B4'
};

// Game objects arrays
let coins = [];
let dollarBills = [];
let hammers = [];

// Input handling
const keys = {
    left: false,
    right: false
};

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        keys.left = true;
    }
    if (e.key === 'ArrowRight') {
        keys.right = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight') {
        keys.right = false;
    }
});

// Coin class
class Coin {
    constructor() {
        this.x = Math.random() * (canvas.width - 30);
        this.y = -30;
        this.width = 30;
        this.height = 30;
        this.speed = 2 + Math.random() * 2.5;
        this.rotation = 0;
        this.rotationSpeed = 0.1;
        this.type = 'coin';
        this.value = 10;
    }

    update() {
        this.y += this.speed * gameSpeed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        if (coinLoaded) {
            // Draw the PNG image
            ctx.drawImage(
                coinImage,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        } else {
            // Fallback: draw the original coin design while image loads
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
        }
        
        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

// Dollar Bill class
class DollarBill {
    constructor() {
        this.x = Math.random() * (canvas.width - 50);
        this.y = -40;
        this.width = 50;
        this.height = 50;
        this.speed = 1.5 + Math.random() * 1.5;
        this.rotation = 0;
        this.rotationSpeed = 0.05;
        this.type = 'dollarBill';
        this.value = 20;
    }

    update() {
        this.y += this.speed * gameSpeed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        if (dollarBillLoaded) {
            // Draw the PNG image
            ctx.drawImage(
                dollarBillImage,
                -this.width/4,
                -this.height/4,
                this.width,
                this.height
            );
        } else {
            // Fallback: draw the original dollar bill design while image loads
            ctx.fillStyle = '#228B22';
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            
            ctx.strokeStyle = '#006400';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$20', 0, 0);
        }
        
        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

// Hammer class
class Hammer {
    constructor() {
        this.x = Math.random() * (canvas.width - 35);
        this.y = -40;
        this.width = 45;
        this.height = 45;
        this.speed = 4 + Math.random() * 2.5;
        this.rotation = 0;
        this.rotationSpeed = 0.10;
        this.type = 'hammer';
        this.value = -20;
    }

    update() {
        this.y += this.speed * gameSpeed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        if (hammerLoaded) {
            // Draw the SVG image
            ctx.drawImage(
                hammerImage,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        } else {
            // Fallback: simple gray rectangle while image loads
            ctx.fillStyle = '#696969';
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            
            // Add simple text to show it's loading
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Loading...', 0, 0);
        }
        
        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height;
    }
}

// Draw piggy bank
function drawPiggyBank() {
    ctx.save();
    
    if (imageLoaded) {
        // Check if pig is splitting (3 hammer hits)
        if (hammerHits >= MAX_HAMMER_HITS) {
            drawSplitPig();
        } else {
            // Draw the normal PNG image
            ctx.drawImage(
                piggyImage,
                piggyBank.x,
                piggyBank.y,
                piggyBank.width,
                piggyBank.height
            );
            
            // Draw cracks based on hammer hits
            if (hammerHits > 0) {
                drawPigCracks();
            }
        }
    } else {
        // Fallback: draw a simple pink rectangle while image loads
        ctx.fillStyle = piggyBank.color;
        ctx.fillRect(piggyBank.x, piggyBank.y, piggyBank.width, piggyBank.height);
        
        // Add simple text to show it's loading
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', piggyBank.x + piggyBank.width/2, piggyBank.y + piggyBank.height/2);
    }
    
    ctx.restore();
}

// Draw cracks on the pig based on hammer hits
function drawPigCracks() {
    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    const centerX = piggyBank.x + piggyBank.width / 2;
    const centerY = piggyBank.y + piggyBank.height / 2;
    
    if (hammerHits >= 1) {
        // First crack - small diagonal crack from top-left
        ctx.beginPath();
        ctx.moveTo(piggyBank.x + 15, piggyBank.y + 10);
        ctx.lineTo(piggyBank.x + 25, piggyBank.y + 20);
        ctx.stroke();
    }
    
    if (hammerHits >= 2) {
        // Second crack - longer crack from top-right
        ctx.beginPath();
        ctx.moveTo(piggyBank.x + piggyBank.width - 10, piggyBank.y + 15);
        ctx.lineTo(centerX + 5, centerY - 5);
        ctx.stroke();
        
        // Additional small crack on the side
        ctx.beginPath();
        ctx.moveTo(piggyBank.x + piggyBank.width - 5, piggyBank.y + 30);
        ctx.lineTo(piggyBank.x + piggyBank.width - 15, piggyBank.y + 40);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Draw split pig animation (called when hammerHits >= 3)
function drawSplitPig() {
    ctx.save();
    
    // Calculate split animation progress (gets wider over time)
    const splitTime = Date.now() - piggyBank.splitStartTime || 0;
    const splitOffset = Math.min(splitTime * 0.05, 20); // Max 20px separation
    
    // Draw left half
    ctx.drawImage(
        piggyImage,
        0, 0, piggyImage.width / 2, piggyImage.height, // Source: left half of image
        piggyBank.x - splitOffset, piggyBank.y, // Destination: moved left
        piggyBank.width / 2, piggyBank.height
    );
    
    // Draw right half  
    ctx.drawImage(
        piggyImage,
        piggyImage.width / 2, 0, piggyImage.width / 2, piggyImage.height, // Source: right half of image
        piggyBank.x + piggyBank.width / 2 + splitOffset, piggyBank.y, // Destination: moved right
        piggyBank.width / 2, piggyBank.height
    );
    
    // Draw jagged split line in the middle
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const splitX = piggyBank.x + piggyBank.width / 2;
    ctx.moveTo(splitX, piggyBank.y);
    
    // Create jagged line
    for (let i = 0; i <= piggyBank.height; i += 8) {
        const jaggedOffset = (i % 16 === 0) ? -3 : 3;
        ctx.lineTo(splitX + jaggedOffset, piggyBank.y + i);
    }
    ctx.stroke();
    
    ctx.restore();
}

// Update piggy bank position
function updatePiggyBank() {
    if (keys.left && piggyBank.x > 0) {
        piggyBank.x -= piggyBank.speed;
    }
    if (keys.right && piggyBank.x < canvas.width - piggyBank.width) {
        piggyBank.x += piggyBank.speed;
    }
}

// Spawn game objects based on current round
function spawnObjects() {
    const spawnRate = 0.05 + (gameSpeed * 0.01);
    
    if (Math.random() < spawnRate) {
        if (currentRound === 1) {
            // Round 1: Only coins
            coins.push(new Coin());
        } else if (currentRound === 2) {
            // Round 2: Coins and dollar bills
            if (Math.random() < 0.7) {
                coins.push(new Coin());
            } else {
                dollarBills.push(new DollarBill());
            }
        } else if (currentRound === 3) {
            // Round 3: Coins, dollar bills, and hammers (more hammers!)
            const rand = Math.random();
            if (rand < 0.3) {
                coins.push(new Coin());
            } else if (rand < 0.5) {
                dollarBills.push(new DollarBill());
            } else {
                hammers.push(new Hammer());
            }
        }
    }
}

// Update all game objects
function updateGameObjects() {
    // Update coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].update();
        if (coins[i].isOffScreen()) {
            coins.splice(i, 1);
        }
    }
    
    // Update dollar bills
    for (let i = dollarBills.length - 1; i >= 0; i--) {
        dollarBills[i].update();
        if (dollarBills[i].isOffScreen()) {
            dollarBills.splice(i, 1);
        }
    }
    
    // Update hammers
    for (let i = hammers.length - 1; i >= 0; i--) {
        hammers[i].update();
        if (hammers[i].isOffScreen()) {
            hammers.splice(i, 1);
        }
    }
}

// Draw all game objects
function drawGameObjects() {
    coins.forEach(coin => coin.draw());
    dollarBills.forEach(bill => bill.draw());
    hammers.forEach(hammer => hammer.draw());
}

// Collision detection
function checkCollisions() {
    // Check coin collisions
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (isColliding(coin, piggyBank)) {
            coins.splice(i, 1);
            updateScore(coin.value);
        }
    }
    
    // Check dollar bill collisions
    for (let i = dollarBills.length - 1; i >= 0; i--) {
        const bill = dollarBills[i];
        if (isColliding(bill, piggyBank)) {
            dollarBills.splice(i, 1);
            updateScore(bill.value);
        }
    }
    
    // Check hammer collisions
    for (let i = hammers.length - 1; i >= 0; i--) {
        const hammer = hammers[i];
        if (isColliding(hammer, piggyBank)) {
            hammers.splice(i, 1);
            updateScore(hammer.value);
            hammerHits++;
            
            // Visual feedback for getting hit by hammer (flash effect)
            canvas.style.filter = 'brightness(1.5) hue-rotate(0deg) saturate(2)';
            setTimeout(() => {
                canvas.style.filter = 'none';
            }, 100);
            
            // Check if player has been hit by too many hammers
            if (hammerHits >= MAX_HAMMER_HITS) {
                // Start pig split animation
                piggyBank.splitStartTime = Date.now();
                gameRunning = false; // Stop spawning new objects
                
                // Show game over after pig split animation completes
                setTimeout(() => {
                    gameOver("Too many hammer hits!");
                }, 1500); // 1.5 second delay to show the split animation
                return;
            }
        }
    }
}

// Helper function to check collision between two objects
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Update score and check for round progression
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
    
    // Prevent negative scores
    if (score < 0) {
        score = 0;
        scoreElement.textContent = score;
    }
    
    // Check for round progression
    checkRoundProgression();
    
    // Increase game speed slightly for positive points
    if (points > 0) {
        gameSpeed += 0.01;
    }
}

// Check if player should advance to next round or win
function checkRoundProgression() {
    if (currentRound === 1 && score >= ROUND_2_THRESHOLD) {
        currentRound = 2;
        showRoundTransition("Round 2: Dollar Bills Incoming!");
    } else if (currentRound === 2 && score >= ROUND_3_THRESHOLD) {
        currentRound = 3;
        showRoundTransition("Round 3: Watch Out for Hammers!");
    } else if (currentRound === 3 && score >= WIN_THRESHOLD) {
        // Player wins!
        gameWon = true;
        gameWin();
    }
}

// Show round transition message
function showRoundTransition(message) {
    // Create temporary message element
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: #FFD700;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out forwards;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#roundTransitionStyle')) {
        const style = document.createElement('style');
        style.id = 'roundTransitionStyle';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageElement);
    
    // Remove message after animation
    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 3000);
}

// Draw round information
function drawRoundInfo() {
    ctx.save();
    
    // Adjust panel height for Round 3 (need more space for hammer info)
    const panelHeight = currentRound === 3 ? 120 : 80;
    
    // Round display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 150, 10, 140, panelHeight);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Round: ${currentRound}`, canvas.width - 140, 35);
    
    // Show next round requirement or win condition
    let nextTarget = '';
    if (currentRound === 1) {
        nextTarget = `Next: ${ROUND_2_THRESHOLD}`;
    } else if (currentRound === 2) {
        nextTarget = `Next: ${ROUND_3_THRESHOLD}`;
    } else {
        nextTarget = `WIN: ${WIN_THRESHOLD}`;
    }
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText(nextTarget, canvas.width - 140, 55);
    
    // Show current items
    ctx.font = '12px Arial';
    let itemsText = '';
    if (currentRound === 1) {
        itemsText = 'Items: Coins';
    } else if (currentRound === 2) {
        itemsText = 'Items: Coins, Bills';
    } else {
        itemsText = 'Items: Coins, Bills, Hammers';
    }
    ctx.fillText(itemsText, canvas.width - 140, 75);
    
    // Show hammer hit counter in Round 3
    if (currentRound === 3) {
        const remainingHits = MAX_HAMMER_HITS - hammerHits;
        ctx.fillStyle = remainingHits <= 1 ? '#FF4444' : '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`Hammer Hits: ${hammerHits}/${MAX_HAMMER_HITS}`, canvas.width - 140, 95);
        
        ctx.fillStyle = remainingHits <= 1 ? '#FF6666' : '#CCCCCC';
        ctx.font = '11px Arial';
        ctx.fillText(`${remainingHits} hits left!`, canvas.width - 140, 110);
    }
    
    ctx.restore();
}

// Draw background
function drawBackground() {
    if (backgroundLoaded) {
        // Draw the background image scaled to fit the canvas
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Fallback: Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw animated clouds on top of the background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Slightly more transparent to blend with new background
    for (let i = 0; i < 5; i++) {
        const x = (i * 200) % canvas.width;
        const y = 50 + Math.sin(Date.now() * 0.001 + i) * 10;
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Game over function
function gameOver(reason = "") {
    gameRunning = false;
    finalScoreElement.textContent = score;
    
    // Check if this is a new high score
    const isNewHighScore = isHighScore(score);
    if (isNewHighScore) {
        saveHighScore(playerName, score);
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }
    
    // Update the game over message based on the reason
    const gameOverTitle = gameOverElement.querySelector('h2');
    if (reason === "Too many hammer hits!") {
        gameOverTitle.textContent = "Game Over - Too Many Hammers!";
        gameOverTitle.style.color = '#FF4444';
    } else {
        gameOverTitle.textContent = "Game Over!";
        gameOverTitle.style.color = '#FFFFFF';
    }
    
    gameOverElement.style.display = 'block';
}

// Game win function
function gameWin() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    
    // Always save win scores as high scores
    saveHighScore(playerName, score);
    document.getElementById('newHighScore').style.display = 'block';
    
    // Update the game over element to show victory
    const gameOverTitle = gameOverElement.querySelector('h2');
    gameOverTitle.textContent = "🎉 YOU WON! 🎉";
    gameOverTitle.style.color = '#FFD700';
    
    // Add victory message
    let victoryMessage = gameOverElement.querySelector('.victory-message');
    if (!victoryMessage) {
        victoryMessage = document.createElement('p');
        victoryMessage.className = 'victory-message';
        victoryMessage.style.color = '#90EE90';
        victoryMessage.style.fontSize = '18px';
        victoryMessage.style.marginTop = '10px';
        gameOverElement.insertBefore(victoryMessage, gameOverElement.querySelector('.restart-btn'));
    }
    victoryMessage.textContent = 'You survived all 3 rounds and reached 1000 points!';
    
    gameOverElement.style.display = 'block';
}

// Restart game function
function restartGame() {
    // Reset game state but keep the same player
    score = 0;
    gameSpeed = 1;
    currentRound = 1;
    hammerHits = 0;
    gameWon = false;
    coins = [];
    dollarBills = [];
    hammers = [];
    piggyBank.x = canvas.width / 2 - 40;
    piggyBank.splitStartTime = null;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    
    // Reset any visual effects
    canvas.style.filter = 'none';
    
    // Remove any victory message
    const victoryMessage = gameOverElement.querySelector('.victory-message');
    if (victoryMessage) {
        victoryMessage.remove();
    }
    
    // Reset game over title and hide new high score
    const gameOverTitle = gameOverElement.querySelector('h2');
    gameOverTitle.textContent = "Game Over!";
    gameOverTitle.style.color = '#FFFFFF';
    document.getElementById('newHighScore').style.display = 'none';
    
    // Start the game
    gameRunning = true;
}

// Main game loop
let gameLoopRunning = false;

function gameLoop() {
    // Always draw if we're showing split animation, otherwise only if game is running
    const showingSplitAnimation = hammerHits >= MAX_HAMMER_HITS && piggyBank.splitStartTime;
    if (!gameRunning && !showingSplitAnimation) {
        gameLoopRunning = false;
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Only update game mechanics if game is actually running
    if (gameRunning) {
        // Update game objects
        updatePiggyBank();
        spawnObjects();
        updateGameObjects();
        checkCollisions();
        
        // Draw game objects
        drawGameObjects();
    }
    
    // Always draw the pig (normal or split animation)
    drawPiggyBank();
    
    // Draw round info
    drawRoundInfo();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
loadHighScores();
setupNameInput();

// High Score Management Functions
function getHighScores() {
    const stored = localStorage.getItem('piggyGameHighScores');
    return stored ? JSON.parse(stored) : [];
}

function saveHighScore(name, score) {
    const highScores = getHighScores();
    highScores.push({ name: name, score: score, date: new Date().toLocaleDateString() });
    
    // Sort by score (highest first) and keep only top 10
    highScores.sort((a, b) => b.score - a.score);
    const topScores = highScores.slice(0, 10);
    
    localStorage.setItem('piggyGameHighScores', JSON.stringify(topScores));
    return topScores;
}

function isHighScore(score) {
    const highScores = getHighScores();
    return highScores.length < 10 || score > highScores[highScores.length - 1].score;
}

function displayHighScores() {
    const highScores = getHighScores();
    const highScoresList = document.getElementById('highScoresList');
    
    if (highScores.length === 0) {
        highScoresList.innerHTML = `
            <div class="high-score-item">
                <span class="high-score-name">No scores yet!</span>
                <span class="high-score-score">Play to set the first record!</span>
            </div>
        `;
        return;
    }
    
    highScoresList.innerHTML = highScores.map((score, index) => `
        <div class="high-score-item">
            <span class="high-score-name">${index + 1}. ${score.name}</span>
            <span class="high-score-score">${score.score} pts</span>
        </div>
    `).join('');
}

function loadHighScores() {
    displayHighScores();
}

// Name Input Functions
function setupNameInput() {
    const nameInput = document.getElementById('playerNameInput');
    const startBtn = document.getElementById('startGameBtn');
    
    nameInput.addEventListener('input', function() {
        const name = this.value.trim();
        startBtn.disabled = name.length === 0;
    });
    
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !startBtn.disabled) {
            startGameWithName();
        }
    });
    
    // Focus on name input when page loads
    setTimeout(() => nameInput.focus(), 100);
}

function startGameWithName() {
    const nameInput = document.getElementById('playerNameInput');
    const name = nameInput.value.trim();
    
    if (name.length === 0) {
        alert('Please enter your name!');
        return;
    }
    
    playerName = name;
    hideNameInput();
    startGame();
}

function showNameInput() {
    document.getElementById('nameInputScreen').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    displayHighScores();
    
    // Clear and focus name input
    const nameInput = document.getElementById('playerNameInput');
    nameInput.value = '';
    nameInput.focus();
    document.getElementById('startGameBtn').disabled = true;
}

function hideNameInput() {
    document.getElementById('nameInputScreen').style.display = 'none';
}

function startGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 1;
    currentRound = 1;
    hammerHits = 0;
    gameWon = false;
    coins = [];
    dollarBills = [];
    hammers = [];
    piggyBank.x = canvas.width / 2 - 40;
    piggyBank.splitStartTime = null;
    scoreElement.textContent = score;
    
    // Reset any visual effects
    canvas.style.filter = 'none';
    
    // Start the game loop if not already running
    if (!gameLoopRunning) {
        gameLoopRunning = true;
        gameLoop();
    }
}
