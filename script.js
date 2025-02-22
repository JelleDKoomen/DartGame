document.addEventListener('DOMContentLoaded', () => {
    const setupPage = document.getElementById('setup');
    const gamePage = document.getElementById('game');
    const resultsPage = document.getElementById('results');
    const orderForm = document.getElementById('order-form');
    const orderList = document.getElementById('order-list');
    const totalAmountSpan = document.getElementById('total-amount');
    const finishButton = document.getElementById('finish-button');
    const endGameModal = document.getElementById('endGameModal');
    const confettiCanvas = document.getElementById('confetti');

    let players = [];
    let scores = {};
    let currentPlayerIndex = 0;
    let currentRound = 1;
    let throws = [];
    let orders = [];

    if (orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const address = document.getElementById('address').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const paymentMethod = document.getElementById('payment-method').value;

            const order = { address, amount, paymentMethod };
            orders.push(order);
            updateOrderList();
            updateTotalAmount();
        });

        orderList.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-button')) {
                const index = event.target.dataset.index;
                orders.splice(index, 1);
                updateOrderList();
                updateTotalAmount();
            }
        });

        finishButton.addEventListener('click', () => {
            orders = [];
            updateOrderList();
            updateTotalAmount();
        });

        function updateOrderList() {
            orderList.innerHTML = '';
            orders.forEach((order, index) => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.textContent = `${order.address} - €${order.amount.toFixed(2)} (Payment: ${order.paymentMethod})`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.dataset.index = index;
                li.appendChild(deleteButton);
                orderList.appendChild(li);
            });
        }

        function updateTotalAmount() {
            const totalAmount = orders
                .filter(order => order.paymentMethod === 'contant')
                .reduce((sum, order) => sum + order.amount, 0);
            totalAmountSpan.textContent = totalAmount.toFixed(2);
        }
    }

    // Existing Dart game functions
    function addPlayer() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) return;
        if (players.length >= 6) return alert('Maximum 6 players allowed.');
        players.push(playerName);
        scores[playerName] = 0;
        updatePlayerList();
        document.getElementById('playerName').value = '';
    }

    function updatePlayerList() {
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = players.map((p, i) => `
            <div class="player-item">
                <span>${p}</span>
                <button onclick="removePlayer(${i})"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }

    function startGame() {
        if (players.length === 0) return alert('Enter at least one player.');
        setupPage.classList.add('hidden');
        gamePage.classList.remove('hidden');
        updateUI();
    }

    function recordThrow(points) {
        if (throws.length < 3) {
            points = points === '' ? 0 : parseInt(points, 10);
            if (isNaN(points)) return alert('Invalid points.');
            throws.push(points);
            updateThrowsList();
        }
    }

    function removePlayer(index) {
        players.splice(index, 1);
        updatePlayerList();
    }

    function removeThrow(index) {
        throws.splice(index, 1);
        updateThrowsList();
    }

    function updateThrowsList() {
        const throwsList = document.getElementById('throwsList');
        throwsList.innerHTML = throws.map((t, i) => `
            <div>
                ${t}
                <button onclick="removeThrow(${i})"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
        for (let i = throws.length; i < 3; i++) {
            throwsList.innerHTML += `
                <div>
                    0
                </div>
            `;
        }
    }

    function nextPlayer() {
        if (throws.length < 3) return alert('Complete 3 throws first.');
        scores[players[currentPlayerIndex]] += throws.reduce((a, b) => a + b, 0);
        throws = [];
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (currentRound === 21 && currentPlayerIndex === 0) return endGame();
        if (currentPlayerIndex === 0) currentRound++;
        updateUI();
    }

    function updateUI() {
        document.getElementById('round').textContent = currentRound;
        document.getElementById('currentPlayer').textContent = players[currentPlayerIndex];
        updateThrowsList();
    }

    function showEndGameModal() {
        document.getElementById('endGameModal').style.display = 'flex';
    }

    function closeEndGameModal() {
        document.getElementById('endGameModal').style.display = 'none';
    }

    function endGame() {
        closeEndGameModal();
        gamePage.classList.add('hidden');
        resultsPage.classList.remove('hidden');
        let finalScores = document.getElementById('finalScores');
        finalScores.innerHTML = players.map(p => `<p>${p}: ${scores[p]}</p>`).join('');
        let sortedPlayers = players.slice().sort((a, b) => scores[b] - scores[a]);
        document.getElementById('winner').textContent = sortedPlayers[0] || "No winner";
        document.getElementById('firstPlace').textContent = sortedPlayers[0] || "-";
        document.getElementById('secondPlace').textContent = sortedPlayers[1] || "-";
        document.getElementById('thirdPlace').textContent = sortedPlayers[2] || "-";
        
        launchConfetti();
    }
    
    function launchConfetti() {
        const canvas = document.getElementById("confetti");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const colors = ["gold", "red", "blue", "green", "purple"];
        let particles = Array.from({length: 100}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 5 + 2,
            d: Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                p.y += p.d;
                if (p.y > canvas.height) p.y = 0;
            });
            requestAnimationFrame(draw);
        }
        draw();
    }

    // Expose functions to global scope for inline event handlers
    window.addPlayer = addPlayer;
    window.startGame = startGame;
    window.recordThrow = recordThrow;
    window.removePlayer = removePlayer;
    window.removeThrow = removeThrow;
    window.nextPlayer = nextPlayer;
    window.showEndGameModal = showEndGameModal;
    window.closeEndGameModal = closeEndGameModal;
    window.endGame = endGame;
});