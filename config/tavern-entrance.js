gameConfig.scenes.push(
	{
		name: "tavern-entrance",
		onScene: game => {
			game.save();
			if (!game.situation.shift) {
				game.situation.shift = 0;
			}
		},
		onSceneRefresh: game => {
			if (game.mouse && game.mouse.x > 64 - 5) {
				game.situation.shift -= .3;
				game.situation.shift = Math.max(-64, Math.min(0, game.situation.shift));
			} else if (game.mouse && game.mouse.x < 5) {
				game.situation.shift += .3;
				game.situation.shift = Math.max(-64, Math.min(0, game.situation.shift));				
			}
		},
		customCursor: (game, ctx) => {
			if (game.mouse) {
				const { x, y } = game.mouse;
				if (x > 64 - 5 && game.situation.shift > -64) {
					game.displayImage(ctx, { src:ASSETS.ARROW_CURSOR, offsetX:x-5, offsetY:y-5, size: [11,11], col: 1, row: 2, index: 1 });
					return "none";
				} else if (x < 5 && game.situation.shift < 0) {
					game.displayImage(ctx, { src:ASSETS.ARROW_CURSOR, offsetX:x-5, offsetY:y-5, size: [11,11], col: 1, row: 2, index: 0 });
					return "none";
				}
			}
		},
		sprites: [
			{
				src: ASSETS.TAVERN_ENTRANCE, col: 2, row: 5, size: [128, 64],
				offsetX: game => Math.round(game.situation.shift),
				index: 0,
			},
			{
				src: ASSETS.TAVERN_ENTRANCE, col: 2, row: 5, size: [128, 64],
				offsetX: game => Math.round(game.situation.shift),
				index: game => {
					if (game.sceneData.openedDoor) {
						const time = game.now - game.sceneData.openedDoor;
						return Math.min(9, 7 + Math.floor(time / 200));
					}
					return 7;
				},
				onClick: game => {
					game.gotoScene("tavern-entrance-zoom");
				},
			},
			{
				src: ASSETS.TAVERN_ENTRANCE, col: 2, row: 5, size: [128, 64],
				offsetX: game => Math.round(game.situation.shift),
				index: 4,
				onClick: game => {
					game.gotoScene("tavern-posters");
				},
			},
			{
				src: ASSETS.TAVERN_ENTRANCE, col: 2, row: 5, size: [128, 64],
				offsetX: game => Math.round(game.situation.shift),
				index: game => Math.floor(game.now / 300) % 10 === 0 ? 2 : 1,
				onClick: game => {
					game.gotoScene("tavern-entrance-zoom");
				},
			},
			{
				src: ASSETS.TAVERN_ENTRANCE, col: 2, row: 5, size: [128, 64],
				offsetX: game => Math.round(game.situation.shift),
				offsetY: game => Math.round(Math.sin(game.now / 400) * 1.5), 
				index: 3,
				onClick: game => {
					game.gotoScene("tavern-entrance-zoom");
				},
			},
			{
				src: ASSETS.TAVERN_ENTRANCE, col: 2, row: 5, size: [128, 64],
				offsetX: game => Math.round(game.situation.shift),
				index: game => Math.floor(game.now / 300) % 13 === 5 ? 6 : 5,
				onClick: game => {

				},
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);
