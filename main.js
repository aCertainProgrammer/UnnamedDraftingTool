
const data = {
  "B1" : {
    "top" : "bad",
    "jungle" : "bad",
    "mid" : "good",
    "adc" : "good",
    "support" : "bad",
    "exceptions" : "lilia"
  }
};

const b1 = document.getElementById("b-one");
b1.innerText = "Can pick:"
const b1_data = data["B1"];
let i = 5;
if(b1_data["top"] == "good"){
  b1.innerText += " toplane"
}
if(b1_data["jungle"] == "good"){
  b1.innerText += " jungle"
}
if(b1_data["mid"] == "good"){
  b1.innerText += " midlane"
}
if(b1_data["adc"] == "good"){
  b1.innerText += " adc"
}
if(b1_data["support"] == "good"){
  b1.innerText += " support"
}
