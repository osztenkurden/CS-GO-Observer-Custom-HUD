$(document).ready(() => {
	function listener() {
		$("input[type='checkbox']").change(function(e){
			let input = $(e.target);
			setHUD($(input.parents()[3]).attr("data-hid"), input.is(":checked"));
		})
	}
    listHUDs(listener);
});