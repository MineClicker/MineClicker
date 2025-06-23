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

  function saveGame() {
    const saveData = { totalCount, pickaxePower, prestigeLevel };
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

  // 👇 THIS IS IMPORTANT 👇
  window.mine = mine;
  window.buyPickaxe = buyPickaxe;
  window.prestige = prestige;
};
