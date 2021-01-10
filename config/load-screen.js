gameConfig.scenes.push(
	{
		name: "load-screen",
		startScene: true,
		onScene: game => {
			game.waitCursor = true;
			game.sceneData.startTime = game.now;
			game.sceneData.estimate = 3600000;
		},
		onSceneRefresh: game => {
			const progress = game.currentScene.getProgress(game);
			if (progress < 1 && game.now > game.sceneData.startTime) {
				const progressSpeed = progress / (game.now - game.sceneData.startTime);
				const estimate = (1 - progress) / progressSpeed;
				if (Math.abs(game.sceneData.estimate - estimate) > 10000 || estimate < game.sceneData.estimate) {
					// game.sceneData.estimate = estimate;
				}
			} else if(game.now > game.sceneData.startTime && game.waitCursor) {
				game.waitCursor = false;
				game.countLoadError = 0;
				console.log(`${game.now / 1000} sec.`);
			}
		},
		getProgress: game => {
			const numAssetsLoaded = game.countAssets(true);
			const totalAssets = game.countAssets();
			return (numAssetsLoaded) / (totalAssets);
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#000000";
					ctx.fillRect(0, 0, 64, 64);					
				},
				hidden: game => game.currentScene.getProgress(game) < 1,
				onClick: game => {
					if (!game.sceneData.gameStarted) {
						game.playSound(SOUNDS.RANDOM);
						game.sceneData.gameStarted = game.now;
						game.delayAction(game => {
							game.gotoScene("start-screen");
							game.save("clear");
						}, 1000);
					}
				}
			},
			{
				custom: (game, sprite, ctx) => {
					const progress = game.currentScene.getProgress(game);
					ctx.clearRect(0, 0, 64, 64);
					ctx.globalAlpha = .08 * progress;
					for (let i= 0; i < 10; i++) {
						game.displayTextLine(ctx, {
							msg: "dobuki studio game",
							x: 1, y: 2 + i * 6,
						});
					}
					ctx.globalAlpha = 1;

					if (progress < 1) {
						ctx.fillStyle = "#003377";
						ctx.fillRect(5, 35, 51, 2);
						ctx.fillStyle = "#999999";
						ctx.fillRect(5, 35, 1 + progress * 50, 2);

						game.displayTextLine(ctx, {
							msg: "Loading~." + (game.now % 1500 < 500 ? "" : game.now % 1500 < 1000 ? "." : ".."),
							x: 15, y: 26,
						});
						if (game.sceneData.estimate < 3600000 && Math.floor(game.sceneData.estimate / 1000) > 0) {
							game.displayTextLine(ctx, {msg: Math.floor(game.sceneData.estimate / 1000) + "~ sec", x:18, y:40});
						}
						const numAssetsLoaded = game.countAssets(true);
						const totalAssets = game.countAssets();
						game.displayTextLine(ctx, {msg: `${numAssetsLoaded} / ${totalAssets}`, x: 1, y: 52, alpha: .2, noTranslate: true});
						if (game.sceneData.lastFileLoaded) {
							game.displayTextLine(ctx, {msg: game.sceneData.lastFileLoaded.split(".")[0], x: 1, y: 58, alpha: .2, noTranslate: true});
						}
					}
				},
			},
			{
				hidden: game => {
					const numScenesLoaded = game.config.scenes.length;
					const totalScenes = game.getSceneCount();
					if (numScenesLoaded >= totalScenes) {
						const progress = game.currentScene.getProgress(game);
						return progress < 1;
					}
					return true;
				},
				custom: (game, sprite, ctx) => {
					ctx.globalAlpha = 1;

					if (GAME_VERSION === 3) {
						game.displayTextLine(ctx, {
							msg: "Baby Hitler is",
							x: 8, y: 12});
						game.displayTextLine(ctx, {
							msg: "OUT OF",
							x: 18, y: 19});
						game.displayTextLine(ctx, {
							msg: "CONTROL!",
							x: 14, y: 26});

					} else {
						game.displayTextLine(ctx, {
							msg: "Where in Space",
							x: 8, y: 15});
						game.displayTextLine(ctx, {
							msg: "is Baby Hitler?",
							x: 9, y: 22});
					}


					ctx.globalAlpha = .2;
					game.displayTextLine(ctx, {
						msg: "a game by",
						x: 17, y: 40,
					});
					game.displayTextLine(ctx, {
						msg: "Jack Le Hamster",
						x: 5, y: 47,
					});
					ctx.globalAlpha = 1;
				},
			},
			{
				custom: (game, sprite, ctx) => {
					const fade = Math.min(1, (game.now - game.sceneData.gameStarted) / 1000);
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
				hidden: game => !game.sceneData.gameStarted,
			},
			{
				src: game => game.sceneData.lastFileLoaded,
				scale: 1/16,
				offsetX: 60,
				offsetY: 52,
				alpha: .5,
				hidden: game => game.currentScene.getProgress(game) >= 1 || !game.sceneData.lastFileLoaded || game.sceneData.lastFileLoaded.indexOf("assets/") !== 0,
			},
		],	
	}
);