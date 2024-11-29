import { DataController } from "./datacontroller.js";
import { Backend } from "./backend.js";
import { capitalize } from "./util.js";
/**
 * A container for all UI-related events and rendering
 */
export class UserInterface {
	constructor(defaultPickIconPath, defaultBanIconPath, imagePath) {
		this.defaultPickIconPath = defaultPickIconPath;
		this.defaultBanIconPath = defaultBanIconPath;
		this.imagePath = imagePath;

		this.pickIconPath = null;
		this.pickIconPostfix = null;
		this.championIconPath = null;
		this.championIconPostfix = null;
		this.banIconPath = null;
		this.banIconPostfix = null;

		this.sendProcessSignal = null;
		this.dataSource = null;
		this.config = null;
		this.team = "all";
		this.role = "all";
		this.selectionData = {
			selectedChampion: "",
			oldSlot: null,
			data: null,
		};
		this.recentlyDragged = null;
		this.renderingData = {
			visibleChampions: [],
			pickedChampions: [],
			bannedChampions: [],
		};
		this.currentlyHoveredChampion = "";
		this.userInputContainer = null;
		this.currentMode = "pick";
		this.themes = ["light", "dark", "village", "retro"];
		this.currentThemeIndex = this.loadSavedTheme();
		document.documentElement.dataset.theme =
			this.themes[this.currentThemeIndex];

		this.welcomeScreen = document.querySelector("#welcome-screen");
		this.closeWelcomeScreenButton = document.querySelector(
			"#close-welcome-screen",
		);
		this.closeWelcomeScreenForeverButton = document.querySelector(
			"#close-welcome-screen-never-show-again",
		);
		this.middleOverlay = document.querySelector("#middle-overlay");
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
		this.searchBar = document.querySelector("#search-bar");
		this.defaultDataSwitch = document.querySelector("#default_data");
		this.userDataSwitch = document.querySelector("#load_user_data");
		this.userDataInput = document.querySelector("#input_user_data");
		this.colorBordersToggle = document.querySelector(
			"#color-borders-toggle",
		);
		this.saveDraftStateToggle = document.querySelector(
			"#save-draft-state-toggle",
		);
		this.dataSourceOnLoadToggle = document.querySelector(
			"#load-user-data-on-program-load-toggle",
		);
		this.clearSearchbarOnFocusToggle = document.querySelector(
			"#clear-searchbar-on-focus-toggle",
		);
		this.toggleSearchModeButton = document.querySelector(
			"#search-mode-toggle",
		);
		this.useCompactModeToggle = document.querySelector(
			"#use-compact-mode-toggle",
		);
		this.useSmallPickIconsToggle = document.querySelector(
			"#use-small-picks-toggle",
		);
		this.useSmallChampionIconsToggle = document.querySelector(
			"#use-small-champions-toggle",
		);
		this.useSmallBanIconsToggle = document.querySelector(
			"#use-small-bans-toggle",
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
		this.switchThemeButton = document.querySelector("#switch-theme-button");
		this.switchThemeButton.value = capitalize(
			this.themes[this.currentThemeIndex],
		);
		this.manualContainer = document.querySelector("#manual-container");
		this.manualText = document.querySelector("#manual-text");
		this.goToTopOfManualButton =
			document.querySelector("#go-to-top-button");
		this.togglePickBanModeButton = document.querySelector(
			"#toggle-pick-ban-mode",
		);
		this.closeMiddleOverlayButton = document.querySelector(
			"#close-middle-overlay-button",
		);
		this.clearAllDraftSnapshotsButton = document.querySelector(
			"#clear-all-draft-snapshots-button",
		);
		this.middleOverlaySearchBar = document.querySelector(
			"#middle-overlay-search-bar",
		);
		this.exportDraftSnapshotsButton = document.querySelector(
			"#export-draft-snapshots-button",
		);
		this.importDraftSnapshotsButton = document.querySelector(
			"#import-draft-snapshots-button",
		);
		this.snapshotsFileInput = document.querySelector(
			"#snapshots-file-input",
		);
		this.snapshotsInputErrorBox = document.querySelector(
			"#snapshots-input-error-box",
		);
		this.draftSnapshotsContainer = document.querySelector(
			"#draft-snapshots-container",
		);
		this.saveDraftButton = document.querySelector("#save-draft-button");
		this.browseSavedDraftsButton = document.querySelector(
			"#browse-saved-drafts-button",
		);

		this.closeWelcomeScreenButton.addEventListener(
			"click",
			this.closeWelcomeScreen.bind(this),
		);
		this.closeWelcomeScreenForeverButton.addEventListener(
			"click",
			this.closeWelcomeScreen.bind(this),
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

		for (let i = 0; i < this.picks.length; i++) {
			this.picks[i].addEventListener(
				"click",
				this.placeChampion.bind(this),
			);
			this.picks[i].addEventListener(
				"drop",
				this.dropChampion.bind(this),
			);
			this.picks[i].childNodes[1].dataset.champion = "";
			this.picks[i].childNodes[1].dataset.slot = i.toString();
			this.picks[i].childNodes[1].dataset.slotType = "pick";
		}
		for (let i = 0; i < this.bans.length; i++) {
			this.bans[i].addEventListener(
				"click",
				this.placeChampion.bind(this),
			);
			this.bans[i].addEventListener("drop", this.dropChampion.bind(this));
			this.bans[i].childNodes[1].dataset.champion = "";
			this.bans[i].childNodes[1].dataset.slot = i.toString();
			this.bans[i].childNodes[1].dataset.slotType = "ban";
		}

		this.logos.forEach((current) => {
			current.addEventListener("click", this.setTeam.bind(this, current));
		});

		this.roleIcons.forEach((current) => {
			current.addEventListener("click", this.setRole.bind(this, current));
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
		this.saveDraftStateToggle.addEventListener(
			"click",
			this.toggleSavingDraftState.bind(this),
		);
		this.dataSourceOnLoadToggle.addEventListener(
			"click",
			this.toggleDataSourceOnLoad.bind(this),
		);
		this.clearSearchbarOnFocusToggle.addEventListener(
			"click",
			this.toggleClearingSearchbarOnFocus.bind(this),
		);
		this.useCompactModeToggle.addEventListener(
			"click",
			this.toggleCompactMode.bind(this),
		);
		this.useSmallPickIconsToggle.addEventListener(
			"click",
			this.togglePickIcons.bind(this),
		);
		this.useSmallChampionIconsToggle.addEventListener(
			"click",
			this.toggleChampionIcons.bind(this),
		);
		this.useSmallBanIconsToggle.addEventListener(
			"click",
			this.toggleBanIcons.bind(this),
		);

		document.addEventListener(
			"keydown",
			this.processKeyboardInput.bind(this),
		);

		this.enterSettingsButton.addEventListener(
			"click",
			this.openSettingsMenu.bind(this),
		);
		this.leaveSettingsButton.addEventListener(
			"click",
			this.closeSettingsMenu.bind(this),
		);
		this.contentContainer.addEventListener(
			"drop",
			this.dropChampionIntoVoid.bind(this),
		);
		this.openManualButton.addEventListener(
			"click",
			this.openManual.bind(this),
		);
		this.closeManualButton.addEventListener(
			"click",
			this.closeManual.bind(this),
		);
		this.switchThemeButton.addEventListener(
			"click",
			this.switchTheme.bind(this),
		);
		this.goToTopOfManualButton.addEventListener("click", () => {
			this.manualText.scrollTop = 0;
		});

		this.togglePickBanModeButton.addEventListener(
			"click",
			this.togglePickBanMode.bind(this),
		);
		this.closeMiddleOverlayButton.addEventListener(
			"click",
			this.hideMiddleOverlay.bind(this),
		);
		this.clearAllDraftSnapshotsButton.addEventListener(
			"click",
			this.clearAllDraftSnapshots.bind(this),
		);
		this.middleOverlaySearchBar.addEventListener(
			"input",
			this.browseSavedDrafts.bind(this),
		);
		this.exportDraftSnapshotsButton.addEventListener(
			"click",
			this.exportDraftSnapshots.bind(this),
		);
		this.snapshotsFileInput.addEventListener(
			"change",
			this.importDraftSnapshots.bind(this),
		);
		this.importDraftSnapshotsButton.addEventListener(
			"click",
			this.clickInput.bind(this, this.snapshotsFileInput),
		);
		this.saveDraftButton.addEventListener(
			"click",
			this.saveDraftSnapshot.bind(this),
		);
		this.browseSavedDraftsButton.addEventListener(
			"click",
			this.toggleMiddleOverlay.bind(this),
		);
		this.toggleSearchModeButton.addEventListener(
			"click",
			this.toggleSearchMode.bind(this),
		);

		this.dragFunction = this.dragChampion.bind(this);
		this.stopDrag = (event) => {
			event.preventDefault();
		};
		this.dragendFunction = function (event) {
			event.preventDefault();
			const dragImage = document.querySelector("#drag-image");
			document.body.removeChild(dragImage);
			this.selectionData.selectedChampion = "";
			this.selectionData.data = null;
			this.selectionData.oldSlot = null;
			const currentlySelectedIcon = document.querySelector(
				".selected[draggable='true']",
			);
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

		if (!localStorage.getItem("welcome_screen_off"))
			this.openWelcomeScreen();
		this.contentContainer.addEventListener("dragover", (event) => {
			event.preventDefault();
		});

		this.handleDrag();
	}

	//end of constructor
	openWelcomeScreen() {
		this.contentContainer.classList.add("hidden");
		this.welcomeScreen.classList.remove("hidden");
	}

	closeWelcomeScreen(event) {
		this.welcomeScreen.classList.add("hidden");
		this.contentContainer.classList.remove("hidden");

		if (event.target.id == "close-welcome-screen-never-show-again") {
			localStorage.setItem("welcome_screen_off", "true");
		}
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

	placeChampion(event) {
		if (this.selectionData.selectedChampion == "") {
			event.target.dataset.champion = "";
		}
		const replacedChampion = event.target.dataset.champion;

		for (let i = 0; i < this.picks.length; i++) {
			if (
				this.picks[i].childNodes[1].dataset.champion ==
					this.selectionData.selectedChampion &&
				this.selectionData.selectedChampion != ""
			) {
				this.selectionData.oldSlot = i;
				this.picks[i].childNodes[1].dataset.champion = "";
				break;
			}
			if (
				this.bans[i].childNodes[1].dataset.champion ==
					this.selectionData.selectedChampion &&
				this.selectionData.selectedChampion != ""
			) {
				this.selectionData.oldSlot = i;
				this.bans[i].childNodes[1].dataset.champion = "";
				break;
			}
		}
		event.target.dataset.champion = this.selectionData.selectedChampion;
		this.selectionData.selectedChampion = "";

		if (
			replacedChampion != null &&
			replacedChampion != "" &&
			this.selectionData.oldSlot != null &&
			this.selectionData.data != null
		) {
			this.selectionData.data[
				this.selectionData.oldSlot
			].childNodes[1].dataset.champion = replacedChampion;
		}
		this.sendProcessSignal();
	}

	dropChampion(event) {
		event.preventDefault();
		event.stopPropagation();

		const replacedChampion = event.target.dataset.champion;
		this.recentlyDragged.dataset.champion = replacedChampion;

		this.placeChampion(event);
	}

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

	toggleUserDataForm() {
		if (this.rightOverlay.classList.contains("hidden")) {
			this.rightOverlay.classList.remove("hidden");

			const json = DataController.loadData(this.getDataSource(), "none");
			this.userDataInputTextarea.value = JSON.stringify(json, null, 4);
		} else this.rightOverlay.classList.add("hidden");
	}

	toggleBorderColor() {
		this.config.colorBorders = !this.config.colorBorders;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.sendProcessSignal();
	}

	toggleSavingDraftState() {
		this.config.saveDraftState = !this.config.saveDraftState;
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

	toggleCompactMode() {
		this.config.useCompactMode = !this.config.useCompactMode;
		this.colorSettingsButtons();

		if (this.config.useCompactMode == true)
			document.documentElement.dataset.mode = "compact";
		else document.documentElement.dataset.mode = "wide";

		DataController.saveConfig(this.config);
	}

	setIcons() {
		if (this.config.useSmallPickIcons == true) {
			this.pickIconPath = "/small_converted_to_webp_scaled/";
			this.pickIconPostfix = ".webp";
		} else {
			this.pickIconPath = "/centered_minified_converted_to_webp_scaled/";
			this.pickIconPostfix = "_0.webp";
		}
		if (this.config.useSmallChampionIcons == true) {
			this.championIconPath = "/small_converted_to_webp_scaled/";
			this.championIconPostfix = ".webp";
		} else {
			this.championIconPath = "/tiles_converted_to_webp_scaled/";
			this.championIconPostfix = "_0.webp";
		}
		if (this.config.useSmallBanIcons == true) {
			this.banIconPath = "/small_converted_to_webp_scaled/";
			this.banIconPostfix = ".webp";
		} else {
			this.banIconPath = "/tiles_converted_to_webp_scaled/";
			this.banIconPostfix = "_0.webp";
		}
	}

	togglePickIcons() {
		this.config.useSmallPickIcons = !this.config.useSmallPickIcons;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.setIcons();
		this.sendProcessSignal();
	}
	toggleChampionIcons() {
		this.config.useSmallChampionIcons = !this.config.useSmallChampionIcons;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.setIcons();
		this.sendProcessSignal();
	}

	toggleBanIcons() {
		this.config.useSmallBanIcons = !this.config.useSmallBanIcons;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.setIcons();
		this.sendProcessSignal();
	}

	processKeyboardInput(event) {
		const key = event.key;
		if (this.middleOverlay.classList.contains("hidden"))
			this.processMainScreenInput(key);
		else this.processMiddleOverlayInput(key);
	}
	processMainScreenInput(key) {
		const shiftKeyPressed = event.shiftKey;
		if ((key == "I" || key == "i") && shiftKeyPressed) {
			this.searchBar.blur();
			this.userDataInput.click();
		}
		if (!this.rightOverlay.classList.contains("hidden")) return;

		if (key == " ") {
			if (
				document.activeElement != this.searchBar &&
				this.config.clearSearchBarOnFocus == true
			)
				this.searchBar.value = "";
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
				event.preventDefault();
				this.searchBar.blur();
				if (this.currentlyHoveredChampion) {
					event.preventDefault();

					for (let i = 0; i < this.picks.length; i++) {
						if (
							this.picks[i].childNodes[1].dataset.champion ==
							this.currentlyHoveredChampion
						)
							this.picks[i].childNodes[1].dataset.champion = "";
					}
					for (let i = 0; i < this.bans.length; i++) {
						if (
							this.bans[i].childNodes[1].dataset.champion ==
							this.currentlyHoveredChampion
						)
							this.bans[i].childNodes[1].dataset.champion = "";
					}

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
			if (key.match(numberRegex) && key.length == 1) {
				this.searchBar.blur();
				this.pickBanChampionWithKeyInput(key);
			}
		} else {
			if (key == "A" || key == "a") {
				this.searchBar.blur();
				this.toggleCompactMode();
			}
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
				this.switchTheme();
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
			if (key == "g" || key == "G") {
				this.searchBar.blur();
				this.toggleMiddleOverlay();
				return;
			}
			if (key == "v" || key == "V") {
				this.searchBar.blur();
				this.saveDraftSnapshot();
			}
		}
	}

	processMiddleOverlayInput(key) {
		const letterRegex = /^[A-Za-z]$/;
		const shiftKeyPressed = event.shiftKey;
		if (key.match(letterRegex)) {
			if (
				document.activeElement != this.middleOverlaySearchBar &&
				this.config.clearSearchBarOnFocus
			)
				this.middleOverlaySearchBar.value = "";
			this.middleOverlaySearchBar.focus();
		}

		if ((key == "g" || key == "G") && shiftKeyPressed) {
			this.middleOverlaySearchBar.blur();
			this.hideMiddleOverlay();
			return;
		}
		if (key == "Enter") {
			this.draftSnapshotsContainer.firstChild.click();
		}
	}

	openSettingsMenu() {
		this.leftOverlay.classList.remove("hidden");
	}

	closeSettingsMenu() {
		this.leftOverlay.classList.add("hidden");
	}

	dropChampionIntoVoid(event) {
		event.preventDefault();

		const droppedChampion = this.recentlyDragged;

		if (
			droppedChampion.dataset.slotType == "pick" ||
			droppedChampion.dataset.slotType == "ban"
		) {
			droppedChampion.dataset.champion = "";
			this.selectionData.selectedChampion = "";
			this.selectionData.data = null;
			this.selectionData.oldSlot = null;
			this.sendProcessSignal();
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

	switchTheme() {
		this.currentThemeIndex++;

		if (this.currentThemeIndex >= this.themes.length)
			this.currentThemeIndex = 0;

		const theme = this.themes[this.currentThemeIndex];
		document.documentElement.dataset.theme = theme;

		this.switchThemeButton.value = capitalize(theme);

		localStorage.setItem("theme", theme);
	}

	togglePickBanMode() {
		let mode;

		if (this.currentMode == "pick") mode = "ban";
		else mode = "pick";

		this.setPickBanMode(mode);
	}

	hideMiddleOverlay() {
		if (!this.middleOverlay.classList.contains("hidden"))
			this.middleOverlay.classList.add("hidden");
		this.draftSnapshotsContainer.innerHTML = "";
	}

	toggleMiddleOverlay() {
		if (this.middleOverlay.classList.contains("hidden")) {
			this.middleOverlay.classList.remove("hidden");

			this.browseSavedDrafts();
		} else {
			this.middleOverlay.classList.add("hidden");
			this.draftSnapshotsContainer.innerHTML = "";
		}
	}

	clearAllDraftSnapshots() {
		localStorage.removeItem("savedDrafts");
		this.hideMiddleOverlay();
	}

	saveDraftSnapshot() {
		const picks = DataController.loadPicksAndBans();
		const saved_drafts = DataController.loadSavedDrafts();

		saved_drafts.push(picks);
		DataController.saveData("savedDrafts", saved_drafts);

		if (!this.middleOverlay.classList.contains("hidden")) {
			this.hideMiddleOverlay();
			this.browseSavedDrafts();
		}
	}

	browseSavedDrafts() {
		this.draftSnapshotsContainer.innerHTML = "";

		let saved_drafts = DataController.loadSavedDrafts();

		const query = this.middleOverlaySearchBar.value;
		if (query != "")
			saved_drafts = Backend.filterDrafts(saved_drafts, query);

		for (let i = 0; i < saved_drafts.length; i++) {
			const draft = saved_drafts[i];
			if (draft == null) continue;

			const draftPreview = this.createDraftSnapshotPreview(draft);
			draftPreview.addEventListener(
				"click",
				this.loadDraftSnapshot.bind(this, draft, i),
			);

			this.draftSnapshotsContainer.appendChild(draftPreview);
		}
	}

	createDraftSnapshotPreview(draft, id) {
		const container = document.createElement("div");
		container.classList.add("draft-snapshot-container");

		for (let i = 0; i < draft.picks.length; i++) {
			const champion = draft.picks[i];

			const div = document.createElement("div");
			div.classList = "draft-preview-icon-container";
			div.draggable = false;

			const img = document.createElement("img");
			if (champion == "") img.src = this.defaultBanIconPath;
			else
				img.src =
					this.imagePath +
					"/small_converted_to_webp_scaled/" +
					capitalize(champion) +
					".webp";

			div.appendChild(img);
			container.appendChild(div);

			div.addEventListener("dragstart", this.stopDrag);
		}

		const remove_button = document.createElement("img");
		remove_button.src = "./img/trash.png";
		remove_button.classList += "draft-snapshot-remove-button";

		container.appendChild(remove_button);

		remove_button.addEventListener(
			"click",
			this.removeDraftSnapshot.bind(this, container, id),
		);

		return container;
	}

	removeDraftSnapshot(container, id) {
		event.stopPropagation();
		container.remove();

		let savedDrafts = DataController.loadSavedDrafts();
		savedDrafts.splice(id, 1);

		DataController.saveData("savedDrafts", savedDrafts);
	}

	loadDraftSnapshot(draft) {
		for (let i = 0; i < draft.picks.length; i++) {
			this.picks[i].childNodes[1].dataset.champion = draft.picks[i];
		}
		for (let i = 0; i < draft.picks.length; i++) {
			this.bans[i].childNodes[1].dataset.champion = draft.bans[i];
		}
		this.sendProcessSignal();
	}

	exportDraftSnapshots() {
		const snapshots = DataController.loadSavedDrafts();

		const blob = new Blob([JSON.stringify(snapshots, null, 4)], {
			type: "plain/text",
		});
		const fileUrl = URL.createObjectURL(blob);
		const downloadElement = document.createElement("a");
		downloadElement.href = fileUrl;
		downloadElement.download = "snapshots.txt";
		downloadElement.style.display = "none";
		document.body.appendChild(downloadElement);
		downloadElement.click();
		document.body.removeChild(downloadElement);
	}

	async importDraftSnapshots() {
		const file = event.target.files[0];
		const data = await DataController.readFile(file);

		try {
			JSON.parse(data);
		} catch (e) {
			this.snapshotsInputErrorBox.classList.remove("hidden");
			this.snapshotsInputErrorBox.innerHTML = e.toString();
			return;
		}

		DataController.saveData("savedDrafts", data);

		if (!this.snapshotsInputErrorBox.classList.contains("hidden"))
			this.snapshotsInputErrorBox.classList.add("hidden");

		this.hideMiddleOverlay();
		this.toggleMiddleOverlay();
	}

	toggleSearchMode() {
		this.config.useLegacySearch = !this.config.useLegacySearch;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.sendProcessSignal();
	}

	dragChampion(event) {
		this.recentlyDragged = event.target;

		let dragImage = document.createElement("img");
		dragImage.src = event.target.src;
		dragImage.id = "drag-image";
		let width = event.target.offsetWidth;
		let height = event.target.offsetHeight;
		document.body.appendChild(dragImage);

		event.dataTransfer.setDragImage(dragImage, width / 2, height / 2);

		this.selectChampion(event);
	}

	colorSettingsButtons() {
		const buttons = [
			this.colorBordersToggle,
			this.saveDraftStateToggle,
			this.dataSourceOnLoadToggle,
			this.clearSearchbarOnFocusToggle,
			this.toggleSearchModeButton,
			this.useCompactModeToggle,
			this.useSmallPickIconsToggle,
			this.useSmallChampionIconsToggle,
			this.useSmallBanIconsToggle,
		];
		const config_settings = [
			this.config.colorBorders,
			this.config.saveDraftState,
			this.config.loadUserDataOnProgramStart,
			this.config.clearSearchBarOnFocus,
			this.config.useLegacySearch,
			this.config.useCompactMode,
			this.config.useSmallPickIcons,
			this.config.useSmallChampionIcons,
			this.config.useSmallBanIcons,
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

	/**
	 * Finds the index of the saved theme
	 * @returns {number} The index of the saved theme, or 0 if nothing is found
	 */
	loadSavedTheme() {
		let theme = localStorage.getItem("theme");

		if (theme == null) theme = "dark";

		for (let i = 0; i < this.themes.length; i++) {
			if (theme == this.themes[i]) return i;
		}

		console.log("Couldn't find the theme in loadSavedTheme()!");
		return 0;
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

		if (
			this.selectionData.selectedChampion == championIcon.dataset.champion
		) {
			this.selectionData.selectedChampion = "";
			this.selectionData.oldSlot = null;
			this.selectionData.data = null;
			return;
		}
		championIcon.classList.add("selected");
		this.selectionData.selectedChampion = event.target.dataset.champion;
		this.selectionData.data =
			event.target.dataset.slotType == "pick" ? this.picks : this.bans;
		this.selectionData.oldSlot = event.target.dataset.slot;
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
					this.championsContainer.firstChild.dataset.champion;
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
		if (this.currentlyHoveredChampion != null) {
			data[index].childNodes[1].dataset.champion =
				this.currentlyHoveredChampion;
		}

		this.currentlyHoveredChampion = "";

		this.sendProcessSignal();
	}

	setPickBanMode(mode) {
		this.currentMode = mode;

		if (this.currentMode == "pick") {
			this.togglePickBanModeButton.dataset.mode = "pick";
			this.togglePickBanModeButton.value = "Mode: pick";
		} else {
			this.togglePickBanModeButton.dataset.mode = "ban";
			this.togglePickBanModeButton.value = "Mode: ban";
		}
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
			if (renderingData.visibleChampions[i] == undefined) break;
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
			championIcon.addEventListener(
				"dragend",
				this.dragendFunction.bind(this),
			);
			championIcon.addEventListener("mouseenter", () => {
				this.currentlyHoveredChampion = championIcon.dataset.champion;
			});
			championIcon.addEventListener("mouseleave", () => {
				this.currentlyHoveredChampion = "";
			});
		}

		if (
			exactlyMatchingChampion == null &&
			this.championsContainer.hasChildNodes()
		) {
			this.currentlyHoveredChampion =
				this.championsContainer.childNodes[0].dataset.champion;
		} else {
			this.currentlyHoveredChampion = exactlyMatchingChampion;
		}

		// Render picked champions
		for (let i = 0; i < this.picks.length; i++) {
			let img = this.picks[i].childNodes[1];

			if (img.classList.contains("selected"))
				img.classList.remove("selected");

			if (renderingData.pickedChampions[i] == "") {
				if (this.config.useSmallPickIcons == true)
					img.src = this.defaultBanIconPath;
				else img.src = this.defaultPickIconPath;

				img.alt = "champion-pick-icon";
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
					this.imagePath +
					this.pickIconPath +
					capitalize(renderingData.pickedChampions[i]) +
					this.pickIconPostfix;
				img.alt =
					"champion-pick-icon-" + renderingData.pickedChampions[i];
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
				img.alt = "champion-ban-icon";
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
					this.imagePath +
					this.banIconPath +
					capitalize(renderingData.bannedChampions[i]) +
					this.banIconPostfix;
				img.alt =
					"champion-ban-icon-" + renderingData.bannedChampions[i];
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
		const championIcon = document.createElement("img");

		championIcon.classList += "champion-icon";
		championIcon.src =
			this.imagePath +
			this.championIconPath +
			capitalize(championName) +
			this.championIconPostfix;
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

		return championIcon;
	}

	handleDrag() {
		document.documentElement.addEventListener("dragstart", () => {
			if (!event.target.draggable == true) event.preventDefault();
		});
	}
}
