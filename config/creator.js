game.addScene(
	{
		name: "creator",
		onScene: game => {
			game.playTheme(SOUNDS.FUTURE_SONG_THEME, {volume: .5});
			game.sceneData.frames = [
				{frames: [0], duration: 2000, time: 1},
				{frames: [1], duration: 2000},
				{frames: [2], duration: 1000},
				{frames: [3], duration: 1000},
				{frames: [4,5], duration: 1000, period: 200},
				{frames: [6,7,8,9,10], duration: 1000, period: 50},
				{frames: [11], duration: 100},
				{frames: [12], duration: 100},
				{frames: [13, 14, 15, 16, ], duration: 1500, period: 50},
				{frames: [17], duration: 2000},
				{frames: [18], duration: 500},
				{frames: [19], duration: 500},
				{frames: [20], duration: 1000},
				{frames: [21], duration: 1000},
				{frames: [22], duration: 500},
				{frames: [23], duration: 1500},
				{frames: [24], duration: 1000},
				{frames: [25], duration: 1000},
				{frames: [26]},
			];
			for (let i = 1; i < game.sceneData.frames.length; i++) {
				game.sceneData.frames[i].duration *= 3;
				// game.sceneData.frames[i].duration /= 3;
			}


			for (let i = 1; i < game.sceneData.frames.length; i++) {
				game.sceneData.frames[i].time = 
					game.sceneData.frames[i-1].time
					+ game.sceneData.frames[i-1].duration; 
			}

			game.sceneData.frames.forEach(({frames, time, period}) => {
				game.delayAction(game => {
					//console.log(frames, period);
					game.sceneData.currentFrames = frames;
					game.sceneData.period = period;
				}, time);
			});

			game.sceneData.credits = `${game.title||" Where in Space\n          is\n BABY HITLER?"}



				A game from
				DOBUKI STUDIO
				by
				Jack Le Hamster

				Coded in JavaScript
				with Sublime Text

				Art made with Piskel

				Music made with BeepBox

				Sound effects made with VoiceChanger.io and Brfx

				Music covers:
				“La Soupe aux Choux”
				(Raymond Lefevre)

				This game is a sequel to “Kill Baby Hitler”. The first part of this game was released for
				#LOWREZJAM\n2019\nas “Escape from Labbyrithe”.

				You have found the CREATOR, who restored your left hand and gave you answers to all your questions.

				You felt fulfilled, yet a bit melancholic. As you realized that the world no longer holds any mystery.

				You have finished the game, with
				CREATOR ENDING.

				What happened next?

				Who knows... From that point on, anything was possible.

				You'll just have to imagine it.

				Have a nice day!
			`.split("\n").map((a, index) => index > 2 ? game.wordwrap(a.trim(), 7) : a).join("\n").split("\n");

		},
		onSceneRefresh: game => {
			const shift = - (game.now - game.sceneData.creditStart) / 200 + 50;
			if (game.sceneData.credits.length * 6 + shift < 10) {
				if (!game.sceneData.showGameOver) {
					game.sceneData.showGameOver = game.now;
					game.gameOver(" ", true);
				}
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
				hidden: game => !game.sceneData.creditStart,
			},
			{
				hidden: game => !game.sceneData.creditStart,
				custom: (game, sprite, ctx) => {
					const shift = - (game.now - game.sceneData.creditStart - 2000) / 200 + 50;
					game.sceneData.credits.forEach((line, index) => {
						const y = index * 6 + shift;
						if (y > 0 && y < 55) {
							game.displayTextLine(ctx, {
								msg: line,
								x:5, y: Math.round(y),
								alpha: Math.max(0.05, Math.min(.8, y/5, (55 - y)/5)),
							});
						}
					});
				},
			},			
			{
				src: ASSETS.CREATOR, col: 5, row: 6,
				index: game => {
					if (game.sceneData.currentFrames) {
						const time = game.now / (game.sceneData.period || 1);
						const frameIndex = Math.floor(time) % game.sceneData.currentFrames.length;
						return game.sceneData.currentFrames[frameIndex];
					}
					return 0;
				},
				onRefresh: (game, sprite) => {
					if (game.evaluate(sprite.index) === 26 && !game.sceneData.creditStart) {
						game.playTheme(SOUNDS.SOFT_THEME, {volume: .8});
						game.sceneData.creditStart = game.now;
						getMedal("CREATOR ENDING");
					}
				},
			},
		],
	},
);