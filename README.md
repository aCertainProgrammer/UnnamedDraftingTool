# UnnamedDraftingTool
https://acertainprogrammer.github.io/UnnamedDraftingTool/index.html

# Manual
You can pick a champion in two ways:
- click a champion, then click a pick/ban slot
- drag and drop the champion 

There is keyboard support, the current shortcuts are:
- `Spacebar` to focus the search bar (no need to click it with the mouse) 
- `Backspace` to focus the search bar and remove a character
- any small letter such as `a` or `l` to search (it also inputs the pressed key)
- any number from 1 to 0 (0 represents 10) to pick or ban a champion in that slot, depending on the current mode 
- `P` to get into `pick` mode
- `B` to get into `ban` mode
- `Delete` to clear all picks and bans
- `C` to load custom data
- `D` to load default data 
- `I` to open the "Input custom data" input area (note that this disables keyboard input until the input area is hidden)
- `F` to open the file data input dialog

# Custom data specification

The custom data needs to be in the form of valid JSON, as an object containing 3 objects:
```
{
    "all",
    "ally",
    "enemy"
}
```

Each one of the objects contains 5 arrays, one for each role, as follows:
```
{
    "all": {
		"top": ["camille", "aatrox", "darius", "chogath"],
		"jungle": ["udyr", "xinzhao", "wukong", "jarvan"],
		"mid": ["syndra", "orianna", "sylas", "akali"],
		"adc": ["jhin", "jinx", "ashe", "kalista"],
		"support": ["leona", "nautilus", "sona", "taric"]
    },
    etc...
}
```

Together, they define the 3 teams you can select in the tool.

Note: You don't need to provide all 3 teams, if you omit a team the data will be pulled from the default data. This enables you to not have to bother with pasting the list of all champions for every config.

`all` is intended to simply be a list of all champions, but there might be other uses for it so I made it customizable. A full list of champions is provided below.

`ally` and `enemy` are simply the pools of two teams involved in the draft, use them however you like

An example of a full, valid config:
```
{
	"all": {
		"top": ["camille", "aatrox", "darius", "chogath"],
		"jungle": ["udyr", "xinzhao", "wukong", "jarvan"],
		"mid": ["syndra", "orianna", "sylas", "akali"],
		"adc": ["jhin", "jinx", "ashe", "kalista"],
		"support": ["leona", "nautilus", "sona", "taric"]
	},
	"ally": {
		"top": ["darius", "chogath"],
		"jungle": ["wukong", "jarvan"],
		"mid": ["sylas", "akali"],
		"adc": ["ashe", "kalista"],
		"support": ["sona", "taric"]
	},
	"enemy": {
		"top": ["camille", "aatrox"],
		"jungle": ["udyr", "xinzhao"],
		"mid": ["syndra", "orianna"],
		"adc": ["jhin", "jinx"],
		"support": ["leona", "nautilus"]
	}
}
```

Pay attention to how some names are changed (xinzhao, jarvan, chogath). This is to make writing configs more convenient. Consult the list of all champions for the accepted names.

# All champions
The current list of all champions:
```
"aatrox"
"ahri"
"akali"
"alistar"
"ambessa"
"amumu"
"anivia"
"annie"
"aphelios"
"ashe"
"aurelionsol"
"aurora"
"azir"
"bard"
"belveth"
"blitzcrank"
"brand"
"braum"
"briar"
"caitlyn"
"camille"
"cassiopeia"
"chogath"
"corki"
"darius"
"diana"
"draven"
"drmundo"
"ekko"
"elise"
"evelynn"
"ezreal"
"fiddlesticks"
"fiora"
"fizz"
"galio"
"gangplank"
"garen"
"gnar"
"gragas"
"graves"
"gwen"
"hecarim"
"hwei"
"illaoi"
"irelia"
"ivern"
"janna"
"jarvan"
"jax"
"jayce"
"jhin"
"jinx"
"kaisa"
"kalista"
"karma"
"karthus"
"kassadin"
"katarina"
"kayle"
"kayn"
"kennen"
"kindred"
"kled"
"kogmaw"
"ksante"
"leblanc"
"leesin"
"leona"
"lillia"
"lissandra"
"lucian"
"lulu"
"lux"
"malphite"
"malzahar"
"maokai"
"masteryi"
"milio"
"missfortune"
"mordekaiser"
"morgana"
"naafiri"
"nami"
"nasus"
"nautilus"
"neeko"
"nidalee"
"nilah"
"nocturne"
"nunu"
"olaf"
"orianna"
"ornn"
"pantheon"
"poppy"
"qiyana"
"quinn"
"rakan"
"rammus"
"reksai"
"rell"
"renata"
"renekton"
"rengar"
"riven"
"rumble"
"ryze"
"samira"
"sejuani"
"senna"
"seraphine"
"sett"
"shaco"
"shen"
"shyvana"
"singed"
"sion"
"sivir"
"skarner"
"smolder"
"sona"
"soraka"
"swain"
"sylas"
"syndra"
"tahmkench"
"taliyah"
"talon"
"taric"
"teemo"
"thresh"
"tristana"
"trundle"
"tryndamere"
"twistedfate"
"twitch"
"udyr"
"urgot"
"varus"
"vayne"
"veigar"
"velkoz"
"vex"
"vi"
"viego"
"viktor"
"vladimir"
"volibear"
"warwick"
"wukong"
"xayah"
"xerath"
"xinzhao"
"yasuo"
"yone"
"yorick"
"yuumi"
"zac"
"zed"
"zeri"
"ziggs"
"zilean"
"zoe"
"zyra"
```

---

UnnamedDraftingTool isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
UnnamedDraftingTool was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.
