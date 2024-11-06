import { capitalize } from "./util.js";
import { DataController } from "./datacontroller.js";
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
		this.championsContainer = document.querySelector(
			championsContainerSelector,
		);
		this.defaultPickIconPath = defaultPickIconPath;
		this.championIconPath = championIconPath;
	}
	clearScreen() {
		while (this.championsContainer.hasChildNodes()) {
			this.championsContainer.removeChild(
				this.championsContainer.firstChild,
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
	render(
		renderingData,
		callbackForChampionSelect,
		callbackForDragstartEvent,
	) {
		const championData = DataController.loadData(
			renderingData.dataSource,
			"none",
		);
		const roles = ["top", "jungle", "mid", "adc", "support"];
		const config = DataController.readConfig();
		// Render champions (central part)
		for (let i = 0; i < renderingData.visibleChampions.length; i++) {
			const championName = renderingData.visibleChampions[i];
			let enemy = 0,
				ally = 0,
				team = "none";
			if (config.colorBorders == true) {
				for (let i = 0; i < roles.length; i++) {
					if (championData.ally[roles[i]].includes(championName))
						ally = 1;
					if (championData.enemy[roles[i]].includes(championName))
						enemy = 1;
					if (ally == 1 && enemy == 1) break;
				}
				if (ally == 1 && enemy == 1) team = "both";
				else if (ally == 1) team = "ally";
				else if (enemy == 1) team = "enemy";
			}
			let isPickedOrBanned = "false";
			if (
				renderingData.pickedChampions.includes(championName) ||
				renderingData.bannedChampions.includes(championName)
			) {
				isPickedOrBanned = "true";
			}
			const championIcon = this.createChampionIcon(
				championName,
				isPickedOrBanned,
				team,
			);
			this.championsContainer.appendChild(championIcon);
			championIcon.addEventListener("click", callbackForChampionSelect);
			championIcon.addEventListener(
				"dragstart",
				callbackForDragstartEvent,
			);
		}

		// Render picked champions
		for (let i = 0; i < this.picks.length; i++) {
			let img = this.picks[i].childNodes[1];
			if (renderingData.pickedChampions[i] == "") {
				img.src = this.defaultPickIconPath;
				img.dataset.champion = "";
			} else {
				img.src =
					this.championIconPath +
					"/centered_minified/" +
					capitalize(renderingData.pickedChampions[i]) +
					"_0.jpg";
				img.dataset.champion = renderingData.pickedChampions[i];
			}
		}

		// Render banned champions
		for (let i = 0; i < this.bans.length; i++) {
			let img = this.bans[i].childNodes[1];
			if (renderingData.bannedChampions[i] == "") {
				img.src = this.defaultPickIconPath;
				img.dataset.champion = "";
			} else {
				img.src =
					this.championIconPath +
					"/tiles/" +
					capitalize(renderingData.bannedChampions[i]) +
					"_0.jpg";
				img.dataset.champion = renderingData.bannedChampions[i];
			}
		}
	}
	createChampionIcon(championName, isPickedOrBanned, team) {
		const newNode = document.createElement("div");
		newNode.classList += "champion-container";
		const championIcon = document.createElement("img");
		championIcon.classList += "champion-icon";
		championIcon.src =
			"./img/champion_icons/tiles/" + capitalize(championName) + "_0.jpg";
		championIcon.alt = championName;
		championIcon.dataset.champion = championName;
		championIcon.dataset.team = team;
		championIcon.draggable = "true";
		if (isPickedOrBanned === "true") {
			championIcon.style.opacity = "0.4";
			championIcon.dataset.pickedOrBanned = "true";
		} else {
			championIcon.dataset.pickedOrBanned = "false";
		}
		newNode.appendChild(championIcon);
		return newNode;
	}
}
