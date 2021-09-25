//...globals
var loggedIn = false;
console.log(`loggedIn ${loggedIn}`);

var authToken = {};
var registerEvent = {};
var loginEvent = {};
var createEvent = {};
var userId = {};

//...change home page nav
if (loggedIn == false) {
	document.getElementById("hide1").className = "hidden";
	document.getElementById("hide2").className = "hidden";
	document.getElementById("hide3").className = "hidden";
}

function registerForm() {
	console.log("sign up clicked");
	let firstName = document.getElementById("defaultRegisterFormFirstName");
	let lastName = document.getElementById("defaultRegisterFormLastName");
	let userName = document.getElementById("defaultRegisterFormUsername");
	let registerBtn = document.getElementById("registerButton");
	let password = document.getElementById("defaultRegisterFormPassword");
	let password2 = document.getElementById("defaultRegisterRepeatPassword");

	let url = "https://baas.kinvey.com/user/kid_BkNEDN87K/";
	let token2 =
		"Basic a2lkX0JrTkVETjg3Szo3ZjExZDI2NDNjYjQ0NTg5OTZlNmRkZGExY2FjNDdlZg==";
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token2,
		},
		body: JSON.stringify({
			username: userName.value,
			password: password.value,
			firstName: firstName.value,
			lastName: lastName.value,
		}),
	};

	//...validations
	if (firstName.value.length < 2) {
		$.notify("First name must be at least 3 characters long", "error");
		return;
	}
	if (lastName.value.length < 2) {
		$.notify("Last name must be at least 3 characters long", "error");
		return;
	}
	if (userName.value.length < 3) {
		$.notify("Username must be at least 3 characters long", "error");
		return;
	}
	if (password.value.length < 6) {
		$.notify("Password must be at least 6 characters long", "error");
		return;
	}
	if (password.value !== password2.value) {
		$.notify("Passwords must be equal", "error");
		return;
	}

	//...successful login
	if (password.value == password2.value) {
		if ((registerEvent = {})) {
			document.getElementById("loadRegister").style.display = "block";
		}

		fetch(url, headers)
			.then(function (response) {
				console.log(response);
				if (response.status == 200 || response.status == 201) {
					$.notify("User registration successful!", "success");
				} else {
					alert("Please select a Username that hasn't been taken!");
				}
				return response.json();
			})
			.then(function (data) {
				console.log(data);
				registerEvent = data.username;
				if (data.error) {
					register();
				} else {
					login();
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		alert("Passwords do not match!");
	}
}

function loginForm() {
	let logInBtn = document.getElementById("logInBtn");
	let username = document.getElementById("defaultRegisterFormUsername");
	let password = document.getElementById("defaultRegisterFormPassword");
	console.log("clicked login");

	let token =
		"Basic a2lkX0JrTkVETjg3Szo5NjE3YjIxMzVlZDE0ZWM4YWMyZjUyZGZmODJiMjczYw==";

	let url = "https://canary-baas.kinvey.com/user/kid_BkNEDN87K/login";
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
		body: JSON.stringify({
			username: username.value,
			password: password.value,
		}),
	};
	// console.log(loginEvent);
	if (loginEvent || loginEvent == undefined) {
		document.getElementById("loadLogin").style.display = "block";
	}

	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			if (response.status !== 200) {
				document.getElementById("loadLogin").style.display = "none";
				alert("Please enter valid login information!");
				// loginEvent = { apples: "Oranges" };
			} else {
				console.log("log in successful!");
				loggedIn = true;
				console.log(`loggedIn ${loggedIn}`);
			}
			return response.json();
		})
		.then(function (data) {
			loginEvent = data.username;
			console.log(data);
			const loggedInUserFirst = data.firstName;
			const loggedInUserLast = data.lastName;
			const loggedUser = loggedInUserFirst + " " + loggedInUserLast;
			userId = data._id;

			authToken = data._kmd.authtoken;
			// console.log(authToken);

			let template = Handlebars.compile("Welcome, {{loggedUser}}!");
			let container = document.getElementById("hide1");
			container.innerHTML = template({
				loggedUser: loggedUser,
			});
			$.notify("Login Successful!", "success");
			home();
			hashRoute = "#home";
			return;
		})
		.catch((err) => {
			console.log(err);
		});
}

function logoutButton() {
	// console.log(authToken);
	console.log("logout Button clicked");

	let token = `Kinvey ${authToken}`;
	let url = "https://baas.kinvey.com/user/kid_BkNEDN87K/_logout";
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	};
	if (loggedIn == true) {
		document.getElementById("loadLogout").style.display = "block";
	}
	fetch(url, headers)
		.then(function (response) {
			// // console.log(response);
			// return response.json();
		})
		.then(function (data) {
			$.notify("Successfully logged out!", "success");

			//page chages logout
			document.getElementById("loggedOutMessage").style.display = "block";
			document.getElementById("loggedOutDefault").style.display = "none";
			document.getElementById("logoutBtn").style.display = "none";

			//reappear navs
			document.getElementById("loggedHide1").className = "nav-link";
			document.getElementById("loggedHide2").className = "nav-link";

			//hide navs
			document.getElementById("hide1").className = "hidden";
			document.getElementById("hide2").className = "hidden";
			document.getElementById("hide3").className = "hidden";
			loggedIn = false;
			authToken = {};
			document.getElementById("loadLogout").style.display = "none";

			console.log(authToken);
		})
		.catch((err) => {
			console.log(err);
		});

	setTimeout(function () {
		anonymous();
	}, 3000);
}

