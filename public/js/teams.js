$(document).ready(function(){
    let id = null;

    listTeams();

    $("#teams").change(function(){
        let i = $(this).val();
        loadTeam(teamsOverall[i]);

        if(teamsOverall[i]) id = teamsOverall[i]._id;

        $("#flags").formSelect();
    });
    $("#save_team").click(function(e){
        e.preventDefault();
        let form = $('form')[0];
        let form_data = new FormData(form);
        let localId = $("#teams").val();

        if(localId == "default"){
            addTeam(form_data);
        } else {
            updateTeam(form_data, $("#id").val());
        }
    });
    $("#delete_team").click(function(){
        deleteTeam(id);
    });
    $("#delete_logo").click(function(){
        deleteLogo($("#id").val());
    });

});
