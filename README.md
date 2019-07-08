# CS:GO Observer Custom HUD

Shout-out to [RedSparr0w](https://github.com/RedSparr0w) for base code and idea! You are the best, man.

## How does it work?
Basically, CS:GO is streaming data to local app-server, that transformes data and then load it to local webpage.

## To-do before running
- Node.js needs to be installed
- public/files/cfg/gamestate_integration_observerspectator.cfg needs to be placed in cfg folder in CS:GO location
- public/files/cfg/observer.cfg needs to be placed in cfg folder in CS:GO location
- CS:GO needs to run on Fullscreen Windowed (I know people may dislike it, but since it's only for observation, soo...)
- After running CS:GO and connecting to match (or replaying a demo, you can use this in  it too), type to console `exec observer.cfg`, it makes everything default disappear besides map and killfeed 

## Configuration
```javascript
//config.json
{
    "GameStateIntegrationPort":1337, //This must be the same as in gamestate_integration_observerspectator.cfg,
    "ServerPort":2626, //Some free port on your PC
    "SteamApiKey":"ABCDEFGIJK12345678", //Steam API Key, without it avatars won't work
    "DisplayAvatars":true, // true for yes, false for no
    "AvatarDirectory":"./public/files/avatars/", // Local storage for avatars
    "GSIToken":"120987" //This must be the same as in gamestate_integration_observerspectator.cfg
}
```

## Examples
![Here](http://i.imgur.com/p9KNsHB.png)

[![Video example](https://img.youtube.com/vi/5FYlgwVcYmg/0.jpg)](https://youtu.be/5FYlgwVcYmg)
Video^
So this is possible to do with everything below.

## Setting up video

[![Video example](https://img.youtube.com/vi/bT8W-WvJe1w/0.jpg)](https://www.youtube.com/watch?v=bT8W-WvJe1w)

## How to make it run?
 - Install NodeJS (nodejs.org)
 - Download this repo somewhere
 - Start RUN file (.bat for Windows, .sh for Linux)
 - Run Overlay Exe from here: [OVERLAY DOWNLOAD](https://drive.google.com/file/d/12pAp3BdzFdb-wcW3DqcYJ6P-VMDzLBHu/view?usp=sharing)
 
There are propably milions of bugs and different things, so be prepared.

## Admin Panel
After starting the code go to address showing up in terminal/command prompt. You should see Admin Panel divided in three parts - Teams, Players, Create Match and HUDs. In here you can manage data used in HUDs during match ups.
#### Teams tab
You can here define teams, their name, short names (actually short names are not use anywhere for now), their country flag and logo. Files for teams' logos are being held in `public/teams/` and their filename should start from `logo-`.
#### Players tab
In Players tab you can define player's real name, displayed name, country flag (can also be set to "The same as team"), their team and, to identify players, SteamID64.
#### Create match tab
Here you can set type of match - is this a map of BO2, BO3 or BO5, score for teams and which team it should load to HUD. In case players are on the wrong side (left/right) there is `SWAP` button to quickly tell the HUD to swap teams' name, logo and flag.
Additionaly, if during the match you decide that there is a type in team's or player's information, you can change it (for example on mobile phone, if you allow Node through firewall and you are on the same local network) and then in this tab click the `Force Refresh HUD`, to make sure all the changes are applied.
### HUDS
This tab shows local HUDs. They are not validated whether or not they actually work, but if any of the files is missing, it will notify you in Warnings column.
You can enable/disable each HUD to make it accessible or not. There is also HUD URL information - if you click it, it will redirect you to local webpage, that's serving as a HUD. It is useful if streamer wants to stream HUD separately - for example it can be added in OBS as Browser Source, then you just need to set it to HUD's URL.
It might be useful for bigger streaming workspaces, like for setups with different PC dedicated to replays - one server app will manage every HUD on local network, because all HUDs are available all the time, if they are not disabled.

![Ex1](https://i.imgur.com/aGksYeo.png)
![Ex2](https://i.imgur.com/tYawDhe.png)
![Ex3](https://i.imgur.com/PqljDXD.png)
![Ex4](https://i.imgur.com/xSLxxrD.png)

## How to create your own HUD
Go to `public/huds` and copy and paste `default` folder and rename it to your heart's content - that's how your HUD will display in Admin Panel.
`template.pug` - template of your HUD in PUG, required.
`style.css` - css to your template, reccomended.
`index.js` - engine of your HUD. Look at the default one and at the template to get the idea how it works.

In `index.js` the most important part is `updatePage()` function. It is required for any HUD to work, because this function is called when data is coming from CS:GO. 

All of main action that will take place on your screen happens in `updatePage()` function, so when you want to represent some information you will need to write your code within its boundaries.
```javascript
function updatePage(data) {
	//Here happens magic
}
```
`data` argument is being passed to it, and from that we can take actions, such as getting informations about players, map, round phases, etc. Below you will find detailed information about received information :>

### `data`

Methods to obtain different objects:



|Method|Description|Example|Returned objects|
|---|---|---|---|
|`getTeamOne()`|Information about Team 1 defined in Admin Panel|`var teamOne = data.getTeamOne();`|JSON:`{team_name: "SK Gaming", short_name: "sk", country_code: "Brazil", logo: "logo-1527775279488.png", _id: "MT3xr6mb37o8Vbe3"}`|
|`getTeamTwo()`|Information about Team 2 defined in Admin Panel|`var players = data.getTeamTwo();`|As above|
|`loadTeam(id)` id: String |Information about team defined in Admin Panel with given id|`var players = data.loadTeam("MT3xr6mb37o8Vbe3");`|As above|
|`getMatchType()`|Information which matchup type is this|`var matchup = data.getMatchType();`|String: `bo2`, `bo3` lub `bo5`|
|`getMatch()`|Information about match set up in panel|`var match = data.getMatch();`|JSON: `{match: "bo5", team_1: {map_score:1, team:"auto"}, team_2: {map_score:1, team:"MT3xr6mb37o8Vbe3"}}`|
|`getPlayers()`|List of players|`var players = data.getPlayers();`|(Array of Players)|
|`getCT()`|CT's informations|`var ct = data.getCT();`|(Team)|
|`getT()`|T's informations|```var t = data.getT();```|(Team)|
|`getObserved()`|Currently spectated player|```var player = data.getObserved();```|(Player) If you are not spectating anyone, returned Player will have Steam ID 1 and name GOTV|
|`getPlayer(observer_slot)` observer_slot: Int|Player with given observation slot (o-9)|```var first = data.getPlayer(1);```|(Player)|
|`phase()`|Game's current phase|```var phase = data.phase();```|(Phase)|
|`round()`|Round's information|```var round = data.round();```|(Round)|
|`map()`|Map's information|```var map = data.map();```|(Map)|
|`previously()`|If anything changed since last update, it will contain the previous value|```var previously = data.previously();```|(Array) More information about `previously()` you will find on the bottom|


Example:
```javascript
function updatePage(data) {
	var player = data.getObserved(); // Getting spectated players object
    var teamLeft = data.getTeamOne(); // Team 1's informations
    var teamRight = data.getTeamTwo(); // Team 2's informations
    
    var round = data.round();
    
    // Setting teams' names
    $("#team_one_name").html(teamLeft.team_name); 
    $("#team_two_score").html(teamRight.team_name);
    // Those might be null if none specified, then use getT() and getCT() 
    
    //Setting teams' flag
    if(teamLeft.country_code){
        $("#team_1 #team_flag").css("background-image", "url('/files/img/flags/"+teamLeft.country_code + ".png')");
    }
    if(teamRight.country_code){
        $("#team_2 #team_flag").css("background-image", "url('/files/img/flags/"+teamRight.country_code + ".png')";
    }
    
    var playerlist = data.getPlayers(); // Array of player objects
    if(playerlist){
        for(var steamid in playerlist){
        	/* Actions here will be taken for each player */
            let player = playerlist[steamid];
            
            let displayed_name = player.name;
            let real_name = player.real_name; // If real name isn't set, it will show player.name
        }
    }
    
    
}
```

## Objects
### Player

Properties


|Property|Description|Example|Values|
|---|---|---|---|
|name|Player's steam name|```var name = player.name;//OLOF```|(String)|
|real_name|Player's real name, if set up in panel|```var real_name = player.name;//Olof Kajbjer Gustafsson```|(String)|
|clan|Player's current shown clan tag|```var clan = player.clan;//fnatic```|(String) or (NULL)|
|observer_slot|Player's spectating number|```var slot = player.observer_slot;//3```|(int) 0-9|
|team|Player's side|```var team = player.team;//CT```|(String) CT/T|
|position|Player's current position on map|```var pos = player.position;//-663.10, -198.32, 16.03```|(String) x, y, z|
|steamid|Player's SteamID64|```var sid = player.steamid;//76561197988627193```|(String)|
|teamData|Player's personal team information, if set up in panel|```var team = player.teamData;```|(JSON):```{team_name: "SK Gaming", short_name: "sk", country_code: "Brazil", logo: "logo-1527775279488.png", _id: "MT3xr6mb37o8Vbe3"}```|

Example:
```javascript
function updatePage(data) {
	var player = data.getObserved(); //Getting spectated players object
    var name =  player.name; //Getting name of that player
    var slot = player.observer_slot; // Getting slot of that player
    
     if(player.team == "CT"){...}
}
```
Methods

|Method|Description|Example|Values|
|---|---|---|---|
|`getWeapons()`|List of player's weapons|```var weapons = player.getWeapons();```|(Array of Weapons)|
|`getCurrentWeapon()`|Player's active weapon|```var holding = player.getCurrentWeapon();```|(Weapon)|
|`getGrenades()`|Player's grenades|```var grenades = player.getGrenades();```|(Array of Weapons)|
|`getStats()`|Player's current statistics (list below)|```var stats = player.getStats();```|(Array)|

Statistics:



|Stat's name|Description|Example|Values|
|---|---|---|---|
|health|Player's health|```var health = player.getStats().health;```|(int) 0-100|
|armor|Player's kevlar|```var armor = player.getStats().armor;```|(int) 0-100|
|helmet|Player's helmet|```var helmet = player.getStats().helmet;```|(bool) True/False|
|defusekit|Player's defuse kit|```var def = player.getStats().defusekit;```|(bool) True/False or (NULL)|
|smoked|Level of being smoked|```var flashed = player.getStats().smoked;```|(int) 0-255 or (NULL)|
|flashed|Level of being flashed|```var flashed = player.getStats().flashed;```|(int) 0-255|
|burning|Level of being burned|```var burning = player.getStats().burning;```|(int) 0-255|
|money|Player's money|```var money = player.getStats().money;```|(int) From 0 and up|
|round_kills|Player's kills during round|```var round_kills = player.getStats().round_kills;```|(int) Usually 0-5|
|round_killhs|Player's kills with headshot during round|```var round_killhs = player.getStats().round_killhs;```|(int) Usually 0-5|
|equip_value|Value of player's equipment|```var equip_value = player.getStats().equip_value;```|(int) From 0 and up|
|kills|Player's kills|```var kills = player.getStats().kills;```|(int)|
|assists|Player's assists|```var assists = player.getStats().assists;```|(int)|
|deaths|Player's deaths|```var deaths = player.getStats().deaths;```|(int)|
|mvps|Player's MVPs|```var mvps = player.getStats().mvps;```|(int)|
|score|Player's point score|```var points = player.getStats().score;```|(int)|

Example:

```javascript
function updatePage(data) {
	var player = data.getObserved(); //Getting spectated players object
    var stats =  player.getStats();
    var weapons = player.getWeapons();
    
    $("#health_box").html(stats.health);
    
    for(var k in weapons){...}
    
    if(stats.defusekit !== true){
    	$("#defusekit").css("display", "hidden");
    }
}
```

### Weapon
|Property|Description|Example|Values|
|---|---|---|---|
|name|Weapon's asset name|```var name = weapon.name;//weapon_awp```|(String) weapon\_...|
|paintkit|Weapon's skin's asset name|```var skin = weapon.paintkit;//cu_medusa_awp```|(String)|
|type|Weapon's type|```var type = weapon.type;```|(String) Knife/Rifle/SniperRifle/Grenade|
|state|State of being equiped|```var state = weapon.state;```|(String) holstered/active|
|ammo_clip|Ammo in clip|```var clip = weapon.ammo_clip;```|(int)|
|ammo_clip_max|Max ammount of ammo in clip|```var maxclip = weapon.ammo_clip_max;```|(int)|
|ammo_reserve|Ammo outside of clip|```var res = weapon.ammo_reserve;```|(int)|

### Map
|Property|Description|Example|Values|
|---|---|---|---|
|name|Map's name|```var name = map.name;//de_dust2```|(String)|
|mode|Game's current mode|```var mode = map.mode;//competitive```|(String) competitive/deathmatch/etc...|
|phase|Game's current phase|```var phase = map.phase;```|(String) warmup/live/intermission/gameover|
|round|How many rounds has been played, not which is it|```var round = map.round;```|(int) 0-15|
|num_matches_to_win_series|How many matches needed to win series|```var need = map.num_matches_to_win_series;```|(int)|
|current_spectators|Number of current live spectators|```var spec = map.current_spectators;```|(int)|
|souvenirs_total|Number of dropped souvenirs (majors)|```var souv = map.souvenirs_total;```|(int)|

### Round
|Property|Description|Example|Values|
|---|---|---|---|
|phase|Round's phase|```var phase = round.phase;```|(String) freezetime/live/over|
|win_team|Side who's win|```var win_team = round.win_team;```|(String) CT/T|
|bomb|State of bomb|```var bomb = round.bomb;```|(String) exploded/defused/planted or (NULL)|

### Team
|Property|Description|Example|Values|
|---|---|---|---|
|score|Team's score|```var score_ct = team.score;```|(int) 0-16 without OTs|
|name|Team's name|```var name_t = team.name;```|(String)|
|flag|Team's flag|```var flag_ct = team.flag;```|(String) ISO 3166 Country Code|
|timeouts_remaining|Team's remaining timeouts|```var timeouts_t = team.timeouts_remaining;```|(int)|
|matches_won_this_series|Matches won this series by this team|```var won_ct = team.matches_won_this_series;```|(int)|
|equip_value|Equipment value of team|```var ct_value = team.equip_value;```|(int)|
|team_money|Sum of  team's players' money|```var ct_money = team.team_money;```|(int)|

### Phase
|Property|Description|Example|Values|
|---|---|---|---|
|phase|Team's score|```var phase = phase.phase;```|(String) freezetime/live/over/bomb/defuse/paused/timeout_t/timeout_ct|
|phase_ends_in|Team's name|```var time = phase.phase_ends_in;//"8.9"```|(String) Time (seconds) with decimal|

# API Requests to databases
### Player object example
```json
{
    "sid":"76561198029090368",
    "real_name":"Hubert Walczak",
    "displayed_name":"osztenkurden",
    "country_code":"Poland",
    "team":"MT3xr6mb37o8Vbe3"
}
```
### Team object example
```json
{
    "team_name":"SK Gaming",
    "short_name":"sk",
    "country_code":"Brazil",
    "logo":"logo-1527775279488.png"
}
```
### HUD object example
```json
{
    "name":"default",
    "enabled":false
}
```

|URL|Method|Request body|Response|
|---|--|--|---|
|`/api/players`|GET||`{players:[Array of Player objects with unique _id property]}` or `Status 500`|
|`/api/players`|POST|`Player object`| `{id:String}`, specifying new unique _id or Status `500`|
|`/api/players`|PATCH|`Player object with _id property`|Status `200` or `500`|
|`/api/players`|DELETE|`{userId: String}`|Status `200` or `500`|
|`/api/teams`|GET||`{players: [Array of Player objects with unique _id property]}` or `Status 500`|
|`/api/teams`|POST|`FormData` object with fields: team_name, short_name, country_code, logo| `{id:String}`, specifying new unique _id or Status `500`|
|`/api/teams`|PATCH|`FormData` object with fields: team_name, short_name, country_code, logo|Status `200` or `500`|
|`/api/teams`|DELETE|`{teamId: String}`|Status `200` or `500`|
|`/api/teams_logo`|DELETE|`{teamId: String}`|Status `200` or `500`|
|`/api/huds`|GET||`{players: [Array of HUD objects with unique _id property]}` or `Status 500`|
|`/api/huds`|POST|`{id: String, enabled: Boolean}`| Status `200` or `500`|
## Credits
As I mentioned before, [RedSparr0w](https://github.com/RedSparr0w) is the man I wouldn't make it without.


## Support/Donate
[![Paypal donate](https://www.paypalobjects.com/en_US/PL/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BM67UTG39894S&source=url)
