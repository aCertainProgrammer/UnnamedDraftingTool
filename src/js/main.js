import { all_champions_data } from "./all_champions_json.js";
require("./../css/style.css");
require("./requires.js");
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

let currentFilter = "none";
const roleIcons = document.querySelectorAll(".role-icon");
function filterRole(event) {
  const role = event.target.id;
  if (currentFilter == role) {
    currentFilter = "none";
    renderAllIcons(current_data);
    return;
  }
  currentFilter = role;
  currentChampion = "none";
  renderRoleIcons(current_data[role]);
}

roleIcons.forEach((icon) => {
  icon.addEventListener("click", filterRole);
});

const allLogo = document.querySelector("#all");
const leoLogo = document.querySelector("#leo");
const karolinernaLogo = document.querySelector("#karolinerna");

let currentTeam = "all";

allLogo.addEventListener("click", () => {
  currentChampion = "none";
  current_data = all_champions_data;
  currentTeam = "all";
  if (currentFilter == "none") {
    renderAllIcons(current_data);
    return;
  }
  renderRoleIcons(current_data[currentFilter]);
});
leoLogo.addEventListener("click", () => {
  currentChampion = "none";
  current_data = leo_data;
  currentTeam = "leo";
  if (currentFilter == "none") {
    renderAllIcons(current_data);
    return;
  }
  renderRoleIcons(current_data[currentFilter]);
});

karolinernaLogo.addEventListener("click", () => {
  currentChampion = "none";
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
    if (oldChampContainer != null) {
      oldChampContainer.firstChild.style.opacity = "1.0";
    }
    const index = pickedChampions.indexOf(oldChamp);
    if (index > -1) {
      pickedChampions.splice(index, 1);
    }
    return;
  }
  if (event.target.id != "") {
    let oldChamp = event.target.alt;
    const oldChampContainer = document.getElementById(oldChamp);
    if (oldChampContainer != null) {
      oldChampContainer.firstChild.style.opacity = "1.0";
    }
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

const banb1 = document.getElementById("banb-one");
const banb2 = document.getElementById("banb-two");
const banb3 = document.getElementById("banb-three");
const banb4 = document.getElementById("banb-four");
const banb5 = document.getElementById("banb-five");
const banr1 = document.getElementById("banr-one");
const banr2 = document.getElementById("banr-two");
const banr3 = document.getElementById("banr-three");
const banr4 = document.getElementById("banr-four");
const banr5 = document.getElementById("banr-five");
const bans = [
  banb1,
  banb2,
  banb3,
  banb4,
  banb5,
  banr1,
  banr2,
  banr3,
  banr4,
  banr5,
];

bans.forEach((current) => {
  current.addEventListener("click", placeChampion);
});