function create() {
	console.log("create button clicked");

	//...input variables
	let meal = document.getElementById("defaultRecepieShareMeal");
	let ingredients = document.getElementById("defaultRecepieShareIngredients");
	let methodOfPreperation = document.getElementById(
		"defaultRecepieShareMethodOfPreparation"
	);
	let description = document.getElementById("defaultRecepieShareDescription");
	let imageURL = document.getElementById("defaultRecepieShareFoodImageURL");
	let categoryInput = document.getElementById("selectCategory");
	let createBtn = document.getElementById("createBtn");
	let categoryImageURL;

	//...checks and value sets

	//meal

	if (meal.value.length < 4) {
		$.notify("Meal must be at least 4 characters long!", {
			className: "error",
			clickToHide: false,
			autoHide: true,
			globalPosition: "top center",
		});
		return;
	}

	//ingredients
	var ingredientsArr;

	function addIngredients(ingredientsInput) {
		let newArr = [];
		ingredientsArr = ingredientsInput.split(", ");
		for (let each of ingredientsArr) {
			each = { each };
			newArr.push(each);
		}
		console.log(newArr);
		return JSON.stringify(newArr);
	}

	addIngredients(ingredients.value);
	// console.log(ingredientsArr);

	if (ingredientsArr.length < 2) {
		$.notify(
			"Must have at least 2 ingredients!\nHint...seperate ingredients with a comma followed by a space.",
			{
				className: "error",
				clickToHide: false,
				autoHide: true,
				globalPosition: "top center",
			}
		);
		return;
	}

	//prep method check
	if (methodOfPreperation.value.length < 10) {
		$.notify("Method of Preperation must be at least 10 characters long!", {
			className: "error",
			clickToHide: false,
			autoHide: true,
			globalPosition: "top center",
		});
		return;
	}

	//description check
	if (description.value.length < 10) {
		$.notify("Description must be at least 10 characters long!", {
			className: "error",
			clickToHide: false,
			autoHide: true,
			globalPosition: "top center",
		});
		return;
	}

	//imageURL check

	let regex = /^(http|https):\/\/[\w\W]*/gm;
	// console.log(regex.test(imageURL.value));
	if (regex.test(imageURL.value) == false) {
		$.notify('Image URL must begin with "https://" "or http://"', {
			className: "error",
			clickToHide: false,
			autoHide: true,
			globalPosition: "top center",
		});
		return;
	}

	// console.log(categoryInput.value);

	//category
	if (categoryInput.value == "Select category...") {
		$.notify("Please select a valid category!", {
			className: "error",
			clickToHide: false,
			autoHide: true,
			globalPosition: "top center",
		});
		return;
	} else if (categoryInput.value == "Vegetables and legumes/beans") {
		categoryImageURL =
			"https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg";
	} else if (categoryInput.value == "Fruits") {
		categoryImageURL =
			"https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg";
	} else if (categoryInput.value == "Grain Food") {
		categoryImageURL =
			"https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg";
	} else if (categoryInput.value == "Milk, cheese, eggs and alternatives") {
		categoryImageURL =
			"https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg";
	} else if (
		categoryInput.value == "Lean meats and poultry, fish and alternatives"
	) {
		categoryImageURL =
			"https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg";
	}

	//...fetch request auth/headers

	// console.log(authToken);
	let token = `Kinvey ${authToken}`;
	let url = "https://baas.kinvey.com/appdata/kid_BkNEDN87K/Recipes";
	let headers = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
		body: JSON.stringify({
			meal: meal.value,
			ingredients: ingredientsArr,
			prepMethod: methodOfPreperation.value,
			description: description.value,
			category: categoryInput.value,
			foodImageURL: imageURL.value,
			categoryImageURL,
			likesCounter: 0,
		}),
	};

	//...notification/loading
	if (createEvent) {
		document.getElementById("loadCreate").style.display = "block";
	}

	//...fetch request

	fetch(url, headers)
		.then(function (response) {
			console.log(response);
			if (response.status == 200 || response.status == 201) {
				$.notify("Recipe successfully created!", {
					className: "success",
					clickToHide: false,
					autoHide: true,
					globalPosition: "top right",
				});
			}
			meal.value = "";
			ingredients.value = "";
			methodOfPreperation.value = "";
			description.value = "";
			imageURL.value = "";
			categoryInput.value = "Select category...";

			setTimeout(function () {
				home();
			}, 3000);

			return response.json();
		})
		.then(function (data) {
			document.getElementById("loadCreate").style.display = "none";
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});
}
