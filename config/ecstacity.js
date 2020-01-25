game.addScene(
	{
		name: "ecstacity",
		onScene: game => {
			delete game.inventory["ticket"];
			game.situation.wentToEcstaCity = game.now;
			game.situation.needToBuyWarpDrive = game.now;

			game.showTip([
				"How many nights are you staying in EcstaCity?",
			], game => {
				game.startDialog({
					conversation: [
						{
							msg: "How many nights?",
							options: [
								{
									msg: "Two nights",
									onSelect: game => {
										game.showTip([
											"You spent two nights in EcstaCity.",
											"You earned 1000 coins.",
											"but all the partying got a toll on you.",
											"You lost 1 point in attack and defense, and 10 in maxlife.",
										], game => {
											game.data.stats.maxLife -= 10;
											game.data.stats.defense -= 1;
											game.data.stats.damage -= 1;
											game.addToInventory({item:"coin", image:ASSETS.GRAB_COIN, count: 1000});
											game.waitCursor = false;
											game.gotoScene("sarlie-planet-world");
										});
									},
								},
								{
									msg: "Three nights",
									onSelect: game => {
										game.showTip([
											"You spent three nights in EcstaCity.",
											"You earned 1200 coins.",
											"but all the partying got a toll on you.",
											"You lost 2 point in attack and defense, and 20 in maxlife.",
										], game => {
											game.data.stats.maxLife -= 20;
											game.data.stats.defense -= 2;
											game.data.stats.damage -= 2;
											game.addToInventory({item:"coin", image:ASSETS.GRAB_COIN, count: 1200});
											game.waitCursor = false;
											game.gotoScene("sarlie-planet-world");
										});
									},
								},
								{
									msg: "One week",
									onSelect: game => {
										game.showTip([
											"You spent one week in EcstaCity.",
											"You earned 2000 coins.",
											"but all the partying got a toll on you.",
											"You lost 50% of your attack and defense, and maxlife.",
										], game => {
											game.data.stats.maxLife = Math.ceil(game.data.stats.maxLife/2);
											game.data.stats.defense = Math.ceil(game.data.stats.defense/2);
											game.data.stats.damage = Math.ceil(game.data.stats.damage/2);
											game.addToInventory({item:"coin", image:ASSETS.GRAB_COIN, count: 2000});
											game.waitCursor = false;
											game.gotoScene("sarlie-planet-world");
										});
									},
								},
							],
						},
					],
				})
			});
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
			},
		],
	},
);