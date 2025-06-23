window.onload = () => {
  let totalCount = 0;
  let pickaxePower = 1;
  let prestigeLevel = 0;

  const powerUpgrades = {
    2: 100,
    3: 500,
    4: 1500,
    5: 5000,
  };

  function updateUI() {
    document.getElementById("totalCount").textContent = Math.floor(totalCount);
    document.getElementById("pickaxePower").textContent = pickaxePower;
    document.getElementById("prestigeLevel").textContent = prestigeLevel;
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

  function buyPickaxe(level) {
    if (pickaxePower >= level) return;
    const cost = powerUpgrades[level];
    if (totalCount >= cost) {
      totalCount -= cost;
      pickaxePower = level;
      updateUI();
      saveGame();
    } else {
      alert("Not enough clicks to upgrade!");
    }
  }

  function prestige() {
    if (totalCount >= 10000) {
      prestigeLevel++;
      pickaxePower = 1;
      totalCount = 0;
      alert("You prestiged! Mining is now 10% faster per level.");
      updateUI();
      saveGame();
    } else {
      alert("You need 10,000 clicks to prestige.");
    }
  }

  function saveGame() {
    const saveData = {
      totalCount,
      pickaxePower,
      prestigeLevel,
    };
    localStorage.setItem("mineclicker-save", JSON.stringify(saveData));
  }

  function loadGame() {
    const saved = JSON.parse(localStorage.getItem("mineclicker-save"));
    if (saved) {
      totalCount = saved.totalCount ?? 0;
      pickaxePower = saved.pickaxePower ?? 1;
      prestigeLevel = saved.prestigeLevel ?? 0;
    }
  }

  loadGame();
  updateUI();
};
