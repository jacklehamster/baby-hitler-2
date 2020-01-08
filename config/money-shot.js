game.addScene(
	{
		name: "money-shot",
		onScene: game => {
			game.hideCursor = true;
			game.playSound(SOUNDS.GOOD_BAD_UGLIZ);
			game.delayAction(game => {
				game.gotoScene("crowd");
			}, 6000);
		},
		sprites: [
			{
				src: ASSETS.MONEY_SHOT,
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: .7,
				offsetY: -5,
				offsetX: 30,
			},
			{
				src: ASSETS.MONEY_SHOT,
				index: 1,
				alpha: game => (Math.sin(game.now / 200) + 1) / 2,
			},
			{
				src: ASSETS.MONEY_SHOT,
				index: 2,
				alpha: game => (Math.sin(game.now / 200 + Math.PI*2/3) + 1) / 2,
			},
			{
				src: ASSETS.MONEY_SHOT,
				index: 3,
				alpha: game => (Math.sin(game.now / 200 + Math.PI*4/3) + 1) / 2,
			},
		],
	},
);