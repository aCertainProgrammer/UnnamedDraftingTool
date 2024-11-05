import { DataController } from "./datacontroller.js";
export class UserInterface {
	constructor(dataSource, dataController) {
		this.sendProcessSignal = null;
		this.dataSource = dataSource;
		this.team = "all";
		this.role = "all";
		this.selectedChampion = "";
		this.renderingData = {
			visibleChampions: [],
			pickedChampions: [],
			bannedChampions: [],
		};
		this.picks = document.querySelectorAll(".champion-pick");
		this.bans = document.querySelectorAll(".champion-ban");
		this.picks.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.addEventListener("drop", this.dropChampion.bind(this));
			current.addEventListener("dragover", (event) => {
				event.preventDefault();
			});
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.childNodes[1].dataset.champion = "";
			current.draggable = "false";
		});
		this.bans.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.addEventListener("drop", this.dropChampion.bind(this));
			current.addEventListener("dragover", (event) => {
				event.preventDefault();
			});
			current.childNodes[1].dataset.champion = "";
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.draggable = "false";
		});

		this.championsContainer = document.querySelector(
			"#champions-container",
		);
		this.logos = document.querySelectorAll(".team-logo");
		this.logos.forEach((current) => {
			current.addEventListener(
				"click",
				this.setTeam.bind(this, current.id),
			);
			current.addEventListener("dragstart", (event) => {
				event.preventDefault();
			});
			current.draggable = "false";
		});

		this.roleIcons = document.querySelectorAll(".role-icon");
		this.roleIcons.forEach((current) => {
			current.addEventListener(
				"click",
				this.setRole.bind(this, current.id),
			);
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
		this.userDataSwitch = document.querySelector("#user_data");
		this.userDataSwitch.addEventListener(
			"click",
			this.showUserDataForm.bind(this),
		);
		document.addEventListener(
			"keydown",
			this.processKeyboardInput.bind(this),
		);
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
		this.team = team;
		this.sendProcessSignal();
	}
	setRole(role) {
		if (this.role == role) {
			this.role = "all";
		} else if (this.role != role) {
			this.role = role;
		}
		this.sendProcessSignal();
	}

	selectChampion(event) {
		this.selectedChampion = event.target.dataset.champion;
		if (event.target.dataset.pickedOrBanned == "true") {
			this.selectedChampion = "";
		}
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
	saveUserData(textarea) {
		DataController.saveData("user_data", textarea.value);
		this.request.source = "user_data";
		this.render();
	}
	async takeFileInput(event) {
		this.dataSource = "user_data";
		const file = event.target.files[0];
		const ok = await DataController.loadFileData(file);
		this.sendProcessSignal();
	}
	clickInput(input) {
		input.click();
	}
	processKeyboardInput(event) {
		const key = event.key;
		if (key == " ") this.searchBar.focus();
	}
	createUserDataForm() {
		const container = document.querySelector("#data");
		const form_container = document.createElement("div");
		form_container.id = "user_data_form_container";
		const textarea = document.createElement("textarea");
		textarea.name = "user_data_input";
		textarea.cols = "80";
		textarea.rows = "10";
		const label = document.createElement("label");
		label.innerHTML =
			'Read the <a href="https://github.com/aCertainProgrammer/UnnamedDraftingTool?tab=readme-ov-file#custom-data-specification">input data specification</a>';
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
}
