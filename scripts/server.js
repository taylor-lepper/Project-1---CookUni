let hashRoute;

$(function () {
	anonymous();

	$.notify(`For guest access, use "test" for both input parameters.`, {
		className: "info",
		clickToHide: true,
		autoHide: true,
		globalPosition: "top center",
	});
	$.notify(`Welcome`, {
		className: "success",
		clickToHide: true,
		autoHide: true,
		globalPosition: "top center",
	});
});

function listen() {
	let current = getCurrent();

	if (current !== hashRoute) {
		// console.log(window.location.hash);
		hashRoute = current;

		if (hashRoute == "" || hashRoute == "#anonymous") {
			anonymous();
		} else if (hashRoute == "#share") {
			share();
		} else if (hashRoute == "#profile") {
			profile();
		} else if (hashRoute == "#logout") {
			logout();
		} else if (hashRoute == "#login") {
			login();
		} else if (hashRoute == "#register") {
			register();
		} else if (hashRoute == "#home") {
			console.log(`loggedIn ${loggedIn}`);
			if (loggedIn == false) {
				anonymous();
			} else {
				home();
			}
		} else if (hashRoute.includes("details")) {
			let hashSplit = hashRoute.split("/");

			viewRecipe(hashSplit[1]); //#details/-MjuM5NtwLEGafDenhIP
		}
	}

	setTimeout(listen, 200);
}

function getCurrent() {
	console.log(window.location.hash);
	return window.location.hash;
}

listen();
