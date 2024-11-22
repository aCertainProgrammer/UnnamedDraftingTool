import { DataController } from "./datacontroller.js";
import { capitalize } from "./util.js";
/**
 * A container for all UI-related events and rendering
 */
export class UserInterface {
	constructor(defaultPickIconPath, defaultBanIconPath, championIconPath) {
		this.defaultPickIconPath = defaultPickIconPath;
		this.defaultBanIconPath = defaultBanIconPath;
		this.championIconPath = championIconPath;

		this.sendProcessSignal = null;
		this.dataSource = null;
		this.config = null;
		this.team = "all";
		this.role = "all";
		this.selectedChampion = "";
		this.recentlyDragged = null;
		this.renderingData = {
			visibleChampions: [],
			pickedChampions: [],
			bannedChampions: [],
		};
		this.currentlyHoveredChampion = "";
		this.userInputContainer = null;
		this.currentMode = "pick";

		this.rightOverlay = document.querySelector("#right-overlay");
		this.leftOverlay = document.querySelector("#left-overlay");
		this.userDataInputTextarea = document.querySelector("#user_data_input");
		this.saveUserDataButton = document.querySelector("#save-user-data");
		this.hideUserInputTextarea = document.querySelector(
			"#hide-user-data-form",
		);
		this.fileInput = document.querySelector("#user-data-file-input");
		this.fileInputButton = document.querySelector(
			"#user-data-file-input-button",
		);
		this.picks = document.querySelectorAll(".champion-pick");
		this.bans = document.querySelectorAll(".champion-ban");
		this.championsContainer = document.querySelector(
			"#champions-container",
		);
		this.teamsContainer = document.querySelector("#teams-container");
		this.logos = document.querySelectorAll(".team-logo");
		this.rolesContainer = document.querySelector("#roles");
		this.roleIcons = document.querySelectorAll(".role-icon");
		this.searchBar = document.querySelector(".search-bar");
		this.defaultDataSwitch = document.querySelector("#default_data");
		this.userDataSwitch = document.querySelector("#load_user_data");
		this.userDataInput = document.querySelector("#input_user_data");
		this.colorBordersToggle = document.getElementById(
			"color-borders-toggle",
		);
		this.dataSourceOnLoadToggle = document.querySelector(
			"#load-user-data-on-program-load-toggle",
		);
		this.clearSearchbarOnFocusToggle = document.querySelector(
			"#clear-searchbar-on-focus-toggle",
		);
		this.settingsMenu = document.querySelector("#settings-menu");
		this.enterSettingsButton = document.querySelector(
			"#enter-settings-button",
		);
		this.contentContainer = document.querySelector("#content-container");
		this.leaveSettingsButton = document.querySelector(
			"#leave-settings-button",
		);
		this.openManualButton = document.querySelector("#open-manual-button");
		this.closeManualButton = document.querySelector("#close-manual-button");
		this.toggleDarkmodeButton = document.querySelector(
			"#toggle-darkmode-button",
		);
		this.manualContainer = document.querySelector("#manual-container");
		this.manualText = document.querySelector("#manual-text");
		this.goToTopOfManualButton =
			document.querySelector("#go-to-top-button");
		this.togglePickBanModeButton = document.querySelector(
			"#toggle-pick-ban-mode",
		);
		this.toggleSearchModeButton = document.querySelector(
			"#search-mode-toggle",
		);

		this.saveUserDataButton.addEventListener(
			"click",
			this.saveUserData.bind(this, this.userDataInputTextarea),
		);
		this.hideUserInputTextarea.addEventListener("click", () => {
			this.rightOverlay.classList += "hidden";
		});
		this.fileInput.addEventListener("input", this.takeFileInput.bind(this));
		this.fileInputButton.addEventListener(
			"click",
			this.clickInput.bind(this, this.fileInput),
		);

		this.picks.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.addEventListener("drop", this.dropChampion.bind(this));
			current.childNodes[1].dataset.champion = "";
		});
		this.bans.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.addEventListener("drop", this.dropChampion.bind(this));
			current.childNodes[1].dataset.champion = "";
		});

		this.logos.forEach((current) => {
			current.addEventListener("click", this.setTeam.bind(this, current));
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.draggable = "false";
		});

		this.roleIcons.forEach((current) => {
			current.addEventListener("click", this.setRole.bind(this, current));
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.draggable = "false";
		});

		this.searchBar.addEventListener(
			"input",
			this.searchChampion.bind(this),
		);
		this.defaultDataSwitch.addEventListener(
			"click",
			this.loadDefaultData.bind(this),
		);
		this.userDataSwitch.addEventListener(
			"click",
			this.loadUserData.bind(this),
		);
		this.userDataInput.addEventListener(
			"click",
			this.toggleUserDataForm.bind(this),
		);
		this.colorBordersToggle.addEventListener(
			"click",
			this.toggleBorderColor.bind(this),
		);
		this.dataSourceOnLoadToggle.addEventListener(
			"click",
			this.toggleDataSourceOnLoad.bind(this),
		);
		this.clearSearchbarOnFocusToggle.addEventListener(
			"click",
			this.toggleClearingSearchbarOnFocus.bind(this),
		);

		document.addEventListener(
			"keydown",
			this.processKeyboardInput.bind(this),
		);

		this.enterSettingsButton.addEventListener(
			"click",
			this.openSettingsMenu.bind(this),
		);
		this.contentContainer.addEventListener("dragover", (event) => {
			event.preventDefault();
		});
		this.contentContainer.addEventListener(
			"drop",
			this.dropChampionIntoVoid.bind(this),
		);
		this.leaveSettingsButton.addEventListener(
			"click",
			this.closeSettingsMenu.bind(this),
		);
		this.openManualButton.addEventListener(
			"click",
			this.openManual.bind(this),
		);
		this.closeManualButton.addEventListener(
			"click",
			this.closeManual.bind(this),
		);
		this.toggleDarkmodeButton.addEventListener(
			"click",
			this.toggleDarkmode.bind(this),
		);

		if (
			localStorage.getItem("darkmode") !=
				document.documentElement.dataset.theme &&
			localStorage.getItem("darkmode") != null
		) {
			this.toggleDarkmode();
		}

		this.goToTopOfManualButton.addEventListener("click", () => {
			this.manualText.scrollTop = 0;
		});

		this.togglePickBanModeButton.addEventListener(
			"click",
			this.togglePickBanMode.bind(this),
		);
		this.toggleSearchModeButton.addEventListener(
			"click",
			this.toggleSearchMode.bind(this),
		);

		this.dragFunction = this.dragChampion.bind(this);
		this.stopDrag = (event) => {
			event.preventDefault();
		};
		this.dragendFunction = function (e) {
			e.preventDefault();
			this.selectedChampion = "";
			const currentlySelectedIcon =
				this.championsContainer.querySelector(".selected");
			if (currentlySelectedIcon !== null)
				currentlySelectedIcon.classList.remove("selected");
		}.bind(this);
		this.mouseenterFunction = function (e) {
			e.preventDefault();
			this.currentlyHoveredChampion = e.target.dataset.champion;
		}.bind(this);
		this.mouseleaveFunction = function (e) {
			e.preventDefault();
			this.currentlyHoveredChampion = "";
		}.bind(this);
	}
	toggleSearchMode() {
		this.config.useLegacySearch = !this.config.useLegacySearch;
		this.colorSettingsButtons();
		DataController.saveConfig(this.config);
		this.sendProcessSignal();
	}
	colorSettingsButtons() {
		const buttons = [
			this.colorBordersToggle,
			this.dataSourceOnLoadToggle,
			this.clearSearchbarOnFocusToggle,
			this.toggleSearchModeButton,
		];
		const config_settings = [
			this.config.colorBorders,
			this.config.loadUserDataOnProgramStart,
			this.config.clearSearchBarOnFocus,
			this.config.useLegacySearch,
		];
		for (let i = 0; i < buttons.length; i++) {
			if (config_settings[i] == true) {
				buttons[i].classList.remove("off");
				buttons[i].classList.add("on");
			} else {
				buttons[i].classList.remove("on");
				buttons[i].classList.add("off");
			}
		}
	}
	openManual() {
		this.manualContainer.classList.remove("hidden");
		this.contentContainer.classList.add("hidden");
	}
	closeManual() {
		this.manualContainer.classList.add("hidden");
		this.contentContainer.classList.remove("hidden");
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
		const searchQuery = this.searchBar.value.toLowerCase();
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
	toggleDarkmode() {
		const root = document.documentElement;
		if (root.dataset.theme == "light") {
			root.dataset.theme = "dark";
			this.toggleDarkmodeButton.childNodes[1].src = "./img/sun.png";
			DataController.saveData("darkmode", "dark");
		} else if (root.dataset.theme == "dark") {
			root.dataset.theme = "light";
			this.toggleDarkmodeButton.childNodes[1].src = "./img/full_moon.png";
			DataController.saveData("darkmode", "light");
		}
	}
	clearSelectedChampions() {
		const selected = this.championsContainer.querySelector(".selected");
		if (selected !== null) {
			selected.classList.remove("selected");
		}
	}
	selectChampion(event) {
		const championIcon = event.target;
		this.clearSelectedChampions();
		if (championIcon.dataset.pickedOrBanned == "true") {
			this.selectedChampion = "";
			return;
		}
		if (this.selectedChampion == championIcon.dataset.champion) {
			this.selectedChampion = "";
			return;
		}
		const currentlySelectedIcon = championIcon.classList.add("selected");
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
		event.stopPropagation();
		const replacedChampion = event.target.dataset.champion;
		this.recentlyDragged.dataset.champion = replacedChampion;
		this.placeChampion(event);
	}
	dropChampionIntoVoid(event) {
		event.preventDefault();
		const droppedChampion = this.recentlyDragged;
		if (
			droppedChampion.dataset.type == "pick" ||
			droppedChampion.dataset.type == "ban"
		) {
			droppedChampion.dataset.champion = "";
			this.selectedChampion = "";
			this.sendProcessSignal();
		}
	}
	dragChampion(event) {
		this.recentlyDragged = event.target;
		const image = document.createElement("img");
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		image.src = event.target.src;
		canvas.width = event.target.offsetWidth;
		canvas.height = event.target.offsetHeight;
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		event.dataTransfer.setDragImage(
			canvas,
			canvas.width / 2,
			canvas.height / 2,
		);
		this.selectChampion(event);
	}

	toggleUserDataForm() {
		if (this.rightOverlay.classList.contains("hidden")) {
			this.rightOverlay.classList.remove("hidden");

			const json = DataController.loadData(this.getDataSource(), "none");
			this.userDataInputTextarea.value = JSON.stringify(json, null, 4);
		} else this.rightOverlay.classList.add("hidden");
	}

	searchChampion() {
		this.searchBar.value = this.searchBar.value.trim();
		this.sendProcessSignal();
	}
	loadDefaultData() {
		this.dataSource = "default_data";
		const json = DataController.loadData(this.getDataSource(), "none");
		this.userDataInputTextarea.value = JSON.stringify(json, null, 4);
		this.sendProcessSignal();
	}
	loadUserData() {
		this.dataSource = "user_data";
		const json = DataController.loadData(this.getDataSource(), "none");
		this.userDataInputTextarea.value = JSON.stringify(json, null, 4);
		this.sendProcessSignal();
	}
	validateUserData(data) {
		const teams = ["all", "ally", "enemy"];
		const defaultData = DataController.loadData("default_data", "none");
		teams.forEach((current) => {
			if (data[current] == null) {
				data[current] = defaultData[current];
			}
		});
		return data;
	}
	saveUserData(textarea) {
		const input_error_box = document.querySelector("#input-error-box");
		let data;
		try {
			data = JSON.parse(textarea.value);
		} catch (e) {
			textarea.classList.remove("valid");
			textarea.classList.add("invalid");

			input_error_box.classList.remove("hidden");

			const message = e.toString();
			input_error_box.innerText = message;

			return;
		}
		textarea.classList.remove("invalid");
		textarea.classList.add("valid");
		input_error_box.classList.add("hidden");
		const validatedData = this.validateUserData(data);
		DataController.saveData("user_data", JSON.stringify(validatedData));
		this.dataSource = "user_data";
		this.sendProcessSignal();
	}
	async takeFileInput(event) {
		const file = event.target.files[0];
		const data = await DataController.readFile(file);
		const unvalidatedJSON = JSON.parse(data);
		const validatedData = this.validateUserData(unvalidatedJSON);
		DataController.saveData("user_data", JSON.stringify(validatedData));
		this.dataSource = "user_data";
		const json = JSON.parse(data);
		this.userDataInputTextarea.value = JSON.stringify(json, null, 4);
		this.sendProcessSignal();
	}
	clickInput(input) {
		input.click();
	}
	pickBanChampionWithKeyInput(key) {
		let data;
		if (this.currentMode == "pick") data = this.picks;
		if (this.currentMode == "ban") data = this.bans;
		if (
			this.currentlyHoveredChampion == "" ||
			this.championsContainer.childNodes.length == 1
		) {
			if (this.championsContainer.childNodes.length == 1) {
				this.currentlyHoveredChampion =
					this.championsContainer.firstChild.firstChild.dataset.champion;
			} else return;
		}
		let oldIndex = null;
		let pickOrBan = null;
		const number = parseInt(key);
		let index;
		switch (number) {
			case 0:
				index = 9;
				break;
			default:
				index = number - 1;
				break;
		}
		for (let i = 0; i < 10; i++) {
			if (
				this.picks[i].childNodes[1].dataset.champion ==
				this.currentlyHoveredChampion
			) {
				this.picks[i].childNodes[1].dataset.champion = "";
				oldIndex = i;
				pickOrBan = this.picks;
				break;
			}
			if (
				this.bans[i].childNodes[1].dataset.champion ==
				this.currentlyHoveredChampion
			) {
				this.bans[i].childNodes[1].dataset.champion = "";
				oldIndex = i;
				pickOrBan = this.bans;
				break;
			}
		}
		//swap champs if both are present
		if (oldIndex != null && data[index] != null) {
			pickOrBan[oldIndex].childNodes[1].dataset.champion =
				data[index].childNodes[1].dataset.champion;
		}
		data[index].childNodes[1].dataset.champion =
			this.currentlyHoveredChampion;
		this.currentlyHoveredChampion = "";
		this.sendProcessSignal();
	}

	togglePickBanMode() {
		let mode;
		if (this.currentMode == "pick") mode = "ban";
		else mode = "pick";
		this.setPickBanMode(mode);
	}
	setPickBanMode(mode) {
		this.currentMode = mode;
		if (this.currentMode == "pick") {
			this.togglePickBanModeButton.dataset.mode = "pick";
			this.togglePickBanModeButton.value = "Current mode: pick";
		} else {
			this.togglePickBanModeButton.dataset.mode = "ban";
			this.togglePickBanModeButton.value = "Current mode: ban";
		}
	}
	processKeyboardInput(event) {
		const key = event.key;
		const shiftKeyPressed = event.shiftKey;
		if ((key == "I" || key == "i") && shiftKeyPressed) {
			this.searchBar.blur();
			this.userDataInput.click();
		}
		if (!this.rightOverlay.classList.contains("hidden")) return;
		if (key == " ") {
			this.searchBar.focus();
		}
		if (key == "Delete") {
			this.picks.forEach((current) => {
				current.childNodes[1].dataset.champion = "";
			});
			this.bans.forEach((current) => {
				current.childNodes[1].dataset.champion = "";
			});
			this.sendProcessSignal();
		}
		if (key == "Backspace") {
			if (document.activeElement != this.searchBar) {
				this.searchBar.blur();
				if (this.currentlyHoveredChampion) {
					event.preventDefault();
					const selector = `[data-champion=${this.currentlyHoveredChampion}]`;
					const hoveredImg = document.querySelector(selector);
					if (hoveredImg == null) return;
					if (hoveredImg.dataset.champion != "")
						hoveredImg.dataset.champion = "";
					this.sendProcessSignal();
				}
			}
		}
		if (!shiftKeyPressed) {
			const letterRegex = /^[A-Za-z]$/;
			if (key.match(letterRegex)) {
				if (
					document.activeElement != this.searchBar &&
					this.config.clearSearchBarOnFocus === true
				)
					this.searchBar.value = "";
				this.searchBar.focus();
			}
			const numberRegex = /[0-9]/;
			if (key.match(numberRegex)) {
				this.searchBar.blur();
				this.pickBanChampionWithKeyInput(key);
			}
		} else {
			if (key == "C" || key == "c") {
				this.searchBar.blur();
				this.dataSource = "user_data";
				this.sendProcessSignal();
			}
			if (key == "D" || key == "d") {
				this.searchBar.blur();
				this.dataSource = "default_data";
				this.sendProcessSignal();
			}
			if (key == "F" || key == "f") {
				this.searchBar.blur();
				this.clickInput(this.fileInput);
			}
			if (key == "P" || key == "p") {
				this.searchBar.blur();
				this.setPickBanMode("pick");
			}
			if (key == "B" || key == "b") {
				this.searchBar.blur();
				this.setPickBanMode("ban");
			}
			if (key == "X" || key == "x") {
				this.searchBar.blur();
				let data;
				if (this.currentMode == "pick") data = this.picks;
				if (this.currentMode == "ban") data = this.bans;
				data.forEach((current) => {
					current.childNodes[1].dataset.champion = "";
				});
				this.sendProcessSignal();
			}
			if (key == "M" || key == "m") {
				this.searchBar.blur();
				if (!this.contentContainer.classList.contains("hidden"))
					this.contentContainer.classList.add("hidden");
				if (!this.leftOverlay.classList.contains("hidden"))
					this.leftOverlay.classList.add("hidden");
				if (this.manualContainer.classList.contains("hidden"))
					this.openManualButton.click();
				else this.closeManualButton.click();
			}
			if (key == "S" || key == "s") {
				this.searchBar.blur();
				if (this.contentContainer.classList.contains("hidden"))
					this.contentContainer.classList.remove("hidden");
				if (!this.manualContainer.classList.contains("hidden"))
					this.manualContainer.classList.add("hidden");
				if (this.leftOverlay.classList.contains("hidden"))
					this.enterSettingsButton.click();
				else this.leaveSettingsButton.click();
			}
			if (key === "T" || key == "t") {
				this.searchBar.blur();
				this.toggleDarkmodeButton.click();
			}
			if (key == "!") {
				this.searchBar.blur();
				this.roleIcons[0].click();
			}
			if (key == "@") {
				this.searchBar.blur();
				this.roleIcons[1].click();
			}
			if (key == "#") {
				this.searchBar.blur();
				this.roleIcons[2].click();
			}
			if (key == "$") {
				this.searchBar.blur();
				this.roleIcons[3].click();
			}
			if (key == "%") {
				this.searchBar.blur();
				this.roleIcons[4].click();
			}
			if (key == "Q" || key == "q") {
				this.searchBar.blur();
				this.logos[0].click();
			}
			if (key == "W" || key == "w") {
				this.searchBar.blur();
				this.logos[1].click();
			}
			if (key == "E" || key == "e") {
				this.searchBar.blur();
				this.logos[2].click();
			}
		}
	}
	toggleBorderColor() {
		this.config.colorBorders = !this.config.colorBorders;
		this.colorSettingsButtons();
		DataController.saveConfig(this.config);
		this.sendProcessSignal();
	}
	toggleDataSourceOnLoad() {
		this.config.loadUserDataOnProgramStart =
			!this.config.loadUserDataOnProgramStart;
		this.colorSettingsButtons();
		DataController.saveConfig(this.config);
	}
	toggleClearingSearchbarOnFocus() {
		this.config.clearSearchBarOnFocus = !this.config.clearSearchBarOnFocus;
		this.colorSettingsButtons();
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

	openSettingsMenu() {
		this.leftOverlay.classList.remove("hidden");
	}
	closeSettingsMenu() {
		this.leftOverlay.classList.add("hidden");
	}
	render(renderingData) {
		if (this.dataSource === "default_data") {
			this.userDataSwitch.classList.remove("highlighted");
			this.defaultDataSwitch.classList.add("highlighted");
		}
		if (this.dataSource === "user_data") {
			this.defaultDataSwitch.classList.remove("highlighted");
			this.userDataSwitch.classList.add("highlighted");
		}

		const championData = DataController.loadData(
			renderingData.dataSource,
			"none",
		);
		const roles = ["top", "jungle", "mid", "adc", "support"];
		const config = DataController.readConfig();
		// Render champions (central part)
		let exactlyMatchingChampion = null;
		for (let i = 0; i < renderingData.visibleChampions.length; i++) {
			const championName = renderingData.visibleChampions[i];
			if (championName == this.searchBar.value) {
				exactlyMatchingChampion = championName;
			}
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
			const championContainer = this.createChampionIcon(
				championName,
				isPickedOrBanned,
				team,
			);
			this.championsContainer.appendChild(championContainer);
			championContainer.addEventListener(
				"click",
				this.selectChampion.bind(this),
			);
			championContainer.addEventListener(
				"dragstart",
				this.dragChampion.bind(this),
			);
			championContainer.addEventListener(
				"dragend",
				this.dragendFunction.bind(this),
			);
			championContainer.addEventListener("mouseenter", () => {
				this.currentlyHoveredChampion =
					championContainer.firstChild.dataset.champion;
			});
			championContainer.addEventListener("mouseleave", () => {
				this.currentlyHoveredChampion = "";
			});
		}
		if (
			exactlyMatchingChampion == null &&
			this.championsContainer.hasChildNodes()
		) {
			this.currentlyHoveredChampion =
				this.championsContainer.childNodes[0].childNodes[0].dataset.champion;
		} else {
			this.currentlyHoveredChampion = exactlyMatchingChampion;
		}

		// Render picked champions
		for (let i = 0; i < this.picks.length; i++) {
			let img = this.picks[i].childNodes[1];
			if (img.classList.contains("selected"))
				img.classList.remove("selected");
			if (renderingData.pickedChampions[i] == "") {
				img.src = this.defaultPickIconPath;
				img.dataset.champion = "";
				img.dataset.type = "pick";
				img.draggable = "false";
				img.removeEventListener("dragstart", this.dragFunction);
				img.addEventListener("dragstart", this.stopDrag);
				img.removeEventListener("dragend", this.dragendFunction);
				img.removeEventListener("mouseenter", this.mouseenterFunction);
				img.removeEventListener("mouseleave", this.mouseleaveFunction);
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
				img.removeEventListener("mouseenter", this.mouseenterFunction);
				img.addEventListener("mouseenter", this.mouseenterFunction);
				img.removeEventListener("mouseleave", this.mouseleaveFunction);
				img.addEventListener("mouseleave", this.mouseleaveFunction);
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
				img.dataset.type = "ban";
				img.draggable = "false";
				img.removeEventListener("dragstart", this.dragFunction);
				img.addEventListener("dragstart", this.stopDrag);
				img.removeEventListener("dragend", this.dragendFunction);
				img.removeEventListener("mouseenter", this.mouseenterFunction);
				img.removeEventListener("mouseleave", this.mouseleaveFunction);
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
				img.removeEventListener("mouseenter", this.mouseenterFunction);
				img.addEventListener("mouseenter", this.mouseenterFunction);
				img.removeEventListener("mouseleave", this.mouseleaveFunction);
				img.addEventListener("mouseleave", this.mouseleaveFunction);
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
