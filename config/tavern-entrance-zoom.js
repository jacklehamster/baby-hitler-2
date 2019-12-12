gameConfig.scenes.push(
	{
		name: "tavern-entrance-zoom",
		onScene: game => {
			game.save();
			if (!game.situation.shift) {
				game.situation.shift = 0;
			}
		},
		sprites: [
			{
				src: ASSETS.ZOOM_TAVERN_DOOR,
				noHighlight: true,
				onClick: game => {
					game.gotoScene("tavern-entrance");
				},
			},
			{
				src: ASSETS.ZOOM_TAVERN_DOOR_LADY, col: 2, row: 2,
				onClick: game => {
					game.playSound(SOUNDS.HUM_LADY);
					game.showTip([
						"I've been trying to get in as well,",
						"but I don't know the\npassword either.",
					], game => {
						
						
					}, 80, { talker:"lady" });
				},
				index: game => game.pendingTip && game.pendingTip.talker === "lady" && game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 4 : 0,
			},
			{
				src: ASSETS.ZOOM_TAVERN_DOOR_SMOKE, col: 2, row: 2,
				index: ({now}) => Math.floor(now / 300) % 4,
			},
			{
				src: ASSETS.ZOOM_TAVERN_DOOR_ROBOT, col: 2, row: 2,
				offsetY: game => Math.round(Math.sin(game.now / 600) * 3), 
				onClick: game => {
					game.showTip([
						"The tavern is for member only.",
					], game => {


					}, 80, { talker:"robot" });
				},
				onRefresh: game => {
					if (game.pendingTip && game.pendingTip.talker === "robot" && game.pendingTip.progress < 1) {
						if (!game.sceneData.robotVoice) {
							game.sceneData.robotVoice = true;
							game.playSound(SOUNDS.ROBOT_VOICE, {loop:true});
						}						
					} else {
						if (game.sceneData.robotVoice) {
							game.sceneData.robotVoice = false;
							game.stopSound(SOUNDS.ROBOT_VOICE);
						}
					}
				},
				index: game => game.pendingTip && game.pendingTip.talker === "robot" && game.pendingTip.progress < 1 ? Math.floor(game.now / 30) % 4 : 0,
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);
