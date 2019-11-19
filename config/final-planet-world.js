gameConfig.scenes.push(
	{		
		name: "final-planet-world",
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
			game.sceneData.forwardUnlocked = true;
			game.sceneData.freeFormMove = true;
			game.sceneData.finalTarget = { x: 230, y: -350 };
		},
		onSceneRefresh: game => {
			if (game.mouseDown) {
				if (game.dialog === null && (!game.hoverSprite || !game.hoverSprite.blockMove)) {
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
			}

			// if (game.arrow && game.mouseDown) {
			// 	const angle = game.rotation / 8 * Math.PI * 2;
			// 	const rx = Math.cos(angle), ry = Math.sin(angle);

			// 	switch(game.arrow) {
			// 		case FORWARD:
			// 			game.pos.x -= .05 * ry;
			// 			game.pos.y -= -.05 * rx;
			// 			break;
			// 		case BACKWARD:
			// 			game.pos.x += .05 * ry;
			// 			game.pos.y += -.05 * rx;
			// 			break;
			// 		case LEFT:
			// 			game.rotation += .05;
			// 			game.rotation = (game.rotation + 8) % 8;
			// 			break;
			// 		case RIGHT:
			// 			game.rotation -= .05;
			// 			game.rotation = (game.rotation + 8) % 8;
			// 			break;
			// 	}
			// }
		},
		onSceneForward: game => {
			return true;
		},		
		onSceneBackward: game => {
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
				offsetX: game => 64 * (game.rotation % 2) + 128,
			},
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 64 * (game.rotation % 2) + 64,
			},
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 64 * (game.rotation % 2),
			},
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 64 * (game.rotation % 2) - 64,
			},
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
				offsetX: game => 64 * (game.rotation % 2) - 128,
			},
			{
				custom: (game, sprite, ctx) => {
					const [ moonX, moonY ] = [ 0 - game.pos.x, -1000 - game.pos.y ];
					const dist = Math.sqrt(moonX*moonX + moonY*moonY);
					const size = 5 * 1000 / dist;
					const outline = size / 5 * 7;
					const rot = game.rotation - 4;
					ctx.fillStyle = "#ffffff11";
					ctx.beginPath();
					ctx.arc(20 + rot * 64, 20, outline, 0, 2 * Math.PI);
					ctx.fill();
					ctx.fillStyle = "#ffffff";
					ctx.beginPath();
					ctx.arc(20 + rot * 64, 20, size, 0, 2 * Math.PI);
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
					return 64 * ((rot + 4) % 8 - 4) - 64;
				}
			},
			{
				src: ASSETS.MOUNTAINS, col: 1, row: 2,
				offsetY: -24,
				alpha: .6,
				index: 1,
				offsetX: game => {
					const rot = game.rotation;
					return 64 * ((rot + 6) % 8 - 4) - 64;
				}
			},
			{
				init: game => {},
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
									displayTemplate.offsetX = 32 - 32 * displayTemplate.scale + scale * dx * 10 * 5;
									displayTemplate.offsetY = 40 - 32 * displayTemplate.scale + scale * 10;
									game.displayImage(ctx, displayTemplate);
								}
							}
						}
					}
				},
			},
			// {
			// 	init: game => {},
			// 	getTileIndex: (game, x, y) => {
			// 		return Math.floor((Math.sin(x) + Math.cos(y)) * 1000000) % 17;
			// 	},
			// 	displayTemplate: {
			// 		src: ASSETS.PLANET_ITEMS,
			// 		col: 3, row: 4, size: [128, 128],
			// 	},
			// 	custom: (game, sprite, ctx) => {
			// 		const { pos } = game;

			// 		const { displayTemplate } = sprite;
			// 		const angle = game.rotation / 8 * Math.PI * 2;
			// 		const rx = Math.cos(angle), ry = Math.sin(angle);

			// 		const commonTemplate = game.currentScene.getTemplate(game, Math.round(pos.x / 20) * 20, Math.round((pos.y-5) / 20) * 20 + 5);

			// 		for (let y = Math.floor(pos.y-5); y < pos.y+5; y++) {
			// 			for (let x = Math.floor(pos.x-5); x < pos.x+5; x++) {
			// 				const index = sprite.getTileIndex(game, x, y);
			// 				if (index <= 11) {
			// 					const absoluteDx = x - pos.x;
			// 					const absoluteDy = y - pos.y;
			// 					const dx = rx * absoluteDx + ry * absoluteDy;
			// 					const dy = ry * absoluteDx - rx * absoluteDy + 2;
			// 					if (dy < 2) {									
			// 						const scale = Math.pow(2, dy);
			// 						displayTemplate.index = index;
			// 						displayTemplate.scale = commonTemplate.scale / 2;
			// 						displayTemplate.offsetX = 32 - 32 * displayTemplate.scale + scale * dx * 10 * 5;
			// 						displayTemplate.offsetY = 40 - 32 * displayTemplate.scale + scale * 10;
			// 						game.displayImage(ctx, displayTemplate);
			// 					}
			// 				}
			// 			}
			// 		}
			// 	},
			// },
			{
				src: ASSETS.SPACESHIP, col: 1, row: 2,
				scale: game => game.sceneData.spaceshipTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.spaceshipTemplate;
					return 32 - 32 * scale/2 + scale * dx * 10 * 5;
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
				src: ASSETS.PLANET_ITEMS, col: 3, row: 4, size: [128,128],
				scale: game => game.sceneData.signTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.signTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 5;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.signTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 30);
				},
				getLocation: (game, x, y) => {
					return [ Math.round(x / 20) * 20, Math.round((y-5) / 20) * 20 + 5 ];
				},
				onRefresh: (game, sprite) => {
					const { pos } = game;
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					game.sceneData.signTemplate = game.currentScene.getTemplate(game, xLoc, yLoc);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game, sprite);
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.signTemplate;
					return dy >= 2 ? -1 : 0;
				},
				tip: (game, sprite) => {
					const { pos } = game;
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					const dx = game.sceneData.finalTarget.x - xLoc;
					const dy = game.sceneData.finalTarget.y - yLoc;
					return `“Westrow's tavern is ${Math.abs(dx)}m ${dx<0?"West":"East"} and ${Math.abs(dy)}m ${dy<0?"South":"North"} from here”`;
				},
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 3, row: 4, size: [128,128],
				scale: game => game.sceneData.nomadTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.nomadTemplate;
					return 32 - 64 * scale / 2 + scale * dx * 10 * 5;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.nomadTemplate;
					return 40 - 64 * scale / 2 + scale * (10 - 30);
				},
				onRefresh: (game, sprite) => {
					const { pos } = game;
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					game.sceneData.nomadTemplate = game.currentScene.getTemplate(game, xLoc, yLoc);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game, sprite);
					if (!game.situation.talkedAbout) {
						game.situation.talkedAbout = {};
					}
					if (!game.sceneData.seenNomad) {
						game.sceneData.seenNomad = {};
					}
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.nomadTemplate;
					return dy >= 2 ? -1 : 1;
				},
				getLocation: (game, x, y) => {
					return [ Math.round((x-10) / 23) * 23 + 10, Math.round((y-5) / 23) * 23 + 5 ];
				},
				hidden: (game, sprite) => {
					const { pos } = game;
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					return game.sceneData.seenNomad[`${xLoc}_${yLoc}`];
				},
				onClick: (game, sprite) => {
					game.pendingTip = null;
					game.startDialog({
						time: game.now,
						index: 0,
						conversation: [
							{
								options: [
									{
										msg: "Ask direction",
										onSelect: game => {
											game.showTip(`You are currently facing ${game.getOrientationText()}.`, null, null, {removeLock:true});
											game.dialog = null;
										},
									},
									{
										msg: "Ask info",
										onSelect: game => {
											game.dialog.index ++;
										}
									},
									{
										msg: "LEAVE", onSelect: game => {
											game.dialog = null;
										}
									},
								],
							},
							{
								options: [
									{
										msg: "The moon...",
										onSelect: game => {
											game.showTip([
													"That bright shiny object is the sky is Westrow's moon.",
													"You can see it by looking south.",
												], game => {
													const { pos } = game;
													const { x, y } = pos;
													const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
													game.sceneData.seenNomad[`${xLoc}_${yLoc}`] = game.now;
												}, null, {removeLock:true}
											);
											game.dialog = null;
										},
									},
									{
										msg: "Nomads...",
										hidden: game => game.situation.talkedAbout.tavern,
										onSelect: game => {
											game.showTip([
													"That bright shiny object is the sky is Westrow's moon.",
													"You can see it by looking south.",
												], game => {
													const { pos } = game;
													const { x, y } = pos;
													const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
													game.sceneData.seenNomad[`${xLoc}_${yLoc}`] = game.now;
													game.situation.talkedAbout.tavern = game.now;
												}, null, {removeLock:true}
											);
											game.dialog = null;
										},
									},
									{
										msg: "The Tavern...",
										hidden: game => !game.situation.talkedAbout.tavern || game.situation.talkedAbout.password,
										onSelect: game => {
											game.showTip([
													"You can't get inside Westrow's tavern without the password.",
													"Unfortunately I don't know it.",
												], game => {
													const { pos } = game;
													const { x, y } = pos;
													const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
													game.sceneData.seenNomad[`${xLoc}_${yLoc}`] = game.now;
													game.situation.talkedAbout.password = game.now;
												}, null, {removeLock:true}
											);
											game.dialog = null;
										},
									},
									{
										msg: "Tavern Password",
										hidden: game => !game.situation.talkedAbout.password || game.situation.talkedAbout.blackCloth,
										onSelect: game => {
											game.showTip([
													"I don't know the password.",
													"I think one of the nomad does though.",
													"He likes to dress in a pitch black cloth.",
												], game => {
													const { pos } = game;
													const { x, y } = pos;
													const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
													game.sceneData.seenNomad[`${xLoc}_${yLoc}`] = game.now;
													game.situation.talkedAbout.blackCloth = game.now;
												}, null, {removeLock:true}
											);
											game.dialog = null;
										},
									},
									{
										msg: "Black cloth nomad",
										hidden: game => !game.situation.talkedAbout.blackCloth,
										onSelect: game => {
											game.showTip([
													`I think I've seen him, near the tavern.`,
													"I think he lives near the east",
												], game => {
													const { pos } = game;
													const { x, y } = pos;
													const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
													game.sceneData.seenNomad[`${xLoc}_${yLoc}`] = game.now;
												}, null, {removeLock:true}
											);
											game.dialog = null;
										},										
									},
								],
							},
						],
					});
				},
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 3, row: 4, size: [128,128],
				scale: game => game.sceneData.treeTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.treeTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 5;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.treeTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 30);
				},
				onRefresh: game => {
					const { pos } = game;
					const { x, y } = pos;
					game.sceneData.treeTemplate = game.currentScene.getTemplate(game, Math.round((x) / 30) * 30, Math.round((y-15) / 30) * 30 + 15);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game);
				},
				index: game => {
					const { dx, dy, scale } = game.sceneData.treeTemplate;
					return dy >= 2 ? -1 : 6;
				},
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 3, row: 4, size: [128,128],
				scale: game => game.sceneData.templeTemplate.scale / 2,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.templeTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 5;
				},
				offsetY: game => {
					const { dx, dy, scale } = game.sceneData.templeTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 30);
				},
				onRefresh: game => {
					const { pos } = game;
					const { x, y } = pos;
					game.sceneData.templeTemplate = game.currentScene.getTemplate(game, game.sceneData.finalTarget.x, game.sceneData.finalTarget.y);
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