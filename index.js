(function () {
  "use strict";

  // Aguarda o objeto 'game' do Gather Town estar disponível
  const waitForGame = setInterval(() => {
    if (window.game && window.game.getMyPlayer) {
      clearInterval(waitForGame);
      main();
    }
  }, 500);

  let savedLocations = [];
  let teleportPanel;

  function main() {
    // Carrega localizações salvas do localStorage
    savedLocations =
      JSON.parse(localStorage.getItem("gatherTeleportLocations_v2")) || [];

    // Cria o painel principal
    createPanel();
    // Cria o botão de salvar localização
    createSaveButton();
    // Renderiza a lista inicial de locais
    renderLocationButtons();
  }

  // Função para criar o painel onde os botões ficarão
  function createPanel() {
    teleportPanel = document.createElement("div");
    teleportPanel.id = "teleport-panel";
    teleportPanel.style.cssText = `
            position: fixed;
            top: 50px;
            left: 10px;
            z-index: 10000;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 8px;
            max-height: 70vh;
            overflow-y: auto;
            color: white;
            font-family: sans-serif;
        `;
    document.body.appendChild(teleportPanel);
  }

  // Função para criar o botão de "Salvar Local Atual"
  function createSaveButton() {
    const saveButton = document.createElement("button");
    saveButton.innerHTML = "💾 Salvar Local Atual";
    saveButton.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10001;
            background-color: #4CAF50;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;

    saveButton.onclick = () => {
      const locationName = prompt("Digite um nome para esta localização:");
      if (locationName) {
        const player = window.game.getMyPlayer();
        const newLocation = {
          name: locationName,
          map: player.map,
          x: player.x,
          y: player.y,
        };
        savedLocations.push(newLocation);
        saveToLocalStorage();
        renderLocationButtons();
        alert(`Localização "${locationName}" salva!`);
      }
    };
    document.body.appendChild(saveButton);
  }

  // Função para renderizar os botões de teletransporte no painel
  function renderLocationButtons() {
    teleportPanel.innerHTML = ""; // Limpa o painel

    if (savedLocations.length === 0) {
      teleportPanel.innerHTML =
        '<p style="font-size: 12px; opacity: 0.8;">Nenhum local salvo.</p>';
      return;
    }

    savedLocations.forEach((loc, index) => {
      const locationContainer = document.createElement("div");
      locationContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            `;

      // Botão de Teletransporte
      const tpButton = document.createElement("button");
      tpButton.innerText = loc.name;
      tpButton.title = `Mapa: ${loc.map} | X: ${loc.x}, Y: ${loc.y}`;
      tpButton.style.cssText = `
                flex-grow: 1;
                background-color: #008CBA;
                color: white;
                border: none;
                padding: 6px 10px;
                border-radius: 4px 0 0 4px;
                cursor: pointer;
                text-align: left;
            `;
      tpButton.onclick = () => {
        console.log(
          `Teleportando para: ${loc.name} (${loc.map}, ${loc.x}, ${loc.y})`
        );
        window.game.teleport(loc.map, loc.x, loc.y);
      };

      // Botão de Deletar
      const delButton = document.createElement("button");
      delButton.innerText = "❌";
      delButton.style.cssText = `
                background-color: #f44336;
                color: white;
                border: none;
                padding: 6px 8px;
                border-radius: 0 4px 4px 0;
                cursor: pointer;
            `;
      delButton.onclick = (e) => {
        e.stopPropagation(); // Impede que o clique no X acione o teletransporte se estivessem aninhados
        if (confirm(`Tem certeza que deseja deletar "${loc.name}"?`)) {
          deleteLocation(index);
        }
      };

      locationContainer.appendChild(tpButton);
      locationContainer.appendChild(delButton);
      teleportPanel.appendChild(locationContainer);
    });
  }

  // Função para deletar uma localização
  function deleteLocation(index) {
    savedLocations.splice(index, 1);
    saveToLocalStorage();
    renderLocationButtons();
  }

  // Função para salvar no localStorage
  function saveToLocalStorage() {
    localStorage.setItem(
      "gatherTeleportLocations_v2",
      JSON.stringify(savedLocations)
    );
  }
})();
