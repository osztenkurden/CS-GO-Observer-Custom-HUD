var teamsOverall;
var playersOverall;

function addTeam(team){
    $.ajax({
        type: "POST",
        url: "/api/teams",
        data: team,
        cache:false,
        contentType:false,
        processData:false,
        success: function(res){
            listTeams(res.id)
        }
    });
}

function deleteTeam(teamId){
    $.ajax({
        type: "DELETE",
        url: "/api/teams",
        data: {teamId:teamId},
        success: function(res){
            listTeams();
            loadTeam();
            $("#delete_team").addClass("disabled")
        }
    });
}

function deleteLogo(teamId){
    $.ajax({
        type: "DELETE",
        url: "/api/teams_logo",
        data: {teamId:teamId},
        success: function(res){
            listTeams(teamId);
            $("#logo_img").attr("src", "").hide();
        }
    });
}

function updateTeam(team, teamId){
    $.ajax({
        type: "PATCH",
        url: "/api/teams",
        data: team,
        cache:false,
        contentType:false,
        processData:false,
        success: function(){
            listTeams(teamId)
        }
    });
}

function listTeams(defaultTeam){

    loadTeams(function(teams){
        $teamList = $("#teams");
        $teamList.html("<option value='default'>New team</option>");

        teams.forEach(function(team, id) {
            let $option = $("<option value='" + id + "'>" + team.team_name + " (" + team.short_name + ")</option>");
            if(defaultTeam && defaultTeam == team._id) $option.prop("selected","selected");
            $("#teams").append($option);
        }, this);

        $('#teams').formSelect();
    });
}
function loadTeams(callback){
    $.get("/api/teams", function (data) {
        teamsOverall = data.teams;
        callback(teamsOverall);
    });
}

function loadTeam(team){
    $("#team_name").val(team ? team.team_name : "");
    $("#short_name").val(team ? team.short_name : "");
    $("#flags").val(team ? team.country_code : "default").formSelect();
    $("#delete_team").removeClass("disabled").addClass(!team ? "disabled" : "");
    $("#id").val(team ? team._id : "");
    $("#logo_img").attr("src", (team && team.logo ? "/teams/" + team.logo : "")).hide();
    if(team && team.logo) $("#logo_img").show();
}

function addPlayer(player){
    $.ajax({
        type: "POST",
        url: "/api/players",
        data: player,
        success: function(res){
            listPlayers(res.id)
        }
    });
}

function deletePlayer(playerId){
    $.ajax({
        type: "DELETE",
        url: "/api/players",
        data: {userId:playerId},
        success: function(res){
            listPlayers();
            loadPlayer();
            $("#delete_player").addClass("disabled")
        }
    });
}

function updatePlayer(player, userId){
    $.ajax({
        type: "PATCH",
        url: "/api/players",
        data: player,
        success: function(){
            listPlayers(userId)
        }
    });
}

function listPlayers(defaultPlayer){

    loadPlayers(function(players){
        $playerList = $("#players");
        $playerList.html("<option value='default'>New player</option>");

        players.forEach(function(player, id) {
            let $option = $("<option value='" + id + "'>" + player.real_name + " " + player.displayed_name + "</option>");
            if(defaultPlayer && defaultPlayer == player._id) $option.prop("selected","selected");
            $("#players").append($option);
        }, this);

        $("#players").formSelect();
    });
}
function loadPlayers(callback){
    $.get("/api/players", function (data) {
        playersOverall = data.players;
        callback(playersOverall);
    });
}

function loadHUDs(callback){
    $.get("/api/huds", function (data) {
        callback(data.huds);
    });
}

function listHUDs(cb){

    loadHUDs(function(huds){
        $hudsTable = $("#huds tbody");
        $hudsTable.html("");

        huds.forEach(function(hud, id) {
            let $row = $("<tr data-hid='" + hud._id + "'><td>" + hud.name + "</td><td><a href ='http://" + ip + ":" + port + "/huds/" + hud._id + "'>/huds/" + hud._id + "</a></td><td><div class='switch'><label>Off<input type='checkbox'><span class='lever'></span>On</label></div></td><td id='warnings'></td></tr>");
            if(hud.enabled == true) $row.find("input").prop("checked","true");

            $row.find("#warnings").append((!hud.files.includes("template.pug") ? '<p>Missing template.pug<p>' : "") + (!hud.files.includes("index.js") ? '<p>Missing index.js<p>' : "") + (!hud.files.includes("style.css") ? '<p>Missing style.css<p>' : ""));

            $hudsTable.append($row);
        }, this);
        cb();
    });
}

function setHUD(id, enabled){
    $.ajax({
        type: "POST",
        url: "/api/huds",
        contentType: 'application/json',
        data: JSON.stringify({
            id:id,
            enabled:enabled
        }),
        error: function(){
            $("tr[data-hid='" + id + "']").find("input").prop("checked", !enabled);
        }
    });
}

function loadPlayer(player){
    $("#sid").val(player ? player.sid : "");
    $("#real_name").val(player ? player.real_name : "");
    $("#vis_name").val(player ? player.displayed_name : "");
    $("#country").val(player ? player.country_code : "default");
    $("#teams_list").val(player && player.team ? player.team : "default");
    $("#delete_player").removeClass("disabled").addClass(!player ? "disabled" : "");
    $("#country").formSelect();
    $("#teams_list").formSelect();

}