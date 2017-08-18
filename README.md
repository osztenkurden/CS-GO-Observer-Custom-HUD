# CS:GO Observer Custom HUD

Shout-out to [RedSparr0w](https://github.com/RedSparr0w) for base code and idea! You are the best, man.

## To-do before running
- Node.js needs to be installed
- files/cfg/gamestate_integration_observerspectator.cfg needs to be placed in cfg folder in CS:GO location
- files/cfg/observer.cfg needs to be placed in cfg folder in CS:GO location
- CS:GO needs to run on Fullscreen Windowed (I know people may dislike it, but since it's only for observation, soo...)
- After running CS:GO and connecting to match (or replaying a demo, you can use this in  it too), type to console `exec observer.cfg`, it makes everything default disappear besides map and killfeed 

## PGL's style example
![Here](http://i.imgur.com/p9KNsHB.png)
So this is possible to do with everything below.

## How I made it run?
 - I installed Node.JS (nodejs.org)
 - I installed NW.js (nwjs.io) to C:\nw
 - I unpacked this whole script to C:\server
 - I run command in cmd "C:\nw\nw.exe C:\server"
 
I'm not good at this stuff, I've probably made milions of mistakes and anyone with experience could have done it better. But I was the first :) Also if I can, I will help with problems.

Somewhere there is "pgl example.zip" which contains server.js configured to look kinda-like PGL's HUD and files needed. Sorry there is such a mess :c


## PGL's example
I hope neither Valve or PGL will be upset about making [this example](https://mega.nz/#!HpQUFB7Q!MT1TecAVYj8xfdXt4zwyrNa2kSwxFVUdRWkrPIBbBDs), none of the images or graphics are mine btw.

## Main methods
It's worth noting all methods return JSONs or `false` boolean, so be prepared for that.

All of main action that will take place on your screen happens in `updatePage()` function, so when you want to represent some information you will need to write your code within its boundaries.
```javascript
function updatePage(data) {
	//Here happens magic
}
```
`data`
variable is being passed to it, and from that we can take actions, such as getting informations about players, map, round phases, etc. Below you will find detailed information about received information :>

### `data`

Methods to obtain different objects:



|Method|Description|Example|Returned objects|
|---|---|---|---|
|`getPlayers()`|List of players|`var players = data.getPlayers();`|(Array of Players)|
|`getCT()`|CT's informations|`var ct = data.getCT();`|(Team)|
|`getT()`|T's informations|```var t = data.getT();```|(Team)|
|`getObserved()`|Currently spectated player|```var player = data.getObserved();```|(Player) If you are not spectating anyone, returned Player will have Steam ID 1 and name GOTV|
|`getPlayer(int observer_slot)`|Player with given observation slot (o-9)|```var first = data.getPlayer(1);```|(Player)|
|`phase()`|Game's current phase|```var phase = data.phase();```|(Phase)|
|`round()`|Round's information|```var round = data.round();```|(Round)|
|`map()`|Map's information|```var map = data.map();```|(Map)|
|`previously()`|If anything changed since last update, it will contain the previous value|```var previously = data.previously();```|(Array) More information about `previously()` you will find on the bottom|


Example:
```javascript
function updatePage(data) {
	var player = data.getObserved(); //Getting spectated players object
    var team_ct = data.getCT(); //CT's informations
    var team_t = data.getT(); //T's informations
    
    var round = data.round();
    
    $("#team_ct_name").html(team_ct.name); //Setting ct's name
    $("#team_ct_score").html(team_ct.score); //Setting t's name
    
    var playerlist = data.getPlayers(); // Array of player objects
    for(var steamid in playerlist){
    	/* Actions here will be taken for each player */
        var cur_player = playerlist[steamid];
      	
        var cur_name = cur_player.name;
        var cur_stats = cur_player.getStats();
    }
    
    
}
```

## Objects
### Player

Properties


|Property|Description|Example|Values|
|---|---|---|---|
|name|Player's steam name|```var name = player.name;//OLOF```|(String)|
|clan|Player's current shown clan tag|```var clan = player.clan;//OLOF```|(String) or (NULL)|
|observer_slot|Player's spectating number|```var slot = player.observer_slot;//3```|(int) 0-9|
|team|Player's side|```var team = player.team;//CT```|(String) CT/T|
|position|Player's current position on map|```var pos = player.position;//-663.10, -198.32, 16.03```|(String) x, y, z|

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

### Phase
|Property|Description|Example|Values|
|---|---|---|---|
|phase|Team's score|```var phase = phase.phase;```|(String) freezetime/live/over/bomb/defuse|
|phase_ends_in|Team's name|```var time = phase.phase_ends_in;//"8.9"```|(String) Time (seconds) with decimal|


## Credits
As I mentioned before, [RedSparr0w](https://github.com/RedSparr0w) is the man I wouldn't make it without.
