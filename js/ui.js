import { Frontend } from "./frontend.js";
const frontend = new Frontend();
export class UI {
	constructor() {
		this.searchBar = document.querySelector(".search-bar");
		this.searchBar.addEventListener("input", (event) => {
			frontend.request.search = event.target.value;
			frontend.render();
		});
		this.picks = document.querySelectorAll(".champion-pick");
		this.bans = document.querySelectorAll(".champion-ban");
		this.picks.forEach((current) => {
			current.addEventListener("click", this.placeChampion);
			current.childNodes[1].dataset.champion = "";
		});
		this.bans.forEach((current) => {
			current.addEventListener("click", this.placeChampion);
			current.childNodes[1].dataset.champion = "";
		});

		this.championsContainer = document.querySelector(
			"#champions-container",
		);
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
		this.defaultDataSwitch = document.querySelector("#default_data");
		this.defaultDataSwitch.addEventListener("click", () => {
			frontend.request.source = "default_data";
			frontend.render();
		});
		this.userDataSwitch = document.querySelector("#user_data");
		this.userDataSwitch.addEventListener(
			"click",
			frontend.showUserDataForm,
		);
	}
	init() {
		frontend.render();
	}
}
