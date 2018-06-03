
var io = io('http://' + ip + ':' + port + '/');
var avatars = {};
function load(cb){
    loadTeams(cb);
}

function loadTeams(cb){
    $.get("/api/teams", function(data){
        let teamsArray = data.teams;
        let teams = {};
        
        teamsArray.forEach(function(team) {
            teams[team._id] = team;
        }, this);
        loadPlayers(cb, teams);
    });
}

function loadPlayers(cb, teams){
    $.get("/api/players", function(data){
        let playersArray = data.players;
        let players = {};

        playersArray.forEach(function(player) {
            players[player.sid] = player;
        }, this);
        cb(players, teams);
    });
}
function loadAvatar(steamid, callback) {
    if(!avatars[steamid]){
        $.get("/av/" + steamid, function () {
            avatars[steamid] = true;
            if(callback) callback();
        });
    } else if(callback){
        callback();
    }
}

$(document).ready(function () {
    var slotted = [];
    var meth = {
        getTeamOne: function(){
            if(!this.info.teams) return false;
            return this.loadTeam(this.info.teams.team_1.team);
        },
        getTeamTwo: function(){
            if(!this.info.teams) return false;
            return this.loadTeam(this.info.teams.team_2.team);
        },
        loadTeam: function(id){
            return this.info.teamList[id] || false;
        },
        getMatchType : function(){
            return (this.info.teams && this.info.teams.match ? this.info.teams.match : false);
        },
        getMatch : function(){
            return this.info.teams || false;
        },
        getPlayers: function () {
            if (!this.info.allplayers) return false;

            let res = [];

            for(var steamid in this.info.allplayers){
                let player = this.info.allplayers[steamid];
                if(player.observer_slot == 0) player.observer_slot = 10;
                player.steamid = steamid;
                res.push(player);
            }
            res.sort(function(a,b){return a.observer_slot - b.observer_slot})
            return res;
        },
        getCT: function () {
            let all_players = [];

            let team_money = 0;
            let equip_value = 0;

            let ret = {
                players: [],
                side:"ct"
            };

            if(!this.info.map || !this.info.map.team_ct) return false;
            
            ret = $.extend({}, ret, this.info.map.team_ct);

            if (!ret.name) 
                ret.name = "Counter-terrorists";
            for (let sid in this.getPlayers()) {
                let player = this.getPlayers()[sid];
                if (player.team.toLowerCase() == "ct") {
                    if(player.state && (player.state.equip_value || player.state.money)){
                        team_money += player.state.money || 0;
                        equip_value += player.state.equip_value || 0;
                    }
                    all_players.push(player);
                }
            }
            ret.team_money = team_money;
            ret.equip_value = equip_value;
            ret.players = all_players;
            return ret;
        },
        getT: function () {
            let all_players = [];
            let team_money = 0;
            let equip_value = 0;
            let ret = {
                players: [],
                side:"t"
            };

            if (!this.info.map || !this.info.map.team_t) return false;

            ret = $.extend({}, ret, this.info.map.team_t);

            if (!ret.name) 
                ret.name = "Terrorists";
            for (let sid in this.getPlayers()) {
                let player = this.getPlayers()[sid];
                if (player.team.toLowerCase() == "t") {
                    if (player.state && (player.state.equip_value || player.state.money)) {
                        team_money += player.state.money || 0;
                        equip_value += player.state.equip_value || 0;
                    }
                    all_players.push(player);
                }
            }
            ret.team_money = team_money;
            ret.equip_value = equip_value;
            ret.players = all_players;
            return ret;
        },
        getObserved: function () {
            if(!this.info.player || this.info.player.steamid == 1) return false;

            let steamid = this.info.player.steamid;
            let players = this.getPlayers();

            for(var k in players){
                if(players[k].steamid == steamid) return players[k];
            }
            
            return false;

        },
        getPlayer: function (slot) {
            slot = parseInt(slot);
            if(!(slot >= 0 && slot <= 10)) return false;
            return slotted[slot];
        },
        phase: function () {
            if (!this.info.phase_countdowns) return false;
            return this.info.phase_countdowns;
            
        },
        round: function () {
            if (!this.info.round) return false;
            return this.info.round;
        },
        map: function () {
            if (!this.info.map)  return false;
            return this.info.map;
            
        },
        previously: function () {
            if (!this.info.previously) return false;
            return this.info.previously;
            
        }
    };
    var integ = {
        info: {},
        extra: {}
    };
    let match = null;

    function create(data, players_data, teams_data){
            data.teamList = teams_data;
            integ.info = data;
            integ = $.extend({}, meth, integ);
            if (integ.getPlayers() !== false) {
                for (var k in integ.getPlayers()) {
                    let slot = integ.getPlayers()[k].observer_slot;
                    let steamid = integ.getPlayers()[k].steamid;

                    slotted[slot] = integ.getPlayers()[k];

                    let name = slotted[slot].name;

                    if(!slotted[slot].steamid){
                        slotted[slot].steamid = k;
                    }

                    slotted[slot].name = players_data[steamid]
                        ? players_data[steamid].displayed_name || name
                        : name;
                    slotted[slot].real_name = players_data[steamid]
                        ? players_data[steamid].real_name || name
                        : name;
                    if (players_data[steamid] && players_data[steamid].country_code) {
                        slotted[slot].country_code = players_data[steamid].country_code;
                    }
                    if (players_data[steamid] && players_data[steamid].team) {
                        slotted[slot].teamData = integ.loadTeam(players_data[steamid].team);
                    }
                    integ.getPlayers()[k].getState = function () {
                        return this.state;
                    };
                    integ.getPlayers()[k].getWeapons = function () {
                        return this.weapons;
                    };
                    integ.getPlayers()[k].getCurrentWeapon = function () {
                        var temp_weapons = this.getWeapons();
                        if (temp_weapons !== false) {
                            for (var k in temp_weapons) {
                                if (temp_weapons[k].state == "active") {
                                    return temp_weapons[k];
                                }
                            }
                        }
                    };
                    integ.getPlayers()[k].getGrenades = function () {
                        var grenades = [];
                        var temp_weapons = this.getWeapons();
                        if (temp_weapons !== false) {
                            for (var k in temp_weapons) {
                                if (temp_weapons[k].type == "Grenade") {
                                    grenades.push(temp_weapons[k]);
                                }
                            }
                            return grenades;
                        }
                    };
                    integ.getPlayers()[k].getStats = function () {
                        var temp_stats = $.extend({}, this.match_stats, this.state);
                        return temp_stats;
                    };
                }
            }
    }
    function listener(players, teams){
        io.on('match', function(data){
            match = data;
        });
        io.on("update", function (json) {

            json.teams = match;
            if(delay >= 0){
                setTimeout(function(){
                    create(json, players, teams);
                    updatePage(integ);
                }, delay*1000);
            }
        });
        io.on('refresh', function(data){
            location.reload();
        });
        io.emit('ready', true);
    }
    load(listener);
});