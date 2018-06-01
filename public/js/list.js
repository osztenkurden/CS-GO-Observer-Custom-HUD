$(document).ready(() => {
	function listener(data) {
        let instances = data.instances;
        instances.forEach(function(hud) {
            let $new = $("#example").clone().removeClass("#example");
            $new.find("p").html("<b>"+hud.hud + " </b> - " + hud.name);
            $new.find("a").attr("href", "/huds/"+hud._id);
            $new.appendTo("#list");
        }, this);
        $("#example").remove();
	}
    loadHUDs(listener);
});