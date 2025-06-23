window.onload = () => {
  const inventory = {
    stone: 0,
    coal: 0,
    iron: 0,
    diamond: 0,
  };

  const layers = ["Stone", "Coal", "Iron", "Diamond"];
  const layerRequirements = {
    Coal: { stone: 50 },
    Iron: { coal: 30 },
    Diamond: { iron: 20 },
  };

  let currentLayer = "Stone";
  let pickaxePower = 1;
  let totalCount = 0;
  let prestigeLevel = 0;

  const upgradeRequirements = {
    2: { stone: 100 },
    3: { coal: 50 },
    4: { iron: 30 },
    5: { diamond: 10 },
  };

  function updateUI() {
    document.getElementById("stone").textContent = inventory.stone;
    document.getElementById("coal").textContent = inventory.coal;
    document.getElementById("iron").textContent = inventory.iron;
    document.getElementById("diamond").textContent = inventory.diamond;
    document.getElementById("pickaxePower").textContent = pickaxePower;
    document.getElementById("totalCount").textContent = totalCount;
    document.getElementById("prestigeLevel").textContent = prestigeLevel;
    document.getElementById("currentLayer").textContent = currentLayer;
    document.getElementById("mineBlock").src = currentLayer.toLowerCase() + ".png";
  }

  function mine() {
    const gain = pickaxePower * (1 + prestigeLevel * 0.1);
    inventory[currentLayer.toLowerCase()] += gain;
    totalCount += gain;
    checkUnlocks();
    updateUI();
    saveGame();
  }

  function buyPickaxe(level) {
    if (pickaxePower >= level) return;
    const req = upgradeRequirements[level];
    const canBuy = Object.entries(req).every(([res, amt]) => inventory[res] >= amt);
    if (canBuy) {
      Object.entries(req).forEach(([res, amt]) => (inventory[res] -= amt));
      pickaxePower = level;
      updateUI();
      saveGame();
    } else {
      alert("Not enough resources!");
    }
  }

  function checkUnlocks() {
    const currentIndex = layers.indexOf(currentLayer);
    if (currentIndex < layers.length - 1) {
      const nextLayer = layers[currentIndex + 1];
      const reqs = layerRequirements[nextLayer];
      const met = Object.entries(reqs).every(([res, amt]) => inventory[res] >= amt);
      if (met) currentLayer = nextLayer;
    }
  }

  function prestige() {
    if (inventory.diamond >= 1000) {
      prestigeLevel++;
      pickaxePower = 1;
      currentLayer = "Stone";
      totalCount = 0;

      for (let key in inventory) inventory[key] = 0;

      updateUI();
      saveGame();
      alert("Prestige unlocked! You now mine faster.");
    } else {
      alert("You need 1000 diamonds to prestige.");
    }
  }

  function saveGame() {
    const data = {
      inventory,
      currentLayer,
      pickaxePower,
      totalCount,
      prestigeLevel,
    };
    localStorage.setItem("mineclicker-v2", JSON.stringify(data));
  }

  function loadGame() {
    const data = JSON.parse(localStorage.getItem("mineclicker-v2"));
    if (data) {
      Object.assign(inventory, data.inventory);
      currentLayer = data.currentLayer;
      pickaxePower = data.pickaxePower;
      totalCount = data.totalCount;
      prestigeLevel = data.prestigeLevel;
    }
  }

  loadGame();
  updateUI();
};
