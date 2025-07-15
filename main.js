const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

const stars = [];
const numStars = 200;
const galaxies = [];
const shockwaves = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let colorPhase = 0;
let bgShift = 0;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        alpha: Math.random(),
        delta: Math.random() * 0.02,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        layer: Math.random() * 3 + 1,
        shapeShift: Math.random() > 0.9,
        color: `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 255, 1)`
    });
}

for (let i = 0; i < 5; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    galaxies.push({
        x,
        y,
        size: Math.random() * 100 + 50,
        arms: 5 + Math.floor(Math.random() * 3),
        dots: 50 + Math.floor(Math.random() * 100),
        rotation: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        colorPhase: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002
    });
}

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bgShift += 0.0002;
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `rgb(${30 + Math.sin(bgShift) * 10}, 10, 20)`);
    gradient.addColorStop(0.5, "#0A0A1E");
    gradient.addColorStop(1, `rgb(5, 5, ${40 + Math.sin(bgShift) * 10})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.alpha += star.delta;
        if (star.alpha >= 1 || star.alpha <= 0) {
            star.delta *= -1;
        }
        
        let dx = (mouseX - canvas.width / 2) * 0.001 * star.layer;
        let dy = (mouseY - canvas.height / 2) * 0.001 * star.layer;
        
        star.x += star.speedX + dx;
        star.y += star.speedY + dy;
        
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        if (star.shapeShift) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y - star.radius);
            ctx.lineTo(star.x + star.radius * 0.6, star.y + star.radius * 0.6);
            ctx.lineTo(star.x - star.radius * 0.6, star.y + star.radius * 0.6);
            ctx.closePath();
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        }
    });
}


function animate() {
    drawStars();
    requestAnimationFrame(animate);
}

animate();




const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const reStartBtn = document.getElementById("restartBtn");
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
let options = ['','','','','','','','',''];
let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
let running = false;

initializeGame()



function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    reStartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}


function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex")

    if (options[cellIndex] !== '' || !running) {
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `${currentPlayer}'s turn`;
}
function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cell1 = options[condition[0]];
        const cell2 = options[condition[1]];
        const cell3 = options[condition[2]];

        if (cell1 === '' || cell2 === '' || cell3 === '') {
            continue;
        }
        if (cell1 === cell2 && cell2 === cell3) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes('')) {
        statusText.textContent = "It's a draw!";
        running = false;
    } else {
        changePlayer();
    }
}
function restartGame(){
    currentPlayer = 'X';
    options = ['','','','','','','','',''];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
    });
    running = true;
}