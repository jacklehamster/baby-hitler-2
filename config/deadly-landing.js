game.addScene(
	{
		name: "deadly-landing",
		map: `
			XXXXXXXXX
			X5.C....X
			XXXXXXXXX
		`,
		onScene: game => {
			game.hideCursor = true;
			game.playTheme(null);
			game.playSound(SOUNDS.DIVING);
		},
		onSceneRefresh: game => {
			const frame = Math.floor((game.now - game.sceneTime) / 50);
			if (!game.sceneData.landed && frame-10 > 2) {
				game.sceneData.landed = game.now;
				game.sceneData.shakeTime = game.now;
				game.playSound(SOUNDS.HIT_LAND);
			}
			if (!game.data.yupa || game.data.yupa.inBottle) {
				if (!game.sceneData.showGameOver && frame > 150) {
					game.hideCursor = false;
					getMedal("Deep dive");
					game.gameOver(" “~You're no\n          Superman!”~");
				}
			} else {
				if (!game.sceneData.yupaTalked && frame > 150) {
					game.sceneData.yupaTalked = game.now;

					game.playSound(SOUNDS.YUPA);

					game.showTip("Whadda stupid...", game => {
						game.hideCursor = false;
						getMedal("Deep dive");
						game.gameOver();
					}, null, { talker: "yupa" });
				}
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => ctx.clearRect(0, 0, 64, 64),
			},
			...getCommonMaze("_1"),
			{
				src: ASSETS.CEILING_HOLE, col: 3, row: 4,
				hidden: game => !game.facingEvent() || !game.facingEvent().ceilinghole || game.rotation % 2 !== 0 || game.moving,
				index: game => {
					const frame = Math.floor((game.now - game.sceneTime) / 50);
					if (frame < 10) {
						return 0;
					}
					if (frame < 100 || !game.data.yupa || game.data.yupa.inBottle) {
						return 2 + Math.min(2, frame - 10);
					}
					if (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker==="yupa") {
						return 7 + Math.floor(game.now / 100) % 2;
					}
					return 5 + Math.min(1, frame - 100);
				},
			},
			...standardMenu(),
			...standardBag(),
		],
		doors: {
		},
		events: {
			'C': {
				ceilinghole: true,
				onEvent: (game, event) => {

				},
			},
		},
	},
);
