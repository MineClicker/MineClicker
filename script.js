window.onload = () => {
  let totalCount = 0;
  let pickaxePower = 1;
  let pickaxeLevel = 1;
  let prestigeLevel = 0;

  const autominers = [
    { name: "Iron Golem", cost: 200, rps: 1, owned: 0 },
    { name: "Wither", cost: 1000, rps: 5, owned: 0 },
    { name: "Dragon", cost: 5000, rps: 20, owned: 0 },
    { name: "Warden", cost: 20000, rps: 100, owned: 0 },
  ];

  let pickaxeCost = 50;

  function updateUI() {
    document.getElementById("totalCount").textContent = Math.floor(totalCount);
    document.getElementById("pickaxePower").textContent = pickaxePower;
    document.getElementById("rps").textContent = calculateRPS();
    document.getElementById("pickaxeCost").textContent = pickaxeCost;
    document.getElementById("prestigeLevel").textContent = prestigeLevel;
    document.getElementById("prestigeCost").textContent = getPrestigeCost();

    const minerHTML = autominers.map((miner, index) => `
      <div>
        <button onclick="buyMiner(${index})">💠 ${miner.name} (Cost: ${miner.cost})</button>
        <span>Owned: ${miner.owned}</span>
      </div>
    `).join('');
    document.getElementById("minersContainer").innerHTML = minerHTML;
  }

  function calculateRPS() {
    return autominers.reduce((sum, m) => sum + m.rps * m.owned, 0);
  }

  function mine() {
    const gain = pickaxePower * (1 + prestigeLevel * 0.1);
    totalCount += gain;
    shakeBlock();
    updateUI();
    saveGame();
  }

  function shakeBlock() {
    const block = document.getElementById("mineBlock");
    block.style.transform = "scale(0.95)";
    setTimeout(() => (block.style.transform = "scale(1)"), 100);
  }

  function buyPickaxe() {
    if (totalCount >= pickaxeCost) {
      totalCount -= pickaxeCost;
      pickaxeLevel++;
      pickaxePower++;
      pickaxeCost = Math.floor(pickaxeCost * 1.75);
      updateUI();
      saveGame();
    }
  }

  function buyMiner(index) {
    const miner = autominers[index];
    if (totalCount >= miner.cost) {
      totalCount -= miner.cost;
      miner.owned++;
      miner.cost = Math.floor(miner.cost * 1.6);
      updateUI();
      saveGame();
    }
  }

  function getPrestigeCost() {
    return 10000 * (prestigeLevel + 1);
  }

  function prestige() {
    const cost = getPrestigeCost();
    if (totalCount >= cost) {
      totalCount = 0;
      pickaxePower = 1;
      pickaxeLevel = 1;
      pickaxeCost = 50;
      autominers.forEach(m => {
        m.owned = 0;
        m.cost = m.cost; // Reset cost to original
      });
      prestigeLevel++;
      updateUI();
      saveGame();
    }
  }

  function resetGame() {
    localStorage.removeItem("mineclicker-save");
    location.reload();
  }

  function saveGame() {
    const saveData = {
      totalCount,
      pickaxePower,
      pickaxeLevel,
      pickaxeCost,
      prestigeLevel,
      autominers,
    };
    localStorage.setItem("mineclicker-save", JSON.stringify(saveData));
  }

  function loadGame() {
    const saved = JSON.parse(localStorage.getItem("mineclicker-save"));
    if (saved) {
      totalCount = saved.totalCount ?? 0;
      pickaxePower = saved.pickaxePower ?? 1;
      pickaxeLevel = saved.pickaxeLevel ?? 1;
      pickaxeCost = saved.pickaxeCost ?? 50;
      prestigeLevel = saved.prestigeLevel ?? 0;
      if (saved.autominers) {
        saved.autominers.forEach((savedMiner, i) => {
          if (autominers[i]) {
            autominers[i].owned = savedMiner.owned;
            autominers[i].cost = savedMiner.cost;
          }
        });
      }
    }
  }

  loadGame();
  updateUI();
  setInterval(() => {
    totalCount += calculateRPS();
    updateUI();
    saveGame();
  }, 1000);

  window.mine = mine;
  window.buyPickaxe = buyPickaxe;
  window.buyMiner = buyMiner;
  window.prestige = prestige;
  window.resetGame = resetGame;
};
