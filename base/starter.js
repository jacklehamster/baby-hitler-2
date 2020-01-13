const noises = document.querySelectorAll(".noise");
const scanlines = document.querySelectorAll(".scanline");
const screenCopies = document.querySelectorAll(".screen-copy");

function toggleScanlines() {
	const check = document.querySelector("#scanlines");
	check.click();
	setScanline(check.checked);			
}

function setScanline(checked) {
	const display = checked ? "" : "none";
	noises.forEach(noise => {
		noise.style.display = display;
	});
	scanlines.forEach(scanline => {
		scanline.style.display = display;
	});
	screenCopies.forEach(screenCopy => {
		screenCopy.style.display = display;
	});
}

function copyFromTo(contextSrc, contextDst) {
	const { width, height } = contextDst.canvas;
	contextDst.clearRect(0, 0, width, height);
	contextDst.drawImage(contextSrc.canvas, 0, 0, width, height);
}

function startGame() {
	const ctx = document.getElementById("canvas").getContext("2d");
	const ctx2 	= document.getElementById("canvas2").getContext("2d",{ alpha: false });
	const touchCtx = document.getElementById("touch-canvas").getContext("2d");
	const touchCtx2 = document.getElementById("touch-canvas2").getContext("2d",{ alpha: false });
	game.injectImage(ASSETS.ALPHABET_DARK, document.getElementById("alphabet"));
	document.getElementById("alphabet").style.display = "none";
	game.playGame();
	updateSaves();

	game.refreshCallback = () => {
		copyFromTo(ctx, ctx2);
		copyFromTo(touchCtx, touchCtx2);
	};

	processTranslation();
}

const game = Game.start(gameConfig);

if (DEMO) {
	document.getElementById("saves").style.display = "none";
}

function clearSaves() {
	localStorage.removeItem("saves");
	updateSaves();
}

function save() {
	const saves = game.getSaveList();
	let index = 0;
	while(saves[index]) {
		index++;
	}
	game.save(index);
	updateSaves();
}

function updateSaves() {
	const saveBox = document.getElementById("savebox");
	saveBox.innerHTML ="";
	const saves = game.getSaveList();
	for (let name in saves) {
		addSaveBox(name);
	}
}

function addSaveBox(name) {
	const saveBox = document.getElementById("savebox");
	const button = saveBox.appendChild(document.createElement("button"));
	button.innerText = name;
	button.addEventListener("click", () => {
		game.playTheme(null);
		game.load(name);
		game.gotoScene(game.sceneIndex, game.door);
		if (game.data.theme) {
			game.playTheme(game.data.theme.song, game.data.theme);
		}

		game.showTip(`GAME ${name} LOADED.`, null, null, {removeLock: true});
	});
}

addEventListener("focus", () => {
	if (game && document.getElementById("pauseexit").checked)
		game.resume();
});
addEventListener("blur", () => {
	if (game && document.getElementById("pauseexit").checked)
		game.pause()
});

document.addEventListener("visibilitychange", () => {
	if (game && document.getElementById("pauseexit").checked) {
		if (document.visibilityState === "hidden") {
			game.pause();
		} else {
			game.resume();
		}
	}
});

const mainNoiseCanvas = document.getElementById("noise");
const noiseCanvases = [];
for (let i = 0; i < 10; i++) {
	const noiseCanvas = document.createElement("canvas");
	noiseCanvas.width = mainNoiseCanvas.width;
	noiseCanvas.height = mainNoiseCanvas.height;
	const noiseCtx = noiseCanvas.getContext("2d");
	const noiseData = noiseCtx.getImageData(0, 0, noiseCtx.canvas.width, noiseCtx.canvas.height);
	const { data } = noiseData;
	for(let n = 0; n < data.length; n += 4) {
		data[n + 3] = Math.random() < .6 + (1-i/10*i/10) * .3 ? 0 : 40;
	}
	noiseCtx.putImageData(noiseData, 0, 0);
	noiseCanvases.push(noiseCanvas);
}

const canvasOverlays = document.querySelectorAll(".canvas-overlay").forEach(canvas => {
	const ctx = canvas.getContext("2d")
	ctx.msImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
});

function startNoiseStatic() {
	const noiseContexes = Array.prototype.slice.call(document.querySelectorAll(".noise"))
		.map(canvas => canvas.getContext("2d"));	
	let time = 0;
	function noise(dt) {
		time += dt;
		if (time > 100) {
			noiseContexes.forEach(noiseCtx => {
			noiseCtx.clearRect(0, 0, noiseCtx.canvas.width, noiseCtx.canvas.height);
			noiseCtx.drawImage(
				noiseCanvases[Math.floor(Math.random() * noiseCanvases.length)],
				0, 0);
			});
			time -= 100;
		}
		requestAnimationFrame(noise);
	}
	requestAnimationFrame(noise);
}
startNoiseStatic();


screen.orientation.lock('portrait').catch(function(error) {
});