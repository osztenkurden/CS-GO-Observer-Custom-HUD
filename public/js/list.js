$(document).ready(() => {
	function listener(huds) {
        huds.forEach(function(hud) {
            let $new = $("#example").clone().removeClass("#example");
            $new.find("p").text(hud.name);
            $new.find("a").attr("href", "/huds/"+hud._id);
            $new.appendTo("#list");
        }, this);
        $("#example").remove();
	}
    loadHUDs(listener);
});