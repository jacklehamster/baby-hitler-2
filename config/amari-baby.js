game.addScene(
	{
		name: "amari-baby",
		onScene: game => {
			game.playSound(SOUNDS.ANIMAL_CRY);
			game.showTip([
				`I will name you ...`,
				`Baby\n~${game.data.name||"Hitman"}~!`,
			], game => {
				game.playTheme(null);
				game.sceneData.cry = game.now;
				game.playSound(SOUNDS.BABY_CRY);
				game.delayAction(game => {
					game.sceneData.cry = game.now;
					game.playSound(SOUNDS.BABY_CRY);
				}, 1000);
				game.delayAction(game => {
					game.sceneData.cry = game.now;
					game.playSound(SOUNDS.BABY_CRY);
				}, 2000);

				game.delayAction(game => {
					game.stopSound(SOUNDS.GOLDMAN_THEME, true);
					game.playTheme(SOUNDS.GOLDMAN_THEME, {volume: .8});
					game.sceneData.creditStart = game.now;
					getMedal("REBORN ENDING");
				}, 3000);
			});

			game.hideCursor = true;
			game.sceneData.credits = `${game.title||" Where in Space is\n  BABY HITLER?"}

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
				(Raymond Lefèvre)

				“Elle a fait un bébé toute seule”
				(Jean-Jacques Goldman)

				This game is a sequel to “Kill Baby Hitler”. The first part of this game was released for
				#LOWREZJAM\n2019\nas “Escape from Labbyrithe”.

				I kept working my ass off on this game, to make a proper ending, which you didn't reach yet.

				But along the way, I got sidetracked with this alternate storyline, where you fall for Amari, spend the night with her, and vanish the next morning.

				This is the only ending where you get to hear a cover from Jean-Jacques Goldman's song, a true delight!				

				Anyway, thanks for playing.

				Please make sure to follow my games, share them, and say great things about them to your family and friends.

				You have finished the game, with
				REBORN ENDING.

				Congratulations, dad!

				Have a nice day!
			`.split("\n").map((a, index) => index > 2 ? game.wordwrap(a.trim(), 9) : a).join("\n").split("\n");
		},
		onSceneRefresh: game => {
			const shift = - (game.now - game.sceneTime) / 200 + 50;
			if (game.sceneData.credits.length * 6 + shift < -25) {
				if (!game.sceneData.showGameOver) {
					game.sceneData.showGameOver = game.now;
					game.gameOver(" ", true);
				}
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = `#000000`;
					ctx.fillRect(0, 0, 64, 64);
				},
			},
			{
				src: ASSETS.AMARI_BABY, col: 2, row: 3,
				index: game => {
					return game.sceneData.cry && game.now - game.sceneData.cry < 500 ? 1 : 0;
				},
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				offsetY: -12,
				index: game => {
					return game.sceneData.cry && game.now - game.sceneData.cry < 500 ? 1 : 0;
				},
			},
			{
				src: ASSETS.AMARI_BABY, col: 2, row: 3,
				index: 4,
			},
			{
				hidden: game => !game.sceneData.creditStart,
				custom: (game, sprite, ctx) => {
					if (game.now - game.sceneData.creditStart) {
						ctx.fillStyle = "#000000";
						ctx.globalAlpha = Math.min(.7, (game.now - game.sceneData.creditStart) / 3000);
						ctx.fillRect(0, 0, 64, 64);
					}
					ctx.globalAlpha = 1;

					const shift = - (game.now - game.sceneData.creditStart - 2000) / 200 + 50;
					game.sceneData.credits.forEach((line, index) => {
						const y = index * 6 + shift;
						if (y > 0 && y < 55) {
							game.displayTextLine(ctx, {
								msg: line,
								x:1, y: Math.round(y),
								alpha: Math.max(0.05, Math.min(.8, y/5, (55 - y)/5)),
							});
						}
					});
				},
			},
		],
	},
);