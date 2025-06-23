window.onload = () => {
  let totalCount = 0;
  let pickaxePower = 1;
  let prestigeLevel = 0;
  let pickaxeLevel = 1;
  const miners = {
    "Iron Golem": { count: 0, baseCost: 500, costMult: 1.15, rps: 1 },
    "Wither":     { count: 0, baseCost: 2000, costMult: 1.2, rps: 5 },
    "Dragon":     { count: 0, baseCost: 7500, costMult: 1.25, rps: 20 },
    "Warden":     { count: 0, baseCost: 20000, costMult: 1.3, rps: 75 }
  };

  const mine = () => {
    const gain = pickaxePower * (1 + prestigeLevel * 0.1);
    totalCount += gain;
    shakeBlock();
    updateUI();
    saveGame();
  };

  const shakeBlock = () => {
    const block = document.getElementById("mineBlock");
    block.style.transform = "scale(0.95)";
    setTimeout(() => (block.style.transform = "scale(1)"), 100);
  };

  const buyPickaxe = () => {
    const cost = Math.floor(50 * Math.pow(1.25, pickaxeLevel));
    if (totalCount >= cost) {
      totalCount -= cost;
      pickaxeLevel++;
      pickaxePower++;
      updateUI();
      saveGame();
    }
  };

  const prestige = () => {
    if (totalCount >= 10000) {
      totalCount = 0;
      pickaxePower = 1;
      pickaxeLevel = 1;
      prestigeLevel++;
      for (let key in miners) miners[key].count = 0;
      updateUI();
      saveGame();
    }
  };

  const buyMiner = (name) => {
    const miner = miners[name];
    const cost = Math.floor(miner.baseCost * Math.pow(miner.costMult, miner.count));
    if (totalCount >= cost) {
      totalCount -= cost;
      miner.count++;
      updateUI();
      saveGame();
    }
  };

  const getTotalRPS = () => {
    let rps = 0;
    for (let key in miners) {
      rps += miners[key].count * miners[key].rps;
    }
    return rps * (1 + prestigeLevel * 0.1);
  };

  const updateUI = () => {
    document.getElementById("totalCount").textContent = Math.floor(totalCount);
    document.getElementById("pickaxePower").textContent = pickaxePower;
    document.getElementById("prestigeLevel").textContent = prestigeLevel;
    document.getElementById("pickaxeCost").textContent = Math.floor(50 * Math.pow(1.25, pickaxeLevel));
    document.getElementById("totalRPS").textContent = getTotalRPS().toFixed(1);

    const container = document.getElementById("minersContainer");
    container.innerHTML = "";
    for (let key in miners) {
      const miner = miners[key];
      const cost = Math.floor(miner.baseCost * Math.pow(miner.costMult, miner.count));

      const card = document.createElement("div");
      card.className = "miner-card";
      card.innerHTML = `
        <img src="${key.toLowerCase().replace(" ", "_")}.png" alt="${key}" />
        <h3>${key} x${miner.count}</h3>
        <p>+${miner.rps * miner.count} RPS</p>
        <p>Cost: ${cost} blocks</p>
        <button onclick="buyMiner('${key}')">Hire</button>
      `;
      container.appendChild(card);
    }
  };

  const saveGame = () => {
    const save = {
      totalCount,
      pickaxePower,
      pickaxeLevel,
      prestigeLevel,
      miners
    };
    localStorage.setItem("mineclicker-save", JSON.stringify(save));
  };

  const loadGame = () => {
    const saved = JSON.parse(localStorage.getItem("mineclicker-save"));
    if (saved) {
      totalCount = saved.totalCount ?? 0;
      pickaxePower = saved.pickaxePower ?? 1;
      pickaxeLevel = saved.pickaxeLevel ?? 1;
      prestigeLevel = saved.prestigeLevel ?? 0;
      Object.keys(miners).forEach(key => {
        miners[key].count = saved.miners?.[key]?.count ?? 0;
      });
    }
  };

  // Expose
  window.mine = mine;
  window.buyPickaxe = buyPickaxe;
  window.prestige = prestige;
  window.buyMiner = buyMiner;

  // Init
  loadGame();
  updateUI();
  setInterval(() => {
    totalCount += getTotalRPS();
    updateUI();
    saveGame();
  }, 1000);
};
