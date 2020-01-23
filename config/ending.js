game.addScene(
	{
		name: "ending",
		onScene: game => {
			game.hideCursor = true;
			game.playTheme(null);
			game.delayAction(game => {
				game.currentScene.startTalk(game, "human", [
					"We did it Yupa!",
					"We defeated Dick Ruber's gang.",
				], game => {
					game.currentScene.startTalk(game, "yupa", [
						`Yu da man,\n~${game.data.name||"hitman"}`,
						"Naice wok wid dat gun bak there.",
					], game => {
						game.sceneData.hitmanToYupa = game.now;
						game.delayAction(game => {
							game.sceneData.yupaToHitman = game.now;
						}, 1000);
						game.currentScene.startTalk(game, "human", [
							"How did you bring the\nspacehip here?",
						], game => {
							game.currentScene.startTalk(game, "yupa", [
								"Pisca cake!",
							], game => {
								game.sceneData.holdRemote = game.now;
								game.currentScene.startTalk(game, "yupa", [
									"I olways bring remothe wid mi",
									"To coll Electra.",
								], game => {
									game.currentScene.startTalk(game, "human", [
										"Great! Now that we finally found Baby Hitler,",
										"We can go back to Earth.",
									], game => {
										game.gotoScene("not-so-fast");
									});
								});
							});
						});
					});
				});
			}, 5000);
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "yupa") {
				x = 2;
				y = 63;
				game.playSound(SOUNDS.YUPA);
			} else if (talker === "human") {
				x = 8;
				y = 63;
				game.playSound(SOUNDS.HUM);				
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
			},
			{
				src: ASSETS.WE_DID_IT, col: 4, row: 5,
			},
			{	//	yupa
				src: ASSETS.WE_DID_IT, col: 4, row: 5,
				index: game => {
					const base = game.sceneData.yupaToHitman ? 13 : 5;
					return base + (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "yupa" ? Math.floor(game.now / 100) % 4 : 0);
				},
			},
			{	//	human
				src: ASSETS.WE_DID_IT, col: 4, row: 5,
				index: 17,
				hidden: game => !game.sceneData.holdRemote,
			},
			{	//	human
				src: ASSETS.WE_DID_IT, col: 4, row: 5,
				index: game => {
					const base = game.sceneData.hitmanToYupa ? 9 : 1;
					return base + (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "human" ? Math.floor(game.now / 100) % 4 : 0);
				},
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: 1.4,
				offsetX: -5,
				offsetY: -20,
				index: game => game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "human" ? Math.floor(game.now / 100) % 4 : 0,
			},
		],
	},
);