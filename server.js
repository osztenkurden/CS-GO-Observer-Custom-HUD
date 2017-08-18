process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var gui = require('nw.gui'),
	http = require('http'),
	debug = false;

// Get the current window
var icons = {
	hegrenade: "files/img/hg.png",
	molotov: "files/img/molotov.png",
	flashbang: "files/img/flashbang.php",
	decoy: "files/img/decoy.png",
	smokegrenade: "files/img/smoke.png",
	incgrenade: "files/img/ctmolotv.png",

    cz75a: "http://vignette3.wikia.nocookie.net/cswikia/images/c/cf/C75a_hud_csgo.png/revision/latest/scale-to-width-down/400",
    deagle: "http://vignette2.wikia.nocookie.net/cswikia/images/7/7d/Deagle_hud_go.png/revision/latest/scale-to-width-down/400",
    elite: "http://vignette2.wikia.nocookie.net/cswikia/images/8/82/Elite_hud_csgo.png/revision/latest/scale-to-width-down/400",
    fiveseven: "http://vignette2.wikia.nocookie.net/cswikia/images/9/9c/Fiveseven_hud_csgo.png/revision/latest/scale-to-width-down/400",
    glock: "http://vignette2.wikia.nocookie.net/cswikia/images/3/33/Glock18_hud_csgo.png/revision/latest/scale-to-width-down/400",
    p250: "http://vignette2.wikia.nocookie.net/cswikia/images/5/57/P250_hud.png/revision/latest/scale-to-width-down/400",
    hkp2000: "http://vignette1.wikia.nocookie.net/cswikia/images/6/67/Hkp2000_hud.png/revision/latest/scale-to-width-down/400",
    tec9: "http://vignette3.wikia.nocookie.net/cswikia/images/5/55/Tec9_hud_csgo.png/revision/latest/scale-to-width-down/400",
    usp_silencer: "http://vignette2.wikia.nocookie.net/cswikia/images/7/73/Usps_hud_csgo.png/revision/latest/scale-to-width-down/400",
    mag7: "http://vignette2.wikia.nocookie.net/cswikia/images/2/2e/Mag7_hud_csgo.png/revision/latest/scale-to-width-down/400",
    revolver: "http://vignette2.wikia.nocookie.net/cswikia/images/7/7d/Deagle_hud_go.png/revision/latest/scale-to-width-down/400",
    nova: "http://vignette4.wikia.nocookie.net/cswikia/images/c/c8/Nova_hud_csgo.png/revision/latest/scale-to-width-down/400",
    sawedoff: "http://vignette1.wikia.nocookie.net/cswikia/images/9/94/Sawedoff_hud_csgo.png/revision/latest/scale-to-width-down/400",
    xm1014: "http://vignette2.wikia.nocookie.net/cswikia/images/a/ad/Xm1014_hud_csgo.png/revision/latest/scale-to-width-down/400",
    mac10: "http://vignette2.wikia.nocookie.net/cswikia/images/f/f7/Mac10_hud_csgo.png/revision/latest/scale-to-width-down/400",
    mp7: "http://vignette4.wikia.nocookie.net/cswikia/images/8/8d/Mp7_hud_csgo.png/revision/latest/scale-to-width-down/400",
    mp9: "http://vignette2.wikia.nocookie.net/cswikia/images/1/14/Mp9_hud_csgo.png/revision/latest/scale-to-width-down/400",
    p90: "http://vignette3.wikia.nocookie.net/cswikia/images/b/bd/P90_hud_csgo.png/revision/latest/scale-to-width-down/400",
    bizon: "http://vignette1.wikia.nocookie.net/cswikia/images/d/d5/Bizon_hud_csgo.png/revision/latest/scale-to-width-down/400",
    ump45: "http://vignette3.wikia.nocookie.net/cswikia/images/c/c4/Ump45_hud_csgo.png/revision/latest/scale-to-width-down/400",
    ak47: "http://vignette1.wikia.nocookie.net/cswikia/images/7/76/Ak47_hud_csgo.png/revision/latest/scale-to-width-down/400",
    aug: "http://vignette2.wikia.nocookie.net/cswikia/images/6/6f/Aug_hud_csgo.png/revision/latest/scale-to-width-down/400",
    famas: "http://vignette2.wikia.nocookie.net/cswikia/images/8/8f/Famas_hud_csgo.png/revision/latest/scale-to-width-down/400",
    galilar: "http://vignette1.wikia.nocookie.net/cswikia/images/4/4a/Galilar_hud.png/revision/latest/scale-to-width-down/400",
    m4a1_silencer: "http://vignette3.wikia.nocookie.net/cswikia/images/4/4f/M4a1s_hud_csgo.png/revision/latest/scale-to-width-down/400",
    m4a1: "http://vignette2.wikia.nocookie.net/cswikia/images/d/d9/M4a4_hud.png/revision/latest/scale-to-width-down/400",
    sg556: "http://vignette1.wikia.nocookie.net/cswikia/images/9/9b/Sg556_hud_csgo.png/revision/latest/scale-to-width-down/400",
    awp: "http://vignette3.wikia.nocookie.net/cswikia/images/e/eb/Awp_hud_csgo.png/revision/latest/scale-to-width-down/400",
    g3sg1: "http://vignette4.wikia.nocookie.net/cswikia/images/4/4a/G3sg1_hud_csgo.png/revision/latest/scale-to-width-down/400",
    ssg08: "http://vignette4.wikia.nocookie.net/cswikia/images/3/3c/Ssg08_hud_csgo.png/revision/latest/scale-to-width-down/400",
    scar20: "http://vignette4.wikia.nocookie.net/cswikia/images/c/c9/Scar20_hud_csgo.png/revision/latest/scale-to-width-down/400",
    m249: "http://vignette2.wikia.nocookie.net/cswikia/images/e/ea/M249_hud_csgo.png/revision/latest/scale-to-width-down/400",
    negev: "http://vignette2.wikia.nocookie.net/cswikia/images/b/be/Negev_hud.png/revision/latest/scale-to-width-down/400",
knife: "http://vignette2.wikia.nocookie.net/cswikia/images/4/4b/Knife_ct_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
   knife_t: "http://vignette3.wikia.nocookie.net/cswikia/images/2/28/Knife_t_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
   knife_bayonet: "http://vignette2.wikia.nocookie.net/cswikia/images/2/28/Csgo_knife_Bayonet.png/revision/latest/scale-to-width-down/400",
    knife_butterfly: "http://vignette2.wikia.nocookie.net/cswikia/images/d/df/Knife_butterfly_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_falchion: "http://vignette4.wikia.nocookie.net/cswikia/images/7/7e/Falchion_Knife_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_flip: "http://vignette3.wikia.nocookie.net/cswikia/images/a/a4/Knife_flip_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_gut: "http://vignette2.wikia.nocookie.net/cswikia/images/f/ff/Knife_gut_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_tactical: "http://vignette2.wikia.nocookie.net/cswikia/images/5/53/Knife_hustman_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_karambit: "http://vignette4.wikia.nocookie.net/cswikia/images/5/57/Knife_karambit_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_m9_bayonet: "http://vignette4.wikia.nocookie.net/cswikia/images/d/d3/Csgo_knife_M9_Bayonet.png/revision/latest/scale-to-width-down/400",
    knife_shadow_dagger: "http://vignette4.wikia.nocookie.net/cswikia/images/f/f1/Knife_push_hud_outline_csgo.png/revision/latest/scale-to-width-down/400",
    knife_survival_bowie: "https://vignette4.wikia.nocookie.net/cswikia/images/8/8c/Survival_bowie_hud_outline.png/revision/latest/scale-to-width-down/400"
}
var win = gui.Window.get();
win.width = screen.width;
win.height = screen.height;
win.setAlwaysOnTop(true);


