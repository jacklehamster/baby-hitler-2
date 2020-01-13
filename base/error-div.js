const errorDiv = document.getElementById("error-div");
errorDiv.addEventListener("click", e => {
	errorDiv.style.display = "none";
});	
function showError(error) {
	if (error) {
		errorDiv.style.display = "";
		errorDiv.innerHTML += error + "\n";
	} else {
		errorDiv.style.display = "none";
	}
}

const loadErrorDiv = document.getElementById("load-error-div");
loadErrorDiv.addEventListener("click", e => {
	loadErrorDiv.style.display = "none";
});

function showLoadErrors(errors) {
	if (errors) {
		loadErrorDiv.style.display = "";
		loadErrorDiv.innerHTML = errors + "\n";
	} else {
		loadErrorDiv.style.display = "none";
	}			
}