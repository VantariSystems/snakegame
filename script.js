const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreBoard = document.getElementById('scoreBoard');
const scoreValue = document.getElementById('scoreValue');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');

const eatSound = new Howl({
    src: ['sounds/eat.mp3', 'sounds/eat.ogg'],
    html5: true,
    onplayerror: function() {
        console.error('Erro ao tentar tocar o som de "comer"');
    }
});

const moveSound = new Howl({
    src: ['sounds/move.mp3', 'sounds/move.ogg'],
    html5: true,
    onplayerror: function() {
        console.error('Erro ao tentar tocar o som de "movimento"');
    }
});

const gameOverSound = new Howl({
    src: ['sounds/gameOver.mp3', 'sounds/gameOver.ogg'],
    html5: true,
    onplayerror: function() {
        console.error('Erro ao tentar tocar o som de "game over"');
    }
});

const backgroundMusic = new Howl({
    src: ['sounds/backgroundMusic.mp3', 'sounds/backgroundMusic.ogg'],
    loop: true,
    volume: 0.5,
    html5: true,
    onplayerror: function() {
        console.error('Erro ao tentar tocar a música de fundo');
    }
});

// Variáveis do jogo
let snake = [{ x: 50, y: 50 }];
let food = { x: 200, y: 200 };
let direction = 'right';
let score = 0;
let gameInterval;
let gameOver = false;
let speed = 100; // Velocidade do jogo

// Função para iniciar o jogo
function startGame() {
    console.log("Iniciando o jogo...");
    backgroundMusic.currentTime = 0; // Reseta o tempo da música
    backgroundMusic.play();  // Inicia a música de fundo

    snake = [{ x: 50, y: 50 }];
    food = { x: 200, y: 200 };
    direction = 'right';
    score = 0;
    gameOver = false;
    speed = 100; // Reseta a velocidade
    canvas.style.display = 'block'; // Mostrar o canvas
    gameOverScreen.style.display = 'none'; // Esconder a tela de game over
    document.getElementById('startScreen').style.display = 'none'; // Esconder a tela de start
    gameInterval = setInterval(updateGame, speed); // Atualizar a cada 100ms
}

// Função para reiniciar o jogo
function restartGame() {
    console.log("Reiniciando o jogo...");
    startGame();
}

// Função para desenhar a cobrinha
function drawSnake() {
    ctx.fillStyle = '#0f0'; // Cor da cobrinha (verde neon)
    for (let i = 0; i < snake.length; i++) {
        let alpha = (i + 1) / snake.length; // Aumenta a opacidade do rastro conforme o segmento é mais antigo
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
    }
}

// Função para desenhar a comida
function drawFood() {
    let gradient = ctx.createRadialGradient(
        food.x + 5, food.y + 5, 2, food.x + 5, food.y + 5, 5
    );
    gradient.addColorStop(0, "#ff4d4d");
    gradient.addColorStop(1, "#990000");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Função para mover a cobrinha
function moveSnake() {
    let head = Object.assign({}, snake[0]);

    switch (direction) {
        case 'up': head.y -= 10; break;
        case 'down': head.y += 10; break;
        case 'left': head.x -= 10; break;
        case 'right': head.x += 10; break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        console.log("Comendo a comida!");
        eatSound.play(); // Agora usando Howler
        score++;
        speed = Math.max(50, speed - 5); // Aumenta a velocidade conforme o jogador vai pontuando
        generateFood(); // Gerar nova comida
    } else {
        snake.pop(); // Remover a última parte da cobrinha
    }
}

// Função para gerar comida em um local aleatório
function generateFood() {
    food.x = Math.floor(Math.random() * 40) * 10;
    food.y = Math.floor(Math.random() * 40) * 10;
}

// Função para verificar colisões
function checkCollision() {
    let head = snake[0];

    // Colisão com as bordas
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// Função de fim de jogo
function endGame() {
    console.log("Fim de jogo!");
    backgroundMusic.pause(); // Pausa a música de fundo
    gameOverSound.play();    // Toca o som de Game Over
    gameOver = true;
    clearInterval(gameInterval); // Parar o intervalo de atualização
    gameOverScreen.style.display = 'block'; // Mostrar a tela de game over
    finalScore.textContent = `Score: ${score}`; // Mostrar o score final
}

// Função para atualizar o jogo
function updateGame() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollision();
}

// Função para controlar a direção da cobrinha com as teclas
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
        moveSound.play();
    } else if (e.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
        moveSound.play();
    } else if (e.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
        moveSound.play();
    } else if (e.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
        moveSound.play();
    }
});

// Adicionar eventos para o botão de "Start" e "Restart"
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
