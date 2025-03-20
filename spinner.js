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
    generateReel();
}

function generateReel() {
    let reel = document.getElementById("reel");
    reel.innerHTML = "";

    let extendedGames = [...games, ...games, ...games]; // Extra duplicaten om het rollen realistischer te maken

    extendedGames.forEach(game => {
        let div = document.createElement("div");
        div.className = "reel-item";
        div.textContent = game;
        reel.appendChild(div);
    });
}

function spinWheel() {
    if (games.length === 0) return;

    let reel = document.getElementById("reel");
    let randomIndex = Math.floor(Math.random() * games.length);
    let offset = randomIndex * -33; // Verschuift naar een willekeurige game
    
    reel.style.transition = "transform 3s cubic-bezier(0.25, 1, 0.5, 1)";
    reel.style.transform = `translateX(${offset}%)`;

    setTimeout(() => {
        document.getElementById("result").textContent = `Gekozen minigame: ${games[randomIndex]}`;
        document.getElementById("result").classList.remove("hidden");
    }, 3000);
}

function resetGame() {
    location.reload();
}
