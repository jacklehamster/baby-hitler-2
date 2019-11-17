gameConfig.scenes.push(
	{
		name: "start-screen",
		touchScreen: game => {
			return "start";
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
			},
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const { img } = sceneData.loadSave[index];
							ctx.drawImage(img, 2 + index % 2 * 32, 2 + Math.floor(index / 2) * 32);
							if (hoverTime) {
								ctx.beginPath();
								ctx.lineWidth = "2px"
								ctx.strokeStyle = "#aaccff";
								ctx.rect(2 + index % 2 * 32, 2 + Math.floor(index / 2) * 32, 28, 28);
								ctx.stroke();														
							}
						}
					},
					onClick: (game, {index}) => {
						const {sceneData} = game;
						game.load(sceneData.loadSave[index].name);
					},
					hidden: ({sceneData, dialog}, sprite) => !dialog || dialog.index !== 2 || !sceneData.loadSave || !sceneData.loadSave[sprite.index],
				};
			})),
			{
				src: ASSETS.MOON_BASE,
				hidden: ({dialog}) => dialog && dialog.index === 2,
			},
			{
				src: ASSETS.MOON_BASE_GUARD, col: 1, row: 2,
				side: LEFT,
				index: ({now, sceneTime}) => Math.floor((now - sceneTime) / 1000) % 2,
				offsetX: ({now, sceneTime}) => -15 + Math.floor((now - sceneTime) / 1000) % 75,
				offsetY: -2,
				hidden: ({dialog}) => dialog && dialog.index === 2,
			},
			{
				src: ASSETS.MOON_BASE_GUARD, col: 1, row: 2,
				side: RIGHT,
				index: ({now, sceneTime}) => Math.floor((now - sceneTime) / 1000) % 2,
				offsetX: ({now, sceneTime}) => +15 - Math.floor((now - sceneTime) / 1000) % 75,
				hidden: ({dialog}) => dialog && dialog.index === 2,
			},
			{
				custom: (game, sprite, ctx) => {
					const fade = 1 - Math.min(1, (game.now - game.sceneTime) / 1000);
					const imageData = ctx.getImageData(0, 0, 64, 64);
					for (let i = 0; i < imageData.data.length; i+= 4) {
						if (Math.random() < fade) {
							imageData.data[i] = 255;
							imageData.data[i+1] = 255;
							imageData.data[i+2] = 255;
							imageData.data[i+3] = 255;
						}
					}
					ctx.putImageData(imageData, 0, 0);
				},
				hidden: game => game.now - game.sceneTime > 1000,
			},
			{
				src: ASSETS.HITLER,
				hidden: ({now, sceneData}) => !sceneData.about && !sceneData.notAbout || sceneData.notAbout && now - sceneData.notAbout >= 1000,
				alpha: ({now, sceneData}) => Math.min(1, sceneData.notAbout ? 1 - (now - sceneData.notAbout)/1000 : (now - sceneData.about) / 1000),
				onClick: game => {
					if (!game.sceneData.notAbout) {
						game.sceneData.notAbout = game.now;
						game.sceneData.about = 0;
						game.playTheme(SOUNDS.FUTURE_SONG_THEME, {volume: .5});
						game.currentScene.onStartDialog(game);
					}
				},
			},
			{
				init: game => {
					game.sceneData.credits = `
						This game is the sequel to
						“Kill Baby Hitler”
						a game released in Jan 2019.

						The first part of this game was released for\n#LOWREZJAM\n2019 in\nSeptember, then it was iterated on.

						This is a\npoint-and-click\nadventure. Use the cursor to interact with items and pick them up. You have an inventory and stats that you can increase. Use your wits to solve puzzles.

						There is one main ending and three alternate endings to unlock.
					`.split("\n").map((a, index) => game.wordwrap(a.trim(), 13)).join("\n").split("\n");
				},
				custom: (game, sprite, ctx) => {
					if (game.now - game.sceneData.scrollTime) {
						ctx.fillStyle = "#000000";
						ctx.globalAlpha = Math.min(.6, (game.now - game.sceneData.scrollTime) / 5000);
						ctx.fillRect(0, 0, 64, 64);
					}
					ctx.globalAlpha = .8;

					const shift = - (game.now - game.sceneData.scrollTime - 1000) / 200 + 50;
					game.sceneData.credits.forEach((line, index) => {
						const y = index * 7 + shift;
						if (y > 0 && y < 55) {
							game.displayTextLine(ctx, {
								msg: line,
								x:1, y: Math.round(y),
								alpha: Math.max(0.05, Math.min(.8, y/5, (55 - y)/5)),
							});
						}
					});
				},
				hidden: game => !game.sceneData.about,
				onRefresh: game => {
					if (game.sceneData.about) {
						if (game.now - game.sceneData.scrollTime > 55000) {
							game.sceneData.notAbout = game.now;
							game.sceneData.about = 0;
							game.playTheme(SOUNDS.FUTURE_SONG_THEME, {volume: .5});
							game.currentScene.onStartDialog(game);
						}
					}
				},
			},
		],
		onStartDialog: game => {
			const backSelection = {
				msg: "Back",
				onSelect: (game, dialog) => dialog.index = 0,
			};
			game.startDialog({
				time: game.now,
				index: 0,
				highlightColor: "#00998899",
				conversation: [
					{
						options: [
							{
								hidden: ({sceneData}) => Object.keys(sceneData.loadSave).length,
							},
							{
								msg: "New Game",
								onSelect: game => {
									game.dialog = null;
									game.hideCursor = true;
									const fadeDuration = 3000;
									game.fadeOut(game.now, {duration:fadeDuration * 1.5, fadeDuration, color:"#000000", onDone: game => {
										game.gotoScene("origin");
									}});
								}
							},
							{
								hidden: ({sceneData}) => !Object.keys(sceneData.loadSave).length,
								msg: "Load",
								onSelect: (game, dialog) => dialog.index = 2,
							},
							{
								msg: "Options",
								onSelect: (game, dialog) => dialog.index = 1,
							},
						],
					},
					{
						offsetY: (game, {options}) => (options.length - 3) * -7,
						options: [
							{
								msg: "About this game",
								onSelect: (game, dialog) => {
									game.sceneData.about = game.now;
									game.sceneData.notAbout = 0;
									game.playTheme(SOUNDS.F1, {volume:.2});
									game.sceneData.scrollTime = game.now;
									game.dialog = null;
								},
							},
							{
								msg: game => `Sound ~${!game.mute?"ON":"OFF"}`,
								onSelect: (game, dialog) => game.mute = !game.mute,
							},
							{
								msg: () => `Retro mode ~${scanlines[0].checked?"ON":"OFF"}`,
								onSelect: (game, dialog) => toggleScanlines(),
							},
							{
								msg: "Language",
								onSelect: (game, dialog) => game.showTip("Option not yet available"),
							},
							backSelection,
						],
					},
					{
						options: [
							{},
							{},
							backSelection,
						],
					}
				],
			});
		},
		onScene: game => {
			game.delayAction(game => {
				game.playTheme(SOUNDS.FUTURE_SONG_THEME, {volume: .5});
				const list = game.getSaveList();
				game.sceneData.loadSave = {};
				for (let name in list) {
					if (name !== "last") {
						const { image } = list[name];
						const img = new Image();
						img.src = image;
						game.sceneData.loadSave[name] = { img, name, };
					}
				}

				game.currentScene.onStartDialog(game);
				game.gameLoaded = true;
			}, 1000);
		},
	},
);
