game.addScene(
	{		
		name: "final-planet-world",
		arrowGrid: [
			[ null, null, MENU,  null, null ],
			[],
			[ null, null, null, null, null ],
			[ null, s(7), s(7), s(7), null ],
			[ null, s(7), BAG,  s(7), null ],
		],
		onScene: game => {
			game.save();
			game.playTheme(SOUNDS.MYSTICA_THEME, {volume: .6});
			if (!game.situation.firstStep) {
				game.situation.firstStep = game.now;
				game.pos = { x: 0, y: 0 };
			}
			game.sceneData.forwardUnlocked = true;
			game.sceneData.freeFormMove = true;
			game.sceneData.finalTarget = { x: 230, y: -350 };
			game.sceneData.nextFoe = 100;
		},
		onEscapeBattle: game => {
			game.battle = null;
			game.playTheme(null);
			game.sceneData.escaping = game.now;

			for (let i = 0; i < 5; i++) {
				game.delayAction(game => {
					game.playSound(SOUNDS.HIT, {volume:.3});
				}, 150 * i);				
			}

			game.delayAction(game => {
				game.playTheme(SOUNDS.MYSTICA_THEME, {volume: .6});
			}, 2000);
		},
		onSceneRefresh: game => {
			if (game.sceneData.leavingScene) {
				return;
			}
			if (game.sceneData.escaping && game.now - game.sceneData.escaping < 2000) {
				const angle = game.rotation / 8 * Math.PI * 2;
				const rx = Math.cos(angle), ry = Math.sin(angle);
				const speed = .2 * (1 - (game.now - game.sceneData.escaping) / 2000);
				game.pos.x += speed * ry;
				game.pos.y += -speed * rx;
				return;
			}

			if (game.mouseDown && !game.dialog && !game.pendingTip) {
				if (!game.hoverSprite || game.hoverSprite.allowMove) {
					const { mouse, pos } = game;
					const mx = mouse.x - 32;
					const my = mouse.y - 50;
					if (mx && game.canTurn(mx < 0 ? "left" : "right")) {
						game.rotation -= mx * .002;
						game.rotation = (game.rotation + 8) % 8;
					}

					if (my && game.canMove(pos, my<0 ? -1 : +1)) {
						const angle = game.rotation / 8 * Math.PI * 2;
						const rx = Math.cos(angle), ry = Math.sin(angle);

						const mov = Math.max(-.1, Math.min(.1, my * .010));
						game.pos.x += mov * ry;
						game.pos.y += -mov * rx;
						game.sceneData.nextFoe -= Math.abs(mov);
						if (game.sceneData.nextFoe < 0) {
							const monsters = ["m", "b"];
							game.triggerEvent(monsters[Math.floor(Math.random() * monsters.length)]);
							game.sceneData.nextFoe = 10 + Math.random() * 200;
						}
					}
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
					return 64 * ((rot + 5) % 8 - 4) - 64;
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
								if (dy < 2 && dy > -1.5) {
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
				scale: game => game.sceneData.spaceshipTemplate ? game.sceneData.spaceshipTemplate.scale / 2 : 1,
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
				hidden: game => game.battle,
				allowMove: true,
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 4, row: 4, size: [128,128],
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
					if (!pos) {
						return;
					}
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					const dx = game.sceneData.finalTarget.x - xLoc;
					const dy = game.sceneData.finalTarget.y - yLoc;
					return `“Westrow tavern is ${Math.abs(dx)}m ${dx<0?"West":"East"} and ${Math.abs(dy)}m ${dy<0?"South":"North"} from here”`;
				},
				hidden: game => game.battle,
				allowMove: true,
			},
			{
				src: ASSETS.PLANET_ITEMS, col: 4, row: 4, size: [128,128],
				scale: game => game.sceneData.nomadTemplate ? game.sceneData.nomadTemplate.scale / 2 : 1,
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
					if (!game.sceneData.nomadTemplate || game.battle) {
						return true;
					}
					if (!pos) {
						return false;
					}
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					return game.sceneData.seenNomad[`${xLoc}_${yLoc}`];
				},
				noHighlight: (game, sprite) => {
					const { pos } = game;
					const { x, y } = pos;
					const [ xLoc, yLoc ] = sprite.getLocation(game, x, y);
					return (Math.abs(x - xLoc) >= 1.5 || Math.abs(y - yLoc) >= 1.5);
				},
				onClick: (game, sprite) => {
					if (game.evaluate(sprite.noHighlight, sprite)) {
						return;
					}

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
										},
									},
									{
										msg: "Ask info...",
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
												}, null, {removeLock:true}
											);
										},
									},
									{
										msg: "Nomads...",
										hidden: game => game.situation.talkedAbout.tavern,
										onSelect: game => {
											game.showTip([
													"Us nomads roam around Westrow's desert.",
													"Other humans gather around a village near Westrow's tavern.",
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
													"I think one of the nomads does though.",
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
													"He usually hangs around there.",
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
										msg: "Where are we?",
										onSelect: game => {
											game.showTip([
												"This is the wasteland of Westrow.",
												"It's also the game scene with the most buggy implementation.",
												"You gotta forgive the creator...",
											], null, null, {removeLock: true});
										},
									},
									{
										msg: "Back",
										onSelect: game => {
											game.dialog.index --;
										},
									},
								],
							},
						],
					});
				},
				allowMove: true,
			},
			{	//	tree
				src: ASSETS.PLANET_ITEMS, col: 4, row: 4, size: [128,128],
				scale: game => game.sceneData.treeTemplate ? game.sceneData.treeTemplate.scale / 2 : 1,
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
				allowMove: true,
			},
			{	//	tree fruit
				src: ASSETS.GRAB_APPLE,
				scale: game => game.sceneData.treeTemplate ? game.sceneData.treeTemplate.scale / 2 : 1,
				offsetX: game => {
					const { dx, dy, scale } = game.sceneData.treeTemplate;
					return 32 - 64 * scale/2 + scale * (dx * 10 * 5 + 10);
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
					return dy >= 2 ? -1 : 1;
				},
				tip: "There's a fruit on that tree.",
				allowMove: true,
				hidden : game => {
					return game.sceneData.grabbedFruit && game.now - game.sceneData.grabbedFruit < 100000;
				},
				onClick: game => {
					game.sceneData.grabbedFruit = game.now;
					game.pickUp({item:"fruit?", image:ASSETS.GRAB_APPLE});					
				},
			},
			{	//	fountain
				src: ASSETS.PLANET_ITEMS, col: 4, row: 4, size: [128,128],
				scale: game => game.sceneData.fountainTemplate ? game.sceneData.fountainTemplate.scale / 4 : 1,
				offsetX: game => {
					if (!game.sceneData.fountainTemplate) {
						return 0;
					}
					const { dx, dy, scale } = game.sceneData.fountainTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 5;
				},
				offsetY: game => {
					if (!game.sceneData.fountainTemplate) {
						return 0;
					}
					const { dx, dy, scale } = game.sceneData.fountainTemplate;
					return 40 - 64 * scale/2 + scale * (10 - 5);
				},
				onRefresh: game => {
					const { pos } = game;
					const { x, y } = pos;
					game.sceneData.fountainTemplate = game.currentScene.getTemplate(game, Math.round((x) / 39) * 39, Math.round((y-15) / 39) * 39 + 7);
				},
				init: (game, sprite) => {
					sprite.onRefresh(game);
				},
				index: game => {
					if (!game.sceneData.fountainTemplate) {
						return -1;
					}
					const { dx, dy, scale } = game.sceneData.fountainTemplate;
					return dy >= 2 ? -1 : 3;
				},
				combine: game => {
					if (item === "empty bottle") {
						game.removeFromInventory("empty bottle");
						game.useItem = null;
						game.pickUp({item:"water bottle", image:ASSETS.GRAB_WATER_BOTTLE, message:"It does look like water... so far."});
						return true;
					}
				},
				tip: "There's water pouring out of this fountain.",
				hidden: game => game.battle,
				allowMove: true,
			},
			{	//	temple
				src: ASSETS.PLANET_ITEMS, col: 4, row: 4, size: [128,128],
				scale: game => game.sceneData.templeTemplate ? game.sceneData.templeTemplate.scale / 2 : 1,
				offsetX: game => {
					if (!game.sceneData.templeTemplate) {
						return 0;
					}
					const { dx, dy, scale } = game.sceneData.templeTemplate;
					return 32 - 64 * scale/2 + scale * dx * 10 * 5;
				},
				offsetY: game => {
					if (!game.sceneData.templeTemplate) {
						return 0;
					}
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
				onClick: game => {
					game.sceneData.leavingScene = game.now;
					game.fadeToScene("tavern-entrance");
				},
				tip: "This is it! Westrow's tavern!",
				allowMove: true,
			},
			makeFoe('monster', ASSETS.MONSTER),
			makeFoe('brusalien', ASSETS.BRUSALIEN),
			{
				init: ({sceneData}) => {
					sceneData.compassRotation = game.rotation;
					sceneData.compassRotationDirection = 0;
				},
				onRefresh: game => {
				},
				custom: (game, sprite, ctx) => {
					const x = 54, y = 57;
					ctx.strokeStyle = "#aaaaaa";
					ctx.fillStyle = "#222233";
					ctx.beginPath();
					ctx.ellipse(x, y, 8, 4, 0, 0, 2 * Math.PI);
					ctx.fill();
					ctx.stroke();

					const angle = game.rotation / 8 * Math.PI * 2;
					ctx.strokeWidth = 3;
					ctx.strokeStyle = "#9999aa";
					ctx.beginPath();
					ctx.moveTo(x, y+1);
					ctx.lineTo(x - Math.sin(angle) * 6, y + Math.cos(angle) * 3);
					ctx.stroke();
					ctx.strokeStyle = "#aa0000";
					ctx.beginPath();
					ctx.moveTo(x, y+1);
					ctx.lineTo(x + Math.sin(angle) * 6, y - Math.cos(angle) * 3);
					ctx.stroke();

					const orientation = game.granular_orientation;
					game.displayTextLine(ctx, {msg: orientation, x: y-5 + (orientation.length === 1 ? 3 : 0), y: y-2});

					ctx.fillStyle = "#cccccc55";
					ctx.beginPath();
					ctx.ellipse(x-1, y-1, 3, 1, 0, 0, 2 * Math.PI);
					ctx.fill();					
				},
				hidden: game => !game.inventory.compass || game.battle || game.dialog || game.useItem === "compass",
			},
			...standardBattle(),
			...standardMenu(),
			...standardBag(),		
		],
		... makeOnSceneBattle(),
		openChest: (game, battle, shot) => {
			if (game.now - game.sceneData > 360000 && !game.inventory.compass) {
				game.findChest(game.now + 2000, {
					item:"compass", image:ASSETS.GRAB_COMPASS, message: "A compass!",
				});						
				return;
			}


			const rand = Math.floor(Math.random() * 10000000);
			switch(rand % 10) {
				case 0: 
				case 1: 
					game.findChest(game.now + 2000, {
						item:"bullet", count: 5, image:ASSETS.GRAB_GUN, message: "I found five bullets for my gun.",
					});
					break;
				case 2:
				case 3:
				case 4:
					game.findChest(game.now + 2000, {
						item:"fruit?", image:ASSETS.GRAB_APPLE,
					});
					break;
				case 5:
					if (!game.inventory.compass && game.now - game.sceneData > 120000) {
						game.findChest(game.now + 2000, {
							item:"compass", image:ASSETS.GRAB_COMPASS, message: "A compass!",
						});						
					} else {
						game.findChest(game.now + 2000, {
							item:"bullet", count: 1, image:ASSETS.GRAB_GUN, message: "I found one bullet for my gun.",
						});						
					}
					break;
				default:
					if (shot) {
						game.findChest(game.now + 2000, {
							item: null, message: "The chest is empty!",
						});
					} else {
						game.findChest(game.now + 2000, {
							item:"bullet", count: 1, image:ASSETS.GRAB_GUN, message: "I found one bullet for my gun.",
						});						
					}
					break;
			}
		},
		events: {
			'm': {
				foe: "monster",
				foeLife: 150,
				foeBlockChance: .8,
				attackSpeed: 1500,
				riposteChance: .6,
				attackPeriod: 100,
				foeDamage: 7,
				foeDefense: 12,
				xp: 12,
				belowTheBelt: false,
				blocking: true,
				blockMap: true,
				chest: true,
				onEvent: (game, {foe, foeLife, foeBlockChance, foeDefense, attackSpeed, riposteChance, attackPeriod, foeDamage, onWin, xp, belowTheBelt}) => {
					const {data, now} = game;
					game.chest = null;
					const theme = game.data.theme.song;
					game.playTheme(SOUNDS.BATTLE_THEME, {volume:.8});
					if (!data.battle) {
						data.battle = {
							time: now,
							foe,
							fist: LEFT,
							attackSpeed,
							playerHit: 0,
							playerBlock: 0,
							foeBlockChance,
							playerLeftAttack: 0,
							playerRightAttack: 0,
							playerAttackLanded: 0,
							playerAttackPeriod: 50,
							foeLife,
							foeMaxLife: foeLife,
							foeBlock: 0,
							foeDefense,
							foeDefeated: 0,
							attackPeriod,
							riposteChance,
							foeDamage,
							onWin,
							xp,
							belowTheBelt,
							theme,
						};
					}
					return true;
				},
				onWin: (game, battle, shot) => game.currentScene.openChest(game, battle, shot),
			},
			'b': {
				foe: "brusalien",
				foeLife: 180,
				foeBlockChance: .9,
				attackSpeed: 2000,
				riposteChance: .3,
				attackPeriod: 100,
				foeDamage: 8,
				foeDefense: 12,
				xp: 15,
				belowTheBelt: false,
				blocking: true,
				blockMap: true,
				chest: true,
				onEvent: (game, {foe, foeLife, foeBlockChance, foeDefense, attackSpeed, riposteChance, attackPeriod, foeDamage, onWin, xp, belowTheBelt}) => {
					const {data, now} = game;
					game.chest = null;
					const theme = game.data.theme.song;
					game.playTheme(SOUNDS.BATTLE_THEME, {volume:.8});
					if (!data.battle) {
						data.battle = {
							time: now,
							foe,
							fist: LEFT,
							attackSpeed,
							playerHit: 0,
							playerBlock: 0,
							foeBlockChance,
							playerLeftAttack: 0,
							playerRightAttack: 0,
							playerAttackLanded: 0,
							playerAttackPeriod: 50,
							foeLife,
							foeMaxLife: foeLife,
							foeBlock: 0,
							foeDefense,
							foeDefeated: 0,
							attackPeriod,
							riposteChance,
							foeDamage,
							onWin,
							xp,
							belowTheBelt,
							theme,
						};
					}
					return true;
				},
				onWin: (game, battle, shot) => game.currentScene.openChest(game, battle, shot),
			},
		},
	},
);