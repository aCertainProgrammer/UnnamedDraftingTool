import { exec } from "node:child_process";
import { captureRejections } from "node:events";
import { createWriteStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { stdout } from "node:process";
import { finished, pipeline, Readable } from "node:stream";

type PatchData = {
	n: {
		champion: String;
	};
};

const patch_json: PatchData = await fetch(
	"https://ddragon.leagueoflegends.com/realms/euw.json",
).then((data) => data.json());
const patchString = patch_json.n.champion;

const tilesApiPath =
	"https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/";
const tilesFsPath = "../img/champion_icons/tiles/";
const tilesPostfix = "_0.jpg";

const centeredApiPath =
	"https://ddragon.leagueoflegends.com/cdn/img/champion/centered/";
const centeredFsPath = "../img/champion_icons/centered/";
const centeredPostfix = "_0.jpg";

const smallApiPath = `https://ddragon.leagueoflegends.com/cdn/${patchString}/img/champion/`;
const smallFsPath = "../img/champion_icons/small/";
const smallPostfix = ".png";

const champions = await fetch(
	`https://ddragon.leagueoflegends.com/cdn/${patchString}/data/en_US/champion.json`,
)
	.then((data) => data.json())
	.then((json) => json.data);

let startedIndex = 1;
let finishedIndex = 1;
async function processChampion(champion: String) {
	console.log(
		"Working on " +
			champion +
			" - " +
			startedIndex +
			"/" +
			Object.keys(champions).length,
	);

	startedIndex += 1;

	const centeredChampionResponse = await fetch(
		centeredApiPath + champion + centeredPostfix,
	);
	const tilesChampionResponse = await fetch(
		tilesApiPath + champion + tilesPostfix,
	);

	let mapped_champion = champion;
	if (champion == "FiddleSticks") {
		mapped_champion = "Fiddlesticks";
	}
	const smallChampionResponse = await fetch(
		smallApiPath + mapped_champion + smallPostfix,
	);

	if (
		centeredChampionResponse == null ||
		centeredChampionResponse.body == null ||
		smallChampionResponse == null ||
		smallChampionResponse.body == null ||
		tilesChampionResponse == null ||
		tilesChampionResponse.body == null
	) {
		console.error("things are null: " + champion);
		return;
	}

	await writeFile(
		centeredFsPath + champion + centeredPostfix,
		Readable.fromWeb(centeredChampionResponse.body),
		{
			flag: "w",
		},
	);
	await writeFile(
		tilesFsPath + champion + tilesPostfix,
		Readable.fromWeb(tilesChampionResponse.body),
		{
			flag: "w",
		},
	);

	await writeFile(
		smallFsPath + mapped_champion + smallPostfix,
		Readable.fromWeb(smallChampionResponse.body),
		{
			flag: "w",
		},
	);

	console.log(
		"Done with " +
			champion +
			" - " +
			finishedIndex +
			"/" +
			Object.keys(champions).length,
	);

	finishedIndex += 1;
}

const promises: Array<Promise<void>> = [];
for (let champion in champions) {
	if (champion == "Fiddlesticks") {
		champion = "FiddleSticks";
	}

	const promise = processChampion(champion);
	promises.push(promise);
}

await Promise.all(promises);

exec(
	"cd ../img/champion_icons/ && python3 ./imageProcessor.py",
	(err, stdout, stderr) => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(stdout);
	},
);

// this is just to make the file an ES6 Module
export {};
