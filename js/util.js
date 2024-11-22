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
