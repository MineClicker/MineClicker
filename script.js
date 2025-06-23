window.onload = () => {
  const inventory = {
    stone: 0,
    coal: 0,
    iron: 0,
    diamond: 0
  };

  const layers = ["Stone", "Coal", "Iron", "Diamond"];
  const layerRequirements = {
    Coal: { stone: 50 },
    Iron: { coal: 30 },
    Diamond: { iron: 20 }
  };

  let currentLayer = "Stone";
  let pickaxePower = 1;

  function updateUI() {
    document.getElementById("stone").textContent = inventory.stone;
    document.getElementById("coal").textContent = inventory.coal;
    document.getElementById("iron").textContent = inventory.iron;
    document.getElementById("diamond").textContent = inventory.diamond;
    document.getElementById("pickaxePower").textContent = pickaxePower;
    document.getElementById("currentLayer").textContent = currentLayer;

    // Change block image
    document.getElementById("mineBlock").src = currentLayer.toLowerCase() + ".png";
  }

  function mine() {
    inventory[currentLayer.toLowerCase()] += pickaxePower;
    checkUnlocks();
    updateUI();
    saveGame();
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

  function craftPickaxe() {
    if (inventory.iron >= 10) {
      inventory.iron -= 10;
      pickaxePower += 2;
      updateUI();
      saveGame();
    } else {
      alert("Not enough iron to craft pickaxe (Need 10)");
    }
  }

  function saveGame() {
    const data = {
      inventory,
      currentLayer,
      pickaxePower
    };
    localStorage.setItem("minelayer-save", JSON.stringify(data));
  }

  function loadGame() {
    const data = JSON.parse(localStorage.getItem("minelayer-save"));
    if (data) {
      Object.assign(inventory, data.inventory);
      currentLayer = data.currentLayer;
      pickaxePower = data.pickaxePower;
    }
  }

  loadGame();
  updateUI();
};
