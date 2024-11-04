import { Backend } from "./backend.js";
import { saveData, loadData, capitalize, readFile } from "./util.js";
export class UI {
	constructor(backend) {
		this.backend = backend;
		this.request = {
			source: "default_data",
			team: "all",
			role: "all",
			search: "",
		};
		this.renderingData = {
			visibleChampions: [],
			pickedChampions: [],
			bannedChampions: [],
		};
		this.selectedChampion = "";
		this.picks = document.querySelectorAll(".champion-pick");
		this.bans = document.querySelectorAll(".champion-ban");
		this.picks.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.childNodes[1].dataset.champion = "";
		});
		this.bans.forEach((current) => {
			current.addEventListener("click", this.placeChampion.bind(this));
			current.childNodes[1].dataset.champion = "";
		});

		this.championsContainer = document.querySelector(
			"#champions-container",
		);
		this.logos = document.querySelectorAll(".team-logo");
		this.logos.forEach((current) => {
			current.addEventListener(
				"click",
				this.switchTeam.bind(this, current.id),
			);
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
		this.searchBar = document.querySelector(".search-bar");
		this.searchBar.addEventListener(
			"input",
			this.searchChampion.bind(this),
		);
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

	selectChampion(event) {
		this.selectedChampion = event.target.dataset.champion;
		if (
			this.renderingData.pickedChampions.includes(
				this.selectedChampion,
			) ||
			this.renderingData.bannedChampions.includes(this.selectedChampion)
		) {
			this.selectedChampion = "";
		}
	}
	placeChampion(event) {
		if (this.selectedChampion == "") {
			event.target.src = "./img/pick_icon.png";
		}
		event.target.dataset.champion = this.selectedChampion;
		this.selectedChampion = "";
		this.render();
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
			'Read the <a href="https://github.com/aCertainProgrammer/UnnamedDraftingTool?tab=readme-ov-file#data-specification">input data specification</a>';
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
		file_input.addEventListener("input", this.loadFileData.bind(this));
		file_input_button.addEventListener(
			"click",
			this.clickInput.bind(this, file_input),
		);
	}
	switchTeam(team) {
		this.request.team = team;
		this.render();
	}
	searchChampion() {
		if (this.searchBar.value == " ") this.searchBar.value = "";
		this.request.search = this.searchBar.value.replace(/\s+/g, "");
		this.render();
	}
	loadDefaultData() {
		this.request.source = "default_data";
		this.render();
	}
	saveUserData(textarea) {
		saveData("user_data", textarea.value);
		this.request.source = "user_data";
		this.render();
	}
	async loadFileData(event) {
		const file = event.target.files[0];
		const data = await readFile(file);
		saveData("user_data", data);
		this.request.source = "user_data";
		this.render();
	}
	clickInput(input) {
		input.click();
	}
	processKeyboardInput(event) {
		const key = event.key;
		console.log(key);
		if (key == " ") this.searchBar.focus();
	}
}
