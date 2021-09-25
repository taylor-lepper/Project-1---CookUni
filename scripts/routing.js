function home() {
	var loggedIn = true;

	if (loggedIn == true) {
		//...nav bar reappears
		document.getElementById("hide1").className = "nav-link";
		document.getElementById("hide2").className = "nav-link";
		document.getElementById("hide3").className = "nav-link";

		//...fix spacing home nav
		document.getElementById("padwan").style.paddingLeft = "0%";

		//...nav bar hides
		document.getElementById("loggedHide1").className = "hidden";
		document.getElementById("loggedHide2").className = "hidden";
	} else {
		anonymous();
	}

	//...fetch headers, token
	let token =
		"Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==";

	let url = "https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes";
	let headers = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};

	//...fetch request for All recipes

	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			if (data) {
				console.log("Recipes found");

				let recipeArr = Object.entries(data);

				recipeArr = recipeArr.map(function (innerArray) {
					// console.log(innerArray);
					let [id, recipeObj] = innerArray;
					// console.log(recipeObj);

					let recipe = {
						id: recipeObj._id,
						mealName: recipeObj.meal,
						category: recipeObj.category,
						ingredients: recipeObj.ingredients,
						foodImageURL: recipeObj.foodImageURL,
						creator: recipeObj._acl.creator,
						likesCounter: recipeObj.likesCounter,
						prepMethod: recipeObj.prepMethod,
						categoryImageURL: recipeObj.categoryImageURL,
					};
					// console.log(recipe);
					return recipe;
				});
				let src = document.getElementById("home").innerHTML;
				let template = Handlebars.compile(src);
				let context = { recipeArr };
				let html = template(context);
				render(html);
				// console.log(recipeArr);
				document.getElementById("foodNotFound").style.display = "none";
				document.getElementById("sharedRecipes").style.display =
					"block";

				//...view the recipe
			} else {
				console.log("No recipes found");
				document.getElementById("sharedRecipes").style.display = "none";
				document.getElementById("foodNotFound").style.display = "block";
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function share() {
	if (loggedIn == false) {
		anonymous();
	}
	let src = document.getElementById("share").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function profile() {
	console.log(userId);
	if (loggedIn == false) {
		anonymous();
	}

	//...headers and url for fetch
	let url = "https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes";
	let token =
		"Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==";

	let headers = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};

	//...fetch info
	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			// get the template as a handlebars string
			console.log(data);

			if (loggedIn == false) {
				anonymous();
			}
			//...create user only recipes
			let recipesArr = Object.entries(data);

			// console.log(recipesArr);
			let finalArr = [];

			for (let each of recipesArr) {
				// console.log(each);
				let [recipeId, recipeObj] = each;
				let creator = recipeObj._acl.creator;
				// console.log(creator, userId);
				if (creator == userId) {
					finalArr.push(recipeObj);
				}
			}

			//...check to see if user has any recipes
			console.log(finalArr.length);
			if (finalArr.length !== 0) {
				//render page
				// console.log(recipeID);
				let src = document.getElementById("profile").innerHTML;
				let template = Handlebars.compile(src);
				let context = { finalArr };
				let html = template(context);
				render(html);

				//...change for recipes found message
				document.getElementById("noRecipesProfile").className =
					"hidden";
				document.getElementById("recipesFoundProfile").className = "";
			} else {
				let src = document.getElementById("profile").innerHTML;
				let template = Handlebars.compile(src);
				let context = {};
				let html = template(context);
				render(html);

				//...change for no recipes found message
				document.getElementById("noRecipesProfile").className = "";
				document.getElementById("recipesFoundProfile").className =
					"hidden";
			}
		})
		.catch((err) => {
			console.log(err);
			$.notify(err, "error");
		});
}

