window.onload = () => {
  let totalCount = 0;
  let pickaxePower = 1;
  let prestigeLevel = 0;

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
    const costs = { 2: 100, 3: 500, 4: 1500, 5: 5000 };
    if (level > pickaxePower && totalCount >= costs[level]) {
      totalCount -= costs[level];
      pickaxePower = level;
      updateUI();
      saveGame();
    }
  }

  function prestige() {
    if (totalCount >= 10000) {
      totalCount = 0;
      pickaxePower = 1;
      prestigeLevel += 1;
      updateUI();
      saveGame();
    }
  }

  function saveGame() {
    localStorage.setItem("mineclicker-save", JSON.stringify({
      totalCount,
      pickaxePower,
      prestigeLevel
    }));
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

  // Expose to HTML
  document.getElementById("mineBlock").addEventListener("click", mine);
  window.buyPickaxe = buyPickaxe;
  window.prestige = prestige;
};
