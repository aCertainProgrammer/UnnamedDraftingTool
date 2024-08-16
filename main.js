const pick_data = {
  b1: {
    top: "maybe",
    jungle: "bad",
    mid: "good",
    adc: "maybe",
    support: "bad",
    exceptions: "lilia cait jinx aurora gragas",
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

const role_data = {
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
    "xin zhao",
    "vi",
    "viego",
    "poppy",
    "nocturne",
    "olaf",
    "wukong",
    "volibear",
    "lilia",
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
for (let j = 0; j < picks.length; j++) {
  for (let i = 0; i < roles.length; i++) {
    picks[j].innerText +=
      roles[i] + " " + pick_data[pickstrings[j]][roles[i]] + ", ";
  }
}
