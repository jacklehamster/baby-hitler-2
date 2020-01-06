game.addScene(
	{
		name: "cards-showdown",
		onScene: game => {
			game.delayAction(game => {
				game.sceneData.showLeft = game.now;
				game.delayAction(game => {
					game.playSound(SOUNDS.HIT);
					game.sceneData.shakeTime = game.now;
				}, 200);
			}, 100);
			game.delayAction(game => {
				game.sceneData.showRight = game.now;
				game.delayAction(game => {
					game.playSound(SOUNDS.HIT);
					game.sceneData.shakeTime = game.now;
				}, 200);

				game.delayAction(game => {
					if (game.getSituation("ernest-card-dealing").aceOfHearts) {
						console.log("ACE OF HEARTS");
					} else {
						game.getSituation("ernest-card-dealing").lostGame = game.now;
						game.gotoScene("ernest-card-dealing");
					}
				}, 3000);
			}, 1500);
		},
		sprites: [
			{
				src: ASSETS.CARDS_SHOWDOWN, col: 2, row: 3,
				index: 2,
			},
			{
				src: ASSETS.CARDS_SHOWDOWN, col: 2, row: 3,
				index: 3,
				offsetY: game => {
					const speedFactor = 20;
					const time = game.now - game.sceneData.showLeft;					
					return Math.min(0, -100 + (time / speedFactor) * (time / speedFactor));
				},
				hidden: game => !game.sceneData.showLeft,
			},
			{
				src: ASSETS.CARDS_SHOWDOWN, col: 2, row: 3,
				index: game => game.getSituation("ernest-card-dealing").aceOfHearts ? 4 : 5,
				offsetY: game => {
					const speedFactor = 20;
					const time = game.now - game.sceneData.showRight;					
					return Math.min(0, -100 + (time / speedFactor) * (time / speedFactor));
				},
				hidden: game => !game.sceneData.showRight,
			},
		],
	},
);