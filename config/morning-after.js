game.addScene(
	{
		name: "morning-after",
		onScene: game => {
			game.playTheme(SOUNDS.SOFT_THEME, {volume: .8});
			game.hideCursor = true;
			game.sceneData.sceneDuration = 55000;
			game.sceneData.fadeTime = game.sceneData.sceneDuration / 8;
			game.delayAction(game => {
				game.showTip([
					"The morning after ...",
					"As I contemplate the vast universe ...",
				], game => {
					game.sceneData.vanishTime = game.now;
					game.showTip([
						"I can feel my soul slowly vanish from existence ...",
						"I will soon be gone ...",
						"And nobody will know that I ever existed ...",
						"I will leave no trace in this world ...",
						"and yet ...",
						"something tells me that this time, perhaps ...",
						"some part of me would remain ...",
						"Good bye, Amari. Good bye, Yupa ...",
						"You were the best part of my life ...",
					], game => {
						game.fadeToScene("9-months", null, 5000);
					}, 100, {y: 16, maxLines: 2});
				}, 100, {y: 16, maxLines: 2});
			}, 6000);
		},
		onSceneRefresh: game => {
			if (game.now - game.sceneTime <= 10000) {
				game.fade = Math.min(1, 1 - (game.now - game.sceneTime) / 5000);
			}
		},
		sprites: [
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 8,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 7,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 6,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 5,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 4,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 3,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 2,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
			{
				src: ASSETS.EVENING_DATE, col: 3, row: 3,
				index: 1,
				alpha: (game, {index}) => {
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return Math.max(0, 1 - (time / fadeTime));
				},
				hidden: (game, {index}) => {
					if (!game.sceneData.vanishTime) {
						return false;
					}
					const fadeTime = game.sceneData.fadeTime;
					const time = game.now - game.sceneData.vanishTime - fadeTime * (index-1);
					return 0 >= 1 - (time / fadeTime);
				},
			},
		],
	},
);