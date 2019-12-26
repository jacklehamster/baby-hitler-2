game.addScene(
	{
		name: "meet-dick",
		onScene: game => {
		},
		sprites: [
			{
				src: ASSETS.TAVERN_GANGSTA,
				index: game => {
					return game.sceneData.gangstaLookUp ? 1 : 0;
				},
			},
			{
				src: ASSETS.BABY_HITLER_WAITER,
				hidden: game => !game.sceneData.showBabyHitlerWaiter,
			},
			{	//	yupa
				src: ASSETS.TAVERN_GANGSTA,
				hidden: game => !game.sceneData.showGangsta || !game.sceneData.approachGangsta,
				side: LEFT,
				index: 2,
			},
			{	//	hitman
				src: ASSETS.TAVERN_GANGSTA,
				hidden: game => !game.sceneData.showGangsta || !game.sceneData.approachGangsta,
				side: RIGHT,
				index: 2,
			},
		],
	},
);