game.addScene(
	{
		name: "gangsta-check-cards",
		onScene: game => {
			game.currentScene.startTalk(game, "bodyguard", [
				"Boss, that's odd.",
				"He has the same card as you boss.",
				"Is that normal?",
			], game => {
				game.sceneData.showCard = game.now;
				game.delayAction(game => {
					game.sceneData.showCard = 0;
					game.sceneData.dickMad = game.now;
					game.currentScene.startTalk(game, "bodyguard", [
						"Boss, are you ok?",
					], game => {
						game.sceneData.zoomDick = game.now;
						game.playTheme(null);
						game.currentScene.startTalk(game, "dick", [
							"You... ",
							"... BASTARD!",
						], game => {
							game.gotoScene("gangsta-shootout");
						});
					});
				}, 3000);
			});
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "dick") {
				x = 2;
				y = 64;
				game.playSound(SOUNDS.GRUMP);				
			} else if (talker === "bodyguard") {
				x = 2;
				y = 45;				
				game.playSound(SOUNDS.YES_BOSS);
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		sprites: [
			{
				src: ASSETS.GANGSTA_CHECK_CARDS,
				index: ({sceneData}) => sceneData.dickMad ? 1 : 0,
				side: LEFT,
			},
			{
				src: ASSETS.GANGSTA_CHECK_CARDS,
				index: ({pendingTip, now}) => pendingTip && pendingTip.talker === "bodyguard" && pendingTip.progress < 1 ? Math.floor(now / 80) % 2 : 0,
				side: RIGHT,
			},
			{
				src: ASSETS.GANGSTA_CHECK_CARDS,
				index: 2,
				hidden: game => !game.sceneData.showCard,
			},
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#990000";
					ctx.fillRect(0, 0, 64, 64);
				},
				hidden: game => !game.sceneData.zoomDick,
			},
			{
				src: ASSETS.ZOOM_DICK_MAD,
				index: ({pendingTip, now}) => pendingTip && pendingTip.talker === "dick" && pendingTip.progress < 1 ? Math.floor(now / 80) % 4 : 0,
				hidden: game => !game.sceneData.zoomDick,
			},
		],
	},
);