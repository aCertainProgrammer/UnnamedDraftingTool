const pick_data = {
  b1: {
    top: "maybe",
    jungle: "bad",
    mid: "good",
    adc: "maybe",
    support: "bad",
    exceptions: "lillia cait jinx aurora gragas",
  },
  b2: {
    top: "maybe",
    jungle: "maybe",
    mid: "good",
    adc: "good",
    support: "good",
    exceptions: "",
  },
  b3: {
    top: "maybe",
    jungle: "maybe",
    mid: "good",
    adc: "good",
    support: "good",
    exceptions: "",
  },
  b4: {
    top: "good",
    jungle: "good",
    mid: "maybe",
    adc: "good",
    support: "good",
    exceptions: "",
  },
  b5: {
    top: "good",
    jungle: "good",
    mid: "maybe",
    adc: "good",
    support: "good",
    exceptions: "",
  },
  r1: {
    top: "maybe",
    jungle: "bad",
    mid: "good",
    adc: "maybe",
    support: "maybe",
    exceptions: "",
  },
  r2: {
    top: "maybe",
    jungle: "bad",
    mid: "good",
    adc: "maybe",
    support: "maybe",
    exceptions: "",
  },
  r3: {
    top: "good",
    jungle: "maybe",
    mid: "maybe",
    adc: "maybe",
    support: "good",
    exceptions: "",
  },
  r4: {
    top: "bad",
    jungle: "good",
    mid: "good",
    adc: "good",
    support: "good",
    exceptions: "",
  },
  r5: {
    top: "good",
    jungle: "good",
    mid: "maybe",
    adc: "good",
    support: "good",
    exceptions: "",
  },
};

const all_champions_data = {
  top: [
    "aatrox",
    "akali",
    "aurora",
    "camille",
    "chogath",
    "darius",
    "drmundo",
    "fiora",
    "gangplank",
    "garen",
    "gnar",
    "gragas",
    "gwen",
    "illaoi",
    "irelia",
    "jax",
    "jayce",
    "kayle",
    "kennen",
    "kled",
    "ksante",
    "malphite",
    "mordekaiser",
    "nasus",
    "olaf",
    "ornn",
    "pantheon",
    "quinn",
    "renekton",
    "riven",
    "rumble",
    "sett",
    "shen",
    "singed",
    "sion",
    "skarner",
    "tahmkench",
    "teemo",
    "trundle",
    "tryndamere",
    "twistedfate",
    "urgot",
    "vayne",
    "volibear",
    "yone",
    "yorick",
  ],
  jungle: [
    "amumu",
    "belveth",
    "brand",
    "briar",
    "diana",
    "ekko",
    "elise",
    "evelynn",
    "fiddlesticks",
    "gragas",
    "graves",
    "hecarim",
    "ivern",
    "jarvan",
    "karthus",
    "kayn",
    "kindred",
    "leesin",
    "lillia",
    "masteryi",
    "nidalee",
    "nocturne",
    "nunu",
    "olaf",
    "poppy",
    "rammus",
    "reksai",
    "rengar",
    "sejuani",
    "shaco",
    "shyvana",
    "skarner",
    "taliyah",
    "udyr",
    "wukong",
    "vi",
    "viego",
    "volibear",
    "warwick",
    "xinzhao",
    "zac",
  ],
  mid: [
    "ahri",
    "anivia",
    "annie",
    "aurelionsol",
    "aurora",
    "azir",
    "brand",
    "cassiopeia",
    "corki",
    "diana",
    "ekko",
    "fizz",
    "galio",
    "hwei",
    "irelia",
    "jayce",
    "kassadin",
    "katarina",
    "leblanc",
    "lissandra",
    "lucian",
    "lux",
    "malzahar",
    "naafiri",
    "orianna",
    "qiyana",
    "ryze",
    "sylas",
    "syndra",
    "taliyah",
    "talon",
    "tristana",
    "twistedfate",
    "veigar",
    "velkoz",
    "vex",
    "viktor",
    "vladimir",
    "xerath",
    "yasuo",
    "yone",
    "zed",
    "ziggs",
    "zoe",
  ],
  adc: [
    "aphelios",
    "ashe",
    "caitlyn",
    "draven",
    "ezreal",
    "jhin",
    "jinx",
    "kaisa",
    "kalista",
    "kogmaw",
    "lucian",
    "missfortune",
    "nilah",
    "samira",
    "sivir",
    "smolder",
    "tristana",
    "twitch",
    "varus",
    "vayne",
    "xayah",
    "zeri",
    "ziggs",
  ],
  support: [
    "alistar",
    "bard",
    "blitzcrank",
    "brand",
    "braum",
    "hwei",
    "janna",
    "karma",
    "leona",
    "lulu",
    "lux",
    "maokai",
    "milio",
    "morgana",
    "nami",
    "nautilus",
    "neeko",
    "poppy",
    "rakan",
    "rell",
    "renata",
    "senna",
    "seraphine",
    "sona",
    "soraka",
    "swain",
    "taric",
    "thresh",
    "velkoz",
    "xerath",
    "yuumi",
    "zilean",
    "zyra",
  ],
};

