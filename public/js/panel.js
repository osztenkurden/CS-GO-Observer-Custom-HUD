var io = io('http://' + ip + ':' + port + '/');
function loadMatch(data){
	loadTeams((teams) => {
        $teamList = $("#team_1, #team_2");
        $teamList.html("<option value=null>NONE</option><option value='auto' selected>Try to match team automatically</option>");

        teams.forEach(function(team, id) {
            let $option = $("<option value='" + team._id + "'>" + team.team_name + " (" + team.short_name + ")</option>");
			if(team.logo){
				$option.attr("data-icon", "/teams/"+team.logo)
			}
            $teamList.append($option);
        }, this);
		if(data){
			$("#botype").val(data.match);
			$("#team_1_score").val("0").val(data.team_1.map_score);
			$("#team_2_score").val("0").val(data.team_2.map_score);
			$("#team_1").val("auto").val(data.team_1.team);
			$("#team_2").val("auto").val(data.team_2.team);
		}
		$("select").formSelect();

    });
}
$(document).ready(() => {
    $("#set").click(() => {
		let match = {
			match: $("#botype").val(),
			team_1:{
				map_score: $("#team_1_score").val(),
				team: $("#team_1").val()
			},
			team_2:{
				map_score: $("#team_2_score").val(),
				team: $("#team_2").val()
			}
		};
        io.emit("update_match", match);
    });
	$("#swap").click(() => {
		let match = {
			match: $("#botype").val(),
			team_2:{
				map_score: $("#team_1_score").val(),
				team: $("#team_1").val()
			},
			team_1:{
				map_score: $("#team_2_score").val(),
				team: $("#team_2").val()
			}
		};
        io.emit("update_match", match);
	});
	$("#ref").click(() => {
		io.emit("refresh", true);
	});
	io.on('match', loadMatch);
	loadMatch();
	io.emit("ready", true);
    
});