window.onload = () => {
  let count = 0;
  let pickaxeLevel = 1;
  let miners = 0;

  // Load data from localStorage
  function loadGame() {
    const saved = JSON.parse(localStorage.getItem("mineclicker-save"));
    if (saved) {
count = (saved.count !== undefined) ? saved.count : 0;
pickaxeLevel = (saved.pickaxeLevel !== undefined) ? saved.pickaxeLevel : 1;
miners = (saved.miners !== undefined) ? saved.miners : 0;
    }
  }

  // Save data to localStorage
  function saveGame() {
    const saveData = {
      count,
      pickaxeLevel,
      miners,
    };
    localStorage.setItem("mineclicker-save", JSON.stringify(saveData));
  }

  // Game functions
  function mine() {
    count += pickaxeLevel;
    updateDisplay();
  }

  function buyPickaxe() {
    if (count >= 10) {
      count -= 10;
      pickaxeLevel++;
      updateDisplay();
    }
  }

  function buyMiner() {
    if (count >= 50) {
      count -= 50;
      miners++;
      updateDisplay();
    }
  }

  function updateDisplay() {
    document.getElementById("count").textContent = count;
    document.getElementById("pickaxeLevel").textContent = pickaxeLevel;
    document.getElementById("miners").textContent = miners;
    document.getElementById("rps").textContent = miners;
  }

  function resetGame() {
    localStorage.removeItem("mineclicker-save");
    location.reload();
  }

  // Expose functions to HTML buttons
  window.mine = mine;
  window.buyPickaxe = buyPickaxe;
  window.buyMiner = buyMiner;
  window.resetGame = resetGame;

  // Load + start
  loadGame();
  updateDisplay();

  // Auto save and auto-mine every second
  setInterval(() => {
    count += miners;
    updateDisplay();
    saveGame();
  }, 1000);
};
