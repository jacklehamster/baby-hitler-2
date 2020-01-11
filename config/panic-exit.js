game.addScene(
	{
		name: "panic-exit",
		onScene: game => {
			game.hideCursor = true;
			game.playTheme(null);
		},
		onSceneRefresh: game => {
			if (!game.sceneData.lastCrowd || game.now - game.sceneData.lastCrowd > 1000) {
				game.playSound(SOUNDS.RANDOM, {volume: .15});		
				game.sceneData.lastCrowd = game.now + Math.random() * 1000 + 500;		
			}
		},
		sprites: [
			{
				src: ASSETS.PANIC_EXIT_BACKGROUND,
				index: game => Math.min(Math.max(0, Math.floor((game.now - game.sceneTime - 3000)/100)), 5),
			},
			{
				src: ASSETS.PANIC_EXIT_YUPA,
				index: game => game.pendingTip && game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 5 : 0,
				init: game => {
					game.playSound(SOUNDS.YUPA);
					game.showTip([
						`${game.data.name || "Hitman"}!`,
						"Da rest of da gang is caming!",
						"Gat reddy for a big faight!",
					], game => {
						game.gotoScene("bring-it-on");
					});
				},
			},
			... new Array(50).fill(null).map((dummy, idx) => {
				const runTime = idx * 200;
				const runner_index = Math.floor(Math.random() * 12);
				return {
					src: ASSETS[`PANIC_EXIT_RUNNER_${runner_index}`],
					index: (game, sprite) => {
						const frame = Math.floor((game.now - (runTime + game.sceneTime))/80);
						return frame;
					},
					hidden: game => {
						const frame = Math.floor((game.now - (runTime + game.sceneTime))/80);
						return frame < 0 || frame > 5;
					},
				};
			}),
		],
	},
);