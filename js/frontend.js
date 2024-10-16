backend = new Backend();
class Frontend {
  constructor() {
    this.request = {
      team: "all",
      role: "all",
    };
    this.renderingData = {
      visibleChampions: [],
      pickedChampions: [],
      bannedChampions: [],
    };
    this.picks = document.querySelectorAll(".champion-pick");
    this.bans = document.querySelectorAll(".champion-ban");
    this.picks.forEach((current) => {
      current.addEventListener("click", this.placeChampion);
    });
    this.bans.forEach((current) => {
      current.addEventListener("click", this.placeChampion);
    });

    this.championsContainer = document.querySelector("#champions-container");
    this.logos = document.querySelectorAll(".team-logo");
    this.logos.forEach((current) => {
      current.addEventListener("click", () => {
        this.request.team = current.id;
        this.render();
      });
    });

    this.roleIcons = document.querySelectorAll(".role-icon");
    this.roleIcons.forEach((current) => {
      current.addEventListener("click", () => {
        if (this.request.role == current.id) {
          this.request.role = "all";
        } else if (this.request.role != current.id)
          this.request.role = current.id;
        this.render();
      });
    });
  }

  render() {
    this.renderingData.visibleChampions = backend.requestVisibleChampions(
      this.request,
    );
    this.renderingData.pickedChampions = this.requestPickedChampions();
    this.renderingData.bannedChampions = this.requestBannedChampions();
    console.log(this.renderingData.visibleChampions);
    this.renderVisibleChampions();
  }

  renderVisibleChampions() {
    while (this.championsContainer.hasChildNodes()) {
      this.championsContainer.removeChild(this.championsContainer.firstChild);
    }
    for (let i = 0; i < this.renderingData.visibleChampions.length; i++) {
      const newChampion = this.renderingData.visibleChampions[i];
      const newNode = document.createElement("div");
      newNode.classList += "champion-container";
      newNode.id = newChampion;
      const championIcon = document.createElement("img");
      championIcon.classList += "champion-icon";
      championIcon.src =
        "./img/champion_icons/tiles/" + capitalize(newChampion) + "_0.jpg";
      championIcon.alt = this.renderingData.visibleChampions[i];
      if (this.renderingData.pickedChampions.includes(newChampion)) {
        championIcon.style.opacity = "0.4";
      }
      newNode.appendChild(championIcon);
      this.championsContainer.appendChild(newNode);
      championIcon.addEventListener("click", selectChampion);
    }
  }
  requestPickedChampions() {
    return ["akali", "ornn", "", "", "", "lillia", "skarner"];
  }
  requestBannedChampions() {
    return ["bard", "camille", "", "", "", "missfortune", "urgot"];
  }

  placeChampion(event) { }
}

function selectChampion() {
  return 1;
}
