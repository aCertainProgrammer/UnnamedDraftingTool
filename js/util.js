/** Capitalizes a string
 * @param {string}
 * @returns {string}
 */
export function capitalize(string) {
	let newString = "";
	newString += string[0].toUpperCase();
	for (let i = 1; i < string.length; i++) {
		newString += string[i];
	}
	return newString;
}

export function prettifyChampionName(name) {
	switch (name) {
		case "aurelionsol":
			name = "Aurelion Sol";
			break;
		case "belveth":
			name = "Bel'Veth";
			break;
		case "chogath":
			name = "Cho'Gath";
			break;
		case "drmundo":
			name = "Dr. Mundo";
			break;
		case "ksante":
			name = "K'Sante";
			break;
		case "kaisa":
			name = "Kai'sa";
			break;
		case "khazix":
			name = "Kha'Zix";
			break;
		case "kogmaw":
			name = "Kog'Maw";
			break;
		case "leesin":
			name = "Lee Sin";
			break;
		case "masteryi":
			name = "Master Yi";
			break;
		case "missfortune":
			name = "Miss Fortune";
			break;
		case "reksai":
			name = "Rek'Sai";
			break;
		case "tahmkench":
			name = "Tahm Kench";
			break;
		case "twistedfate":
			name = "Twisted Fate";
			break;
		case "velkoz":
			name = "Vel'Koz";
			break;
		case "xinzhao":
			name = "Xin Zhao";
			break;
		default:
			name = capitalize(name);
	}
	return name;
}

export function downloadImage(dataUrl, fileName) {
	const downloadElement = document.createElement("a");
	downloadElement.href = dataUrl;
	downloadElement.download = fileName;
	downloadElement.style.display = "none";
	downloadElement.dataset.is_download_element = true;
	document.body.appendChild(downloadElement);
	downloadElement.click();
	document.body.removeChild(downloadElement);
}