const leo_data = {
  top: [
    "gragas",
    "aatrox",
    "ksante",
    "rumble",
    "gnar",
    "olaf",
    "aurora",
    "gwen",
    "skarner",
    "yone",
    "jayce",
    "camille",
    "kennen",
    "ornn",
    "sion",
  ],
  jungle: [
    "xinzhao",
    "vi",
    "viego",
    "poppy",
    "nocturne",
    "olaf",
    "wukong",
    "volibear",
    "lillia",
    "taliyah",
    "ivern",
    "maokai",
  ],
  mid: [
    "orianna",
    "syndra",
    "viktor",
    "anivia",
    "lucian",
    "corki",
    "zilean",
    "ornn",
  ],
  adc: [
    "jinx",
    "xayah",
    "kaisa",
    "varus",
    "zeri",
    "twitch",
    "caitlyn",
    "ziggs",
  ],
  support: [
    "rell",
    "leona",
    "nautilus",
    "blitzcrank",
    "rakan",
    "maokai",
    "alistar",
    "braum",
    "janna",
    "milio",
    "lulu",
    "karma",
    "seraphine",
  ],
};

const karolinerna_data = {
  top: [
    "aurora",
    "camille",
    "gnar",
    "irelia",
    "jax",
    "kennen",
    "ksante",
    "renekton",
    "rumble",
    "sion",
    "volibear",
  ],
  jungle: [
    "brand",
    "gwen",
    "ivern",
    "talon",
    "viego",
    "maokai",
    "drmundo",
    "hecarim",
  ],
  mid: ["yasuo", "yone", "aurora", "syndra", "leblanc", "zed"],
  adc: [
    "zeri",
    "missfortune",
    "ezreal",
    "kaisa",
    "aphelios",
    "xayah",
    "jinx",
    "ashe",
  ],
  support: [
    "leona",
    "nautilus",
    "rell",
    "rakan",
    "pyke",
    "braum",
    "senna",
    "camille",
    "renata",
  ],
};

const b1 = document.getElementById("b-one");
const b2 = document.getElementById("b-two");
const b3 = document.getElementById("b-three");
const b4 = document.getElementById("b-four");
const b5 = document.getElementById("b-five");
const r1 = document.getElementById("r-one");
const r2 = document.getElementById("r-two");
const r3 = document.getElementById("r-three");
const r4 = document.getElementById("r-four");
const r5 = document.getElementById("r-five");
const picks = [b1, b2, b3, b4, b5, r1, r2, r3, r4, r5];
const pickstrings = [
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "r1",
  "r2",
  "r3",
  "r4",
  "r5",
];
const roles = ["top", "jungle", "mid", "adc", "support", "exceptions"];
const pickedChampions = [];

