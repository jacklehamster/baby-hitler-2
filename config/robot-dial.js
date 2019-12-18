gameConfig.scenes.push(
	{
		name: "robot-dial",
		onScene: game => {
			game.sceneData.digitDown = [];
			game.sceneData.password = "";
		},
		onDial: (game, sprite) => {
			const PASSWORD = "707-8008";
			const digit = sprite.index % 10;
			game.sceneData.digitDown[digit] = game.now;
			if (game.sceneData.password.length === 3) {
				game.sceneData.password += "-";
			}
			game.sceneData.password += digit;
			if (game.sceneData.password.length === 8) {
				game.waitCursor = true;
				if (game.sceneData.password === PASSWORD) {
					game.playSound(SOUNDS.JINGLE);
					game.situation.gotPassword = game.now;
					game.delayAction(game => {
						game.gotoScene("tavern-entrance");
						game.sceneData.openedDoor = game.now;
					}, 3000);
				} else {
					game.playErrorSound();
					game.delayAction(game => {
						game.sceneData.password = "";
						game.waitCursor = false;
					}, 1000);
				}
				return;
			}
			game.playSound(SOUNDS.BEEP);
		},
		sprites: [
			{
				noHighlight: true,
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "black";
					ctx.fillRect(0, 0, 64, 64);
				},
				onClick: game => {
					game.gotoScene("tavern-entrance-zoom");
				},
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 0,
			},
			{
				custom: (game, sprite, ctx) => {
					game.displayTextLine(ctx, {msg: game.sceneData.password, x: 14, y: 12, dark: true, alpha: .8});
				},
				hidden: game => game.sceneData.password.length === 8 && Math.floor(game.now / 200) % 2 === 0,
			},
			{
				custom: (game, sprite, ctx) => {
					game.displayTextLine(ctx, {msg: game.sceneData.password, x: 14, y: 11, dark: false, alpha: .8});
				},
				hidden: game => game.sceneData.password.length === 8 && Math.floor(game.now / 200) % 2 === 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 1,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 2,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 3,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 4,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 5,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 6,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 7,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 8,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 9,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
			{
				src: ASSETS.ROBOT_DIAL, col: 3, row: 4,
				index: 10,
				onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
				offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[index%10] < 100 ? 1 : 0,
			},
		],
	},
);
