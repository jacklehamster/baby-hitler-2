game.addScene(
	{
		name: "tavern-posters",
		onScene: game => {
			game.waitCursor = true;
			game.showTip(["Hey, it looks like Yupa and I.", "We're worth a lot of money!"],
				game => {
					game.gotoScene("tavern-entrance");
				}
			);
		},
		sprites: [
			{
				src: ASSETS.POSTERS,
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				offsetY: -20,
				offsetX: -6.5,
				scale: .3,
				index: 0,
			},
		],
	},
);
