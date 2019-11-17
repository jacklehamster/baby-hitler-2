// let theScreen = null;
// const touchContainer = document.querySelector("#touch-container");
// const touchView = document.querySelector(".touch");

// function setTouchScreen(screen) {
// 	if (theScreen !== screen) {
// 		touchView.style.display = "";
// 		theScreen = screen;
// 		touchContainer.innerHTML = "";

// 		switch(screen) {
// 			case "start":
// 				addStart(touchContainer);
// 				break;
// 			case null:
// 				break;
// 			default:
// 				console.error(screen + "< touchscreen not recognized");
// 		}
// 	}
// }

// function addStart(touchContainer) {
// 	const startDiv = touchContainer.appendChild(document.createElement("div"));
// 	startDiv.innerText = "start";
// 	startDiv.classList.add("touch-button");
// 	startDiv.classList.add("start");
// }