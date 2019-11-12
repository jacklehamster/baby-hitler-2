gameConfig.scenes.push(
	{		
		name: "final-planet-world",
		// arrowGrid: [
		// 	[ null, null, MENU,  null, null ],
		// 	[],
		// 	[ LEFT, null, s(11), null, RIGHT ],
		// 	[ LEFT, s(7), s(11), s(7), RIGHT ],
		// 	[ LEFT, s(7), s(9),  s(7), RIGHT ],
		// ],
		arrowGrid: [
			[ null, null, MENU,  null, null ],
			[],
			[],
			[],
			[ null, null, BAG, null, null ],
		],
		onScene: game => {
			game.save();
			game.playTheme(SOUNDS.MYSTICA_THEME, {volume: .6});
			game.pos = { x: 0, y: 0 };
//			game.sceneData.goal = { x: 0, y: 0 };
			game.sceneData.forwardUnlocked = true;
			game.sceneData.freeFormMove = true;
			// addEventListener("keydown", e => {
			// 	if (e.keyCode === 37) {
			// 		game.rotation = ((game.rotation - .2) + 8) % 8;
			// 	} else if (e.keyCode === 39) {
			// 		game.rotation = ((game.rotation + .2) + 8) % 8;
			// 	}
			// });
		},
		onSceneRefresh: game => {
			if (game.mouseDown) {
				const { mouse } = game;
				const mx = mouse.x - 32;
				const my = mouse.y - 40;
				game.rotation -= mx * .002;
				game.rotation = (game.rotation + 8) % 8;

				const angle = game.rotation / 8 * Math.PI * 2;
				const rx = Math.cos(angle), ry = Math.sin(angle);

				const mov = my * .002;
				game.pos.x += mov * ry;
				game.pos.y += -mov * rx;

			}

			if (game.arrow && game.mouseDown) {
				const angle = game.rotation / 8 * Math.PI * 2;
				const rx = Math.cos(angle), ry = Math.sin(angle);

				switch(game.arrow) {
					case FORWARD:
						game.pos.x -= .05 * ry;
						game.pos.y -= -.05 * rx;
						break;
					case BACKWARD:
						game.pos.x += .05 * ry;
						game.pos.y += -.05 * rx;
						break;
					case LEFT:
						game.rotation += .05;
						game.rotation = (game.rotation + 8) % 8;
						break;
					case RIGHT:
						game.rotation -= .05;
						game.rotation = (game.rotation + 8) % 8;
						break;
				}
			}
			// game.pos.x += (game.sceneData.goal.x - game.pos.x) / 10;
			// game.pos.y += (game.sceneData.goal.y - game.pos.y) / 10;
		},
		onSceneForward: game => {
			// const angle = game.rotation / 8 * Math.PI * 2;
			// const rx = Math.cos(angle), ry = Math.sin(angle);
			// const mx = - 1 * ry;
			// const my = + 1 * rx;
			// game.sceneData.goal.x = game.pos.x + mx;
			// game.sceneData.goal.y = game.pos.y + my;
			return true;
		},		
		onSceneBackward: game => {
			// const angle = game.rotation / 8 * Math.PI * 2;
			// const rx = Math.cos(angle), ry = Math.sin(angle);
			// const mx = + 1 * ry;
			// const my = - 1 * rx;
			// game.sceneData.goal.x = game.pos.x + mx;
			// game.sceneData.goal.y = game.pos.y + my;
			return true;
		},
		onSceneRotate: (game, arrow) => {
			return true;
		},
		getTemplate: (game, x, y) => {
			const { pos } = game;
			const angle = game.rotation / 8 * Math.PI * 2;
			const rx = Math.cos(angle), ry = Math.sin(angle);
			const absoluteDx = x - pos.x;
			const absoluteDy = y - pos.y;
			const dx = rx * absoluteDx + ry * absoluteDy;
			const dy = ry * absoluteDx - rx * absoluteDy + 2;
			const scale = Math.pow(2, dy);
			return { scale, dx, dy };
		},
		sprites: [
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 32 * (game.rotation % 2) + 64,
			},
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 32 * (game.rotation % 2),
			},
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 32 * (game.rotation % 2) - 64,
			},
			{
				custom: (game, sprite, ctx) => {
					const rot = game.rotation - 4;
					ctx.fillStyle = "#ffffff11";
					ctx.beginPath();
					ctx.arc(20 + rot * 32, 20, 7, 0, 2 * Math.PI);
					ctx.fill();
					ctx.fillStyle = "#ffffff";
					ctx.beginPath();
					ctx.arc(20 + rot * 32, 20, 5, 0, 2 * Math.PI);
					ctx.fill();
				},
			},
			{
				src: ASSETS.MOUNTAINS, col: 1, row: 2,
				offsetY: -24,
				alpha: .6,
				index: 0,
				offsetX: game => {
					const rot = game.rotation;
					return 32 * ((rot + 4) % 8 - 4) - 32;
				}
			},
			{
				src: ASSETS.MOUNTAINS, col: 1, row: 2,
				offsetY: -24,
				alpha: .6,
				index: 1,
				offsetX: game => {
					const rot = game.rotation;
					return 32 * ((rot + 6) % 8 - 4) - 32;
				}
			},
			{
				init: game => {
				},
				getTileIndex: (game, x, y) => {
					return Math.floor((Math.sin(x) + Math.cos(y)) * 1000000) % 17;
				},
				displayTemplate: {
					src: ASSETS.CRATER,
					col: 3, row: 3,
				},
				custom: (game, sprite, ctx) => {
					const { pos } = game;

					const { displayTemplate } = sprite;
					const angle = game.rotation / 8 * Math.PI * 2;
					const rx = Math.cos(angle), ry = Math.sin(angle);

					for (let y = Math.floor(pos.y-5); y < pos.y+5; y++) {
						for (let x = Math.floor(pos.x-5); x < pos.x+5; x++) {
							const index = sprite.getTileIndex(game, x, y);
							if (index < 9) {
								const absoluteDx = x - pos.x;
								const absoluteDy = y - pos.y;
								const dx = rx * absoluteDx + ry * absoluteDy;
								const dy = ry * absoluteDx - rx * absoluteDy + 2;
								if (dy < 2) {
									const scale = Math.pow(2, dy);
									displayTemplate.index = index;
									displayTemplate.alpha = scale;
									displayTemplate.scale = scale / 2;
									displayTemplate.offsetX = 32 - 32 * displayTemplate.scale + scale * dx * 10 * 4;
									displayTemplate.offsetY = 40 - 32 * displayTemplate.scale + scale * 10;
									game.displayImage(ctx, displayTemplate);
								}
							}
						}
					}
				},
			},
			{
				src: ASSETS.SPACESHIP, col: 1, row: 2,
				scale: game => game.sceneData.spaceshipTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.spaceshipTemplate;
					return 32 - 32 * scale/2 + scale * dx * 10 * 4;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.spaceshipTemplate;
					return 40 - 32 * scale/2 + scale * (10 - 5);
				},
				onRefresh: game => {
					game.sceneData.spaceshipTemplate = game.currentScene.getTemplate(game, 0, 1);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game);
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.spaceshipTemplate;
					return dy >= 2 ? -1 : 0;
				},
				tip: "We landed in the middle of nowhere!",
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 2, row: 2, size: [128,128],
				scale: game => game.sceneData.signTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.signTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 4;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.signTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 30);
				},
				onRefresh: game => {
					const { pos } = game;
					const { x, y } = pos;
					game.sceneData.signTemplate = game.currentScene.getTemplate(game, Math.round(x / 20) * 20, Math.round((y-5) / 20) * 20 + 5);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game);
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.signTemplate;
					return dy >= 2 ? -1 : 0;
				},
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 2, row: 2, size: [128,128],
				scale: game => game.sceneData.nomadTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.nomadTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 4;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.nomadTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 30);
				},
				onRefresh: game => {
					const { pos } = game;
					const { x, y } = pos;
					game.sceneData.nomadTemplate = game.currentScene.getTemplate(game, Math.round((x-10) / 30) * 30 + 10, Math.round((y-5) / 30) * 30 + 5);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game);
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.nomadTemplate;
					return dy >= 2 ? -1 : 1;
				},
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 2, row: 2, size: [128,128],
				scale: game => game.sceneData.templeTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.templeTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 4;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.templeTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 30);
				},
				onRefresh: game => {
					const { pos } = game;
					const { x, y } = pos;
					game.sceneData.templeTemplate = game.currentScene.getTemplate(game, Math.round((x) / 30) * 30, Math.round((y-15) / 30) * 30 + 15);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game);
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.templeTemplate;
					return dy >= 2 ? -1 : 2;
				},
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);