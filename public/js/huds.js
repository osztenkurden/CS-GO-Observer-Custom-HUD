$(document).ready(() => {
	function listener() {
		let names_listen = {};
		let delay_listen = {};
		$("input[type='checkbox']").change(function(e){
			let container = $($(e.target).parents()[3]);
			let hud = {
				id: container.attr("data-hid"),
				enabled: $(e.target).is(":checked"),
				name:container.find("#name").val(),
				delay:container.find("#delay").val()
			}
			setHUD(hud);
		});
		$(".add_hud").click(function(e){
			let div = $($(e.target).parents()[1]);
			let new_hud = {
				name:div.find("#name").val(),
				hud:div.find("th:eq(0)").text(),
				enabled:true,
				delay:div.find("#delay").val()
			}
			addHUD(new_hud, listener)
		});
		$(".delete_hud").click(function(e){
			let id = $($(e.target).parents()[1]).attr("data-hid");
			deleteHUD(id, listener);
		});
		function handler(e){
			let container = $($(e.target).parents()[$(e.target).hasClass("name") ? 1 : 2]);
			let id = container.attr("data-hid");

			container.find("#warnings").html('<i class="material-icons">hourglass_empty</i>')

			if(names_listen[id]){
				clearTimeout(names_listen[id])
			}
			names_listen[id] = setTimeout(function() {
				let hud = {
					id: id,
					enabled: container.find("input[type='checkbox']").is(":checked"),
					name:container.find("#name").val(),
					delay:container.find("#delay").val() != "" ? parseInt(container.find("#delay").val()) : 0
				}
				setHUD(hud);
			}, 1000);	
		}
		$(".name, .delay").keyup(handler).change(handler);;
        $('.tooltipped').tooltip();
	}
    listHUDs(listener);
});