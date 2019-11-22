gameConfig.scenes.push(
	{
		name: "disk-screen",
		sprites: [
			{
				custom: (game, sprite, ctx) => ctx.clearRect(0, 0, 64, 64),
			},
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index}, ctx) => {
						if (sceneData.loadSave) {
							const { img } = sceneData.loadSave[index];
							ctx.drawImage(img, 2 + index % 2 * 32, 0 + Math.floor(index / 2) * 32);
						}
					},
					hidden: ({sceneData}, sprite) => !sceneData.loadSave || !sceneData.loadSave[sprite.index],
				};
			})),
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const left = 2 + index % 2 * 32;
							const top = 0 + Math.floor(index / 2) * 32;
							const width = 28, height = 28;
							const x = left + width/2 - 6;
							const y = top + height / 2 - 8;

							ctx.fillStyle = hoverTime ? "#8888cc" : "#000088bb";
							ctx.fillRect(x-1, y-1, 15, 7);
							game.displayTextLine(ctx, {
								msg: "load",
								x, y,
							});
						}
					},
					onClick: (game, {index}) => {
						const {sceneData} = game;
						game.load(index);
					},
					hidden: ({sceneData}, {index}) => !sceneData.loadSave || !sceneData.loadSave[index] || sceneData.currentSaves[index],
				};
			})),
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const left = 2 + index % 2 * 32;
							const top = 0 + Math.floor(index / 2) * 32;
							const width = 28, height = 28;
							const x = left + width/2 - 10;
							const y = top + height / 2 + 6;

							ctx.fillStyle = hoverTime ? "#cc8888" : "#880000bb";
							ctx.fillRect(x-1, y-1, 22, 7);
							game.displayTextLine(ctx, {
								msg: "delete",
								x, y,
							});
						}
					},
					onClick: (game, {index}) => {
						if (!game.sceneData.currentSaves[index]) {
							game.sceneData.undoes[index] = game.getLoadData(index);
						} else {
							delete game.sceneData.currentSaves[index];
						}
						game.deleteSave(index);
						game.currentScene.refreshImages(game);
					},
					hidden: ({sceneData}, sprite) => !sceneData.loadSave || !sceneData.loadSave[sprite.index],
				};
			})),
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						const left = 2 + index % 2 * 32;
						const top = 0 + Math.floor(index / 2) * 32;
						const width = 28, height = 28;
						const x = left + width/2 - 5;
						const y = top + height / 2 - 3;
						ctx.beginPath();
						ctx.lineWidth = "3px"
						ctx.strokeStyle = "#334444";
						ctx.rect(2 + left, 2 + top, 24, 24);
						ctx.stroke();
					},
					hidden: ({sceneData}, sprite) => !sceneData.loadSave || sceneData.loadSave[sprite.index],
				};
			})),
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						const left = 2 + index % 2 * 32;
						const top = 0 + Math.floor(index / 2) * 32;
						const width = 28, height = 28;
						const x = left + 1;
						const y = top + 1;
						ctx.beginPath();
						ctx.lineWidth = "4px"
						ctx.strokeStyle = "#88FF99";
						ctx.rect(x, y, 26, 26);
						ctx.stroke();
					},
					hidden: ({sceneData}, sprite) => !sceneData.currentSaves || !sceneData.currentSaves[sprite.index],
				};
			})),
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						const hasUndo = sceneData.undoes[index];

						const left = 2 + index % 2 * 32;
						const top = 0 + Math.floor(index / 2) * 32;
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
						delete game.sceneData.undoes[index];
						const savedData = game.sceneData.savedData;
						const screenshot = game.sceneData.screenshot;
						game.saveData(index, screenshot, savedData);
						game.sceneData.currentSaves[index] = true;
						game.currentScene.refreshImages(game);
					},
					hidden: ({sceneData}, sprite) => !sceneData.loadSave || sceneData.loadSave[sprite.index],
				};
			})),
			... (new Array(4).fill(null).map((a, index) => {
				return {
					index,
					isSaveFile: true,
					custom: ({sceneData}, {index, hoverTime}, ctx) => {
						if (sceneData.loadSave) {
							const left = 2 + index % 2 * 32;
							const top = 0 + Math.floor(index / 2) * 32;
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
						const undo = game.sceneData.undoes[index];
						game.saveData(index, null, undo);
						delete game.sceneData.undoes[index];
						game.currentScene.refreshImages(game);
					},
					hidden: ({sceneData}, sprite) => !sceneData.undoes || !sceneData.undoes[sprite.index],
				};
			})),
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
		},
		onScene: game => {
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
	},
);