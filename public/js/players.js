$(document).ready(function(){
    let id = null;

    listPlayers();

    loadTeams(function(teams){
        $teamList = $("#teams_list");
        $teamList.html("<option value='default'>No team</option>");

        teams.forEach(function(team, id) {
            let $option = $("<option value='" + team._id + "'>" + team.team_name + " (" + team.short_name + ")</option>");
            $("#teams_list").append($option);
        }, this);

        $("#teams_list").formSelect();
    });

    $("#players").change(function(){
        let i = $(this).val();
        loadPlayer(playersOverall[i]);

        if(playersOverall[i]) id = playersOverall[i]._id;

        $("#country").formSelect();
    });
    $("#save_player").click(function(){
        let player = {
            sid: $("#sid").val(),
            real_name: $("#real_name").val(),
            displayed_name: $("#vis_name").val(),
            country_code: $("#country").val(),
            team:$("#teams_list").val()
        };
        let localId = $("#players").val();
        if(localId == "default"){
            addPlayer(player);
        } else {
            player._id = playersOverall[parseInt(localId)]._id;
            updatePlayer(player, player._id);
        }
    });
    $("#delete_player").click(function(){
        deletePlayer(id);
    })
});
