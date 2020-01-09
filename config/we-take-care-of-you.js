game.addScene(
	{
		name: "we-take-care-of-you",
		onScene: game => {
			game.playTheme(null);
			game.startDialog({
				conversation: [
					{
						options: [
							{
								msg: "We'll take care",
								onSelect: game => {
									game.dialog = null;
									game.playSound(SOUNDS.HUM);
									game.showTip([
										"Don't worry.",
										"We will take care of you,\nBaby Hitler."
									], game => {
										game.sceneData.showBoy = game.now;
										game.delayAction(game => game.sceneData.boySmile = game.now, 2500);
										game.delayAction(game => game.sceneData.showBoy = 0, 5000);
									}, null, { talker: "human"});
								},
							},
							{
								msg: "Don't move",
								onSelect: game => {
									game.dialog = null;
									game.playSound(SOUNDS.HUM);
									game.showTip([
										"Don't go\nanywhere.",
										"You should stay with us,\nBaby Hitler.",
									], game => {
										game.sceneData.showBoy = game.now;
										game.delayAction(game => game.sceneData.boySmile = game.now, 2500);
										game.delayAction(game => game.sceneData.showBoy = 0, 5000);
									}, null, { talker: "human"});
								},
							},
							{
								msg: "I'll protect you",
								onSelect: game => {
									game.dialog = null;
									game.playSound(SOUNDS.HUM);
									game.showTip([
										"I'm here to protect you.",
										"Don't you worry,\nBaby Hitler."
									], game => {
										game.sceneData.showBoy = game.now;
										game.delayAction(game => game.sceneData.boySmile = game.now, 2500);
										game.delayAction(game => game.sceneData.showBoy = 0, 5000);
									}, null, { talker: "human"});
								},
							},
						],
					},
				],
			});
		},
		onSceneRefresh: game => {
			if (!game.sceneData.lastCrowd || game.now - game.sceneData.lastCrowd > 1000) {
				game.playSound(SOUNDS.RANDOM, {volume: .15});		
				game.sceneData.lastCrowd = game.now + Math.random() * 1000 + 500;		
			}
		},
		sprites: [
			{
				src: ASSETS.HITMAN_FROM_ABOVE,
				index: ({pendingTip, now}) => {
					return pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0;
				},
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: .7,
				offsetY: -5,
				offsetX: 20,
				index: ({pendingTip, now}) => {
					return pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0;
				},
			},
			{
				src: ASSETS.BOY_SMILE,
				index: game => {
					if (game.sceneData.boySmile) {
						return 2;
					}
					return Math.floor(game.now / 100) % 20 === 0 ? 1 : 0;
				},
				hidden: game => !game.sceneData.showBoy,
			},
		],
	},
);