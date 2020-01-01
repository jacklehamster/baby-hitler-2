game.addScene(
	{
		name: "disk-screen",
		onScene: game => {
			game.sceneData.shift = 0;
			game.sceneData.maxSlot = 0;
			
			game.sceneData.currentSaves = {};
			game.sceneData.undoes = {};

			game.currentScene.refreshImages(game);

			game.startDialog({
				time: game.now,
				index: 0,
				highlightColor: "#00998899",
				conversation: [
					{
						options: [
							{},
							{},
							{
								msg: "Back",
								onSelect: (game, dialog) => game.gotoScene(game.sceneData.returnScene, null, true),
							},
						],
					}
				],
			});
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => ctx.clearRect(0, 0, 64, 64),
			},
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index}, ctx) => {
						if (sceneData.loadSave) {
							const sideLeft = sceneData.sideLeft || 0;
							const sideRight = sceneData.sideRight || 0;
							const delay = 100;
							const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
							const offsetX = time >= delay ? 0
								: sideLeft > sideRight
								? -30 * (delay - time) / delay
								: sideLeft < sideRight
								? 30 * (delay - time) / delay
								: 0;

							const spriteIndex = index + sceneData.shift;
							const { img } = sceneData.loadSave[spriteIndex];
							const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
							ctx.drawImage(img, px + 2 + offsetX, py + 2);
						}
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						return !sceneData.loadSave || !sceneData.loadSave[spriteIndex];
					},
				};
			})),
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index}, ctx) => {
						if (sceneData.loadSave) {
							const sideLeft = sceneData.sideLeft || 0;
							const sideRight = sceneData.sideRight || 0;
							const delay = 100;
							const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
							const offsetX = time >= delay ? 0
								: sideLeft > sideRight
								? -30 * (delay - time) / delay
								: sideLeft < sideRight
								? 30 * (delay - time) / delay
								: 0;

							const spriteIndex = index + sceneData.shift;
							const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;

							game.displayTextLine(ctx, {
								msg: `#${spriteIndex+1}`,
								x: px + offsetX + 1, y: py + 2,
								alpha: .8,
								dark: true,
							});								

							game.displayTextLine(ctx, {
								msg: `#${spriteIndex+1}`,
								x: px + offsetX + 1, y: py + 1,
							});
						}
					},
				};
			})),			
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const sideLeft = sceneData.sideLeft || 0;
							const sideRight = sceneData.sideRight || 0;
							const delay = 100;
							const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
							const offsetX = time >= delay ? 0
								: sideLeft > sideRight
								? -30 * (delay - time) / delay
								: sideLeft < sideRight
								? 30 * (delay - time) / delay
								: 0;

							const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
							const left = 2 + px + offsetX;
							const top = py;
							const width = 28, height = 28;
							const x = left + width/2 - 6;
							const y = top + height / 2 - 6;

							ctx.fillStyle = hoverTime ? "#8888cc" : "#00008899";
							ctx.fillRect(x-1, y-1, 15, 7);
							game.displayTextLine(ctx, {
								msg: "load",
								x, y,
							});
						}
					},
					onClick: (game, {index}) => {
						const {sceneData} = game;
						const spriteIndex = index + game.sceneData.shift;
						game.load(spriteIndex);
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						return !sceneData.loadSave || !sceneData.loadSave[spriteIndex] || sceneData.currentSaves[spriteIndex];
					}
				};
			})),
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const sideLeft = sceneData.sideLeft || 0;
							const sideRight = sceneData.sideRight || 0;
							const delay = 100;
							const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
							const offsetX = time >= delay ? 0
								: sideLeft > sideRight
								? -30 * (delay - time) / delay
								: sideLeft < sideRight
								? 30 * (delay - time) / delay
								: 0;

							const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
							const left = 2 + px + offsetX;
							const top = py;
							const width = 28, height = 28;
							const x = left + width/2 - 10;
							const y = top + height / 2 + 9;

							ctx.fillStyle = hoverTime ? "#cc8888" : "#88000099";
							ctx.fillRect(x-1, y-1, 22, 7);
							game.displayTextLine(ctx, {
								msg: "delete",
								x, y,
							});
						}
					},
					onClick: (game, {index}) => {
						const spriteIndex = index + game.sceneData.shift;
						if (!game.sceneData.currentSaves[spriteIndex]) {
							game.sceneData.undoes[spriteIndex] = game.getLoadData(spriteIndex);
						} else {
							delete game.sceneData.currentSaves[spriteIndex];
						}
						game.deleteSave(spriteIndex);
						game.currentScene.refreshImages(game);
						game.playSound(SOUNDS.HIT_LAND);
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						if (sceneData.currentSaves && sceneData.currentSaves[spriteIndex]) {
							return true;
						}
						return !sceneData.loadSave || !sceneData.loadSave[spriteIndex];
					}
				};
			})),
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						const sideLeft = sceneData.sideLeft || 0;
						const sideRight = sceneData.sideRight || 0;
						const delay = 100;
						const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
						const offsetX = time >= delay ? 0
							: sideLeft > sideRight
							? -30 * (delay - time) / delay
							: sideLeft < sideRight
							? 30 * (delay - time) / delay
							: 0;

						const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
						const left = 2 + px + offsetX;
						const top = py;
						const width = 28, height = 28;
						const x = left + width/2 - 5;
						const y = top + height / 2 - 3;
						ctx.beginPath();
						ctx.lineWidth = "3px"
						ctx.strokeStyle = "#334444";
						ctx.rect(2 + left, 2 + top, 24, 24);
						ctx.stroke();
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						return !sceneData.loadSave || sceneData.loadSave[spriteIndex];
					}
				};
			})),
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						const sideLeft = sceneData.sideLeft || 0;
						const sideRight = sceneData.sideRight || 0;
						const delay = 100;
						const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
						const offsetX = time >= delay ? 0
							: sideLeft > sideRight
							? -30 * (delay - time) / delay
							: sideLeft < sideRight
							? 30 * (delay - time) / delay
							: 0;

						const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
						const left = 2 + px + offsetX;
						const top = py;
						const width = 28, height = 28;
						const x = left + 0.5;
						const y = top + 2.5;
						ctx.beginPath();
						ctx.lineWidth = 3;
						ctx.strokeStyle = "black";
						ctx.rect(x, y, 27, 27);
						ctx.stroke();
						ctx.beginPath();
						ctx.fillStyle = "black";
						ctx.fillRect(x-.5, y-.5, 28, 8);


						ctx.lineWidth = 1;
						ctx.strokeStyle = "#33aa00";
						ctx.rect(x, y, 27, 27);
						ctx.stroke();

						game.displayTextLine(ctx, {
							msg: "saved",
							x: x + 4.5, y: y + 1.5,
						});						
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						return !sceneData.currentSaves || !sceneData.currentSaves[spriteIndex];
					}
				};
			})),
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						const spriteIndex = index + sceneData.shift;
						const hasUndo = sceneData.undoes[spriteIndex];

						const sideLeft = sceneData.sideLeft || 0;
						const sideRight = sceneData.sideRight || 0;
						const delay = 100;
						const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
						const offsetX = time >= delay ? 0
							: sideLeft > sideRight
							? -30 * (delay - time) / delay
							: sideLeft < sideRight
							? 30 * (delay - time) / delay
							: 0;

						const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
						const left = 2 + px + offsetX;
						const top = py;
						const width = 28, height = 28;
						const x = left + width/2 - 7;
						const y = top + height / 2 - (hasUndo ? 8 : 3);

						ctx.fillStyle = hoverTime ? "#88cc88" : "#008800bb";
						ctx.fillRect(x-1, y-1, 16, 7);
						game.displayTextLine(ctx, {
							msg: "save",
							x, y,
						});
					},
					onClick: (game, {index}) => {
						const spriteIndex = index + game.sceneData.shift;
						delete game.sceneData.undoes[spriteIndex];
						const savedData = game.sceneData.savedData;
						const screenshot = game.sceneData.screenshot;
						game.saveData(spriteIndex, screenshot, savedData);
						game.sceneData.currentSaves[spriteIndex] = true;
						game.currentScene.refreshImages(game);
						game.playSound(SOUNDS.JINGLE);
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						return !sceneData.loadSave || sceneData.loadSave[spriteIndex];
					}
				};
			})),
			... (new Array(8).fill(null).map((a, idx) => {
				const index = idx - 2;
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const sideLeft = sceneData.sideLeft || 0;
							const sideRight = sceneData.sideRight || 0;
							const delay = 100;
							const time = Math.min(delay, game.now - Math.max(sideLeft, sideRight));
							const offsetX = time >= delay ? 0
								: sideLeft > sideRight
								? -30 * (delay - time) / delay
								: sideLeft < sideRight
								? 30 * (delay - time) / delay
								: 0;

							const px = Math.floor(index / 2) * 32, py = (index % 2 + 2) % 2 * 32;
							const left = 2 + px + offsetX;
							const top = py;
							const width = 28, height = 28;
							const x = left + width/2 - 7;
							const y = top + height / 2 + 4;

							ctx.fillStyle = hoverTime ? "#cc88bb" : "#880066bb";
							ctx.fillRect(x-1, y-1, 17, 7);
							game.displayTextLine(ctx, {
								msg: "undo",
								x, y,
							});
						}
					},
					onClick: (game, {index}) => {
						const spriteIndex = index + game.sceneData.shift;
						const undo = game.sceneData.undoes[spriteIndex];
						game.saveData(spriteIndex, null, undo);
						delete game.sceneData.undoes[spriteIndex];
						game.currentScene.refreshImages(game);
					},
					hidden: ({sceneData}, {index}) => {
						const spriteIndex = index + sceneData.shift;
						return !sceneData.undoes || !sceneData.undoes[spriteIndex];
					}
				};
			})),
			{
				src: ASSETS.SIDE_BUTTONS,
				side: LEFT,
				index: ({hoverSprite, dialog}, sprite) => hoverSprite === sprite && !dialog.hovered ? 1 : 0,
				onClick: game => {
					game.sceneData.shift -= 2;
					game.sceneData.sideLeft = game.now;
				},
				hidden: game => game.sceneData.shift <= 0 || game.dialog && game.dialog.hovered,
			},
			{
				src: ASSETS.SIDE_BUTTONS,
				side: RIGHT,
				index: ({hoverSprite, dialog}, sprite) => hoverSprite === sprite && !dialog.hovered ? 1 : 0,
				onClick: game => {
					game.sceneData.shift += 2;
					game.sceneData.sideRight = game.now;
				},
				hidden: game => game.sceneData.maxSlot + 1 - game.sceneData.shift <= 3 || game.dialog && game.dialog.hovered,
			},
		],
		refreshImages: game => {
			const list = game.getSaveList();
			game.sceneData.loadSave = {};
			for (let name in list) {
				if (name !== "last") {
					const { image } = list[name];
					const img = new Image();
					img.src = image;
					game.sceneData.loadSave[name] = { img, name, };
				}
			}
			game.sceneData.maxSlot = 0;
			for (let i in game.sceneData.loadSave) {
				const { name } = game.sceneData.loadSave[i];
				if (!isNaN(parseInt(name))) {
					game.sceneData.maxSlot = Math.max(parseInt(name), game.sceneData.maxSlot);
				}
			}
		},
	},
);