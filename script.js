window.onload = () => {
  let totalCount = 0;
  let pickaxePower = 1;
  let pickaxeLevel = 1;
  let prestigeLevel = 0;
  let pickaxeCost = 50;

  const autominers = [
  { name: "Iron Golem", baseCost: 200, cost: 200, rps: 1, owned: 0 },
  { name: "Wither", baseCost: 1000, cost: 1000, rps: 5, owned: 0 },
  { name: "Dragon", baseCost: 5000, cost: 5000, rps: 20, owned: 0 },
  { name: "Warden", baseCost: 20000, cost: 20000, rps: 100, owned: 0 },
];


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

  function calculateRPS() {
    return autominers.reduce((sum, m) => sum + m.rps * m.owned, 0);
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
        m.cost = m.baseCost;
      });
      prestigeLevel++;
      updateUI();
      saveGame();
    } 
  }   
      
  function resetGame() {
  const confirmReset = confirm("Are you sure you want to reset your progress?");
  if (!confirmReset) return;

  localStorage.removeItem("mineclicker-save");

  // Delay reload slightly to ensure localStorage clears first
  setTimeout(() => {
    location.reload();
  }, 100);
  }

  function updateUI() {
    document.getElementById("totalCount").textContent = Math.floor(totalCount);
    document.getElementById("pickaxePower").textContent = pickaxePower;
    document.getElementById("rps").textContent = calculateRPS();
    document.getElementById("pickaxeCost").textContent = pickaxeCost;
    document.getElementById("prestigeLevel").textContent = prestigeLevel;
    document.getElementById("prestigeCost").textContent = getPrestigeCost();

    const minerHTML = autominers.map((m, i) => `
      <div>
        <button onclick="buyMiner(${i})">💠 ${m.name} (Cost: ${m.cost})</button>
        <span> Owned: ${m.owned}</span>
      </div>
    `).join('');
    document.getElementById("minersContainer").innerHTML = minerHTML;
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
        saved.autominers.forEach((data, i) => {
          if (autominers[i]) {
            autominers[i].owned = data.owned;
            autominers[i].cost = data.cost;
          }
        });
      }
    }
  }

  // Run
  loadGame();
  updateUI();
  setInterval(() => {
    totalCount += calculateRPS();
    updateUI();
    saveGame();
  }, 1000);

  // Expose functions
  window.mine = mine;
  window.buyPickaxe = buyPickaxe;
  window.buyMiner = buyMiner;
  window.prestige = prestige;
  window.resetGame = resetGame;
};