function logout() {
	if (loggedIn == false) {
		anonymous();
	}
	let src = document.getElementById("logout").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function login() {
	let src = document.getElementById("login").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function register() {
	let src = document.getElementById("register").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function anonymous() {
	let src = document.getElementById("anonymous").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
	var loggedIn = false;
}

function editRecipe(recipe) {
	console.log(recipe);
	if (loggedIn == false) {
		anonymous();
	}
	//...button
	let editRecipeBtn = document.getElementById("editRecipeBtn");

	//...load page
	let src = document.getElementById("editPage").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);

	//...set defaults
	document.getElementById("defaultRecepieEditMeal").placeholder = recipe.meal;
	if (recipe.ingredients) {
		document.getElementById("defaultRecepieEditIngredients").value =
			recipe.ingredients.join(", ");
	} else {
		document.getElementById("defaultRecepieEditIngredients").value =
			recipe.ingredients;
	}
	document.getElementById("defaultRecepieEditMethodOfPreparation").value =
		recipe.prepMethod;
	document.getElementById("defaultRecepieEditDescription").value =
		recipe.description;
	document.getElementById("defaultRecepieEditFoodImageURL").value =
		recipe.foodImageURL;
	document.getElementById("defaultRecipeEditFoodCategory").value =
		recipe.category;
}

function viewRecipe(recipeID) {
	// console.log(recipeID);
	if (loggedIn == false) {
		anonymous();
	}
	let token =
		"Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==";

	let url = `https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes/${recipeID}`;
	let headers = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};
	console.log("view recipe clicked");
	if (document.getElementById("loadView")) {
		document.getElementById("loadView").style.display = "block";
	}

	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			console.log(data);

			//...variables for context and checks
			let recipe = data;
			let creator = recipe._acl.creator;
			console.log(userId, creator);

			//...render page
			let src = document.getElementById("viewRecipe").innerHTML;
			let template = Handlebars.compile(src);
			let context = recipe;
			let html = template(context);
			render(html);
			if (loggedIn == false) {
				anonymous();
			}

			if (document.getElementById("loadView")) {
				document.getElementById("loadView").style.display = "none";
			}

			//...hide buttons
			if (userId == creator) {
				if (document.getElementById("like")) {
					document.getElementById("like").style.display = "none";
				}
			} else {
				if (document.getElementById("edit")) {
					document.getElementById("edit").style.display = "none";
					document.getElementById("archive").style.display = "none";
				}
			}

			//...click events buttons view recipe page
			if (document.getElementById("archive")) {
				document
					.getElementById("archive")
					.addEventListener("click", function () {
						console.log("archive clicked");

						let token = `Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==`;
						let url = `https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes/${recipeID}`;
						let headers = {
							method: "DELETE",
							headers: {
								"Content-Type": "application/json",
								Authorization: token,
							},
						};

						document.getElementById("loadView").style.display =
							"block";

						fetch(url, headers)
							.then(function (response) {
								console.log(response);
								return response.json();
							})
							.then(function (data) {
								if (data.count) {
									document.getElementById(
										"loadView"
									).style.display = "none";
									console.log(data);
									$.notify(
										"Successfully removed recipe from database!",
										"success"
									);
									home();
									return;
								} else {
									$.notify("Error", "error");
								}
							})
							.catch((err) => {
								console.log(err);
								$.notify(err, "error");
							});
					});
			}

			if (document.getElementById("edit")) {
				document
					.getElementById("edit")
					.addEventListener("click", function () {
						console.log("edit clicked");

						editRecipe(recipe);
					});
			}
			if (document.getElementById("like")) {
				document
					.getElementById("like")
					.addEventListener("click", function () {
						console.log("likes clicked");
						let likeBtn = document.getElementById("like");
						// console.log(data);

						let token = `Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==`;
						let url = `https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes/${recipe._id}`;
						let headers = {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
								Authorization: token,
							},
							body: JSON.stringify({
								meal: data.meal,
								ingredients: data.ingredients,
								prepMethod: data.prepMethod,
								description: data.description,
								category: data.category,
								foodImageURL: data.foodImageURL,
								categoryImageURL: data.categoryImageURL,
								likesCounter: data.likesCounter + 1,
							}),
						};
						console.log(headers);

						//...send edit to database
						if (document.getElementById("loadView")) {
							document.getElementById("loadView").style.display =
								"block";
						}

						fetch(url, headers)
							.then(function (response) {
								console.log(response);
								return response.json();
							})
							.then(function (data) {
								if (document.getElementById("loadView")) {
									document.getElementById(
										"loadView"
									).style.display = "none";
								}
								console.log(data);
								viewRecipe(data._id);
								return;
							})
							.catch((err) => {
								console.log(err);
								$.notify(err, "error");
							});
					});
			}
		})

		.catch((err) => {
			console.log(err);
			$.notify("Couldn't figure out the issue here", "error");

			setTimeout(function () {
				profile();
			}, 1500);

			// change html to show an error has occured
		});
}

function editRecipeSubmit() {
	if (loggedIn == false) {
		anonymous();
	}
	console.log("clicked edit recipe submit");
	let hashSplit = hashRoute.split("/");
	let recipeId = hashSplit[1];
	console.log(recipeId);

	let token =
		"Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==";

	let url = `https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes/${recipeId}`;
	let headers = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};
	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			// get the template as a handlebars string
			console.log(data);
			let recipe = data;

			//...edit recipe inputs
			let meal = document.getElementById("defaultRecepieEditMeal").value;
			let ingredients = document
				.getElementById("defaultRecepieEditIngredients")
				.value.split(", ");
			let prepMethod = document.getElementById(
				"defaultRecepieEditMethodOfPreparation"
			).value;
			let description = document.getElementById(
				"defaultRecepieEditDescription"
			).value;
			let foodImageURL = document.getElementById(
				"defaultRecepieEditFoodImageURL"
			).value;
			let category = document.getElementById(
				"defaultRecipeEditFoodCategory"
			).value;

			//...unseen recipe variables
			let likesCounter = recipe.likesCounter;
			let categoryImageURL = recipe.categoryImageURL;

			// ...headers and auth for edit recipe
			let token = `Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==`;
			let url = `https://canary-baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes/${recipe._id}`;
			let headers = {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
				body: JSON.stringify({
					meal,
					ingredients,
					prepMethod,
					description,
					category,
					foodImageURL,
					categoryImageURL,
					likesCounter,
				}),
			};
			console.log(headers);

			//...send edit to database

			// document.getElementById("loadEdit").style.display = "block";
			fetch(url, headers)
				.then(function (response) {
					console.log(response);
					return response.json();
				})
				.then(function (data) {
					// document.getElementById("loadEdit").style.display = "none";
					console.log(data);
					viewRecipe(data._id);
					return;
				})
				.catch((err) => {
					console.log(err);
					$.notify(err, "error");
				});
		})
		.catch((err) => {
			console.log(err);
			// change html to show an error has occured
		});
}

function render(html) {
	document.getElementById("container").innerHTML = html;
}
