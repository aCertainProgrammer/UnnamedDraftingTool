export class Renderer {
	constructor(
		picksSelector,
		banSelector,
		championsContainerSelector,
		defaultPickIconPath,
		championIconPath,
	) {
		this.picks = document.querySelectorAll(picksSelector);
		this.bans = document.querySelectorAll(banSelector);
		this.championsContainer = document.querySelectorAll(
			championsContainerSelector,
		);
		this.defaultPickIconPath = defaultPickIconPath;
		this.championIconPath = championIconPath;
	}
	clearScreen() {
		while (this.championContainer.hasChildNodes()) {
			this.championContainer.removeChild(
				this.championContainer.firstChild,
			);
		}
		for (let i = 0; i < this.picks.length; i++) {
			const img = this.picks[i].childNodes[1];
			img.src = this.defaultPickIconPath;
		}
		for (let i = 0; i < this.bans.length; i++) {
			const img = this.bans[i].childNodes[1];
			img.src = this.defaultPickIconPath;
		}
	}
	render(renderingData, callback) {
		for (let i = 0; i < this.renderingData.visibleChampions.length; i++) {
			const championIcon = this.renderingData.visibleChampions[i];
			this.championsContainer.appendChild(championIcon);
			championIcon.addEventListener("click", callback);
		}
		for (let i = 0; i < picks.length; i++) {
			let img = this.picks[i].childNodes[1];
			if (this.renderingData.pickedChampions[i] == "") {
				img.src = this.defaultPickIconPath;
				img.dataset.champion = "";
			} else {
				img.src =
					this.championIconPath +
					"/centered/" +
					capitalize(this.renderingData.pickedChampions[i]) +
					"_0.jpg";
				img.dataset.champion = this.renderingData.pickedChampions[i];
			}
		}
		for (let i = 0; i < bans.length; i++) {
			let img = this.bans[i].childNodes[1];
			if (this.renderingData.bannedChampions[i] == "") {
				img.src = this.defaultPickIconPath;
				img.dataset.champion = "";
			} else {
				img.src =
					this.championIconPath +
					"/centered/" +
					capitalize(this.renderingData.bannedChampions[i]) +
					"_0.jpg";
				img.dataset.champion = this.renderingData.bannedChampions[i];
			}
		}
	}
	createChampionIcon(championName) {
		const newNode = document.createElement("div");
		newNode.classList += "champion-container";
		const championIcon = document.createElement("img");
		championIcon.classList += "champion-icon";
		championIcon.src =
			"./img/champion_icons/tiles/" + capitalize(championName) + "_0.jpg";
		championIcon.alt = this.renderingData.visibleChampions[i];
		championIcon.dataset.champion = championName;
		if (
			this.renderingData.pickedChampions.includes(championName) ||
			this.renderingData.bannedChampions.includes(championName)
		) {
			championIcon.style.opacity = "0.4";
		}
		newNode.appendChild(championIcon);
		return newNode;
	}
}