server = http.createServer(function (req, res) {

	if (req.method == 'POST') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			if (!!debug) {
				console.debug("POST payload: " + body);
			}
			update(JSON.parse(body));
			res.end('');
		});

	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end("Nothing to see here!");
	}

});
var slotted = [];
var meth = {
	getPlayers: function(){
		if(this.info.allplayers){
			return this.info.allplayers
		}
		return false;
	},
	getCT: function(){
		var all_players = [];
		var ret = {
			players: []
		};
		if(this.info.map && this.info.map.team_ct){
			ret = $.extend({}, ret, this.info.map.team_ct);
		} else {
			return false;
		}
		for(var psid in this.getPlayers()){
			var curpl = this.getPlayers()[psid];
			if(curpl.team.toLowerCase() == "ct"){
				all_players.push(curpl);
			}
		}
		ret.players = all_players;
		return ret;
	},
	getT: function(){
		var all_players = [];
		var ret = {
			players: []
		};
		if(this.info.map && this.info.map.team_t){
			ret = $.extend({}, ret, this.info.map.team_t);
		}
		for(var psid in this.getPlayers()){
			var curpl = this.getPlayers()[psid];
			if(curpl.team.toLowerCase() == "t"){
				all_players.push(curpl);
			}
		}
		ret.players = all_players;
		return ret;
	},
	getObserved: function(){
		if(this.info.player.steamid != 1){
			var csid = this.info.player.steamid;
			var cur_player = this.getPlayers()[csid];
			if(cur_player){
				cur_player.steamid = csid;
				return cur_player;
			}
			//if(this.getPlayers()[csid]) return this.getPlayers()[csid];
			return false;
		}
		return this.info.player;
	},
	getPlayer: function(slot){
		slot = parseInt(slot);
		if(slot >= 0 && slot <= 10) return slotted[slot];
		return false;
	},
	phase: function(){
		if(this.info.phase_countdowns) return this.info.phase_countdowns;
		return false;
	},
	round: function(){
		if(this.info.round) return this.info.round;
		return false;
	},
	map: function(){
		if(this.info.map) return this.info.map;
		return false;
	},
	previously: function(){
		if(this.info.previously) return this.info.previously;
		return false;
	}
}
var integ = {
	info: {},
	extra: {}
};

