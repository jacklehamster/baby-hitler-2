game.addScene(
	{
		name: "ernest",
		onScene: game => {
			game.waitCursor = true;
			game.delayAction(game => {
				game.currentScene.startTalk(game, "ernest", [
					"Greetings. I will be your dealer for tonight.",
					"I can assure you, I will remain impartial throughout the whole game.",
				], game => {
					game.sceneData.zoomDick = game.now;
					game.currentScene.startTalk(game, "dick", [
						"Go ahead, Ernest. Deal us the cards.",
						"We're playing WAR!",
					], game => {
						game.sceneData.zoomDick = 0;
						game.currentScene.startTalk(game, "ernest", [
							"Right away sir.",
						], game => {
							game.sceneData.shuffling = game.now;
							game.delayAction(game => {
								game.sceneData.shiftyEyes = game.now;
							}, 4000);
							game.delayAction(game => {
								game.sceneData.shiftyEyes = 0;
							}, 8000);
							game.delayAction(game => {
								game.sceneData.shuffling = 0;
								game.gotoScene("ernest-card-dealing");
							}, 12000);
						});
					});
				});
			}, 1500);
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "ernest") {
				x = 2;
				y = 50;
				game.playSound(SOUNDS.YES_SIR);
			} else if (talker === "dick") {
				x = 2;
				y = 24;
				game.playSound(SOUNDS.GRUMP);				
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#453737";
					ctx.fillRect(0, 0, 64, 64);
				},
			},
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#816d45";
					ctx.fillRect(0, 47, 64, 17);
					ctx.fillStyle = "black";
					ctx.fillRect(0, 46, 64, 1);
				},
				hidden: game => game.sceneData.zoomDick,
			},
			{
				src: ASSETS.ERNEST, col: 2, row: 3,
				offsetX: game => {
					const d = Math.min(0, game.now - game.sceneTime - 1000) / 50;
					return -d*d;
				},
				index: ({pendingTip, now}) => {
					if (pendingTip && pendingTip.talker === "ernest" && pendingTip.progress < 1) {
						return Math.floor(now / 100) % 4;
					}
					return 0;					
				},
				hidden: game => game.sceneData.zoomDick,
			},
			{//	cards
				src: ASSETS.ERNEST, col: 2, row: 3,
				index: 4,
				offsetY: 2,
				hidden: game => game.sceneData.zoomDick,
			},
			{
				src: ASSETS.ZOOM_DICK,
				index: game => {
					if (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "dick") {
						return Math.floor(game.now / 100) % 4;
					}
					return 0;
				},
				hidden: game => !game.sceneData.zoomDick,
			},		
			{
				src: ASSETS.SHUFFLE_CARDS, col: 3, row: 3,
				index: game => Math.floor(game.now/100) % 7,
				hidden: game => !game.sceneData.shuffling,
				onRefresh: (game, sprite) => {
					const index = game.evaluate(sprite.index);
					if (index < 5 && (!game.sceneData.lastShuffleSound || game.now - game.sceneData.lastShuffleSound > 50)) {
						game.playSound(SOUNDS.HIT, {volume: game.sceneData.shiftyEyes ? .05 : .1});
						game.sceneData.lastShuffleSound = game.now;
					}
				},
			},
			{
				src: ASSETS.SHIFTY_EYES,
				index: game => Math.round((Math.sin(game.now/100) + 1) / 2 * 3),
				hidden: game => !game.sceneData.shiftyEyes,				
			},
		],
	},
);