function prepareData(data) {
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

function capitalize(string) {
  let newString = "";
  newString += string[0].toUpperCase();
  for (let i = 1; i < string.length; i++) {
    newString += string[i];
  }
  return newString;
}

let currentChampion = "none";
function selectChampion(event) {
  console.log(event.target);
  if (event.target.style.opacity == "0.4") return;
  if (currentChampion !== "none") {
    let oldChampionContainer =
      document.getElementById(currentChampion).firstChild;
    oldChampionContainer.style.borderColor = "black";
  }
  currentChampion = event.target.alt;
  event.target.style.borderColor = "white";
}

const championsContainer = document.getElementById("champions-container");
function renderRoleIcons(data) {
  while (championsContainer.hasChildNodes()) {
    championsContainer.removeChild(championsContainer.firstChild);
  }
  data = prepareData(data);
  for (let i = 0; i < data.length; i++) {
    const newChampion = data[i];

    const newNode = document.createElement("div");
    newNode.classList += "champion-container";
    newNode.id = newChampion;
    const championIcon = document.createElement("img");
    championIcon.classList += "champion-icon";
    championIcon.src =
      "./img/champion_icons/tiles/" + capitalize(newChampion) + "_0.jpg";
    championIcon.alt = data[i];
    if (pickedChampions.includes(newChampion)) {
      championIcon.style.opacity = "0.4";
      console.log(newChampion);
    }
    newNode.appendChild(championIcon);
    championsContainer.appendChild(newNode);
    championIcon.addEventListener("click", selectChampion);
  }
}

function renderAllIcons(data) {
  let allChampions = [];
  for (let i = 0; i < roles.length - 1; i++) {
    for (let j = 0; j < data[roles[i]].length; j++) {
      allChampions.push(data[roles[i]][j]);
    }
  }
  renderRoleIcons(allChampions);
}
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", (event) => {
  console.log(event.data);
});

function colorPickValue(role) {
  for (let i = 0; i < pickstrings.length; i++) {
    if (pick_data[pickstrings[i]][role] == "good") {
      picks[i].style.border = "3px solid green";
    }
    if (pick_data[pickstrings[i]][role] == "maybe") {
      picks[i].style.border = "3px solid yellow";
    }
    if (pick_data[pickstrings[i]][role] == "bad") {
      picks[i].style.border = "3px solid red";
    }
  }
}

function resetColors() {
  for (let i = 0; i < pickstrings.length; i++) {
    picks[i].style.border = "3px solid black";
  }
}

let currentFilter = "none";
const roleIcons = document.querySelectorAll(".role-icon");
function filterRole(event) {
  const role = event.target.id;
  if (currentFilter == role) {
    currentFilter = "none";
    resetColors();
    renderAllIcons(current_data);
    return;
  }
  currentFilter = role;
  renderRoleIcons(current_data[role]);

  if (currentTeam == "leo") {
    colorPickValue(currentFilter);
  } else {
    resetColors();
  }
}

roleIcons.forEach((icon) => {
  icon.addEventListener("click", filterRole);
});

const allLogo = document.querySelector("#all");
const leoLogo = document.querySelector("#leo");
const karolinernaLogo = document.querySelector("#karolinerna");

let currentTeam = "all";

allLogo.addEventListener("click", () => {
  resetColors();
  current_data = all_champions_data;
  currentTeam = "all";
  if (currentFilter == "none") {
    renderAllIcons(current_data);
    return;
  }
  renderRoleIcons(current_data[currentFilter]);
});
leoLogo.addEventListener("click", () => {
  current_data = leo_data;
  currentTeam = "leo";
  colorPickValue(currentFilter);
  if (currentFilter == "none") {
    renderAllIcons(current_data);
    return;
  }
  renderRoleIcons(current_data[currentFilter]);
});

karolinernaLogo.addEventListener("click", () => {
  resetColors();
  current_data = karolinerna_data;
  if (currentFilter == "none") {
    renderAllIcons(current_data);
    return;
  }
  renderRoleIcons(current_data[currentFilter]);
  currentTeam = "karolinerna";
});
let current_data = all_champions_data;
renderAllIcons(current_data);

function placeChampion(event) {
  if (currentChampion == "none") {
    event.target.src = "./img/pick_icon.png";
    let oldChamp = event.target.alt;
    event.target.alt = "champion-pick-icon";
    event.target.id = "";
    const oldChampContainer = document.getElementById(oldChamp);
    console.log(oldChampContainer);
    oldChampContainer.firstChild.style.opacity = "1.0";
    return;
  }
  if (event.target.id != "") {
    let oldChamp = event.target.alt;
    const oldChampContainer = document.getElementById(oldChamp);
    oldChampContainer.firstChild.style.opacity = "1.0";
  }
  event.target.src =
    "./img/champion_icons/tiles/" + capitalize(currentChampion) + "_0.jpg";
  const oldChampionContainer =
    document.getElementById(currentChampion).firstChild;
  oldChampionContainer.style.borderColor = "black";
  oldChampionContainer.style.opacity = "0.4";
  event.target.id = currentChampion + "_picked";
  event.target.alt = currentChampion;
  pickedChampions.push(currentChampion);
  currentChampion = "none";
}

picks.forEach((current) => {
  current.addEventListener("click", placeChampion);
});
