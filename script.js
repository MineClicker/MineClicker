let resources = 0;
let resourcesPerClick = 1;
let rps = 0; // resources per second
let pickaxeLevel = 1;
let miners = 0;

function updateUI() {
  document.getElementById("count").innerText = Math.floor(resources);
  document.getElementById("pickaxeLevel").innerText = pickaxeLevel;
  document.getElementById("miners").innerText = miners;
  document.getElementById("rps").innerText = rps.toFixed(1);
}

function mine() {
  resources += resourcesPerClick;
  updateUI();
}

function buyPickaxe() {
  const cost = 10 * pickaxeLevel;
  if (resources >= cost) {
    resources -= cost;
    pickaxeLevel++;
    resourcesPerClick++;
    updateUI();
  } else {
    alert("Not enough resources!");
  }
}

function buyMiner() {
  const cost = 50 + miners * 25;
  if (resources >= cost) {
    resources -= cost;
    miners++;
    rps += 0.5;
    updateUI();
  } else {
    alert("Not enough resources!");
  }
}

// Auto-mining every second
setInterval(() => {
  resources += rps;
  updateUI();
}, 1000);

// Save progress every 5 seconds
setInterval(() => {
  localStorage.setItem("mineSave", JSON.stringify({
    resources, resourcesPerClick, rps, pickaxeLevel, miners
  }));
}, 5000);

// Load game on start
window.onload = () => {
  const save = JSON.parse(localStorage.getItem("mineSave"));
  if (save) {
    resources = save.resources;
    resourcesPerClick = save.resourcesPerClick;
    rps = save.rps;
    pickaxeLevel = save.pickaxeLevel;
    miners = save.miners;
    updateUI();
  }
};
