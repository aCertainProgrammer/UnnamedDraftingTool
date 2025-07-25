import { DataController } from "./datacontroller.js";
import { Backend } from "./backend.js";
import { capitalize, downloadImage, prettifyChampionName } from "./util.js";
import { drawDraft } from "./images.js";
/**
 * A container for all UI-related events and rendering
 */
export class UserInterface {
	constructor(defaultPickIconPath, defaultBanIconPath, imagePath) {
		this.draftCounterMaxLimit = 999;
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
		this.sendDraftImportSignal = null;
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
		this.useZenMode = false;
		this.binds = DataController.loadBinds();
		this.currentlyHoveredChampion = "";
		this.userInputContainer = null;
		this.currentMode = "pick";
		this.themes = ["light", "dark", "village", "retro"];
		this.currentThemeIndex = this.loadSavedTheme();
		document.documentElement.dataset.theme =
			this.themes[this.currentThemeIndex];

		this.allyEnemyColors = ["none", "B/R", "R/B"];
		this.currentAllyEnemyColorsIndex = this.loadSavedAllyEnemyColors();
		this.oddDraftsColors = localStorage.getItem("oddDraftsColors");
		if (
			this.oddDraftsColors == null &&
			this.currentAllyEnemyColorsIndex != 0
		) {
			this.oddDraftsColors =
				this.allyEnemyColors[this.currentAllyEnemyColorsIndex];
			localStorage.setItem("oddDraftsColors", this.oddDraftsColors);
		}
		document.documentElement.dataset.allyEnemyColors =
			this.allyEnemyColors[this.currentAllyEnemyColorsIndex];

		this.welcomeScreen = document.querySelector("#welcome-screen");
		this.closeWelcomeScreenButton = document.querySelector(
			"#close-welcome-screen",
		);
		this.closeWelcomeScreenForeverButton = document.querySelector(
			"#close-welcome-screen-never-show-again",
		);
		this.header = document.querySelector("#header");
		this.middleOverlay = document.querySelector("#middle-overlay");
		this.rightOverlay = document.querySelector("#right-overlay");
		this.leftOverlay = document.querySelector("#left-overlay");
		this.bindMenu = document.querySelector("#bind-menu");
		this.zenModeBindInput = document.querySelector("#zen-mode-bind");
		this.fearlessModeBindInput = document.querySelector(
			"#fearless-mode-bind",
		);
		this.pickModeBindInput = document.querySelector("#pick-mode-bind");
		this.banModeBindInput = document.querySelector("#ban-mode-bind");
		this.clearPicksOrBansBindInput = document.querySelector(
			"#clear-picks-or-bans-bind",
		);
		this.saveDraftSnapshotBindInput = document.querySelector(
			"#save-draft-snapshot-bind",
		);
		this.browseDraftSnapshotsBindInput = document.querySelector(
			"#browse-draft-snapshots-bind",
		);
		this.loadCustomDataBindInput = document.querySelector(
			"#load-custom-data-bind",
		);
		this.loadDefaultDataBindInput = document.querySelector(
			"#load-default-data-bind",
		);
		this.inputCustomDataBindInput = document.querySelector(
			"#input-custom-data-bind",
		);
		this.importCustomDataFromFileBindInput = document.querySelector(
			"#import-custom-data-bind",
		);
		this.toggleThemeBindInput =
			document.querySelector("#toggle-theme-bind");
		this.toggleManualBindInput = document.querySelector(
			"#toggle-manual-bind",
		);
		this.toggleSettingsTabBindInput = document.querySelector(
			"#toggle-settings-bind",
		);
		this.toggleCompactModeBindInput = document.querySelector(
			"#toggle-compact-mode-bind",
		);
		this.toggleToplaneFilteringBindInput = document.querySelector(
			"#toggle-toplane-filtering-bind",
		);
		this.toggleJungleFilteringBindInput = document.querySelector(
			"#toggle-jungle-filtering-bind",
		);
		this.toggleMidlaneFilteringBindInput = document.querySelector(
			"#toggle-midlane-filtering-bind",
		);
		this.toggleADCFilteringBindInput = document.querySelector(
			"#toggle-adc-filtering-bind",
		);
		this.toggleSupportFilteringBindInput = document.querySelector(
			"#toggle-support-filtering-bind",
		);
		this.toggleAllFilteringBindInput = document.querySelector(
			"#toggle-all-filtering-bind",
		);
		this.toggleAllyFilteringBindInput = document.querySelector(
			"#toggle-ally-filtering-bind",
		);
		this.toggleEnemyFilteringBindInput = document.querySelector(
			"#toggle-enemy-filtering-bind",
		);
		this.resetBindsButton = document.querySelector("#reset-binds-button");
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
		this.dataSourceSwitch = document.querySelector("#default_data");
		this.userDataInput = document.querySelector("#input_user_data");
		this.useZenModeToggle = document.querySelector("#zen-mode-toggle");
		this.useFearlessModeToggle = document.querySelector(
			"#use-fearless-mode-toggle",
		);
		this.makeNewDraftsBlankToggle = document.querySelector(
			"#blank-new-drafts-toggle",
		);
		this.draftLimitInput = document.querySelector("#draft-limit-input");
		let limit = localStorage.getItem("maxDraftNumber");
		if (limit == null || limit == "null") limit = 0;
		this.draftLimitInput.value = limit;
		this.enableAllChampionsInTheLastDraftToggle = document.querySelector(
			"#enable-all-champions-in-last-draft-toggle",
		);
		this.exportCurrentDraftsButton = document.querySelector(
			"#export-current-drafts-button",
		);
		this.importDraftsButton = document.querySelector(
			"#import-drafts-button",
		);
		this.importDraftsFileInput = document.querySelector(
			"#import-drafts-file-input",
		);
		this.draftImportInputErrorBox = document.querySelector(
			"#draft-import-input-error-box",
		);
		this.clearAllDraftsButton = document.querySelector(
			"#clear-all-drafts-button",
		);
		this.exportAllDraftsAsScreenshotsButton = document.getElementById(
			"export-all-draft-images-button",
		);
		this.toggleTeamColorTogglingToggle = document.querySelector(
			"#toggle-color-toggling-toggle",
		);
		this.colorBordersToggle = document.querySelector(
			"#color-borders-toggle",
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
		this.toggleAppendingToDraftSnapshotsButton = document.querySelector(
			"#append-to-snapshots-on-import-toggle",
		);
		this.draftSnapshotDisplayToggle = document.querySelector(
			"#draft-snapshot-display-toggle",
		);
		this.useSuperCompactModeToggle = document.querySelector(
			"#use-super-compact-mode-toggle",
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
		this.useColorGradientToggle = document.querySelector(
			"#use-color-gradient-toggle",
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
		this.draftSnapshotsPaginationLeftArrow = document.querySelector(
			"#snapshots-pagination-left-arrow",
		);
		this.draftSnapshotsPaginationPageCounter = document.querySelector(
			"#snapshots-pagination-page-counter",
		);
		this.draftSnapshotsPaginationRightArrow = document.querySelector(
			"#snapshots-pagination-right-arrow",
		);
		this.draftSnapshotsPaginationItemCount = document.querySelector(
			"#draft-snapshots-per-page",
		);
		this.saveDraftButton = document.querySelector("#save-draft-button");
		this.browseSavedDraftsButton = document.querySelector(
			"#browse-saved-drafts-button",
		);
		this.draftCounterLeftArrow = document.querySelector(
			"#draft-counter-left-arrow",
		);
		this.draftCounterRightArrow = document.querySelector(
			"#draft-counter-right-arrow",
		);
		this.draftCounter = document.querySelector("#draft-counter");
		this.draftCounter.value = 1;
		this.toggleAllyEnemyColorsButton = document.querySelector(
			"#toggle-ally-enemy-coloring-button",
		);
		this.toggleAllyEnemyColorsButton.value =
			"Colors: " + this.allyEnemyColors[this.currentAllyEnemyColorsIndex];

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
		this.bindMenu.addEventListener("input", this.changeBinds.bind(this));
		this.resetBindsButton.addEventListener(
			"click",
			this.resetBinds.bind(this),
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
		this.dataSourceSwitch.addEventListener(
			"click",
			this.toggleDataSource.bind(this),
		);
		this.userDataInput.addEventListener(
			"click",
			this.toggleUserDataForm.bind(this),
		);
		this.useZenModeToggle.addEventListener(
			"click",
			this.toggleZenMode.bind(this),
		);
		this.useFearlessModeToggle.addEventListener(
			"click",
			this.toggleFearlessMode.bind(this),
		);
		this.makeNewDraftsBlankToggle.addEventListener(
			"click",
			this.toggleMakingBlankDrafts.bind(this),
		);
		this.draftLimitInput.addEventListener(
			"input",
			this.changeMaxDraftNumber.bind(this),
		);
		this.enableAllChampionsInTheLastDraftToggle.addEventListener(
			"click",
			this.toggleEnablingAllChampionsForLastDraft.bind(this),
		);
		this.exportCurrentDraftsButton.addEventListener(
			"click",
			this.exportDrafts.bind(this),
		);
		this.importDraftsButton.addEventListener(
			"click",
			this.clickInput.bind(this, this.importDraftsFileInput),
		);
		this.importDraftsFileInput.addEventListener(
			"input",
			this.importDrafts.bind(this),
		);
		this.clearAllDraftsButton.addEventListener(
			"click",
			this.clearAllDrafts.bind(this),
		);
		this.exportAllDraftsAsScreenshotsButton.addEventListener(
			"click",
			this.exportAllDraftsAsImages.bind(this),
		);
		this.toggleTeamColorTogglingToggle.addEventListener(
			"click",
			this.toggleTeamColorToggling.bind(this),
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
		this.draftSnapshotDisplayToggle.addEventListener(
			"click",
			this.toggleDraftSnapshotDisplay.bind(this),
		);
		this.useSuperCompactModeToggle.addEventListener(
			"click",
			this.toggleSuperCompactMode.bind(this),
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
		this.useColorGradientToggle.addEventListener(
			"click",
			this.toggleColorGradient.bind(this),
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
			"input",
			this.importDraftSnapshots.bind(this),
		);
		this.importDraftSnapshotsButton.addEventListener(
			"click",
			this.clickInput.bind(this, this.snapshotsFileInput),
		);
		this.draftSnapshotsPaginationLeftArrow.addEventListener(
			"click",
			this.changeDraftPaginationPage.bind(this, -1),
		);
		this.draftSnapshotsPaginationPageCounter.addEventListener(
			"input",
			this.browseSavedDrafts.bind(this),
		);
		this.draftSnapshotsPaginationRightArrow.addEventListener(
			"click",
			this.changeDraftPaginationPage.bind(this, 1),
		);
		this.draftSnapshotsPaginationItemCount.addEventListener(
			"change",
			this.inputDraftSnapshotPaginationItemCount.bind(this),
		);
		this.saveDraftButton.addEventListener(
			"click",
			this.saveDraftSnapshot.bind(this),
		);
		this.browseSavedDraftsButton.addEventListener(
			"click",
			this.toggleMiddleOverlay.bind(this),
		);
		this.draftCounterLeftArrow.addEventListener(
			"click",
			this.changeDraftNumber.bind(this, -1),
		);
		this.draftCounterRightArrow.addEventListener(
			"click",
			this.changeDraftNumber.bind(this, 1),
		);
		this.draftCounter.addEventListener("input", this.openDraft.bind(this));
		this.toggleAllyEnemyColorsButton.addEventListener(
			"click",
			this.toggleAllyEnemyColors.bind(this),
		);
		this.toggleSearchModeButton.addEventListener(
			"click",
			this.toggleSearchMode.bind(this),
		);
		this.toggleAppendingToDraftSnapshotsButton.addEventListener(
			"click",
			this.toggleAppendingToDraftSnapshots.bind(this),
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

		this.contentContainer.addEventListener("dragover", (event) => {
			event.preventDefault();
		});

		this.setBindInputValues();
		this.handleDrag();
		document.body.addEventListener(
			"click",
			this.closeOverlaysIfClickIsOutside.bind(this),
		);
	}

	//end of constructor
	openWelcomeScreen() {
		this.welcomeScreen.classList.remove("hidden");
	}

	closeWelcomeScreen(event) {
		this.welcomeScreen.classList.add("hidden");
		this.contentContainer.classList.remove("hidden");

		if (
			event != undefined &&
			event.target.id == "close-welcome-screen-never-show-again"
		) {
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

		if (this.dataSource != "user_data") {
			this.toggleDataSource();
		}

		this.sendProcessSignal();
	}

	changeBinds(event) {
		const bindId = event.target.id;
		const bindKey = event.target.value;

		switch (bindId) {
			case "zen-mode-bind":
				this.binds.zenModeBind = bindKey;
				break;
			case "fearless-mode-bind":
				this.binds.fearlessModeBind = bindKey;
				break;
			case "pick-mode-bind":
				this.binds.pickModeBind = bindKey;
				break;
			case "ban-mode-bind":
				this.binds.banModeBind = bindKey;
				break;
			case "clear-picks-or-bans-bind":
				this.binds.clearPicksOrBansBind = bindKey;
				break;
			case "save-draft-snapshot-bind":
				this.binds.saveDraftSnapshotBind = bindKey;
				break;
			case "browse-draft-snapshots-bind":
				this.binds.browseDraftSnapshotsBind = bindKey;
				break;
			case "load-custom-data-bind":
				this.binds.loadCustomDataBind = bindKey;
				break;
			case "load-default-data-bind":
				this.binds.loadDefaultDataBind = bindKey;
				break;
			case "input-custom-data-bind":
				this.binds.inputCustomDataBind = bindKey;
				break;
			case "import-custom-data-bind":
				this.binds.importCustomDataFromFileBind = bindKey;
				break;
			case "toggle-theme-bind":
				this.binds.toggleThemeBind = bindKey;
				break;
			case "toggle-manual-bind":
				this.binds.toggleManualBind = bindKey;
				break;
			case "toggle-settings-bind":
				this.binds.toggleSettingsTabBind = bindKey;
				break;
			case "toggle-compact-mode-bind":
				this.binds.toggleCompactModeBind = bindKey;
				break;
			case "toggle-toplane-filtering-bind":
				this.binds.toggleToplaneFilteringBind = bindKey;
				break;
			case "toggle-jungle-filtering-bind":
				this.binds.toggleJungleFilteringBind = bindKey;
				break;
			case "toggle-midlane-filtering-bind":
				this.binds.toggleMidlaneFilteringBind = bindKey;
				break;
			case "toggle-adc-filtering-bind":
				this.binds.toggleADCFilteringBind = bindKey;
				break;
			case "toggle-support-filtering-bind":
				this.binds.toggleSupportFilteringBind = bindKey;
				break;
			case "toggle-all-filtering-bind":
				this.binds.toggleAllFilteringBind = bindKey;
				break;
			case "toggle-ally-filtering-bind":
				this.binds.toggleAllyFilteringBind = bindKey;
				break;
			case "toggle-enemy-filtering-bind":
				this.binds.toggleEnemyFilteringBind = bindKey;
				break;
			case "reset-binds-button":
				break;
			default:
				console.log("Bad ID!");
				return;
		}
		DataController.saveBinds(this.binds);
		this.setBindInputValues();
	}
	resetBinds() {
		localStorage.removeItem("keybinds");
		this.binds = DataController.loadBinds();
		DataController.saveBinds(this.binds);
		this.setBindInputValues();
	}

	setBindInputValues() {
		this.zenModeBindInput.value = this.binds.zenModeBind || "";
		this.fearlessModeBindInput.value = this.binds.fearlessModeBind || "";
		this.pickModeBindInput.value = this.binds.pickModeBind || "";
		this.banModeBindInput.value = this.binds.banModeBind || "";
		this.clearPicksOrBansBindInput.value =
			this.binds.clearPicksOrBansBind || "";
		this.saveDraftSnapshotBindInput.value =
			this.binds.saveDraftSnapshotBind || "";
		this.browseDraftSnapshotsBindInput.value =
			this.binds.browseDraftSnapshotsBind || "";
		this.loadCustomDataBindInput.value =
			this.binds.loadCustomDataBind || "";
		this.loadDefaultDataBindInput.value =
			this.binds.loadDefaultDataBind || "";
		this.inputCustomDataBindInput.value =
			this.binds.inputCustomDataBind || "";
		this.importCustomDataFromFileBindInput.value =
			this.binds.importCustomDataFromFileBind || "";
		this.toggleThemeBindInput.value = this.binds.toggleThemeBind || "";
		this.toggleManualBindInput.value = this.binds.toggleManualBind || "";
		this.toggleSettingsTabBindInput.value =
			this.binds.toggleSettingsTabBind || "";
		this.toggleCompactModeBindInput.value =
			this.binds.toggleCompactModeBind || "";
		this.toggleToplaneFilteringBindInput.value =
			this.binds.toggleToplaneFilteringBind || "";
		this.toggleJungleFilteringBindInput.value =
			this.binds.toggleJungleFilteringBind || "";
		this.toggleMidlaneFilteringBindInput.value =
			this.binds.toggleMidlaneFilteringBind || "";
		this.toggleADCFilteringBindInput.value =
			this.binds.toggleADCFilteringBind || "";
		this.toggleSupportFilteringBindInput.value =
			this.binds.toggleSupportFilteringBind || "";
		this.toggleAllFilteringBindInput.value =
			this.binds.toggleAllFilteringBind || "";
		this.toggleAllyFilteringBindInput.value =
			this.binds.toggleAllyFilteringBind || "";
		this.toggleEnemyFilteringBindInput.value =
			this.binds.toggleEnemyFilteringBind || "";
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
		const replacedChampion = event.target.dataset.champion;
		if (replacedChampion == this.selectionData.selectedChampion) {
			this.selectionData.selectedChampion = "";
			this.selectionData.oldSlot = null;
			this.selectionData.data = null;
			this.clearSelectedChampions();
			return;
		}

		if (this.selectionData.selectedChampion == "") {
			event.target.dataset.champion = "";
		}

		for (let i = 0; i < this.picks.length; i++) {
			if (
				this.picks[i].childNodes[1].dataset.champion ==
					this.selectionData.selectedChampion &&
				this.selectionData.selectedChampion != ""
			) {
				this.selectionData.oldSlot = i;
				this.selectionData.data = this.picks;
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
				this.selectionData.data = this.bans;
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
		this.selectionData.data = null;
		this.selectionData.selectedChampion = "";
		this.selectionData.oldSlot = null;
		this.clearSelectedChampions();
		this.sendProcessSignal();
	}

	dropChampion(event) {
		event.preventDefault();
		event.stopPropagation();

		if (event.target.dataset.champion == null) return;

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

	toggleDataSource() {
		if (this.dataSource == "default_data") {
			this.dataSourceSwitch.value = "Use default data";
			this.loadUserData();
		} else {
			this.dataSourceSwitch.value = "Use custom data";
			this.loadDefaultData();
		}
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
		event.stopPropagation();
	}

	toggleZenMode() {
		this.useZenModeToggle.dataset.value =
			this.useZenModeToggle.dataset.value == "false" ? "true" : "false";
		this.useZenMode =
			this.useZenModeToggle.dataset.value == "false" ? false : true;

		if (
			this.useZenModeToggle.dataset.value == "false" &&
			this.header.classList.contains("hidden")
		) {
			this.header.classList.remove("hidden");
		} else if (
			this.useZenModeToggle.dataset.value == "true" &&
			!this.header.classList.contains("hidden")
		) {
			this.header.classList.add("hidden");
		}

		this.colorSettingsButtons();
	}

	toggleFearlessMode() {
		this.config.useFearlessMode = !this.config.useFearlessMode;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.sendProcessSignal();
	}

	toggleMakingBlankDrafts() {
		this.config.makeNewDraftsBlank = !this.config.makeNewDraftsBlank;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);
	}

	toggleEnablingAllChampionsForLastDraft() {
		this.config.enableAllChampionsInTheLastDraft =
			!this.config.enableAllChampionsInTheLastDraft;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.sendProcessSignal();
	}

	exportDrafts() {
		const drafts = DataController.loadPicksAndBans();

		let limited_drafts = [];

		const maxDrafts = localStorage.getItem("maxDraftNumber");

		if (
			maxDrafts == 0 ||
			maxDrafts == "" ||
			maxDrafts == null ||
			maxDrafts == "null"
		) {
			limited_drafts = drafts;
		} else {
			for (let i = 0; i < maxDrafts; i++) {
				limited_drafts.push(drafts[i]);
			}
		}

		const blob = new Blob([JSON.stringify(limited_drafts, null, 4)], {
			type: "plain/text",
		});
		const fileUrl = URL.createObjectURL(blob);
		const downloadElement = document.createElement("a");
		downloadElement.href = fileUrl;
		downloadElement.download = "drafts.json";
		downloadElement.style.display = "none";
		document.body.appendChild(downloadElement);
		downloadElement.click();
		document.body.removeChild(downloadElement);
	}

	async importDrafts() {
		const file = event.target.files[0];
		const data = await DataController.readFile(file);

		try {
			JSON.parse(data);
		} catch (e) {
			this.draftImportInputErrorBox.classList.remove("hidden");
			this.draftImportInputErrorBox.innerHTML = e.toString();
			return;
		}

		DataController.saveData("picksAndBans", data);

		if (this.draftImportInputErrorBox.classList.contains("hidden")) {
			this.draftImportInputErrorBox.classList.remove("hidden");
		}

		this.sendDraftImportSignal();
		this.sendProcessSignal();
	}

	clearAllDrafts() {
		const ok = window.confirm("Do you want to clear all drafts?");
		if (!ok) return;

		localStorage.removeItem("picksAndBans");

		this.picks.forEach((current) => {
			current.childNodes[1].dataset.champion = "";
		});
		this.bans.forEach((current) => {
			current.childNodes[1].dataset.champion = "";
		});

		this.draftCounter.value = 1;

		this.sendProcessSignal();
	}

	async exportAllDraftsAsImages() {
		const drafts = DataController.loadPicksAndBans();

		let limited_drafts = [];

		const maxDrafts = localStorage.getItem("maxDraftNumber");

		if (
			maxDrafts == 0 ||
			maxDrafts == "" ||
			maxDrafts == null ||
			maxDrafts == "null"
		) {
			limited_drafts = drafts;
		} else {
			for (let i = 0; i < maxDrafts; i++) {
				limited_drafts.push(drafts[i]);
			}
		}

		await this.exportDraftsAsImages(drafts);
	}

	async exportDraftsAsImages(drafts) {
		const paths = {
			imagePath: this.imagePath,
			pickIconPostfix: this.pickIconPostfix,
			banIconPostfix: this.banIconPostfix,
			defaultPickIconPath: this.defaultPickIconPath,
			defaultBanIconPath: this.defaultBanIconPath,
		};

		let image_urls = [];

		for (let i = 0; i < drafts.length; i++) {
			image_urls.push(await drawDraft.call(this, drafts[i], paths));
		}

		image_urls.forEach((url, index) => {
			downloadImage(url, `draft_${index + 1}.png`);
		});
	}

	exportSnapshotAsImage(id) {
		event.stopPropagation();
		let drafts = DataController.loadSavedDrafts();

		this.exportDraftsAsImages([drafts[id]]);
	}

	toggleTeamColorToggling() {
		this.config.toggleTeamColorsBetweenDrafts =
			!this.config.toggleTeamColorsBetweenDrafts;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);

		this.sendProcessSignal();
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

	toggleSuperCompactMode() {
		this.config.useSuperCompactMode = !this.config.useSuperCompactMode;
		this.colorSettingsButtons();

		if (this.config.useSuperCompactMode == true) {
			document.documentElement.dataset.mode = "super-compact";
		} else {
			if (this.config.useCompactMode == true) {
				document.documentElement.dataset.mode = "compact";
			} else document.documentElement.dataset.mode = "wide";
		}

		DataController.saveConfig(this.config);
	}

	toggleCompactMode() {
		this.config.useCompactMode = !this.config.useCompactMode;
		this.colorSettingsButtons();

		if (!this.config.useSuperCompactMode == true) {
			if (this.config.useCompactMode == true)
				document.documentElement.dataset.mode = "compact";
			else document.documentElement.dataset.mode = "wide";
		}

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

	toggleColorGradient() {
		this.config.useColorGradient = !this.config.useColorGradient;
		this.colorSettingsButtons();

		if (this.config.useColorGradient == true) {
			document.documentElement.dataset.gradient = "show";
		} else {
			document.documentElement.dataset.gradient = "hide";
		}

		DataController.saveConfig(this.config);
	}

	processKeyboardInput(event) {
		const key = event.key;
		if (this.middleOverlay.classList.contains("hidden"))
			this.processMainScreenInput(key);
		else this.processMiddleOverlayInput(key);
	}
	processMainScreenInput(key) {
		const shiftKeyPressed = event.shiftKey;

		if (
			key.toLowerCase() == this.binds.inputCustomDataBind.toLowerCase() &&
			shiftKeyPressed
		) {
			this.searchBar.blur();
			this.userDataInput.click();
		}

		if (!this.rightOverlay.classList.contains("hidden")) return;

		if (
			key.toLowerCase() ==
				this.binds.toggleSettingsTabBind.toLowerCase() &&
			shiftKeyPressed
		) {
			this.searchBar.blur();
			if (this.contentContainer.classList.contains("hidden"))
				this.contentContainer.classList.remove("hidden");
			if (!this.manualContainer.classList.contains("hidden"))
				this.manualContainer.classList.add("hidden");
			if (this.leftOverlay.classList.contains("hidden"))
				this.enterSettingsButton.click();
			else this.leaveSettingsButton.click();
		}
		if (!this.leftOverlay.classList.contains("hidden")) return;

		if (document.activeElement == this.draftCounter) {
			return;
		}

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
			if (key.toLowerCase() == this.binds.zenModeBind.toLowerCase()) {
				this.searchBar.blur();
				this.useZenModeToggle.click();
			}
			if (
				key.toLowerCase() == this.binds.fearlessModeBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.useFearlessModeToggle.click();
			}
			if (key.toLowerCase() == "arrowleft") {
				event.preventDefault();
				this.searchBar.blur();
				this.draftCounterLeftArrow.click();
			}
			if (key.toLowerCase() == "arrowright") {
				event.preventDefault();
				this.searchBar.blur();
				this.draftCounterRightArrow.click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleCompactModeBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.toggleCompactMode();
			}
			if (
				key.toLowerCase() == this.binds.loadCustomDataBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.dataSource = "user_data";
				this.dataSourceSwitch.value = "Custom data";
				this.sendProcessSignal();
			}
			if (
				key.toLowerCase() ==
				this.binds.loadDefaultDataBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.dataSource = "default_data";
				this.dataSourceSwitch.value = "Default data";
				this.sendProcessSignal();
			}
			if (
				key.toLowerCase() ==
				this.binds.importCustomDataFromFileBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.clickInput(this.fileInput);
			}
			if (key.toLowerCase() == this.binds.pickModeBind.toLowerCase()) {
				this.searchBar.blur();
				this.setPickBanMode("pick");
			}
			if (key.toLowerCase() == this.binds.banModeBind.toLowerCase()) {
				this.searchBar.blur();
				this.setPickBanMode("ban");
			}
			if (
				key.toLowerCase() ==
				this.binds.clearPicksOrBansBind.toLowerCase()
			) {
				this.searchBar.blur();
				let data;
				if (this.currentMode == "pick") data = this.picks;
				if (this.currentMode == "ban") data = this.bans;
				data.forEach((current) => {
					current.childNodes[1].dataset.champion = "";
				});
				this.sendProcessSignal();
			}
			if (
				key.toLowerCase() == this.binds.toggleManualBind.toLowerCase()
			) {
				this.searchBar.blur();
				if (!this.contentContainer.classList.contains("hidden"))
					this.contentContainer.classList.add("hidden");
				if (!this.leftOverlay.classList.contains("hidden"))
					this.leftOverlay.classList.add("hidden");
				if (this.manualContainer.classList.contains("hidden"))
					this.openManualButton.click();
				else this.closeManualButton.click();
			}
			if (key.toLowerCase() == this.binds.toggleThemeBind.toLowerCase()) {
				this.searchBar.blur();
				this.switchTheme();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleToplaneFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.roleIcons[0].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleJungleFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.roleIcons[1].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleMidlaneFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.roleIcons[2].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleADCFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.roleIcons[3].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleSupportFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.roleIcons[4].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleAllFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.logos[0].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleAllyFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.logos[1].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.toggleEnemyFilteringBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.logos[2].click();
			}
			if (
				key.toLowerCase() ==
				this.binds.browseDraftSnapshotsBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.toggleMiddleOverlay();
				return;
			}
			if (
				key.toLowerCase() ==
				this.binds.saveDraftSnapshotBind.toLowerCase()
			) {
				this.searchBar.blur();
				this.saveDraftSnapshot();
			}
		}
	}

	processMiddleOverlayInput(key) {
		const letterRegex = /^[A-Za-z]$/;
		const shiftKeyPressed = event.shiftKey;
		if (
			document.activeElement.classList.contains("draft-name") ||
			document.activeElement.classList.contains("complex-draft-name")
		) {
			return;
		}
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
			if (this.draftSnapshotsContainer.firstChild != null)
				this.draftSnapshotsContainer.firstChild.click();
		}
		if (key.toLowerCase() == "arrowleft") {
			event.preventDefault();
			this.middleOverlaySearchBar.blur();
			this.draftSnapshotsPaginationLeftArrow.click();
		}
		if (key.toLowerCase() == "arrowright") {
			event.preventDefault();
			this.middleOverlaySearchBar.blur();
			this.draftSnapshotsPaginationRightArrow.click();
		}
	}

	openSettingsMenu() {
		this.leftOverlay.classList.remove("hidden");
		event.stopPropagation();
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

	changeMaxDraftNumber() {
		const limit = parseInt(this.draftLimitInput.value.trim());
		DataController.saveData("maxDraftNumber", limit);

		if (!(limit == "0" || limit == "") && this.draftCounter.value > limit) {
			this.draftCounter.value = limit;
		}

		this.sendProcessSignal();
	}

	changeDraftNumber(amount) {
		let value = parseInt(this.draftCounter.value) + parseInt(amount);

		if (isNaN(value)) value = 1 + parseInt(amount);
		if (value < 1) value = 1;
		if (
			value > this.draftLimitInput.value &&
			!(
				this.draftLimitInput.value == "0" ||
				this.draftLimitInput.value == ""
			)
		) {
			value = this.draftLimitInput.value;
		}
		if (value > this.draftCounterMaxLimit)
			value = this.draftCounterMaxLimit;

		this.draftCounter.value = value;

		this.openDraft();
	}

	openDraft() {
		if (isNaN(this.draftCounter.value) || this.draftCounter.value == "")
			return;

		if (this.draftCounter.value > this.draftCounterMaxLimit)
			this.draftCounter.value = this.draftCounterMaxLimit;
		this.changeMaxDraftNumber();

		if (this.config.toggleTeamColorsBetweenDrafts == true) {
			this.changeTeamColors();
		} else if (this.draftCounter.value % 2 == 0) {
			const colors =
				this.allyEnemyColors[this.currentAllyEnemyColorsIndex];
			if (colors == "B/R") {
				this.oddDraftsColors = "R/B";
			} else if (colors == "R/B") {
				this.oddDraftsColors = "B/R";
			} else if (colors == "none") {
				this.oddDraftsColors = null;
			}
			localStorage.setItem("oddDraftsColors", this.oddDraftsColors);
		}

		localStorage.setItem("draftNumber", this.draftCounter.value);
		this.sendProcessSignal();
	}

	changeTeamColors() {
		if (this.oddDraftsColors == null || this.oddDraftsColors == "null") {
			return;
		}

		if (
			this.draftCounter.value % 2 == 0 &&
			this.oddDraftsColors ==
				this.allyEnemyColors[this.currentAllyEnemyColorsIndex]
		) {
			if (this.currentAllyEnemyColorsIndex == 1) {
				this.currentAllyEnemyColorsIndex = 2;
			} else if (this.currentAllyEnemyColorsIndex == 2) {
				this.currentAllyEnemyColorsIndex = 1;
			}
		} else if (
			this.draftCounter.value % 2 != 0 &&
			this.oddDraftsColors !=
				this.allyEnemyColors[this.currentAllyEnemyColorsIndex]
		) {
			if (this.currentAllyEnemyColorsIndex == 1) {
				this.currentAllyEnemyColorsIndex = 2;
			} else if (this.currentAllyEnemyColorsIndex == 2) {
				this.currentAllyEnemyColorsIndex = 1;
			}
		}

		const colors = this.allyEnemyColors[this.currentAllyEnemyColorsIndex];
		document.documentElement.dataset.allyEnemyColors = colors;
		this.toggleAllyEnemyColorsButton.value = "Colors: " + colors;

		localStorage.setItem("ally_enemy_colors", colors);
		localStorage.setItem("oddDraftsColors", this.oddDraftsColors);
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
		if (event != undefined) event.stopPropagation();
	}

	clearAllDraftSnapshots() {
		const ok = window.confirm("Do you want to clear all drafts?");
		if (ok) {
			localStorage.removeItem("savedDrafts");
			this.draftSnapshotsPaginationPageCounter.value = 1;

			this.hideMiddleOverlay();
		}
	}
	inputDraftSnapshotPaginationItemCount() {
		if (this.draftSnapshotsPaginationItemCount.value == -1)
			this.changeDraftPaginationPage();
		this.browseSavedDrafts();
	}
	saveDraftSnapshot() {
		const drafts = DataController.loadPicksAndBans();
		const picks = drafts[this.draftCounter.value - 1];
		const draft = {
			name: "",
			picks: picks.picks,
			bans: picks.bans,
		};
		const saved_drafts = DataController.loadSavedDrafts();

		saved_drafts.push(draft);
		DataController.saveData("savedDrafts", saved_drafts);

		if (!this.middleOverlay.classList.contains("hidden")) {
			this.hideMiddleOverlay();
			this.browseSavedDrafts();
		}
	}

	browseSavedDrafts() {
		this.draftSnapshotsContainer.innerHTML = "";

		let saved_drafts = DataController.loadSavedDrafts();
		let item_count = parseInt(this.draftSnapshotsPaginationItemCount.value);
		let page_number = parseInt(
			this.draftSnapshotsPaginationPageCounter.value,
		);
		if (item_count == -1) item_count = saved_drafts.length;
		if (isNaN(page_number)) {
			page_number = 1;
		}

		const query = this.middleOverlaySearchBar.value;
		if (query != "") {
			saved_drafts = Backend.filterDrafts(saved_drafts, query);
			if (saved_drafts.length < item_count * (page_number - 1)) {
				page_number = 1;
				this.draftSnapshotsPaginationPageCounter.value = 1;
			}
		}

		const lower_index =
			item_count == saved_drafts.length
				? 0
				: item_count * (page_number - 1);
		const upperIndex =
			item_count == saved_drafts.length
				? item_count
				: item_count * page_number;

		for (let i = lower_index; i < upperIndex; i++) {
			const draft = saved_drafts[i];
			if (draft == null) continue;

			let draftPreview;
			if (this.config.useSimpleSnapshotDisplay == true)
				draftPreview = this.createSimpleDraftSnapshotPreview(draft, i);
			else
				draftPreview = this.createComplexDraftSnapshotPreview(draft, i);
			draftPreview.addEventListener(
				"click",
				this.loadDraftSnapshot.bind(this, draft, i),
			);

			this.draftSnapshotsContainer.appendChild(draftPreview);
		}
	}

	createSimpleDraftSnapshotPreview(draft, id) {
		const container = document.createElement("div");
		container.classList.add("draft-snapshot-container");
		container.dataset.draft = JSON.stringify(draft);

		const draft_name = document.createElement("input");
		draft_name.type = "text";
		draft_name.classList.add("draft-name");
		draft_name.value = draft.name == null ? "" : draft.name;

		container.appendChild(draft_name);

		draft_name.addEventListener("click", () => {
			event.stopPropagation();
		});

		draft_name.addEventListener(
			"input",
			this.changeDraftName.bind(this, id),
		);

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

	createComplexDraftSnapshotPreview(draft, id) {
		const container = document.createElement("div");
		container.classList.add("complex-draft-snapshot-container");
		container.dataset.draft = JSON.stringify(draft);

		const draft_name = document.createElement("input");
		draft_name.type = "text";
		draft_name.classList.add("complex-draft-name");
		draft_name.value = draft.name == null ? "" : draft.name;

		container.appendChild(draft_name);

		draft_name.addEventListener("click", () => {
			event.stopPropagation();
		});

		draft_name.addEventListener(
			"input",
			this.changeDraftName.bind(this, id),
		);
		const icon_order = [
			draft.bans[0],
			draft.bans[1],
			draft.bans[2],
			draft.picks[0],
			draft.picks[1],
			draft.picks[2],
			draft.bans[3],
			draft.bans[4],
			draft.picks[3],
			draft.picks[4],
			draft.bans[5],
			draft.bans[6],
			draft.bans[7],
			draft.picks[5],
			draft.picks[6],
			draft.picks[7],
			draft.bans[8],
			draft.bans[9],
			draft.picks[8],
			draft.picks[9],
		];
		for (let i = 0; i < 20; i++) {
			this.createDraftSnapshotIcon(container, icon_order[i], i);
		}

		const remove_button = document.createElement("img");
		remove_button.src = "./img/trash.png";
		remove_button.classList += "draft-snapshot-remove-button";

		container.appendChild(remove_button);

		remove_button.addEventListener(
			"click",
			this.removeDraftSnapshot.bind(this, container, id),
		);

		const screenshot_button = document.createElement("img");
		screenshot_button.src = "./img/screenshot.webp";
		screenshot_button.classList += "take-snapshot-screenshot-icon";
		container.appendChild(screenshot_button);
		screenshot_button.addEventListener(
			"click",
			this.exportSnapshotAsImage.bind(this, id),
		);

		return container;
	}

	createDraftSnapshotIcon(container, champion, index) {
		const div = document.createElement("div");
		if (index < 10) div.classList = "complex-draft-preview-icon-container";
		else div.classList = "reverse-complex-draft-preview-icon-container";
		div.draggable = false;

		const champ_name = document.createElement("label");
		if (champion != "") {
			champ_name.innerHTML = prettifyChampionName(champion);
			div.appendChild(champ_name);
		}

		const ban_indexes = [0, 1, 2, 6, 7, 10, 11, 12, 16, 17];
		if (ban_indexes.includes(index))
			div.classList.add("snapshot-ban-container");
		else div.classList.add("snapshot-pick-container");

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

	changeDraftName(id) {
		let drafts = DataController.loadSavedDrafts();

		drafts[id].name = event.target.value;

		DataController.saveData("savedDrafts", drafts);
	}

	removeDraftSnapshot(container, id) {
		event.stopPropagation();
		container.remove();

		let savedDrafts = DataController.loadSavedDrafts();
		savedDrafts.splice(id, 1);

		DataController.saveData("savedDrafts", savedDrafts);

		this.hideMiddleOverlay();
		this.toggleMiddleOverlay();
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
		downloadElement.download = "snapshots.json";
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

		const old_data = localStorage.getItem("savedDrafts");
		if (this.config.appendToDraftSnapshots == true && old_data != null) {
			const old_array = JSON.parse(old_data);
			const new_array = JSON.parse(data);

			const joined_array = old_array.concat(new_array);

			DataController.saveData(
				"savedDrafts",
				JSON.stringify(joined_array),
			);
		} else DataController.saveData("savedDrafts", data);

		if (!this.snapshotsInputErrorBox.classList.contains("hidden"))
			this.snapshotsInputErrorBox.classList.add("hidden");

		this.hideMiddleOverlay();
		this.toggleMiddleOverlay();
	}

	changeDraftPaginationPage(amount) {
		this.draftSnapshotsContainer.scrollTop = 0;
		let saved_drafts = DataController.loadSavedDrafts();
		const query = this.middleOverlaySearchBar.value;
		if (query != "")
			saved_drafts = Backend.filterDrafts(saved_drafts, query);
		let value =
			parseInt(this.draftSnapshotsPaginationPageCounter.value) +
			parseInt(amount);

		if (isNaN(value)) value = 1 + parseInt(amount);
		if (value < 1) value = 1;
		if (
			value >
				1 +
					saved_drafts.length /
						this.draftSnapshotsPaginationItemCount.value &&
			value > 1
		) {
			value -= 1;
		}

		this.draftSnapshotsPaginationPageCounter.value = value;

		if (this.draftSnapshotsPaginationItemCount.value == -1)
			this.draftSnapshotsPaginationPageCounter.value = 1;
		this.browseSavedDrafts();
	}

	toggleAllyEnemyColors() {
		this.currentAllyEnemyColorsIndex++;

		if (this.currentAllyEnemyColorsIndex >= this.allyEnemyColors.length)
			this.currentAllyEnemyColorsIndex = 0;

		const colors = this.allyEnemyColors[this.currentAllyEnemyColorsIndex];
		document.documentElement.dataset.allyEnemyColors = colors;
		this.toggleAllyEnemyColorsButton.value = "Colors: " + colors;

		localStorage.setItem("ally_enemy_colors", colors);

		if (this.draftCounter.value % 2 != 0) {
			this.oddDraftsColors = colors;
			localStorage.setItem("oddDraftsColors", this.oddDraftsColors);
		}
	}

	loadSavedAllyEnemyColors() {
		let colors = localStorage.getItem("ally_enemy_colors");

		if (colors == null) colors = "none";

		for (let i = 0; i < this.allyEnemyColors.length; i++) {
			if (colors == this.allyEnemyColors[i]) return i;
		}

		console.log("Couldn't find the colors in loadSavedAllyEnemyColors()!");
		return 0;
	}

	toggleDraftSnapshotDisplay() {
		this.config.useSimpleSnapshotDisplay =
			!this.config.useSimpleSnapshotDisplay;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);
	}

	toggleAppendingToDraftSnapshots() {
		this.config.appendToDraftSnapshots =
			!this.config.appendToDraftSnapshots;
		this.colorSettingsButtons();

		DataController.saveConfig(this.config);
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

		if (
			this.selectionData.selectedChampion == event.target.dataset.champion
		) {
			return;
		}
		this.selectChampion(event);
	}

	loadImageToCache(src, champion) {
		let cacheImage = document.createElement("img");
		cacheImage.src =
			src.includes("/tiles_converted_to_webp_scaled/") ||
			src.includes("/small_converted_to_webp_scaled/")
				? this.imagePath +
					"/centered_minified_converted_to_webp_scaled/" +
					capitalize(champion) +
					"_0.webp"
				: this.imagePath +
					"/small_converted_to_webp_scaled/" +
					capitalize(champion) +
					".webp";
	}

	colorSettingsButtons() {
		const buttons = [
			this.useZenModeToggle,
			this.useFearlessModeToggle,
			this.enableAllChampionsInTheLastDraftToggle,
			this.makeNewDraftsBlankToggle,
			this.toggleTeamColorTogglingToggle,
			this.colorBordersToggle,
			this.dataSourceOnLoadToggle,
			this.clearSearchbarOnFocusToggle,
			this.draftSnapshotDisplayToggle,
			this.toggleAppendingToDraftSnapshotsButton,
			this.toggleSearchModeButton,
			this.useSuperCompactModeToggle,
			this.useCompactModeToggle,
			this.useSmallPickIconsToggle,
			this.useSmallChampionIconsToggle,
			this.useSmallBanIconsToggle,
			this.useColorGradientToggle,
		];
		const config_settings = [
			this.useZenMode,
			this.config.useFearlessMode,
			this.config.enableAllChampionsInTheLastDraft,
			this.config.makeNewDraftsBlank,
			this.config.toggleTeamColorsBetweenDrafts,
			this.config.colorBorders,
			this.config.loadUserDataOnProgramStart,
			this.config.clearSearchBarOnFocus,
			this.config.useSimpleSnapshotDisplay,
			this.config.appendToDraftSnapshots,
			this.config.useLegacySearch,
			this.config.useSuperCompactMode,
			this.config.useCompactMode,
			this.config.useSmallPickIcons,
			this.config.useSmallChampionIcons,
			this.config.useSmallBanIcons,
			this.config.useColorGradient,
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

	getDraftNumber() {
		const draftNumber = this.draftCounter.value - 1;
		return draftNumber;
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
		this.loadImageToCache(event.target.src, event.target.dataset.champion);
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

		if (this.championsContainer.hasChildNodes()) {
			if (exactlyMatchingChampion == null) {
				this.currentlyHoveredChampion =
					this.championsContainer.childNodes[0].dataset.champion;
				this.loadImageToCache(
					this.championsContainer.firstChild.src,
					this.championsContainer.firstChild.dataset.champion,
				);
			} else {
				this.currentlyHoveredChampion = exactlyMatchingChampion;
				this.loadImageToCache(
					this.championsContainer.firstChild.src,
					exactlyMatchingChampion,
				);
			}
		}

		// Render picked champions
		for (let i = 0; i < this.picks.length; i++) {
			let img = this.picks[i].childNodes[1];

			if (img.classList.contains("selected"))
				img.classList.remove("selected");

			if (
				renderingData.pickedChampions[i] == "" ||
				renderingData.pickedChampions[i] == "undefined"
			) {
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

			if (
				renderingData.bannedChampions[i] == "" ||
				renderingData.bannedChampions[i] == "undefined"
			) {
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

	closeOverlaysIfClickIsOutside(event) {
		const overlays = [
			this.middleOverlay,
			this.leftOverlay,
			this.rightOverlay,
		];

		overlays.forEach((current) => {
			if (
				!current.contains(event.target) &&
				!current.classList.contains("hidden")
			) {
				if (
					current == this.middleOverlay &&
					event.target.classList.contains(
						"take-snapshot-screenshot-icon",
					)
				) {
					return;
				}
				if (
					event.target.dataset != undefined &&
					event.target.dataset.is_download_element == "true"
				) {
					return;
				}
				current.classList.add("hidden");
			}
		});
	}
}
