game.addScene(
	{
		name: "surface",
		onScene: game => {
			game.save();
			game.playTheme(null);
			game.situation.shift = { x: 0, y: 0 };
		},
		sprites: [
			{
				init: ({sceneData}) => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = 64;
					tempCanvas.height = 64;
					tempCtx = tempCanvas.getContext("2d");
					sceneData.tempCtx = tempCtx;
				},
				getRandom: (game, x, y) => Math.floor(Math.abs(Math.sin(x * 7 + y * 13)) * 11),
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#333343";
					ctx.fillRect(0, 0, 64, 64);

					tempCtx.clearRect(0, 0, 64, 64);
					tempCtx.fillStyle = "#333343";

					const { shift } = game.situation;
					for (let y = Math.floor(shift.y-5); y < shift.y+5; y++) {
						for (let x = Math.floor(shift.x-5); x < shift.x+5; x++) {
							const random = sprite.getRandom(game, x, y);
							if ((random * 13) % 5 == 0) {
								const size = (random * 13) % 10 + 3;
								const dx = (random * 37) % 10 - 5;
								const dy = (random * 17) % 10 - 5;
								tempCtx.beginPath();
								tempCtx.arc(x*10 + 32 + dx, y*10 + 32 + dy, size, 0, 2 * Math.PI);
								tempCtx.fill();

								// ctx.strokeStyle = "#000000";
								// ctx.beginPath();
								// ctx.arc(x*5 + 32, y*5 + 32, size, 0, 2 * Math.PI);
								// ctx.stroke();
								// ctx.strokeStyle = "#FFFFFF";
								// ctx.beginPath();
								// ctx.arc(x*5 + 32, y*5-1 + 32, size, 0, 2 * Math.PI);
								// ctx.stroke();
							}
						}
					}
					ctx.shadowColor = "#FFFFFF";
					ctx.shadowBlur = 1;
					ctx.drawImage(tempCtx.canvas, 0, 0);
					ctx.shadowBlur = 0;			



//					tempCtx.globalAlpha = 1;
				},
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);