function update(json) {
	integ.info = json;
	integ = $.extend({}, meth, integ);
	if(integ.getPlayers() !== false){
		for(var k in integ.getPlayers()){
			slotted[integ.getPlayers()[k].observer_slot] = integ.getPlayers()[k];
			integ.getPlayers()[k].getState = function(){
				return this.state;
			};
			integ.getPlayers()[k].getWeapons = function(){
				return this.weapons;
			};
			integ.getPlayers()[k].getCurrentWeapon = function(){
				var temp_weapons = this.getWeapons();
				if(temp_weapons !== false){
					for(var k in temp_weapons){
						if(temp_weapons[k].state == "active"){
							return temp_weapons[k];
						}
					}
				}
			};
			integ.getPlayers()[k].getGrenades = function(){
				var grenades = [];
				var temp_weapons = this.getWeapons();
				if(temp_weapons !== false){
					for(var k in temp_weapons){
						if(temp_weapons[k].type == "Grenade"){
							grenades.push(temp_weapons[k]);
						}
					}
					return grenades;
				}
			};
			integ.getPlayers()[k].getStats = function(){
				var temp_stats = $.extend({}, this.match_stats, this.state);
				return temp_stats;
			};
		}
	}
	updatePage(integ);
}

function updatePage(data) {
	var observed = data.getObserved(); // Players information
	var stats = observed.getStats(); //Players stats and state
	var players = data.getPlayers(); //Array of other players with SteamID as key

	//OBSERVED PLAYER HUD

	//HERE

	//HUD FOR EVERY OTHER PLAYER
	if(players){
		for(var steamid in players){
	
		}
	}


}

server.listen(1337);
