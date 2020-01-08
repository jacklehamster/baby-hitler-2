game.addScene(
	{
		name: "explore-tavern",
		arrowGrid: [
			[null, null,  MENU,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ BACKWARD, BACKWARD, null,   null, null ],
		],
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
		onSceneBackward: game => {
			game.fadeToScene("tavern-entrance");
		},
		canGo: (game, direction) => {
			if (direction === BACKWARD) {
				return game.situation.shift > -20;
			}
			if (direction === RIGHT) {
				return game.situation.shift > -64;
			}
			if (direction === LEFT) {
				return game.situation.shift < 0;
			}
			return false;
		},
		onScene: game => {
			game.save();
			game.playTheme(SOUNDS.TURTLE_SONG_THEME, {volume: .7});
			if (!game.situation.shift) {
				game.situation.shift = 0;
			}
			game.sceneData.noTurn = true;
		},
		onSceneRefresh: game => {
			if (game.mouse && game.mouse.x > 64 - 5 || game.actionDown === RIGHT) {
				game.situation.shift -= .3;
				game.situation.shift = Math.max(-64, Math.min(0, game.situation.shift));
			} else if (game.mouse && game.mouse.x < 5 || game.actionDown === LEFT) {
				game.situation.shift += .3;
				game.situation.shift = Math.max(-64, Math.min(0, game.situation.shift));				
			}
		},
		sprites: [
			{	//	Phone booth
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: 4,
				offsetX: game => Math.round(game.situation.shift),
				tip: "There's a phone booth in the corner.",
				onClick: game => {
					game.gotoScene("tavern-phone");
				},
			},
			{	//	Stage
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: 5,
				offsetX: game => Math.round(game.situation.shift),
				tip: "There are two musicians on stage, playing a funky tune.",
				onClick: game => {

				},
			},
			{	//	Gangsta table
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: 6,
				offsetX: game => Math.round(game.situation.shift),
				tip: game => game.situation.confirmDick
					? "That's Dick Ruber's table." : "I bet that's Dick Ruber's table.",
				onClick: game => {
					game.gotoScene("gangsta-table");
				},
			},
			{	//	Bar
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: 7,
				offsetX: game => Math.round(game.situation.shift),
				tip: game => game.getSituation("tavern-phone").yupaAndBrutus
					? "One bodyguard is busy talking to Yupa.\nThis should help dealing with Dick." : "The bartender is talking with a drunk customer.",
				onClick: game => {

				},
			},
			{
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: game => Math.floor(game.now / 500) % 2,
				offsetX: game => Math.round(game.situation.shift),
			},
			{
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: 10,
				offsetX: game => Math.round(game.situation.shift),
				hidden: game => !game.getSituation("tavern-phone").yupaAndBrutus,
			},
			{
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 6,
				index: game => {
					if (game.getSituation("tavern-phone").yupaAndBrutus) {
						return 8;
					}
					return 9;
				},
				offsetX: game => Math.round(game.situation.shift),
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);