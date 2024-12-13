# Manual

If you:
1. Notice any bugs
2. Dislike a feature 
3. Want to suggest a change 
4. Want to talk about anything else

Feel free to contact me by:

1. [Opening an issue](https://github.com/aCertainProgrammer/UnnamedDraftingTool/issues/new)
2. Adding me on discord: rycer__
3. Sending me an email: a_certain_programmer@proton.me

|Table of contents|
|-----------------|
|[Running the program](#running-the-program)|
|[Picking and banning champions](#picking-and-banning-champions)|
|[Keyboard shortcuts](#keyboard-shortcuts)|
|[Personalisation and configuration](#personalisation-and-configuration)|
|[Draft snapshots](#draft-snapshots)|
|[Custom data input](#custom-data-input)|

## Running the program 

### On the website
Head over to https://acertainprogrammer.github.io/UnnamedDraftingTool/ and you're good to go.

### Local installation
The program can be used locally, as it has no backend.

#### Cross Platform (still fully online, but more convenient):
Open the website, then search for an installation prompt. Note that your browser must support PWAs (Firefox requires add-ons for this, Chromium browsers generally support PWAs)

The prompt looks like this on Chrome: https://imgur.com/a/5HRUsJT

#### Linux/WSL/Git bash:
```
git clone https://github.com/aCertainProgrammer/UnnamedDraftingTool.git --depth 1
```

Then run it with something like `live-server` or `vite`

```
cd UnnamedDraftingTool
live-server
```

This will open the app in localhost.

There is no build step required.
To install the live server:
```
npm install -g live-server
```

To update the program, run 
```
git pull
```

Running the program locally makes the performance better since images (the main bottleneck) are on your disk and don't need to be downloaded on the fly.
You will also occasionally get access to new features before they are published on the website.

## Picking and banning champions
You can pick or ban a champion in four ways:
- Click a champion, then click a pick/ban slot
- Drag and drop the champion 
- Hover over a champion, then press a number on your keyboard (1 to 10, with 10 being represented by 0 to keep consistency left-to-right).

    This will either pick or ban the champion, depending on your current mode (pick or ban, toggled with `Shift` +`P` and `Shift` + `B` respectively).

    This also works on already picked/banned champions. There is, however, a limitation to it: if you want to use this method while hovering over the same pick/ban slot twice, you need to leave and reenter it with your mouse.

- Search for a champion until it is the first result, then use the number method from above

    This method has the advantage of not requiring a hover to work, which will certainly be appreciated by the Vim enthusiast.

Note that there is a special case: if you search for Vi, you will see Vi and possibly other champions, such as Anivia, Viego etc. This does not stop you from picking Vi, as the program additionally checks for an exact match with the search query.

## Keyboard shortcuts

### Picking and banning

- `Shift` + `P` to get into `pick` mode
- `Shift` + `B` to get into `ban` mode
- Any number from 1 to 10 (10 being represented by 0) to pick or ban a champion into that slot, depending on the current mode 
- `Backspace` to unpick or unban a champion
- `Delete` to clear all picks and bans
- `Shift` + `X` to clear picks or bans depending on the mode

### Search bar operations
- `Spacebar` or any letter (`a` to `z`, `A` to `Z`) to focus the search bar (no need to click it with the mouse)

    If the [Clear search bar on focus](#clear-search-bar-on-focus) setting is enabled, every time you refocus the searchbar it will be cleared

### Data management
- `Shift` + `V` to save a draft snapshot
- `Shift` + `C` to load custom data
- `Shift` + `D` to load default data 
- `Shift` + `I` to toggle the "Input custom data" input area - this disables keyboard input until the input area is hidden, with the sole exception of being able to `Shift` + `I` again to close the input area
- `Shift` + `F` to open the file data input dialog

### UI navigation
- `Shift` + `T` to toggle between themes
- `Shift` + `M` to toggle the manual tab
- `Shift` + `S` to toggle the settings tab
- `Shift` + `G` to toggle the draft snapshots tab
- `Shift` + `A` to toggle compact/wide mode
- `!, @, #, $, %` (meaning `Shift` + `1, 2, 3, 4, 5`) to toggle role filtering from top to support
- `Shift` + `Q, W, E` to toggle team filtering (All, Ally, Enemy respectively)

## Personalisation and configuration

Currently you are given the option to customize the following:

### Color champion borders
This colors the borders of the champions depending on which team they belong to:
- Green for ally champions
- Red for enemy champions
- Orange for champions in both teams
- Champions that are not in either ally or enemy teams are not given a colored border

### Load user data on page reload
This option decides which data source the program loads on startup (or when the page is reloaded).
If enabled, your custom data will be loaded, provided it is available.

### Clear search bar on focus
If enabled, clears the search bar whenever it is refocused. This enables the following:
1. Search a champion 
2. Pick it with a key 
3. Start typing the name of the next champion, no need to clear the previous one

### Use legacy search
- `Legacy search` is pure substring matching - if a word contains the exact string of the search query, it will be matched - for example, "ji" will match "JInx".
- `Modern search` uses both substring matching and checks for letter order ("ji" matches "seJuanI") to deliver an experience more similar to league client search

### Use simple draft display 
If disabled, uses a leaguepedia-like display for draft snapshots with more information

### Append to draft snapshots on import
If enabled, appends to draft snapshots when you import them instead of replacing them entirely  

### Use compact mode, Use small X icons
These settings change the looks of the draft area

## Draft snapshots
You can save your drafts for later and come back to them easily by using draft snapshots.

1. `Shift` + `V` to save your current draft state
2. `Shift` + `G` to open the snapshot menu
3. Start typing to filter the drafts - type champion names in pick order, so B1 > R1 > R2 etc. Don't use punctuation. An example search query would be `camille ahri varus` (you can omit the spaces)
4. Press `Enter` to load the first draft in the list, or click on the desired draft
5. `Shift` + `G` to close the snapshot overlay

You can also use the buttons for navigation.

You can export and import the snapshot data, making it possible to share drafts with your team. This also allows them to edit the draft quickly and send you back a snapshot.

The snapshot data must be in the form of valid JSON, as an array of draft objects containing picks and bans as arrays:
```
[
    {
        "picks": [
            "chogath",
            "annie",
            "aatrox",
            "elise",
            "cassiopeia",
            "",
            "",
            "",
            "",
            ""
        ],
        "bans": [
            "",
            "",
            "camille",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ]
    },
    {
        "picks": [
            "",
            "annie",
            "aatrox",
            "elise",
            "cassiopeia",
            "chogath",
            "",
            "",
            "",
            ""
        ],
        "bans": [
            "",
            "",
            "",
            "",
            "",
            "briar",
            "",
            "",
            "",
            ""
        ]
    },
]
```

## Custom data input

**Note: if the data doesn't load, it means you made a mistake in your input. Read the error message that is being displayed for you and fix the problem.
You can also validate your JSON here:
https://jsonchecker.com/
or on any other JSON validation website**

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

**Note**: You don't need to provide all 3 teams, if you omit a team the data will be pulled from the default data. 
This enables you to not have to bother with pasting the list of all champions for every config.

`all` is intended to simply be a list of all champions, but there might be other uses for it so I made it customizable. A full list of champions is provided below.

`ally` and `enemy` are simply the pools of two teams involved in the draft, use them however you like.

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

**Pay attention to how some names are changed (xinzhao, jarvan, chogath)**. 

This is to make writing configs more convenient. Consult the list of all champions for the accepted names.

### All champions
The current list of all champions:
```
"aatrox",
"ahri",
"akali",
"alistar",
"ambessa",
"amumu",
"anivia",
"annie",
"aphelios",
"ashe",
"aurelionsol",
"aurora",
"azir",
"bard",
"belveth",
"blitzcrank",
"brand",
"braum",
"briar",
"caitlyn",
"camille",
"cassiopeia",
"chogath",
"corki",
"darius",
"diana",
"draven",
"drmundo",
"ekko",
"elise",
"evelynn",
"ezreal",
"fiddlesticks",
"fiora",
"fizz",
"galio",
"gangplank",
"garen",
"gnar",
"gragas",
"graves",
"gwen",
"hecarim",
"hwei",
"illaoi",
"irelia",
"ivern",
"janna",
"jarvan",
"jax",
"jayce",
"jhin",
"jinx",
"kaisa",
"kalista",
"karma",
"karthus",
"kassadin",
"katarina",
"kayle",
"kayn",
"kennen",
"kindred",
"kled",
"kogmaw",
"ksante",
"leblanc",
"leesin",
"leona",
"lillia",
"lissandra",
"lucian",
"lulu",
"lux",
"malphite",
"malzahar",
"maokai",
"masteryi",
"milio",
"missfortune",
"mordekaiser",
"morgana",
"naafiri",
"nami",
"nasus",
"nautilus",
"neeko",
"nidalee",
"nilah",
"nocturne",
"nunu",
"olaf",
"orianna",
"ornn",
"pantheon",
"poppy",
"qiyana",
"quinn",
"rakan",
"rammus",
"reksai",
"rell",
"renata",
"renekton",
"rengar",
"riven",
"rumble",
"ryze",
"samira",
"sejuani",
"senna",
"seraphine",
"sett",
"shaco",
"shen",
"shyvana",
"singed",
"sion",
"sivir",
"skarner",
"smolder",
"sona",
"soraka",
"swain",
"sylas",
"syndra",
"tahmkench",
"taliyah",
"talon",
"taric",
"teemo",
"thresh",
"tristana",
"trundle",
"tryndamere",
"twistedfate",
"twitch",
"udyr",
"urgot",
"varus",
"vayne",
"veigar",
"velkoz",
"vex",
"vi",
"viego",
"viktor",
"vladimir",
"volibear",
"warwick",
"wukong",
"xayah",
"xerath",
"xinzhao",
"yasuo",
"yone",
"yorick",
"yuumi",
"zac",
"zed",
"zeri",
"ziggs",
"zilean",
"zoe",
"zyra"
```

---

UnnamedDraftingTool isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
UnnamedDraftingTool was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.
