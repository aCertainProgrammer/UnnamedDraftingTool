function capitalize(string) {
  let newString = "";
  newString += string[0].toUpperCase();
  for (let i = 1; i < string.length; i++) {
    newString += string[i];
  }
  return newString;
}

export function prepareData(data) {
  data.sort();
  const newData = [];
  newData.push(data[0]);
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1] != data[i]) {
      newData.push(data[i]);
    }
  }
  return newData;
}
