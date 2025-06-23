let count = 0;
let pickaxeLevel = 1;
let miners = 0;

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

setInterval(() => {
  count += miners;
  updateDisplay();
}, 1000);
