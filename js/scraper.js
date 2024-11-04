export class Scraper {
	constructor(picksSelector, banSelector) {
		this.picks = document.querySelectorAll(picksSelector);
		this.bans = document.querySelectorAll(banSelector);
	}
	getPicksAndBans() {
		let data = {
			picks: [],
			bans: [],
		};
		for (let i = 0; i < 10; i++) {
			let img = this.picks[i].childNodes[1];
			this.data.picks[i] = img.dataset.champion;
		}
		for (let i = 0; i < 10; i++) {
			let img = this.bans[i].childNodes[1];
			this.data.bans[i] = img.dataset.champion;
		}
		return data;
	}
}
