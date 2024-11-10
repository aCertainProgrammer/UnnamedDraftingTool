import { DataController } from "./datacontroller.js";
import { capitalize } from "./util.js";
export class UserInterface {
	constructor(defaultPickIconPath, defaultBanIconPath, championIconPath) {
		this.sendProcessSignal = null;
		this.dataSource = null;
		this.config = null;
		this.team = "all";
		this.role = "all";
		this.selectedChampion = "";
		this.renderingData = {
			visibleChampions: [],
			pickedChampions: [],
			bannedChampions: [],
		};
		this.defaultPickIconPath = defaultPickIconPath;
		this.defaultBanIconPath = defaultBanIconPath;
		this.championIconPath = championIconPath;

		this.picks = document.querySelectorAll(".champion-pick");
		this.bans = document.querySelectorAll(".champion-ban");
		this.picks.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.addEventListener("drop", this.dropChampion.bind(this));
			current.addEventListener("dragover", (event) => {
				event.preventDefault();
			});
			current.childNodes[1].dataset.champion = "";
		});
		this.bans.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.addEventListener("drop", this.dropChampion.bind(this));
			current.addEventListener("dragover", (event) => {
				event.preventDefault();
			});
			current.childNodes[1].dataset.champion = "";
		});

		this.championsContainer = document.querySelector(
			"#champions-container",
		);
		this.teamsContainer = document.querySelector("#teams-container");
		this.logos = document.querySelectorAll(".team-logo");
		this.logos.forEach((current) => {
			current.addEventListener("click", this.setTeam.bind(this, current));
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.draggable = "false";
		});

		this.rolesContainer = document.querySelector("#roles");
		this.roleIcons = document.querySelectorAll(".role-icon");
		this.roleIcons.forEach((current) => {
			current.addEventListener("click", this.setRole.bind(this, current));
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.draggable = "false";
		});
		this.searchBar = document.querySelector(".search-bar");
		this.searchBar.addEventListener(
			"input",
			this.searchChampion.bind(this),
		);
		this.searchBar.addEventListener("dragstart", (event) => {
			event.preventDefault();
		});
		this.searchBar.draggable = "false";
		this.defaultDataSwitch = document.querySelector("#default_data");
		this.defaultDataSwitch.addEventListener(
			"click",
			this.loadDefaultData.bind(this),
		);

		this.userDataSwitch = document.querySelector("#load_user_data");
		this.userDataSwitch.addEventListener(
			"click",
			this.loadUserData.bind(this),
		);
		this.userDataInput = document.querySelector("#input_user_data");
		this.userDataInput.addEventListener(
			"click",
			this.showUserDataForm.bind(this),
		);
		this.colorBordersToggle = document.getElementById(
			"color-borders-toggle",
		);
		this.colorBordersToggle.addEventListener(
			"click",
			this.toggleBorderColor.bind(this),
		);
		this.dataSourceOnLoadToggle = document.querySelector(
			"#load-user-data-on-program-load-toggle",
		);
		this.dataSourceOnLoadToggle.addEventListener(
			"click",
			this.toggleDataSourceOnLoad.bind(this),
		);
		document.addEventListener(
			"keydown",
			this.processKeyboardInput.bind(this),
		);
		this.dragFunction = this.dragChampion.bind(this);
		this.stopDrag = (event) => {
			event.preventDefault();
		};
		this.dragendFunction = function () {
			event.target.dataset.champion = "";
			event.target.src = this.defaultPickIconPath;
			this.sendProcessSignal();
		}.bind(this);
	}
	getConfig() {
		const config = this.config;
		return config;
	}
	getDataSource() {
		const source = this.dataSource;
		return source;
	}
	getTeam() {
		const team = this.team;
		return team;
	}
	getRole() {
		const role = this.role;
		return role;
	}
	getSearchQuery() {
		const searchQuery = this.searchBar.value;
		return searchQuery;
	}
	setDataSource() {}
	setTeam(team) {
		this.team = team.id;
		const currentlySelectedTeam =
			this.teamsContainer.querySelector(".selected");
		if (currentlySelectedTeam !== null)
			currentlySelectedTeam.classList.remove("selected");
		team.classList.add("selected");
		this.sendProcessSignal();
	}
	setRole(roleIcon) {
		const currentlySelectedIcon =
			this.rolesContainer.querySelector(".selected");
		if (currentlySelectedIcon !== null)
			currentlySelectedIcon.classList.remove("selected");
		if (this.role == roleIcon.id) {
			this.role = "all";
		} else if (this.role != roleIcon.id) {
			this.role = roleIcon.id;
			roleIcon.classList.add("selected");
		}
		this.sendProcessSignal();
	}

	selectChampion(event) {
		const championIcon = event.target;
		if (championIcon.dataset.pickedOrBanned == "true") {
			this.selectedChampion = "";
			return;
		}
		if (this.selectedChampion == championIcon.dataset.champion) {
			championIcon.classList.remove("selected");
			this.selectedChampion = "";
			return;
		}
		const currentlySelectedIcon =
			this.championsContainer.querySelector(".selected");
		if (currentlySelectedIcon !== null)
			currentlySelectedIcon.classList.remove("selected");
		championIcon.classList.add("selected");
		this.selectedChampion = event.target.dataset.champion;
	}
	placeChampion(event) {
		if (this.selectedChampion == "") {
			event.target.src = "./img/pick_icon.png";
		}
		event.target.dataset.champion = this.selectedChampion;
		this.selectedChampion = "";
		this.sendProcessSignal();
	}
	dropChampion(event) {
		event.preventDefault();
		this.placeChampion(event);
	}
	dragChampion(event) {
		this.selectChampion(event);
	}

	showUserDataForm() {
		const form_container = document.querySelector(
			"#user_data_form_container",
		);
		if (form_container) form_container.classList.remove("hidden");
		else {
			this.createUserDataForm();
		}
	}

	searchChampion() {
		this.searchBar.value = this.searchBar.value.trim();
		this.sendProcessSignal();
	}
	loadDefaultData() {
		this.dataSource = "default_data";
		this.sendProcessSignal();
	}
	loadUserData() {
		this.dataSource = "user_data";
		this.sendProcessSignal();
	}
	saveUserData(textarea) {
		DataController.saveData("user_data", textarea.value);
		this.dataSource = "user_data";
		this.sendProcessSignal();
	}
	async takeFileInput(event) {
		this.dataSource = "user_data";
		const file = event.target.files[0];
		const data = await DataController.loadFileData(file);
		const json = JSON.parse(data);
		const pretty_text = JSON.stringify(json, null, 2);
		const textarea = document.querySelector("textarea");
		textarea.innerHTML = pretty_text;
		this.sendProcessSignal();
	}
	clickInput(input) {
		input.click();
	}
	processKeyboardInput(event) {
		const container = document.querySelector("#user_data_form_container");
		if (container !== null)
			if (!container.classList.contains("hidden")) return;
		const key = event.key;
		if (key == " ") this.searchBar.focus();
	}
	toggleBorderColor() {
		this.config.colorBorders = !this.config.colorBorders;
		DataController.saveConfig(this.config);
		this.sendProcessSignal();
	}
	toggleDataSourceOnLoad() {
		this.config.loadUserDataOnProgramStart =
			!this.config.loadUserDataOnProgramStart;
		DataController.saveConfig(this.config);
	}
	clearScreen() {
		this.championsContainer.innerHTML = "";
		for (let i = 0; i < this.picks.length; i++) {
			const img = this.picks[i].childNodes[1];
			img.src = this.defaultPickIconPath;
		}
		for (let i = 0; i < this.bans.length; i++) {
			const img = this.bans[i].childNodes[1];
			img.src = this.defaultPickIconPath;
		}
	}

	createUserDataForm() {
		const container = document.querySelector("#data");
		const form_container = document.createElement("div");
		form_container.id = "user_data_form_container";
		const textarea = document.createElement("textarea");
		textarea.name = "user_data_input";
		textarea.id = "user_data_input";
		textarea.cols = "80";
		textarea.rows = "10";
		const label = document.createElement("label");
		label.innerHTML =
			'Read the <a href="https://github.com/aCertainProgrammer/UnnamedDraftingTool?tab=readme-ov-file#custom-data-specification" target="_blank">input data specification</a>';
		label.for = "user_data_input";
		const button_container = document.createElement("div");
		button_container.style.display = "flex";
		button_container.style.flexDirection = "row";
		const save = document.createElement("button");
		save.innerText = "Save and load";
		save.classList += "source-button";
		const hide = document.createElement("button");
		hide.innerText = "Hide";
		hide.classList += "source-button";
		const file_input = document.createElement("input");
		file_input.type = "file";
		file_input.name = "user_file_input";
		file_input.style.display = "none";
		const file_input_button = document.createElement("button");
		file_input_button.innerText = "Load from file";
		button_container.appendChild(save);
		button_container.appendChild(hide);
		button_container.appendChild(file_input);
		button_container.appendChild(file_input_button);
		form_container.appendChild(label);
		form_container.appendChild(textarea);
		form_container.appendChild(button_container);
		container.appendChild(form_container);
		save.addEventListener("click", this.saveUserData.bind(this, textarea));
		hide.addEventListener("click", () => {
			form_container.classList += "hidden";
		});
		file_input.addEventListener("input", this.takeFileInput.bind(this));
		file_input_button.addEventListener(
			"click",
			this.clickInput.bind(this, file_input),
		);
	}
	render(renderingData) {
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
			championIcon.addEventListener(
				"click",
				this.selectChampion.bind(this),
			);
			championIcon.addEventListener(
				"dragstart",
				this.dragChampion.bind(this),
			);
		}

		// Render picked champions
		for (let i = 0; i < this.picks.length; i++) {
			let img = this.picks[i].childNodes[1];
			if (renderingData.pickedChampions[i] == "") {
				img.src = this.defaultPickIconPath;
				img.dataset.champion = "";
				img.draggable = "false";
				img.removeEventListener("dragstart", this.dragFunction);
				img.addEventListener("dragstart", this.stopDrag);
				img.removeEventListener("dragend", this.dragendFunction);
			} else {
				img.src =
					this.championIconPath +
					"/centered_minified/" +
					capitalize(renderingData.pickedChampions[i]) +
					"_0.jpg";
				img.dataset.champion = renderingData.pickedChampions[i];
				img.draggable = "true";
				img.removeEventListener("dragstart", this.stopDrag);
				img.addEventListener("dragstart", this.dragFunction);
				img.removeEventListener("dragend", this.dragendFunction);
				img.addEventListener("dragend", this.dragendFunction);
			}
		}

		// Render banned champions
		for (let i = 0; i < this.bans.length; i++) {
			let img = this.bans[i].childNodes[1];
			if (img.classList.contains("selected"))
				img.classList.remove("selected");
			if (renderingData.bannedChampions[i] == "") {
				img.src = this.defaultBanIconPath;
				img.dataset.champion = "";
				img.draggable = "false";
				img.removeEventListener("dragstart", this.dragFunction);
				img.addEventListener("dragstart", this.stopDrag);
				img.removeEventListener("dragend", this.dragendFunction);
			} else {
				img.src =
					this.championIconPath +
					"/tiles/" +
					capitalize(renderingData.bannedChampions[i]) +
					"_0.jpg";
				img.dataset.champion = renderingData.bannedChampions[i];
				img.draggable = "true";
				img.removeEventListener("dragstart", this.stopDrag);
				img.addEventListener("dragstart", this.dragFunction);
				img.removeEventListener("dragend", this.dragendFunction);
				img.addEventListener("dragend", this.dragendFunction);
			}
		}
	}
	createChampionIcon(championName, isPickedOrBanned, team) {
		const championContainer = document.createElement("div");
		championContainer.classList += "champion-container";
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
		championContainer.appendChild(championIcon);
		return championContainer;
	}
}
