game.addScene(
	{
		name: "tavern-entrance-zoom",
		arrowGrid: [
			[null, null,  MENU,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ null, null, BAG ,  null, null ],
		],
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
					game.showTip(game.situation.revealPassword ? [
						"I told all my friends about the password.",
						"Now we can all go in and have fun!",
					] : [
						"I've been trying to get in as well,",
						"but I don't know the\npassword\neither.",
					], game => {
						game.startDialog({
							conversation: [
								{
									options: [
										{
											msg: "Why go in?",
											onSelect: game => {
												game.playSound(SOUNDS.HUM);
												game.showTip([
													"Why are you trying to get in?",
												], game => {
													game.playSound(SOUNDS.HUM_LADY);
													game.showTip([
														"Everyone knows, this place serves the most\nmarvelous cocktails.",
														"And a lot of young handsome men...",
													], game => {
													}, 80, { talker: "lady"});
												}, 80, {talker: "human"});

											},
										},
										{
											msg: "Reveal password",
											hidden: game => game.situation.revealPassword,
											onSelect: game => {
												game.playSound(SOUNDS.HUM);
												game.showTip([
													"Would you like to know the\npassword?",
												], game => {
													game.playSound(SOUNDS.HUM_LADY);
													game.showTip([
														"Yes please!",
													], game => {
														game.dialog.index = 1;
													}, 80, { talker: "lady"});
												}, 80, {talker: "human"});
											},
										},
										{
											msg: "I'm poor",
											hidden: game => !game.situation.revealPassword || game.countItem("coin"),
											onSelect: game => {
												game.playSound(SOUNDS.HUM);
												game.showTip([
													"Can you spare some change?",
												], game => {
													game.playSound(SOUNDS.HUM_LADY);
													game.showTip([
														"Sure! Here you go",
													], game => {
														game.pickUp({item:"coin", image:ASSETS.GRAB_COIN, message:"1 coin"});
													}, 80, { talker: "lady"});
												});												
											},
										},
										{
											msg: "LEAVE", onSelect: game => {
												game.gotoScene("tavern-entrance");
											}
										},
									],
								},
								{
									options: [
										{
											hidden: game => !game.getSituation("tavern-stranger-zoom").knowPassword,
											msg: "707 - 8008",
											onSelect: game => {
												game.playSound(SOUNDS.HUM);
												game.showTip([
													"Alright, not sure if I can trust you this time,",
													"but I'll take my chances.",
													"Keep it a secret:",
													"To get in, the password is",
													`${"707 - 8008"}`,
												], game => {
													game.situation.revealPassword = game.now;
													game.playSound(SOUNDS.HUM_LADY);
													game.showTip([
														"707 - 8008, got it.",
														"Thank you! I will tell that to all my friends!",
														"Here's a token of my\ngratitude",
													], game => {
														game.pickUp({item:"coin", image:ASSETS.GRAB_COIN, message:"1 coin",
															onPicked: game => {
																game.playSound(SOUNDS.HUM_LADY);
																game.showTip([
																	"I'm a rich and\ngenerous lady ...",
																], null, 80, { talker:"lady"});
															},
														});
														game.dialog.index = 0;
													}, 80, { talker: "lady"});
												});
											},
										},
										{
											msg: "I don't know",
											onSelect: game => {
												game.playSound(SOUNDS.HUM);
												game.showTip([
													"I actually don't know the password.",
												], game => {
													game.playSound(SOUNDS.HUM_LADY);
													game.showTip([
														"Pff... get out of here!",
													], game => {
														game.dialog.index = 0;
													}, 80, { talker: "lady"});
												});
											},
										},
										{
											msg: "Nevermind", onSelect: game => {
												game.dialog.index = 0;
											},
										},
									],
								},
							],
						});						
					}, 80, { talker:"lady" });
				},
				index: game => game.pendingTip && game.pendingTip.talker === "lady" && game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 4 : 0,
			},
			{
				src: ASSETS.ZOOM_TAVERN_DOOR_SMOKE, col: 2, row: 2,
				index: ({now}) => Math.floor(now / 300) % 4,
			},
			{
				src: ASSETS.ZOOM_TAVERN_DOOR_ROBOT, col: 3, row: 3,
				offsetY: game => Math.round(Math.sin(game.now / 600) * 3), 
				onClick: game => {
					game.waitCursor = true;
					game.showTip([
						"The tavern is for members only.",
					], game => {
						game.waitCursor = false;
						game.startDialog({
							conversation: [
								{
									options: [
										{ 
											msg: "Got the password",
											onSelect: game => {
												game.waitCursor = true;
												game.showTip("Go ahead, enter the password.", game => {
													game.dialog = null;
													game.sceneData.showDigits = game.now;
													game.delayAction(game => {
														game.waitCursor = false;
														game.gotoScene("robot-dial");
													}, 1000);
												}, 80, {talker: "robot"});
											},
										},
										{
											msg: "Become a member",
											onSelect: game => {
												game.playSound(SOUNDS.HUM);
												game.showTip("How do I become a member?", game => {
													game.showTip("You come inside and talk with the patron.", game => {
														game.playSound(SOUNDS.HUM);
														game.showTip("But I can't come inside if I'm not a member!");
													}, 80, {talker: "robot"});
												});
											},
										},
										{
											msg: "LEAVE", onSelect: game => {
												game.gotoScene("tavern-entrance");
											}
										},
									],
								},
							],
						});
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
				index: game => {
					if (game.sceneData.showDigits) {
						return 4 + Math.min(3, Math.floor((game.now - game.sceneData.showDigits)/200));
					}
					return game.pendingTip && game.pendingTip.talker === "robot" && game.pendingTip.progress < 1 ? Math.floor(game.now / 30) % 4 : 0;
				},
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);
