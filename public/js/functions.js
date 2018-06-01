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
        callback(data);
    });
}

function addHUD(data, callback){
    $.ajax({
        type: "POST",
        url: "/api/huds",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res){
            listHUDs(callback);
        }
    });
}
function deleteHUD(instanceId, callback){
    $.ajax({
        type: "DELETE",
        url: "/api/huds",
        data: {id:instanceId},
        success: function(res){
            listHUDs(callback);
        }
    });
}

function listHUDs(cb){
    loadHUDs(function(res){
        let huds = res.huds;
        let instances = res.instances;
        let files = res.files;

        let $instance_example, $hud_example;
        
        $instance_example = $("#instance").clone();
        $hud_example = $("#hud").clone();
        let $instance = $("#instance").clone().attr("id", "");
        let $hud = $("#hud").clone().attr("id", "");

        let hudList = {};

        instances.forEach(function(el) {
            if(!hudList[el.hud]) hudList[el.hud] = [];
            hudList[el.hud].push(el);
        }, this);

        $hudsTable = $("#huds tbody");
        $hudsTable.html("");
        $hudsTable.append($instance_example.hide());
        $hudsTable.append($hud_example.hide());
        
        huds.forEach(function(hud) {
            let $hudRow = $hud.clone().show().appendTo("<tr></tr>");
            $hudRow.find("th:eq(0)").text(hud)

            $hudsTable.append($hudRow);
            if(hudList[hud]){
                hudList[hud].forEach(function(inst) {
                    let $temp = $instance.clone();
                    
                    $temp.show();
                    $temp.find("#name").val(inst.name);
                    $temp.appendTo($("<tr></tr>")).attr("data-hid", inst._id).appendTo($hudsTable);
                    $temp.find('#delay').val(inst.delay);
                    $temp.find("td:eq(3)").html("<a href='/huds/" + inst._id + "'>/huds/" + inst._id + "</a>");
                    $temp.find("#warnings").html('<i class="material-icons">done</i>')

                    if(inst.enabled == true) $temp.find("input[type='checkbox']").prop("checked","true");
                }, this);
            }
            let $status = $hudRow.find("#warnings i");
            if(!files[hud].includes("template.pug") ||  !files[hud].includes("index.js") || !files[hud].includes("style.css")){
                let tip = "Missing files:" + (!files[hud].includes("template.pug") ? ' template.pug,' : "") + (!files[hud].includes("index.js") ? ' index.js,' : "") + (!files[hud].includes("style.css") ? ' style.css,' : "");
                $status.addClass("tooltipped").attr({"data-position":"top", "data-tooltip":tip.substr(0, tip.length -1)}).text("warning")
            } else {
                $status.removeClass("tooltipped").text("done_all");
            }
        }, this);
        if(typeof cb == "function") cb();
    });
}

function setHUD(data){
    $.ajax({
        type: "PATCH",
        url: "/api/huds",
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function(){
            $("tr[data-hid='" + data.id + "']").find("#warnings").html('<i class="material-icons tooltipped" data-position="top" data-tooltip="Error during request">error_outline</i>');
        },
        success: function(){
            $("tr[data-hid='" + data.id + "']").find("#warnings").html('<i class="material-icons">done</i>');
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