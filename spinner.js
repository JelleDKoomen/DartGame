let games = [];

function addGame() {
    let input = document.getElementById("gameInput");
    let game = input.value.trim();
    
    if (game) {
        games.push(game);
        let listItem = document.createElement("li");
        listItem.textContent = game;
        document.getElementById("gameList").appendChild(listItem);
        input.value = "";

        document.getElementById("startSpinner").disabled = false;
    }
}

function showSpinner() {
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("spinnerContainer").classList.remove("hidden");
    drawWheel();
}

let canvas = document.getElementById("wheelCanvas");
let ctx = canvas.getContext("2d");
let spinning = false;
let selectedGame = "";

function drawWheel() {
    let sections = games.length;
    let anglePerSection = (2 * Math.PI) / sections;
    
    for (let i = 0; i < sections; i++) {
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i * anglePerSection, (i + 1) * anglePerSection);
        ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ffaa00";
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(games[i], 250 + Math.cos(i * anglePerSection + anglePerSection / 2) * 150, 
                     250 + Math.sin(i * anglePerSection + anglePerSection / 2) * 150);
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    
    let rotations = Math.floor(Math.random() * 10) + 5;
    let duration = 3000; 

    let start = performance.now();
    function animate(time) {
        let elapsed = time - start;
        let progress = elapsed / duration;

        let spinAngle = rotations * 360 * (1 - Math.pow(1 - progress, 3)); 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate((spinAngle * Math.PI) / 180);
        ctx.translate(-250, -250);
        drawWheel();
        ctx.restore();

        if (elapsed < duration) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            let index = Math.floor(Math.random() * games.length);
            selectedGame = games[index];
            document.getElementById("result").textContent = "Gekozen minigame: " + selectedGame;
        }
    }
    
    requestAnimationFrame(animate);
}

function resetGame() {
    location.reload();
}
