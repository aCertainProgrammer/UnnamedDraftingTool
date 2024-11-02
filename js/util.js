export function capitalize(string) {
	let newString = "";
	newString += string[0].toUpperCase();
	for (let i = 1; i < string.length; i++) {
		newString += string[i];
	}
	return newString;
}

export function saveData(destination, data) {
	if (typeof data !== "string") data = JSON.stringify(data);
	localStorage.setItem(destination, data);
}

export function loadData(source, team) {
	const json = localStorage.getItem(source);
	const all_data = JSON.parse(json);
	const data = all_data[team];
	return data;
}
