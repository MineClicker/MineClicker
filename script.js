let count = 0;
let pickaxeLevel = 1;
let miners = 0;

// Load from localStorage if it exists
function loadGame() {
  const saved = JSON.parse(localStorage.getItem("mineclicker-save"));
  if (saved) {
    count = saved.count || 0;
    pickaxeLevel = saved.pickaxeLevel || 1;
    miners = saved.miners || 0;
  }
}

// Save to localStorage
function saveGame() {
  const saveData = {
    count,
    pickaxeLevel,
    miners,
  };
  localStorage.setItem("mineclicker-save", JSON.stringify(saveData));
}

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

// Run every second: auto-mine and save progress
setInterval(() => {
  count += miners;
  updateDisplay();
  saveGame(); // <-- autosave every second
}, 1000);

// Load saved progress on startup
loadGame();
updateDisplay();
