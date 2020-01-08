const Game = (() => {
	this.title = "Where in Space is Baby Hitler?";

	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = canvas.width;
	maskCanvas.height = canvas.height;
	const maskCtx = maskCanvas.getContext("2d");

	const tempCanvas = document.createElement("canvas");
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	tempCtx = tempCanvas.getContext("2d");

	const touchCanvas = document.getElementById("touch-canvas");
	const touchCtx = touchCanvas.getContext("2d");

	const letterCanvas = document.createElement("canvas");
	letterCanvas.width = canvas.width;
	letterCanvas.height = canvas.height;
	letterCtx = letterCanvas.getContext("2d");

	const AudioContext = window.AudioContext || window.webkitAudioContext;

	let TEXTSPEEDER = 1;
	const SAVES_LOCATION = "saves";
	const LAST_CONTINUE = "last";

	const MAX_LOAD_ERRORS = 800;

	const TOUCH_SPRITES = {
		LEFT: {
			src: ASSETS.TOUCH_ARROWS, col: 2, row: 3, size: [64, 32],
			index: game => game.actionDown === LEFT && game.turning ? 1 : 0,
			side: LEFT,
			hidden: game => game.sceneData.freeFormMove || !game.canTurn("left") && !game.evaluate(game.currentScene.canGo, LEFT),
			onClick: game => game.processArrow(LEFT),
			alpha: .5,
		},
		RIGHT: {
			src: ASSETS.TOUCH_ARROWS, col: 2, row: 3, size: [64, 32],
			index: game => game.actionDown === RIGHT && game.turning ? 1 : 0,
			side: RIGHT,
			hidden: game => game.sceneData.freeFormMove || !game.canTurn("right") && !game.evaluate(game.currentScene.canGo, RIGHT),
			onClick: game => game.processArrow(RIGHT),
			alpha: .5,
		},
		FORWARD: {
			src: ASSETS.TOUCH_ARROWS, col: 2, row: 3, size: [64, 32],
			index: game => 2 + (game.actionDown === FORWARD && game.moving ? 1 : 0),
			hidden: game => game.sceneData.freeFormMove || (!game.pos || !game.canMove(game.pos, 1)) && !game.evaluate(game.currentScene.canGo, FORWARD),
			onClick: game => game.processArrow(FORWARD),
			alpha: .5,
		},
		BACKWARD: {
			src: ASSETS.TOUCH_ARROWS, col: 2, row: 3, size: [64, 32],
			index: game => 4 + (game.actionDown === BACKWARD && game.moving ? 1 : 0),
			hidden: game => game.sceneData.freeFormMove || (!game.pos || !game.canMove(game.pos, -1)) && !game.evaluate(game.currentScene.canGo, BACKWARD),
			onClick: game => game.processArrow(BACKWARD),
			alpha: .5,
		},
		PUNCH: {
			src: ASSETS.TOUCH_PUNCH, col: 1, row: 2, size: [64, 32],
			index: game => game.mouseDown && !game.arrow ? 1 : 0,
			side: LEFT,
			hidden: game => !game.battle || game.battle.foeDefeated,
		},
		BLOCK: {
			src: ASSETS.TOUCH_PUNCH, col: 1, row: 2, size: [64, 32],
			index: game => game.mouseDown && game.arrow === BLOCK ? 1 : 0,
			side: RIGHT,
			hidden: game => !game.battle || game.battle.foeDefeated,
		},
		MULTI_ARROWS: {
			src: ASSETS.MULTI_ARROWS, size: [64, 32],
			hidden: game => game.battle || !game.sceneData.freeFormMove,
			onRefresh: (game, sprite) => {
				const cx = 32, cy = 18;
				let jx = 0, jy = 0;
				let anyTouch = false;
				for (let i = 0; i < game.touchList.length; i++) {
					const { pageX, pageY } = game.touchList[i];
					const px = (pageX - touchCanvas.offsetLeft) / touchCanvas.offsetWidth * touchCanvas.width;
					const py = (pageY - touchCanvas.offsetTop) / touchCanvas.offsetHeight * touchCanvas.height;					
					jx = px;
					jy = py;
					anyTouch = true;
				}
				if (anyTouch) {
					if (!game.mouse) {
						game.mouse = game.lastMousePos ? game.lastMousePos : {
							x: canvas.width / 2,
							y: canvas.height / 2,
							fromTouch: true,
						};					
					}
					game.mouse.x = jx;
					game.mouse.y = jy + 30;
					game.mouseDown = true;
				} else {
					// game.mouse = null;
					// game.mouseDown = false;
				}
			},
		},
		JOYPAD: {
			hidden: game => !game.sceneData.joy,
			onRefresh: (game, sprite) => {
				const { sceneData } = game;
				if (!sceneData.joystick) {
					sceneData.joystick = {};
				}
				const cx = 50, cy = 18;
				let jx = 0, jy = 0;
				for (let i = 0; i < game.touchList.length; i++) {
					const { pageX, pageY } = game.touchList[i];
					const px = (pageX - touchCanvas.offsetLeft) / touchCanvas.offsetWidth * touchCanvas.width;
					const py = (pageY - touchCanvas.offsetTop) / touchCanvas.offsetHeight * touchCanvas.height;					
					const djx = (px - cx);
					const djy = (py - cy);
					if (px > 32) {
						const dist = Math.sqrt(djx * djx + djy * djy);
						jx = djx / dist * Math.min(dist, 5);
						jy = djy / dist * Math.min(dist, 5);
					}
				}
				sceneData.joystick.jx = jx;
				sceneData.joystick.jy = jy;

				if (!game.mouse) {
					game.mouse = game.lastMousePos ? game.lastMousePos : {
						x: canvas.width / 2,
						y: canvas.height / 2,
						fromTouch: true,
					};
				}
				const dist = Math.sqrt(jx*jx + jy*jy);

				const { gameScreen } = sceneData;
				const limitLeft = gameScreen ? gameScreen.x + 1 : 0;
				const limitTop = gameScreen ? gameScreen.y + 1 : 0;
				const limitBottom = gameScreen ? gameScreen.y + gameScreen.height - 2 : canvas.height;
				const limitRight = gameScreen ? gameScreen.x + gameScreen.width - 2 : canvas.height;
				const speed = gameScreen ? .3 : 1;
				if (dist) {
					game.mouse.x = game.mouse.x + jx / dist * speed;
					game.mouse.y = game.mouse.y + jy / dist * speed;
				}
				game.mouse.x = Math.max(limitLeft, Math.min(limitRight, game.mouse.x));
				game.mouse.y = Math.max(limitTop, Math.min(limitBottom, game.mouse.y));
			},
			custom: (game, sprite, ctx) => {
				const cx = 50, cy = 18;
				ctx.fillStyle = "#888888";
				ctx.beginPath();
				ctx.arc(cx, cy, 10, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#555555";
				ctx.beginPath();
				ctx.arc(cx, cy, 4, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#bbbbbb";
				ctx.beginPath();
				ctx.arc(cx, cy, 2, 0, Math.PI * 2);
				ctx.fill();

				const { jx, jy } = game.sceneData.joystick;

				const joyTop = 6;
				ctx.fillStyle = "#bbbbbb";
				ctx.beginPath();
				ctx.moveTo(cx - 2, cy);
				ctx.lineTo(cx + 2, cy);
				ctx.lineTo(cx + jx + 2, cy + jy - joyTop);
				ctx.lineTo(cx + jx - 2, cy + jy - joyTop);
				ctx.lineTo(cx - 2, cy);
				ctx.closePath();
				ctx.fill();

				ctx.strokeStyle = "#ffffff";
				ctx.beginPath();
				ctx.moveTo(cx - 1, cy);
				ctx.lineTo(cx + jx -1, cy + jy - joyTop);
				ctx.stroke();

				ctx.fillStyle = "#77bb77";
				ctx.beginPath();
				ctx.arc(cx + jx, cy + jy - joyTop, 6, 0, Math.PI * 2);
				ctx.fill();				
				ctx.fillStyle = "#FFFFFF";
				ctx.beginPath();
				ctx.arc(cx + jx - 2, cy + jy - joyTop - 2, 2, 0, Math.PI * 2);
				ctx.fill();				
			},
		},
		JOYBUTTON: {
			hidden: game => !game.sceneData.joy,
			onRefresh: (game, sprite) => {
				if (!game.sceneData.joystick) {
					game.sceneData.joystick = {};
				}
				game.sceneData.joystick.pressed = 0;
				for (let i = 0; i < game.touchList.length; i++) {
					const { pageX, pageY } = game.touchList[i];
					const px = (pageX - touchCanvas.offsetLeft) / touchCanvas.offsetWidth * touchCanvas.width;
					const py = (pageY - touchCanvas.offsetTop) / touchCanvas.offsetHeight * touchCanvas.height;					
					if (px < 32) {
						game.sceneData.joystick.pressed = game.now;
					}
				}
				game.mouseDown = game.sceneData.joystick.pressed;
			},
			custom: (game, sprite, ctx) => {
				const cx = 16, cy = 18;
				ctx.fillStyle = "#888888";
				ctx.beginPath();
				ctx.arc(cx, cy, 8, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#222222";
				ctx.beginPath();
				ctx.arc(cx, cy, 7, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = "#bb5555";
				ctx.beginPath();
				ctx.arc(cx, cy+1, 6, 0, Math.PI * 2);
				ctx.fill();				

				const { pressed } = game.sceneData.joystick;	
				const joyTop = pressed ? 1 : 4;

				ctx.fillStyle = "#ff7777";
				ctx.beginPath();
				ctx.arc(cx, cy - joyTop, 6, 0, Math.PI * 2);
				ctx.fill();				
			},			
		},
		DIALOG: {
			custom: (game, sprite, ctx) => {
				// TODO DIALOG
			},
		},
	};

	function nop() {}

	function toMap(string) {
		if (!string) {
			return null;
		}
		const lines = string.split("\n").map(line => line.trim()).filter(line => line != "");
		lines.reverse();		
		return lines;
	}

	function getCell(map, x, y) {
		if (!map) {
			console.error("You need a map!");
			return;
		}
		if (y < 0 || y >= map.length || !map[y] || x < 0 || x >= map[y].length) {
			return 'X';
		}
		return map[y][x];
	}

	const imageStock = {};
	const soundStock = {};
	let gameInstance;

	const gameSettings = {};

	// ['N','NW','W','SW','S','SE','E','NE'];
	const ROTATION_FRAMES = [
		[1, 0, 7],
		[2, 4, 6],
		[3, 4, 5],
	];

	class Game {
		static setTextSpeeder(value) {
			TEXTSPEEDER = value;
			console.log("TextSpeeder", TEXTSPEEDER);
		}

		static start(gameConfig) {
			gameInstance = new Game();
			gameInstance.config = gameConfig;
			gameConfig.scenes.forEach(scene => {
				gameInstance.onSceneAdded(scene);
			});
			return gameInstance;
		}

		playGame() {
			this.play();

			if (location.hash.split("#")[1]) {
				this.gotoScene(location.hash.split("#")[1]);
			}			
		}

		getMapInfo(map, door) {
			if (!map) {
				return null;
			}
			for (let row = 0; row < map.length; row++) {
				for(let col = 0; col < map[row].length; col++) {
					if (map[row][col] == door) {
						for (let rotation = 0; rotation < ORIENTATIONS.length; rotation+=2) {
							if (this.matchCell(map,col,row,0,1,ORIENTATIONS[rotation],'','X12345')) {
								const [ x, y ] = Game.getPosition(col, row, 0, 1, ORIENTATIONS[rotation]);
								return {
									pos: { x, y },
									rotation,
								};
							}
						}

						return this.matchCell(this.map,col,row,0,+1,this.orientation,'12345',[]);

						return {
							x: col, y: row + 1,
						};
					}
				}
			}
			throw new Error(`Invalid map. Missing door ${door}`);
		}

		emptyBag() {
			for (let i in this.inventory) {
				return false;
			}
			return true;
		}

		addToInventory(obj) {
			if (this.inventory[obj.item]) {
				const { count } = obj;
				this.inventory[obj.item].count = this.countItem(obj.item) + (count||1);
			} else {
				this.inventory[obj.item] = obj;
			}
		}

		removeFromInventory(item, count) {
			if (this.inventory[item]) {
				if (this.inventory[item].count) {
					this.inventory[item].count-= (count||1);
				}
				if (!this.inventory[item].count) {
					delete this.inventory[item];
				}
			}
		}

		countItem(item) {
			return this.inventory[item] ? this.inventory[item].count || 1 : 0;
		}

		set sceneName(name) {
			if (name !== this.sceneName) {
				this.data.scene = {
					name,
				};
				console.log("SCENE", this.data.scene.name);
			}
		}

		get sceneName() {
			return (this.data.scene ? this.data.scene.name : null) || this.config.scenes.filter(scene => scene.startScene)[0].name;
		}

		unlock(cell) {
			if (!this.situation.unlocked) {
				this.situation.unlocked = {};
			}
			if (!this.situation.unlocked[cell]) {
				this.situation.unlocked[cell] = this.now;
				return true;
			}
			return false;
		}

		constructor() {
			this.imageStock = imageStock;
			this.soundStock = soundStock;
			this.keyboard = [];
			document.addEventListener("keydown", ({keyCode}) => {
				this.keyboard[keyCode] = true;
			});

			document.addEventListener("keyup", ({keyCode}) => {
				this.keyboard[keyCode] = false;
			});

			canvas.addEventListener("mousemove", ({currentTarget, offsetX, offsetY}) => {
				const { offsetWidth, offsetHeight } = currentTarget;
				this.actionMove(offsetX, offsetY, offsetWidth, offsetHeight);
			});

			canvas.addEventListener("mousedown", e => {
				e.preventDefault();
				const { currentTarget, offsetX, offsetY} = e;
				const { offsetWidth, offsetHeight } = currentTarget;
				this.actionClick(offsetX, offsetY, offsetWidth, offsetHeight);

				if (this.pendingTip) {
					this.pendingTip.time -= 400;
					this.playSound(SOUNDS.BOP, {volume: .2});
					this.sceneData.flashTip = this.now;
				}
				if (this.pickedUp && this.pickedUp.tip) {
					this.pickedUp.tip.time -= 400;
					this.playSound(SOUNDS.BOP, {volume: .2});
					this.sceneData.flashTip = this.now;					
				}
			});

			canvas.addEventListener("mouseleave", () => {
				this.arrow = 0;
				this.lastMousePos = null;
				this.mouse = null;
				this.mouseDown = 0;
				this.actionDown = 0;
			});

			document.addEventListener("mouseup", e => {
				this.actionDown = 0;
				this.mouseDown = 0;
				this.clicking = false;
			});

			document.addEventListener("keydown", ({keyCode}) => {
				switch(keyCode) {
					case 65: case 81:
						this.turnLeft(this.now);
						break;
					case 68: case 69:
						this.turnRight(this.now);
						break;
					case 32:
						this.performAction(this.now);
						break;
					default:
				}
			});

			const self = this;
			this.touchActive = false;

			//	FIRST TIME SONG ACTIVATION
			// document.addEventListener('touchend', function makeFull(e) {
			// 	touchActive = true;
			// 	self.toggleFullScreen(true);
			// 	e.preventDefault();
			// 	document.removeEventListener('touchend', makeFull);
			// });

			document.addEventListener('touchend', function activateMotion(e) {
				self.touchActive = true;

				if (!document.fullscreenElement && !self.disableFullScreen) {
					self.toggleFullScreen();
					e.preventDefault();
					e.stopPropagation();
				} else {
					if (e.target === canvas) {
						const { target, changedTouches } = e;
						const [ touch ] = changedTouches;
						const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = target;
						self.actionClick(touch.clientX - offsetLeft, touch.clientY - offsetTop, offsetWidth, offsetHeight, true);
					}
				}
				document.removeEventListener('touchend', activateMotion);

				registerAllTouchEvents(self);
			});

			const touchCanvas = document.getElementById("touch-canvas");
			function registerAllTouchEvents(game) {

				//	SONG ACTIVATION
				document.addEventListener('touchend', e => {
					if (game.data.theme && game.soundStock[game.data.theme.song]) {
						const audio = game.soundStock[game.data.theme.song].audio;
						if (!audio.played.length) {
							//	play blocked song
							audio.play();
							console.log("Unblocking song");
						}
					}
					if (!document.fullscreenElement && !self.disableFullScreen) {
						self.toggleFullScreen();
						e.preventDefault();
						e.stopPropagation();
					}
				});

				////////////////////////////////
				//	CURSOR MODE
				document.addEventListener('touchend', e => {
					if (!game.touchActive) {
						return;
					}
					if (!document.fullscreenElement && !self.disableFullScreen) {
						return;
					}
					if (e.target != canvas && e.target != touchCanvas && !event.touches.length) {
						if (game.mouse)
							game.lastMousePos = game.mouse;
						game.mouse = null;
					}
					game.actionDown = 0;
					game.mouseDown = 0;
					game.clicking = false;
					game.arrow = null;
				});

				canvas.addEventListener('touchmove', e => {
					const { currentTarget, changedTouches } = e;
					const [ touch ] = changedTouches;
					const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = currentTarget;
					game.actionMove(touch.clientX - offsetLeft, touch.clientY - offsetTop, offsetWidth, offsetHeight, true);
				}, {passive:true});

				canvas.addEventListener('touchstart', e => {
					if (!game.touchActive) {
						return;
					}
					if (!document.fullscreenElement && !self.disableFullScreen) {
						return;
					}

					const { currentTarget, changedTouches } = e;
					const [ touch ] = changedTouches;
					const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = currentTarget;

					game.actionMove(touch.clientX - offsetLeft, touch.clientY - offsetTop, offsetWidth, offsetHeight);
					game.checkMouseHover(true);
					game.actionClick(touch.clientX - offsetLeft, touch.clientY - offsetTop, offsetWidth, offsetHeight, true);
					if (game.pendingTip) {
						game.pendingTip.time -= 400;
						game.playSound(SOUNDS.BOP, {volume: .2});
						game.sceneData.flashTip = game.now;
					}
					if (game.pickedUp && game.pickedUp.tip) {
						game.pickedUp.tip.time -= 400;
						game.playSound(SOUNDS.BOP, {volume: .2});
						game.sceneData.flashTip = game.now;					
					}
				}, {passive:true});

				canvas.addEventListener('touchend', e => e.preventDefault());

				self.touchList = {length:0};

				self.touchesSaved = [];
				touchCanvas.addEventListener("touchstart", ({changedTouches, touches}) => {
					self.touchList = touches;
					if (game.sceneData.joy || game.sceneData.freeFormMove && !game.battle) {
						return;
					}

					for (let i = 0; i < changedTouches.length; i++) {
						const {identifier, pageX, pageY} = changedTouches[i];
						const px = (pageX - touchCanvas.offsetLeft) / touchCanvas.offsetWidth * touchCanvas.width;
						const py = (pageY - touchCanvas.offsetTop) / touchCanvas.offsetHeight * touchCanvas.height;
						const pos = { x: px, y: py };

						if (game.battle && !game.battle.foeDefeated) {
							if (pos.x < 32) {
								game.arrow = null;
							} else {
								game.arrow = BLOCK;
							}	
							game.mouse = null;
							game.actionClickAtMouse();
							return;
						}


						for (let arrow in TOUCH_SPRITES) {
							const sprite = TOUCH_SPRITES[arrow];
							if (game.isMouseHover(sprite, pos) && sprite.onClick) {
								sprite.onClick(game, sprite);
								game.mouse = null;
								return;
							}
						}
					}

					for (let i = 0 ; i < changedTouches.length; i++) {
						delete self.touchesSaved[changedTouches[i].identifier];					
					}

					if (!game.mouse) {
						game.mouse = game.lastMousePos ? game.lastMousePos : {
							x: canvas.width / 2,
							y: canvas.height / 2,
							fromTouch: true,
						};
					}
					game.mouse.time = game.now;
					game.lastMouseMove = game.now;
				}, {passive:true});

				touchCanvas.addEventListener("touchmove", e  => {
					const {changedTouches, touches} = e;
					self.touchList = touches;
					if (game.sceneData.joy || game.sceneData.freeFormMove && !game.battle) {
						return;
					}

					Array.prototype.slice.call(changedTouches).forEach(({identifier, pageX, pageY}) => {
						if (!self.touchesSaved[identifier]) {
							self.touchesSaved[identifier] = {
								pageX,
								pageY,
							};
						} else {
							if (game.mouse) {
								const diffX = (pageX - self.touchesSaved[identifier].pageX);
								const diffY = (pageY - self.touchesSaved[identifier].pageY);
								const dist = Math.sqrt(diffX * diffX + diffY * diffY);
								const dx = diffX * canvas.width / canvas.offsetWidth * dist;
								const dy = diffY * canvas.height / canvas.offsetHeight * dist;
								game.mouse.x = Math.max(0, Math.min(canvas.width, game.mouse.x + dx));
								game.mouse.y = Math.max(0, Math.min(canvas.height, game.mouse.y + dy));
								game.mouse.fromTouch = true;
								game.actionMoveMouse();
							}
							self.touchesSaved[identifier].pageX = pageX;
							self.touchesSaved[identifier].pageY = pageY;
						}
					});
				}, {passive:true});

				touchCanvas.addEventListener("touchend", ({changedTouches, touches}) => {
					self.touchList = touches;
					if (game.sceneData.joy || game.sceneData.freeFormMove && !game.battle) {
						return;
					}

					if (game.mouse) {
						if (game.now - game.mouse.time < 400) {
							game.mouse.fromTouch = true;
							game.actionClickAtMouse();
							game.checkMouseHover(true);
							game.actionDown = 0;
							game.mouseDown = 0;
							game.clicking = false;
						}
					}
				});
				//	END CURSOR MODE
				///////////////////////////////////


				document.addEventListener('fullscreenerror', (event) => {
				  	console.error('an error occurred changing into fullscreen', event);
				});
				document.addEventListener("fullscreenchange", () => {
					const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
					const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);				
					const minSize = Math.min(w, h);
					if (!document.fullscreenElement) {
						document.querySelectorAll(".game-size").forEach(({classList, style}) => {
							style.width = ``;
							style.height = ``;
							classList.remove("full");
						});
						document.querySelectorAll(".touch-size").forEach(({classList, style}) => {
							classList.remove("full");
						});
						document.querySelector(".game-container").classList.remove("full");
					} else {
						document.querySelectorAll(".game-size").forEach(({classList, style}) => {
							style.width = `${minSize}px`;
							style.height = `${minSize}px`;
							classList.add("full");
						});
						document.querySelectorAll(".touch-size").forEach(({classList, style}) => {
							classList.add("full");
						});
						document.querySelector(".game-container").classList.add("full");
					}
				});

			}

			window.oncontextmenu = function(event) {
			     event.preventDefault();
			     event.stopPropagation();
			     return false;
			};
		}

		actionMove(x, y, offsetWidth, offsetHeight, fromTouch) {
			if (!this.mouse) {
				this.mouse = {};
			}
			this.mouse.x = x / offsetWidth * canvas.width;
			this.mouse.y = y / offsetHeight * canvas.height;
			this.mouse.fromTouch = fromTouch;
			this.actionMoveMouse();
		}

		actionMoveMouse() {
			if (this.now - this.lastMouseCheck < 100) {
				this.lastMouseCheck = 0;
			}
			this.lastMouseMove = this.now;

			if (this.pendingTip && (this.pendingTip.progress < 1 || this.pendingTip.moreText) && !this.pendingTip.removeLock || this.waitCursor || this.hideCursor) {
				return;
			}
			if (this.pickedUp && this.pickedUp.tip && this.pickedUp.tip.progress < 1) {
				return;
			}

			if (this.arrowGrid) {
				this.arrow = this.getArrow(this.mouse.x, this.mouse.y, 64, 64);
				if (this.mouseDown) {
					this.actionDown = this.arrow;
				}
			}			
		}

		actionClick(x, y, offsetWidth, offsetHeight, fromTouch) {
			if (!this.mouse) {
				this.mouse = {};
			}
			this.mouse.x = x / offsetWidth * canvas.width;
			this.mouse.y = y / offsetHeight * canvas.height;
			this.mouse.fromTouch = fromTouch;

			this.actionClickAtMouse();
		}

		actionClickAtMouse() {
			this.lastMouseMove = this.now;
			this.lastMouseCheck = 0;
			if (this.battle && !this.bagOpening) {
				if (!this.blocking() && !this.battle.playerHit && !this.battle.playerBlock
						&& this.arrow !== BAG 
						&& !(this.battle.dummyBattle && (this.arrow===LEFT || this.arrow===RIGHT))
						&& !this.battle.playerLeftAttack && !this.battle.playerRightAttack
						&& (!this.hoverSprite || !this.evaluate(this.hoverSprite.noPunch, this.hoverSprite))) {
					if (this.onScenePunch(this, this.battle)) {
						if (this.battle.fist === LEFT && !this.battle.playerLeftAttack) {
							this.battle.playerLeftAttack = this.now;
							this.battle.playerAttackLanded = 0;
							this.battle.foeBlock = 0;
						} else if (this.battle.fist === RIGHT && !this.battle.playerRightAttack) {
							this.battle.playerRightAttack = this.now;
							this.battle.playerAttackLanded = 0;
							this.battle.foeBlock = 0;
						}
					}
				}
			}
			if (this.pendingTip && (this.pendingTip.progress < 1 || this.pendingTip.moreText) && !this.pendingTip.removeLock || this.waitCursor || this.hideCursor) {
				return;
			}
			if (this.useItem === "gun" && (!this.hoverSprite || !this.hoverSprite.bag && !this.hoverSprite.menu)) {
				if (this.countItem('bullet') > 0) {
					const { bullet } = this.inventory;
					this.removeFromInventory('bullet');
					this.gunFired = this.now;
					game.playSound(SOUNDS.GUN_SHOT);
				} else {
					this.gunFired = 0;
					game.playSound(SOUNDS.DUD)
				}
				this.mouseDown = this.now;
				return;
			}
			if (this.pickedUp) {
				const { item, onPicked, tip, image } = this.pickedUp;
				if (tip.progress >= 1) {
					this.pickedUp = null;
					this.tips = {};
					this.openBag(this.now, onPicked);
				}
				return;
			}
			if (this.useItem) {
				const { image, item, message, col, row } = this.inventory[this.useItem];
				if (game.isMouseHover({ src: image, index: 3, col, row }, this.mouse)) {
					this.pickUp({item, image, message:message||"", justLooking: true});
					return;
				}
			}				
			if (this.dialog && (!this.pendingTip || this.pendingTip.removeLock)) {
				this.checkHoveredDialog();
				if (this.dialog.hovered) {
					if (this.dialog.hovered.onSelect && !this.dialog.tapped) {
						this.dialog.tapped = this.now;
						this.playSound(SOUNDS.SELECT, {volume: .5});
						const hovered = game.dialog.hovered;
						const dialog = game.dialog;
						this.delayAction(game => {
							dialog.tapped = 0;
							hovered.onSelect(game, dialog, dialog.conversation[dialog.index], hovered);
						}, 180);
					}
					return;
				}
			}
			if (this.data.gameOver) {
				const selection = Math.floor(this.mouse.y / 10) - 4;
				if (selection >= 0 && selection <= 1) {
					if (selection == 0) {
						this.load();
					} else {
						this.restart();
					}
					return;
				}
			}

			this.mouseDown = this.now;

			if (this.mouse) {
				if (!this.hoverSprite || this.hoverSprite.bag || this.hoverSprite.menu) {
					if (this.arrowGrid && !this.useItem && !this.bagOpening && !game.sceneData.showStats) {
						this.arrow = this.getArrow(this.mouse.x, this.mouse.y, 64, 64);
						this.processArrow(this.arrow);
					}
				}
			}
			this.checkMouseHover(true);
		}

		processArrow(arrow) {
			switch(arrow) {
				case LEFT: {
					if (this.onSceneRotate(this, arrow)) {
						return;
					}
					this.turnLeft(this.now);
					this.actionDown = arrow;
					break;
				}
				case RIGHT: {
					if (this.onSceneRotate(this, arrow)) {
						return;
					}
					this.turnRight(this.now);
					this.actionDown = arrow;
					break;
				}
				case DOOR: {
					const { x, y } = this.pos;
					if (this.matchCell(this.map,x,y,0,1,this.orientation,"12345",[])) {
						const cell = this.frontCell();
						const door = this.frontDoor();
						if (!door) {
							console.error("You need doors!");
						} else if (door.lock && (!this.situation.unlocked || !this.situation.unlocked[cell])) {
							this.showTip("It's locked.", null, null, {removeLock:true});
							this.playErrorSound();
						} else {
							if (!this.doorOpening) {
								this.performAction(this.now);
							} else if (this.doors[cell].exit) {
								if (this.doors[cell].wayUp || this.doors[cell].wayDown) {
									this.playSteps();
								}
								this.doors[cell].exit(this, this.doors[cell]);
							} else {
								this.actionDown = arrow;
							}
						}
					} else {
						this.actionDown = arrow;
					}
					break;
				}
				case FORWARD: {
					if (this.onSceneForward(this)) {
						return;
					}
					if (!this.pos) {
						this.actionDown = arrow;
						return;
					}
					const { x, y } = this.pos;
					if (this.matchCell(this.map,x,y,0,1,this.orientation,"12345",[])) {
						if (!this.doorOpening) {
							this.performAction(this.now);
						} else if (this.doors) {
							const cell = getCell(this.map, ... Game.getPosition(x,y,0,1,this.orientation));
							if (this.doors[cell].exit) {
								if (this.doors[cell].wayUp || this.doors[cell].wayDown) {
									this.playSteps();
								}
								this.doors[cell].exit(this, this.doors[cell]);
							} else {
								this.actionDown = arrow;
							}
						} else {
							console.error("You need doors!");
						}
					} else {
						this.actionDown = arrow;
					}
					break;
				}
				case BACKWARD: {
					if (this.onSceneBackward(this)) {
						return;
					}
					this.actionDown = arrow;
					break;
				}
			}			
		}		

		fadeToScene(index, entrance, fadeDuration, afterScene) {
			if (!fadeDuration) {
				fadeDuration = 1000;
			}
			this.waitCursor = true;
			this.fadeOut(this.now, {duration:fadeDuration * 1.5, fadeDuration, color:"#000000", onDone: game => {
				game.waitCursor = false;
				game.gotoScene(index, entrance);
				if (afterScene) {
					afterScene(game);
				}
			}});
		}

		gotoScene(index, entrance, restoreMapInfo) {
			const {door} = entrance || {};
			if (typeof(index) === "string") {
				const sceneToGoTo = index;
				index = this.config.scenes.map(({name}, idx) => name === index ? idx : -1).filter(index => index >= 0)[0];
				if (typeof(index) === 'undefined') {
					console.error(`${sceneToGoTo}: unknown scene.`);
				}
			}
			this.sceneName = this.config.scenes[index].name;
			this.door = door || 1;
			this.loadScene(this.config.scenes[index], restoreMapInfo);
		}

		checkMotionAvailable() {
			this.motionAvailable = false;
			if (this.arrowGrid) {
				this.arrowGrid.forEach(line => {
					line.forEach(cell => {
						if (cell && cell !== BAG && cell !== MENU) {
							this.motionAvailable = true;
						}
					});
				});
			}
		}

		getSceneByName(name) {
			if (this.sceneByName) {
				return this.sceneByName[name];
			}
			return null;			
		}

		get currentScene() {
			return this.getSceneByName(this.sceneName);
		}

		set door (value) {
			this.data.scene.door = value;
		}

		get door () {
			return this.data.scene ? this.data.scene.door || 0 : 0;
		}

		get inventory() {
			return this.data.inventory;
		}

		get situation() {
			const { data, sceneName } = this;
			if (!data.situation[sceneName]) {
				data.situation[sceneName] = {};
			}
			return data.situation[sceneName];
		}

		get mute() {
			return gameSettings.mute || false;
		}

		set mute(value) {
			if (this.mute !== value) {
				gameSettings.mute = value;
				const { theme } = this.data;
				if (theme) {
					if (this.mute) {
						this.stopSound(theme.song);
					} else {
						this.playTheme(theme.song, theme);					
					}
				}
			}
		}

		getSituation(sceneName) {
			const { data, config } = this;
			if (!data.situation[sceneName]) {
				data.situation[sceneName] = {};
			}			
			return data.situation[sceneName];
		}

		hasVisited(sceneName) {
			const { data, config } = this;
			const index = config.scenes.map(({name}, idx) => name === sceneName ? idx : -1).filter(index => index >= 0)[0];
			return data.situation[index];
		}

		pause() {
			this.paused = this.now;
			this.resumed = 0;
			for (let s in SOUNDS) {
				this.stopSound(SOUNDS[s]);
			}
			if (this.tone) {
				this.tone.stop();
			}
		}

		resume() {
			this.paused = 0;
			this.resumed = this.now;
			if (this.data && this.data.theme && this.data.theme.song) {
				this.playTheme(this.data.theme.song, this.data.theme);
			}
			if (this.tone) {
				this.tone.start();
			}
		}

		clearData() {
			this.data = {
				time: 0,
				name: null,
				scene: {},
				pickedUp: {},
				seen: {},
				shot: {},
				inventory: {},
				situation: {},
				pos: { x:0, y:0 },
				rotation: 0,
				gameOver: 0,
				battle: null,
				mute: false,
				stats: null,
				joined: null,
				ship: {},
			};
			this.setupStats();			
		}

		initGame() {
			this.clearData();

			if (this.mouse)
				this.lastMousePos = this.mouse;
			this.mouse = null;
			this.timeOffset = 0;
			this.paused = false;
			this.loadCount = 0;
			this.lastMouseCheck = 0;
			this.lastMouseMove = 0;
			
			this.clickCtx = document.createElement("canvas").getContext("2d");
			this.clickCtx.canvas.width = 3;
			this.clickCtx.canvas.height = 3;

			this.prepareAssets();
			this.prepareSounds(({src}) => {
			});

			this.createLoop(this.refresh.bind(this));
		}

		get orientation() {
			return ORIENTATIONS[Math.floor(this.rotation / 2) * 2];
		}

		get granular_orientation() {
			return ORIENTATIONS[Math.round(this.rotation) % 8];
		}

		initScene() {
			this.actions = [];
			this.keyboard = [];
			this.frameIndex = 0;
			this.doorOpening = 0;
			this.bagOpening = 0;
			this.menuOpening = 0;
			this.doorOpened = 0;
			this.arrow = 0;
			this.actionDown = 0;
			this.fade = 0;
			this.fadeColor = "#000000";
			this.mouseDown = 0;
			this.clicking = false;
			this.hoverSprite = null;
			this.tips = {};
			this.pickedUp = null;
			this.useItem = null;
			this.useItemTime = 0;
			this.pendingTip = null;
			this.hideCursor = false;
			this.waitCursor = false;
			this.hideArrows = false;
			this.sceneData = {
				visited: {},
			};
			this.sceneIntro = false;
			this.mouseHand = null;
			this.gunFired = 0;

			this.map = null;
			this.sprites = null;
			this.doors = null;
			this.events = null;
			this.arrowGrid = null;
			this.sceneTime = 0;
			this.dialog = null;
			this.onScene = null;
			this.onSceneRefresh = null;
			this.onSceneShot = null;
			this.onSceneHoldItem = null;
			this.onSceneUseItem = null;
			this.onSceneForward = null;
			this.onSceneBackward = null;
			this.onSceneBattle = null;
			this.onScenePunch = null;
			this.customCursor = null;
			this.moving = 0;
			this.turning = 0;
			this.setTone(0);
			this.data.gameOver = false;
		}

		markPickedUp(item) {
			if (!this.data.pickedUp[item]) {
				this.data.pickedUp[item] = this.now;
			}
		}

		pickUp({item, image, message, inventoryMessage, count, col, row, index, onPicked, onTipDone, justLooking, hideFromInventory}) {
			if (!item) {
				console.error(`Your item (${image}) needs a name.`);
			}
			const time = this.now;
			if (!justLooking) {
				this.markPickedUp(item);
				this.addToInventory({
					item,
					image: hideFromInventory ? null : image,
					col: col||2,
					row: row||2,
					count: count || 1,
					message: inventoryMessage,
				});
				this.playSound(SOUNDS.PICKUP);
			}

			this.pickedUp = {
				item,
				image,
				time,
				onPicked,
				col: col||2,
				row: row||2,
				index: index||0,
				tip: {
					text: message||"",
					time,
					speed: 100 * TEXTSPEEDER,
					fade: 0,
					end: 0,
					onDone: onTipDone,
				},
			};
			if (!this.bagOpening) {
				this.openBag(this.now)
			}
		}

		getArrow(x, y, width, height) {
			if (this.hideArrows) {
				return 0;
			}
			const quadrantX = Math.min(4, Math.max(0, Math.floor(x / width * 5)));
			const quadrantY = Math.min(4, Math.max(0, Math.floor(y / height * 5)));
			const arrow = this.evaluate(this.arrowGrid[quadrantY][quadrantX]);
			return arrow;
		}

		evaluate(value, extra) {
			if (value && value.constructor === Function) {
				return this.evaluate(value(this, extra));
			}
			return value;
		}

		turnLeft(now, callback) {
			const { map } = this;
			this.turn(now, "left", callback);
		}

		turnRight(now, callback) {
			const { map } = this;
			this.turn(now, "right", callback);
		}

		turn(now, direction, callback) {
			if (this.battle) {
				if (this.battle.dummyBattle) {
					this.setVisited(false);
					this.battle = null;
				}
			}
			if (this.rotation % 2 === 0 && this.canTurn(direction)) {
				this.actions.push({
					time: now,
					frame: 0,
					command: "turn",
					direction,
					rotation: this.rotation,
					active: true,
					started: false,
					repeat: 0,
					onDone: (game, action) => {
						if (game.checkEvents()) {
							action.active = false;
						}
						if (callback) {
							callback(game, action);
						}
					},
				});
				this.tips = {};
			}
		}

		performAction(now) {
			if (this.map) {
				const {x, y} = this.pos;
				const closeDoor = this.matchCell(this.map,x,y,0,1,this.orientation,'12345','');;
				if (closeDoor) {
					this.playSound(SOUNDS.DOOR);
					this.actions.push({
						time: now,
						frame: 0,
						command: "open",
						onStart: () => this.doorOpening = !this.doorOpening ? 1 : -this.doorOpening,
						onDone: game => game.doorOpened = game.doorOpening > 0 ? 1 : 0,
						active: true,
						started: false,
					});
				}
			}
		}

		openBag(now, onClose) {
			if (this.processingBag) {
				return;
			}
			this.processingBag = true;
			this.actions.push({
				time: now,
				command: "openbag",
				onStart: () => this.bagOpening = !this.bagOpening ? 1 : -this.bagOpening,
				onDone: game => {
					if(game.bagOpening < 0) {
						game.bagOpening = 0;
						if (onClose) {
							onClose(game);
						}
					} else if (game.bagOpening > 0 && game.useItem) {
						game.useItem = null;
					}
					this.processingBag = false;
				},
				active: true,
				started: false,
			});
			if (this.pendingTip) {
				this.pendingTip.end = game.now;
			}
		}

		openMenu(now, onClose) {
			this.actions.push({
				time: now,
				command: "openmenu",
				onStart: () => this.menuOpening = !this.menuOpening ? 1 : -this.menuOpening,
				onDone: game => {
					if(game.menuOpening < 0) {
						game.menuOpening = 0;
						if (onClose) {
							onClose(game);
						}
					}
				},
				active: true,
				started: false,
			});
		}

		fadeOut(now, {duration, fadeDuration, color, onDone, max}) {
			this.actions.push({
				time: now,
				command: "fadeOut",
				color: color || "#000000",
				onDone,
				duration,
				fadeDuration,
				active: true,
				started: false,
				max: max || 1,
			});
		}

		refreshMove() {
			if (!this.map) {
				return;
			}
			let dy = 0;
			if (this.keyboard[87]) {
				dy++;
			}
			if (this.keyboard[83]) {
				dy--;
			}
			if (this.actionDown) {
				dy = this.actionDown === FORWARD ? 1 : this.actionDown === BACKWARD ? -1 : 0;
			}
			if (dy < 0) {
				this.moveBack(this.now);
			} else if (dy > 0) {
				this.moveForward(this.now);
			}
		}

		refreshActions() {
			this.actions.forEach(action => {
				const {time, command, direction, active, onDone, onStart, started} = action;
				if (!active) {
					return;
				}
				if (!started) {
					action.started = true;
					if (onStart) {
						onStart(this, action);
					}
				}

				switch (command) {
					case "move": {
						action.frame = Math.floor((this.now - time) / 120);
						if (action.frame < 4) {
							this.frameIndex = direction === "forward" ? 3 - action.frame : direction === "backward" ? action.frame : 0;
						} else {
							this.frameIndex = 0;
							if (onDone) {
								onDone(this, action);
							}
							const dy = direction === "forward" ? 1 : -1;
							if (action.repeat && action.active && this.canMove(this.pos, dy)) {
								action.repeat--;
								const {x, y} = this.pos;
								if (this.matchCell(this.map,x,y,0,dy,this.orientation,'X12345',"")) {
									action.active = false;
								} else {
									action.started = false;
									action.time = this.now;
									this.doorOpening = 0;
									this.doorOpened = 0;
									this.moving = this.now;
								}
							} else {
								action.active = false;
							}
						}
						break;
					}
					case "open": {
						const frame = Math.floor((this.now - time) / 150);
						if (frame < 4) {
							this.frameIndex = Math.min(3, this.doorOpening > 0 ? frame : 3 - frame);
						} else {
							if (onDone) {
								onDone(this, action);
							}
							action.active = false;
						}
						break;
					}
					case "openbag": {
						const frame = Math.floor((this.now - time) / 80);
						if (frame < 4) {
							this.frameIndex = Math.min(3, this.bagOpening > 0 ? frame : 3 - frame);
						} else {
							if (onDone) {
								onDone(this, action);
							}
							action.active = false;
						}
						break;
					}
					case "openmenu": {
						const frame = Math.floor((this.now - time) / 50);
						if (frame < 4) {
							this.frameIndex = Math.min(3, this.menuOpening > 0 ? frame : 3 - frame);
						} else {
							if (onDone) {
								onDone(this, action);
							}
							action.active = false;
						}
						break;						
					}
					case "turn": {
						const frame = Math.floor((this.now - time) / 150);

						const cycle = 2;
						if (frame < cycle) {
							const dr = direction === "left" ? 1 : direction === "right" ? -1 : 0;
							if (!dr) {
								throw new Error("invalid direction");
							}
							this.rotation = (action.rotation + dr * (frame + 1) + 8) % 8;
							if (!this.turning) {
								this.turning = this.now;
							}
						} else {
							if (onDone) {
								onDone(this, action);
							}
							action.active = false;
							this.turning = 0;
						}
						break;
					}
					case "fadeOut": {
						const { duration, fadeDuration, color, max } = action;
						this.fadeColor = color;
						this.fade = Math.min(max, (this.now - time) / fadeDuration);
						if (this.now - time > duration) {
							if(onDone) {
								onDone(this, action);
							}
							action.active = false;
						}
						break;
					}
					case "delay": {
						const { delay } = action;
						if (this.now - time > delay) {
							if(onDone) {
								onDone(this, action);
							}
							action.active = false;
						}
					}
					break;
				}
			});
		}

		showTip(message, onDone, speed, options) {
			const { removeLock, x, y, talker, maxLines } = options || {};
			if (Array.isArray(message)) {
				let index = 0;

				message = message.filter(a => a);
				if (message.length) {
					const tip = this.pendingTip = {
						maxLines,
						index,
						text: message[index],
						time: this.now + 200,
						speed: (speed || 80) * TEXTSPEEDER,
						end: 0,
						x, y,
						talker,
						moreText: message.length > 1,
						onDone: message.length === 1 ? onDone : game => {
							index++;
							tip.index = index;
							tip.text = message[index];
							tip.time = game.now + 200;
							if (index === message.length-1) {
								tip.onDone = onDone;
							}
							this.pendingTip = tip;
						},
						removeLock,
					};
				}
			} else {
				this.pendingTip = {
					maxLines,
					text: message,
					time: this.now + 200,
					speed: (speed || 90) * TEXTSPEEDER,
					end: 0,
					x, y,
					talker,
					onDone,
					removeLock,
				};
			}
		}

		startDialog(dialog) {
			this.dialog = dialog;
			dialog.time = game.now;
			dialog.index = dialog.index || 0;
		}

		checkMouseHover(checkClick) {
			if (this.now - this.lastMouseCheck < 300 && !checkClick) {
				return;
			}
			this.lastMouseCheck = this.now;

			if (this.mouse) {
				let hovered = null;
				for (let i = this.sprites.length - 1; i >= 0; i--) {
					const sprite = this.sprites[i];
					if ((sprite.onClick || sprite.onHover || sprite.onShot || this.evaluate(sprite.tip, sprite) || this.useItem && sprite.name || this.useItem && sprite.combine) && !this.actionDown && !this.evaluate(sprite.blockMouse, sprite)) {
						if (this.isMouseHover(sprite, this.mouse)) {
							if (this.mouseDown && !this.clicking) {
								if (this.useItem && !sprite.bag && !sprite.menu) {
									const { combine, combineMessage, name, onShot } = sprite;
									if (this.useItem === "gun" && this.gunFired) {
										this.data.shot[name] = this.now;
										let handled = false;
										if (onShot) {
											handled = onShot(this, sprite);
										}
										if (!handled) {
											this.onSceneShot(this, name);
										}
									} else if (!combine || !combine(this.useItem, this, sprite)) {
										if (this.useItem !== "gun") {
											this.showTip(combineMessage && combineMessage(this.useItem, this) ||
												(name ? `You can't use ~the ${this.useItem}~ on ~the ${name}~.` : `You can't use ~the ${this.useItem}~ like that.`),
												() => {}, 70, {removeLock: true});
											this.useItem = null;
										}
									}
								} else if (sprite.onClick && checkClick) {
									sprite.onClick(this, sprite);
								} else if (sprite.tip) {
									const hoveredTip = this.evaluate(sprite.tip, sprite);
									if (hoveredTip) {
										const tip = this.tips[hoveredTip];
										if (tip) {
											tip.time = Math.min(this.now, tip.time);
										}
									}									
								}
								return;
							}
							hovered = sprite;
							if (!hovered.bag && !hovered.menu && !this.battle) {
								this.arrow = 0;
							}
							break;
						}
					}
				}
				if (this.hoverSprite !== hovered) {
					if (this.hoverSprite !== null) {
						if (this.hoverSprite.onHoverOut) {
							this.hoverSprite.onHoverOut(this, this.hoverSprite, hovered);
						}
						this.hoverSprite.hoverTime = 0;
					}
					this.hoverSprite = hovered;
					if (hovered) {
						hovered.hoverTime = game.now;
						if (this.hoverSprite.onHover) {
							this.hoverSprite.onHover(this, this.hoverSprite);
						}
					}
				}
			}
		}

		checkUseItem() {
			if (this.mouseDown && !this.actionDown && !this.clicking) {
				this.clicking = true;
				if (this.useItem === "gun") {
					if (this.gunFiredWithin(100)) {
//						this.onSceneShot(this, this.useItem);
					}
				} else if (this.useItem) {
					this.onSceneUseItem(this, this.useItem);
				}
			}
		}

		isMouseHover(sprite, mouse) {
			if (this.evaluate(sprite.hidden, sprite)) {
				return false;
			}
			if (this.evaluate(sprite.mouseHovered, sprite)) {
				return true;
			}
			const { x, y } = mouse;

			const { clickCtx } = this;
			clickCtx.clearRect(0, 0, clickCtx.canvas.width, clickCtx.canvas.height);

			// const shiftX = (game.evaluate(sprite.offsetX, sprite) || 0) - x + 1;
			// const shiftY = (game.evaluate(sprite.offsetY, sprite) || 0) - y + 1;

			const shiftX = - x + 1;
			const shiftY = - y + 1;
			clickCtx.translate(shiftX, shiftY);
			this.displayImage(clickCtx, sprite);
			clickCtx.resetTransform();
			const pixels = clickCtx.getImageData(0, 0, 3, 3).data;
			for (let i = 0; i < pixels.length; i += 4) {
				if (pixels[i + 3] > 0) {
					return true;
				}
			}
			return false;
		}

		canTurn(direction) {
			if (this.battle) {
				return false;
			}
			if (this.sceneData.freeFormMove) {
				return true;
			}
			if (!this.motionAvailable) {
				return false;
			}
			if (this.dialog) {
				return false;
			}
			if (this.sceneData.noTurn) {
				return false;
			}
			return !this.battle || this.battle.dummyBattle;
		}

		isBlocked({x, y}, dx, dy, goingBackwards) {
			const closeWallWithDirection = this.matchCell(this.map,x,y,dx,dy,this.orientation,"MXO",'');;
			if (closeWallWithDirection) {
				return true;
			}
			const closeDoorWithDirection = this.matchCell(this.map,x,y,dx,dy,this.orientation,'12345','');;
			if (closeDoorWithDirection && (!this.doorOpened || goingBackwards)) {
				return true;
			}

			const mapPosition = Game.getPosition(x,y,dx,dy,this.orientation);
			const cell = getCell(this.map, ... mapPosition);
			if (this.events && this.events[cell] && this.events[cell].blocking) {
				return true;
			}

			return false;			
		}

		canMove(pos, direction) {
			if (this.battle) {
				return false;
			}
			if (this.sceneData.freeFormMove) {
				return true;
			}

			if (direction < 0 && this.evaluate(this.currentScene.canGo, BACKWARD)) {
				return true;
			}
			if (direction > 0 && this.evaluate(this.currentScene.canGo, FORWARD)) {
				return true;
			}

			if (!this.motionAvailable) {
				return false;
			}
			if (!this.map) {
				return false;
			}
			if (this.fade > 0 || this.battle || this.dialog) {
				return false;
			}
			return !this.isBlocked(pos, 0, direction, direction === -1);
		}

		canOpen({x, y}, direction) {
			const closeDoor = this.matchCell(this.map,x,y,0,direction,this.orientation,'12345','');;
			return closeDoor && !this.doorOpened;			
		}

		facingPosition() {
			const { pos, orientation } = this;
			const { x, y } = pos;
			return Game.getPosition(x,y,0,1,orientation);
		}

		behindEvent() {
			const { events } = this;
			if (!events) {
				return null;
			}
			const { pos, orientation } = this;
			const { x, y } = pos;
			const mapPosition = Game.getPosition(x,y,0,-1,orientation);
			const cell = getCell(this.map, ... mapPosition);
			return events[cell];			
		}

		currentEvent() {
			const { events, map } = this;
			if (!events) {
				return null;
			}
			if (this.sceneData.currentEventCell && events[this.sceneData.currentEventCell]) {
				return events[this.sceneData.currentEventCell];
			}
			if (!map) {
				return null;
			}

			const { pos, orientation } = this;
			const { x, y } = pos;
			const mapPosition = Game.getPosition(x, y, 0, 0, orientation);
			const cell = getCell(this.map, ... mapPosition);
			return events[cell];			
		}

		facingEvent() {
			const { events, map } = this;
			if (!events || !map) {
				return null;
			}
			const mapPosition = this.facingPosition();
			const cell = getCell(this.map, ... mapPosition);
			return events[cell];
		}

		furtherEvent() {
			const { events } = this;
			if (!events) {
				return null;
			}
			const { pos, orientation } = this;
			const { x, y } = pos;
			const mapPosition = Game.getPosition(x,y,0,2,orientation);
			const cell = getCell(this.map, ... mapPosition);
			return events[cell];			
		}

		setVisited(value) {
			const mapPosition = this.facingPosition();
			const visitTag = mapPosition.join("_");
			this.sceneData.visited[visitTag] = value;
		}

		checkEvents() {
			const { events, map } = this;
			if (events) {
				if (this.sceneData.currentEventCell) {
					this.triggerEvent(this.sceneData.currentEventCell);
					this.sceneData.currentEventTriggered = this.now;
					return;
				}

				if (map) {
					const mapPosition = this.facingPosition();
					const cell = getCell(map, ... mapPosition);
					if (events[cell]) {
						const visitTag = mapPosition.join("_");
						if (!this.sceneData.visited[visitTag]) {
							if (this.triggerEvent(cell)) {
								this.setVisited(true);							
							}
						}
					}
				}
			}
			return false;
		}

		triggerEvent(cell) {
			const { events } = this;
			if (!events[cell]) {
				return false;
			}
			const { onEvent } = events[cell];
			return onEvent && onEvent(this, events[cell]);
		}

		move(now, direction, callback) {
			const dy = direction === "forward" ? 1 : -1;
			if (!this.canMove(this.pos, dy)) {
				return;
			}
			const onStart = direction === "forward" ? game => game.applyMove(direction, game.orientation) : nop;
			const onDone = direction === "backward" 
				? (game, action) => {
					game.applyMove(direction, game.orientation);
					const { x, y } = game.pos;
					const closeDoor = game.matchCell(game.map,x,y,0,direction,game.orientation,'12345','');;
					game.doorOpening = 0;
					game.doorOpened = 0;
					game.frameIndex = 0;
					if (callback) {
						callback(game);
					}
					if (this.checkEvents()) {
						action.active = false;
					}
				}
				: (game, action) => {
					if (callback) {
						callback(game);
					}
					if (this.checkEvents()) {
						action.active = false;
					}
				};

			const [ action ] = this.actions.filter(action => {
				const {command, active} = action;
				return active && command === "move" && action.direction === direction;
			});
			if (action) {
				if (action.frame === 3 && action.repeat === 0) {
					action.repeat++;
				}
				return;
			}

			this.doorOpening = 0;
			this.doorOpened = 0;
			this.moving = now;
			this.actions.push({
				time: now,
				frame: 0,
				command: "move",
				direction,
				onStart,
				onDone: (game, action) => {
					this.moving = 0;
					onDone(game, action);
				},
				active: true,
				started: false,
				repeat: 0,
			});
			const { yupa } = game.data;
			if (yupa) {
				yupa.rotation = direction === "forward" ? (this.rotation + 4) % 8 : this.rotation;
				if (direction==="forward") {
					yupa.position = Math.random()<.5 ? -9 : 9;
				}
			}
		}

		moveForward(now) {
			this.move(now, "forward");
		}

		moveBack(now) {
			this.move(now, "backward");
		}
		
		applyMove(direction, orientation) {
			const dir = direction === "forward" ? 1 : direction === "backward" ? -1 : 0;
			switch(orientation) {
				case 'N':
					this.pos.y += dir;
					break;
				case 'S':
					this.pos.y -= dir;
					break;
				case 'E':
					this.pos.x += dir;
					break;
				case 'W':
					this.pos.x -= dir;
					break;
			}
		}

		cleanupData() {
			this.actions = this.actions.filter(({active}) => active);
		}

		static getPosition(x, y, dx, dy, orientation) {
			switch(orientation) {
				case 'N':
					return [ x + dx, y + dy ];
				case 'S':
					return [ x - dx, y - dy ];
				case 'E':
					return [ x + dy, y - dx ];
				case 'W':
					return [ x - dy, y + dx ];
			}
		}

		hasLeftWallWhenRotating() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			switch(this.granular_orientation) {
				case 'NW':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,-1,0,'N','.',"")
						: this.matchCell(this.map,x,y,-1,0,'N','XM12345',"");
				case 'SW':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,0,-1,'N','.',"")
						: this.matchCell(this.map,x,y,0,-1,'N','XM12345',"");
				case 'SE':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,1,0,'N','.',"")
						: this.matchCell(this.map,x,y,1,0,'N','XM12345',"");
				case 'NE':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,0,1,'N','.',"")
						: this.matchCell(this.map,x,y,0,1,'N','XM12345',"");
			}
		}

		hasRightWallWhenRotating() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			switch(this.granular_orientation) {
				case 'NW':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,0,1,'N','.',"")
						: this.matchCell(this.map,x,y,0,1,'N','XM12345',"");
				case 'SW':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,-1,0,'N','.',"")
						: this.matchCell(this.map,x,y,-1,0,'N','XM12345',"");
				case 'SE':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,0,-1,'N','.',"")
						: this.matchCell(this.map,x,y,0,-1,'N','XM12345',"");
				case 'NE':
					return this.onDoor() 
						? this.matchCell(this.map,x,y,1,0,'N','.',"")
						: this.matchCell(this.map,x,y,1,0,'N','XM12345',"");
			}
		}

		matchCell(map, x, y, dx, dy, orientation, types, nottypes) {
			const cell = getCell(map, ... Game.getPosition(x,y,dx,dy,orientation));
			return (types.length === 0 || types.indexOf(cell) >= 0) && (!nottypes.length || nottypes.indexOf(cell) < 0);
		}

		mazeHole({direction, distance}) {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			const dx = direction === LEFT ? -1 : direction === RIGHT ? 1 : 0;
			const dy = distance === FURTHER ? 2 : distance === FAR ? 1 : distance === CLOSE ? 0 : 0;
			if (this.onDoor() && this.matchCell(this.map, x, y, dx, dy, this.orientation,".", "")) {
				return false;
			}

			return this.matchCell(this.map,x,y,dx,dy,this.orientation,[], 'XM12345');			
		}

		closeWall() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			if (this.facingEvent() && this.facingEvent().wall) {
				return true;
			}
			return this.matchCell(this.map,x,y,0,+1,this.orientation,'XM12345',[]) || this.matchCell(this.map,x,y,0,0,this.orientation,'12345',[]) && this.frontCell()==='.';
		}

		closeDoor() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,+1,this.orientation,'12345',[])
				|| this.matchCell(this.map,x,y,0,0,this.orientation,'12345',[]) && this.frontCell() === '.';			
		}

		onDoor() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,0,this.orientation,'12345',[]);			
		}

		frontDoor() {
			if (!this.doors) {
				return null;
			}
			return this.doors[this.frontCell()];
		}

		frontCell() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return getCell(this.map, ... Game.getPosition(x,y,0,1,this.orientation));			
		}

		closeMap() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,+1,this.orientation,'M',[]);			
		}

		farMap() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,+2,this.orientation,'M',[]);
		}

		mazeMap({direction, distance}) {
			const { x, y } = this.pos;
			const dx = direction === LEFT ? -1 : direction === RIGHT ? 1 : 0;
			const dy = distance === FURTHER ? 2 : distance === FAR ? 1 : distance === CLOSE ? 0 : 0;
			return this.matchCell(this.map,x,y,dx,dy,this.orientation,"M",[]);			
		}

		mazeFloor(distance) {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,distance,this.orientation,'_',[]);
		}

		farWall() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			if (this.furtherEvent() && this.furtherEvent().wall) {
				return true;
			}
			return this.matchCell(this.map,x,y,0,+2,this.orientation,'XM12345',[]);
		}

		furtherWall() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,+3,this.orientation,'XM12345',[]);
		}

		farDoor() {
			if (!this.pos) {
				return false;
			}
			const { x, y } = this.pos;
			return this.matchCell(this.map,x,y,0,+2,this.orientation,'12345',[]);
		}

		displayArrows() {
			if (this.touchActive) {
				return;
			}
			const { useItem, bagOpening, hideArrows, pickedUp, hideCursor } = this;
			if (useItem || bagOpening || hideArrows || pickedUp || hideCursor) {
				return;
			}
			if (this.data.gameOver || this.battle && this.arrow !== BAG && !this.battle.dummyBattle || game.sceneData.showStats) {
				return;
			}

			const sprites = [];
			const { arrow, pos } = this;
			if (arrow) {
				if (arrow === FORWARD && pos && !this.canMove(pos, 1)) {
				} else if (arrow === BACKWARD && pos && !this.canMove(pos, -1)) {
				} else if (arrow === LEFT && !this.canTurn("left") || arrow === RIGHT && !this.canTurn("right")) {
				} else if (ARROWS[arrow]) {
					const index = this.actionDown ? 1 + Math.floor(this.now / 100) % 3 : 0;
					const { src, side } = ARROWS[arrow];
					sprites.push({ src, side, index });
				}
			}
			sprites.forEach(sprite => this.displayImage(ctx, sprite));
		}

		displayTips() {
			// if (this.bagOpening || this.pickedUp) {
			// 	return;
			// }
			const flash = this.sceneData.flashTip && this.now - this.sceneData.flashTip < 30;
			if (this.pendingTip) {
				const tip = this.pendingTip;
				tip.fade = Math.min(1, (this.now - (tip.end || tip.time + (tip.text.length + 10) * tip.speed)) / 350);
				
				this.displayText(tip, flash);
				if (tip.fade >= 1) {
					this.pendingTip = null;
					this.tips = {};
					if (tip.onDone) {
						tip.onDone(this);
					}
				}
				return;
			}
			if (this.hideCursor || this.waitCursor || this.sceneIntro || this.useItem || this.pickedUp || this.dialog && !this.dialog.paused) {
				return;
			}
			let hoveredTip = null;
			if (this.hoverSprite && this.mouse) {
				hoveredTip = this.evaluate(this.hoverSprite.tip, this.hoverSprite);
				if (hoveredTip) {
					const tip = this.tips[hoveredTip];
					if (!tip) {
						this.tips[hoveredTip] = {
							text: hoveredTip,
							time: this.now + 1000,
							speed: 80 * TEXTSPEEDER,
							end: 0,
						};
					} else {
						tip.end = 0;
					}
				}
			}

			for(let t in this.tips) {
				const tip = this.tips[t];
				if (!tip.end && (!this.hoverSprite || hoveredTip != tip.text)) {
					tip.end = this.now + 200;
				}

				tip.fade = Math.min(1, tip.end ? (this.now - tip.end) / 100 : (this.now - (tip.time + (tip.text.length + 15) * tip.speed)) / 350);
				this.displayText(tip, flash);
				if (tip.fade >= 1) {
					delete this.tips[t];
				}
			}
		}

		displayInventoryTips() {
			if (this.hoverSprite && this.mouse && this.hoverSprite.bag && this.bagOpening&& (this.frameIndex === 2 || this.frameIndex === 3) && !this.pickedUp) {
				let tipItem = null;
				for (let i in this.inventory) {
					if (i !== this.useItem && (!this.pickedUp || i !== this.pickedUp.item)) {
						const { item, image, count, col, row } = this.inventory[i];	
						if (this.isMouseHover({ src: image, index: this.frameIndex-1, col, row }, this.mouse)) {
							tipItem = i;
						}
					}
				}
				if (tipItem) {
					const { item, count } = this.inventory[tipItem];	
					const msg = item==="gun" ? `gun with ${this.countItem('bullet')} bullet${this.countItem('bullet')>1?'s':''}` : (count||1) > 1 ? `${item} x${count}` : `${item}`;
					ctx.fillStyle = "#000000aa";
					const showAbove = this.mouse.y >= 55;
					ctx.fillRect(1, showAbove ? 40 : 57, 62, 7);
					this.displayTextLine(ctx, {msg,  x:3, y: showAbove ? 40 : 58 });
				}
			}
		}

		displayFade({fade, fadeColor}) {
			if (fade > 0) {
				ctx.globalAlpha = fade;
				ctx.fillStyle = fadeColor;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.globalAlpha = 1.0;
			}
		}

		displayCursor() {
			if (this.hideCursor) {
				return;
			}
			if (this.mouse) {
				const { x, y, fromTouch } = this.mouse;
				const px = Math.floor(x)+.5, py = Math.floor(y)+.5;

				const customCursor = this.customCursor ? this.customCursor(this, ctx) : null;
				if (customCursor==="none") {
					return;
				}

				if (this.pendingTip && (this.pendingTip.progress < 1 || this.pendingTip.moreText) && !this.pendingTip.removeLock || this.pickedUp && this.pickedUp.tip && this.pickedUp.tip.progress < 1 || this.waitCursor || customCursor==="wait") {
					const angle = this.now / 200;
					const radius = 2;
					ctx.strokeStyle = "#FFFFFF";
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(x - Math.cos(angle) * radius, y - Math.sin(angle) * radius);
					ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
					ctx.stroke();
				} else if (this.useItem && this.useItem === "gun" && this.arrow !== BAG) {
					ctx.strokeStyle = Math.random() < .5 ? "#FFFFFF" : "#000000";
					ctx.lineWidth = .5;
					ctx.beginPath();
					ctx.moveTo(px, 0);
					ctx.lineTo(px, 64);
					ctx.moveTo(0, py);
					ctx.lineTo(64, py);
					ctx.stroke();
				} else {
					const tipReady = this.hoverSprite && this.evaluate(this.hoverSprite.tip, this.hoverSprite);
					const canClick = this.hoverSprite && this.hoverSprite.onClick && !this.evaluate(this.hoverSprite.preventClick);
					const noHighlight = this.hoverSprite && this.evaluate(this.hoverSprite.noHighlight, this.hoverSprite);
					const canCombine = this.hoverSprite && this.useItem && (this.hoverSprite.name || this.hoverSprite.combine || this.hoverSprite.combineMessage);
					const canOpen = this.map && this.arrow === DOOR && this.matchCell(this.map,this.pos.x,this.pos.y,0,1,this.orientation,"12345",[]) && !this.doorOpening;

					const highLight = !this.data.gameOver && (!this.arrow || this.arrow === DOOR || this.chest) && (tipReady || canClick || canCombine || canOpen) && !this.bagOpening && !noHighlight;
					ctx.strokeStyle = "#00000055";
					ctx.lineWidth = 1;

					if (!highLight) {
						// shadow
						ctx.fillStyle = "#00000099";
						ctx.beginPath();
						ctx.moveTo(px, 2 + py);
						ctx.lineTo(px - (x / 16), 2 + py + 8 - (x / 32));
						ctx.lineTo(px + 4 - (x / 16), 2 + py + 6 + (x / 32));
						ctx.lineTo(px, 2 + py);
						ctx.fill();
					}

					const ydown = this.mouseDown ? 1 : 0;
					const x0 = px - x / 16, y0 = py + 8 - (x / 32);
					const x1 = px + 4 - x / 16, y1 = py + 6 - (x / 32);

					ctx.fillStyle = highLight ? (this.arrow && !this.battle ? "#aaFFaa" : "#FFFFaa") : "#FFFFFF";
					ctx.beginPath();
					ctx.moveTo(px, py + ydown * 2);
					ctx.lineTo(px - (x / 16), py + 8 - (x / 32));
					ctx.lineTo(px + 4 - (x / 16), py + 6 + (x / 32));
					ctx.lineTo(px, ydown * 2 + py);
					ctx.stroke();
					ctx.fill();

					if (!this.mouseDown && !highLight) {
						ctx.strokeStyle = "#aaccFF";
						const mid = (x % 8) / 8;
						ctx.beginPath();
						ctx.moveTo(px, py + ydown * 2);
						ctx.lineTo(x0 * mid + x1 * (1-mid), y0 * mid + y1 * (1-mid));
						ctx.stroke();
					}
				}

				if (this.useItem && this.useItem === "gun") {
					if (!this.mouseHand) {
						this.mouseHand = { x:32, y:32 };
					}
					this.mouseHand.x += (x - this.mouseHand.x) * .15;
					this.mouseHand.y += (y - this.mouseHand.y) * .5;

					ctx.transform(1,0,-(this.mouseHand.x - 32) / 128,1,(this.mouseHand.x - 32) * 1.25, Math.max(0, this.mouseHand.y - 41));
					const { gunFired } = this;
					this.displayImage(ctx, { src: ASSETS.HOLD_GUN, col: 1, row: 2, index: gunFired && this.now - gunFired < 100 ? 1 : 0 });
					ctx.resetTransform();					
				}
			}
		}

		wordwrap(text, col) {
			return text.split("\n").map(text => {
				const split = text.split(" ");
				const array = [];
				let w = 0;
				for(let i = 0; i < split.length; i++) {
					const char = split[i];
					array.push(split[i]);
					if (i < split.length-1) {
						w += split[i].length + 1;
						if (w >= col) {
							w = 0;
							array.push("\n");
						} else {
							array.push(" ");
						}
					}
				}
				return array.join("");
			}).join("\n");
		}

		displayText(tip, flash) {
			let {text} = tip;
			const {time, fade, speed} = tip;
			if (this.now < time) {
				return;
			}

			this.prepareImage(ASSETS.ALPHABET);
			const spriteData = imageStock[ASSETS.ALPHABET];
			if (!spriteData || !spriteData.loaded || this.loadPending) {
				return;
			}
			if (fade >= 1) {
				return;
			}

			text = this.processText(text);

			const frame = Math.floor((this.now - (time||0)) / speed);
			const fullWrappedText = this.wordwrap(text, 12);
			tip.progress = Math.min(1, frame / fullWrappedText.length);
			const lines = fullWrappedText.substr(0, Math.min(text.length, frame)).split("\n").slice(-(tip.maxLines || 3));

			tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
			lines.forEach((msg, row) => {
				this.displayTextLine(tempCtx, {msg, x: (tip.x || 2), y: (row - lines.length) * 7 + (tip.y || 60), noTranslate: true});
			});
			if (fade > 0) {
				ctx.globalAlpha = 1 - fade;
			}
			this.displayOutlinedImage(tempCanvas, flash ? "#444488" : "black", 20);

			if (fade > 0) {
				ctx.globalAlpha = 1;
			}
		}

		countAssets(loaded) {
			let count = 0;
			for (let a in ASSETS) {
				if (!loaded || imageStock[ASSETS[a]] && imageStock[ASSETS[a]].loaded) {
					count++;
				}
			}
			for (let a in SOUNDS) {
				if (!loaded || soundStock[SOUNDS[a]] && soundStock[SOUNDS[a]].loaded) {
					count++;
				}
			}
			if (loaded) {
				count += this.config.scenes.length;
			} else {
				count += document.querySelectorAll("script[src^='config/']").length;
			}
			return count;
		}

		prepareAssets(callback) {
			for (let a in ASSETS) {
				const src = ASSETS[a];
				if (!imageStock[src]) {
					this.prepareImage(src, stock => {
						stock.org = stock.img;
						if (callback) {
							callback(stock);
						}
					});
				}
			}
		}

		prepareSounds(callback) {
			for (let a in SOUNDS) {
				const src = SOUNDS[a];
				if (!soundStock[src]) {
					this.prepareSound(src, stock => {
						if (callback) {
							callback(stock);
						}
					});
				}
			}
		}

		playTheme(song, options) {
			const {volume} = options || {};
			if(this.data.theme && this.data.theme.song !== song) {
				this.stopSound(this.data.theme.song);
			}
			if (song) {
				this.playSound(song, {loop: true, volume});
			}
			this.data.theme = {
				song,
				volume,
			}
		}

		playSoundClone(src) {
			const { audio, clones } = soundStock[src];
			let freeClone = clones.filter(({playing}) => !playing)[0];
			if (!freeClone) {
				freeClone = {
					audio: audio.cloneNode(true),
					playing: false,
				};
				freeClone.audio.addEventListener("ended", e => {
					freeClone.playing = false;
				});
				clones.push(freeClone);
			}
			freeClone.playing = true;
			return freeClone.audio;
		}

		playSound(src, options) {
			if (this.mute) {
				return;
			}
			const {loop, volume} = options || {};
			if (soundStock[src]) {
				const { audio, playing } = soundStock[src];
				if (loop) {
					audio.volume = volume || 1;
					audio.loop = true;
					try {
						audio.play();
					} catch(e) {
						console.log("sound blocked", e);
					}
				} else {
					if (!playing) {
						soundStock[src].playing = true;
					}
					const soundBite = playing ? this.playSoundClone(src) : audio;
					soundBite.volume = volume || .5;
					soundBite.loop = false;
					try {
						soundBite.play();
					} catch(e) {
						console.log("sound blocked", e);
					}
				}
			} else {
				this.prepareSound(src, ({audio}) => {
					soundStock[src] = audio;
					audio.volume = volume || 1;
					try {
						audio.play();
					} catch(e) {
						console.log("sound blocked", e);
					}
				})
			}
		}

		setTone(index, digit) {
			if (index && !this.audioContext) {
				this.audioContext = new AudioContext();
			}
			switch(index) {
				case 0:
					if (this.tone) {
						this.tone.stop();
						this.tone = null;
					}
					break;
				case 1:
					this.setTone(0);
					this.tone = new Tone(this.audioContext, 200, 300);
					this.tone.start();
					break;
				case 2:
					this.setTone(0);
					this.tone = new Tone(this.audioContext, 350, 440);
					this.tone.start();
					break;
				case 3:
					this.setTone(0);
					this.tone = new Tone(this.audioContext, 350, 440);
					this.tone.start();
					break;
				case 4:
					this.setTone(0);
					this.tone = new Tone(this.audioContext, 400, 450);
					this.tone.startRinging();
					break;
				default:
					this.setTone(0);
					const dtmfFrequencies = {
					    "1": {f1: 697, f2: 1209},
					    "2": {f1: 697, f2: 1336},
					    "3": {f1: 697, f2: 1477},
					    "4": {f1: 770, f2: 1209},
					    "5": {f1: 770, f2: 1336},
					    "6": {f1: 770, f2: 1477},
					    "7": {f1: 852, f2: 1209},
					    "8": {f1: 852, f2: 1336},
					    "9": {f1: 852, f2: 1477},
					    // "*": {f1: 941, f2: 1209},
					    "0": {f1: 941, f2: 1336},
					    // "#": {f1: 941, f2: 1477}
					};
					const { f1, f2 } = dtmfFrequencies[digit];
					this.tone = new Tone(this.audioContext, f1, f2);
					this.tone.start();
					this.delayAction(game => {
						game.setTone(0);
					}, 100);
					break;
			}
		}

		stopSound(src, reset) {
			if (src && soundStock[src]) {
				const { audio } = soundStock[src];
				audio.pause();
				if (reset) {
					audio.currentTime = 0;
				}
			}
		}

		prepareSound(src, callback) {
			if (!src) {
				console.error("Invalid sound.");
			}
			const soundData = soundStock[src];
			if (!soundData) {
				const stock = { src, clones: [] };
				const audio = new Audio(src);
				audio.addEventListener("ended", () => {
					stock.playing = false;
				});
				this.loadPending = true;
				const onReady = () => {
					if (!stock.loaded) {
						stock.loaded = true;
						this.loadPending = false;
						this.sceneData.lastFileLoaded = src;
						if (callback) {
							callback(stock);
						}
					}
				};

				audio.addEventListener("canplaythrough", onReady);

				audio.addEventListener("error", () => {
					this.addLoadError(src);
					delete soundStock[src];
					this.loadPending = false;
					if (this.countLoadError > MAX_LOAD_ERRORS) {
						this.tooManyErrors();
						return;
					}
					this.delayAction(game => {
						this.prepareSound(src, data => {
							this.removeLoadError(src);
							if (callback) {
								callback(data);
							}
						});
					}, 5000);
				});
				stock.audio = audio;
				soundStock[src] = stock;
				audio.load();
			}
		}

		addLoadError(src) {
			console.error(`Error: ${src}`);
			if (!this.loadError) {
				this.loadError = {};
				this.loadErrorResolved = {};
			}
			this.loadError[src] = true;
			this.countLoadError = (this.countLoadError || 0) + 1;
			this.showLoadError();
		}

		removeLoadError(src) {
			this.loadErrorResolved[src] = this.now;
			this.showLoadError();
			this.delayAction(game => {
				delete this.loadErrorResolved[src];
				delete this.loadError[src];
				this.showLoadError();
			}, 1000);
		}

		showLoadError() {
			const errors = [];
			for (let src in this.loadError) {
				if (this.loadErrorResolved[src]) {
					errors.push(`<div style="color: #FFFFDD33">✅ <del>Failed to load: ${src}.</del></div>`);
				} else {
					errors.push(`<div>⚠️ Failed to load: <a target=_blank href="${src}">${src}.</a></div>`);
				}
			}
			if (errors.length) {
				showLoadErrors(errors.join(""));
			} else {
				showLoadErrors(null);
			}
		}

		injectImage(src, img) {
			imageStock[src] = {
				loaded: true,
				img,
			};
		}

		tooManyErrors() {
			if (!this.showedTooManyErrors) {
				this.showedTooManyErrors = true;
				showError("Too many load errors. Please check your internet connection.<br>");
			}
		}

		prepareImage(src, callback) {
			const spriteData = imageStock[src];
			if (spriteData) {
				if (spriteData.loaded) {
					if (callback) {
						callback(spriteData);
					}
				} else {
					if (callback) {
						spriteData.img.addEventListener("load", () => {
							callback(spriteData);
						});
						spriteData.img.addEventListener("error", () => {
							this.addLoadError(src);
							if (this.countLoadError > MAX_LOAD_ERRORS) {
								this.tooManyErrors();
								return;
							}
							this.delayAction(game => {
								this.prepareImage(src, data => {
									this.removeLoadError(src);
									if (callback) {
										callback(data);
									}
								});
							}, 5000);
						});
					};
				}
				return;
			}

			const splitPop = src.split("|").pop();

			if (splitPop.indexOf("crop:") === 0) {
				const [ cropX, cropY, cropWidth, cropHeight ] = splitPop.split("crop:").pop().split(",");
				this.prepareImage(src.split("|").slice(0,-1).join("|"), stock => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = cropWidth;
					tempCanvas.height = cropHeight;
					const tempCtx = tempCanvas.getContext("2d");
					tempCtx.drawImage(stock.img, -cropX, -cropY);
					imageStock[src] = {
						loaded: true,
						img: tempCanvas,
					};
					if (callback) {
						callback(imageStock[src]);
					}
				});
				return;				
			}

			if (splitPop === "invert-colors") {
				this.prepareImage(src.split("|").slice(0,-1).join("|"), stock => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = stock.img.naturalWidth || stock.img.width;
					tempCanvas.height = stock.img.naturalHeight || stock.img.height;
					const tempCtx = tempCanvas.getContext("2d");
					tempCtx.drawImage(stock.img, 0, 0);
					const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
					const { data } = imageData;
					for (let i = 0; i < data.length; i+=4) {
						if (data[i + 3]) {
							data[i + 0] = 255 - data[i + 0];
							data[i + 1] = 255 - data[i + 1];
							data[i + 2] = 255 - data[i + 2];
						}
					}
					tempCtx.putImageData(imageData, 0, 0);
					imageStock[src] = {
						loaded: true,
						img: tempCanvas,
					};
					if (callback) {
						callback(imageStock[src]);
					}
				});
				return;
			}

			if (splitPop === "darken") {
				this.prepareImage(src.split("|").slice(0,-1).join("|"), stock => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = stock.img.naturalWidth || stock.img.width;
					tempCanvas.height = stock.img.naturalHeight || stock.img.height;
					const tempCtx = tempCanvas.getContext("2d");
					tempCtx.drawImage(stock.img, 0, 0);
					const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
					const { data } = imageData;
					for (let i = 0; i < data.length; i+=4) {
						if (data[i + 3]) {
							data[i + 0] = Math.max(0, Math.floor(data[i + 0]/2));
							data[i + 1] = Math.max(0, Math.floor(data[i + 1]/2));
							data[i + 2] = Math.max(0, Math.floor(data[i + 2]/2));
						}
					}
					tempCtx.putImageData(imageData, 0, 0);
					imageStock[src] = {
						src,
						loaded: true,
						img: tempCanvas,
					};
					if (callback) {
						callback(imageStock[src]);
					}
				});
				return;
			}

			if (splitPop === "rotate-colors") {
				this.prepareImage(src.split("|").slice(0,-1).join("|"), stock => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = stock.img.naturalWidth || stock.img.width;
					tempCanvas.height = stock.img.naturalHeight || stock.img.height;
					const tempCtx = tempCanvas.getContext("2d");
					tempCtx.drawImage(stock.img, 0, 0);
					const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
					const { data } = imageData;
					for (let i = 0; i < data.length; i+=4) {
						if (data[i + 3]) {
							const temp = data[i + 0];
							data[i + 0] = data[i + 2];
							data[i + 2] = data[i + 1];
							data[i + 1] = temp;
						}
					}
					tempCtx.putImageData(imageData, 0, 0);
					imageStock[src] = {
						src,
						loaded: true,
						img: tempCanvas,
					};
					if (callback) {
						callback(imageStock[src]);
					}
				});
				return;
			}

			if (splitPop === "chroma-key-pink") {
				this.prepareImage(src.split("|").slice(0,-1).join("|"), stock => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = stock.img.naturalWidth || stock.img.width;
					tempCanvas.height = stock.img.naturalHeight || stock.img.height;
					const tempCtx = tempCanvas.getContext("2d");
					tempCtx.drawImage(stock.img, 0, 0);
					const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
					const { data } = imageData;
					for (let i = 0; i < data.length; i+=4) {
						if (data[i + 3]) {
							if (data[i + 0] === 0xFF && data[i + 1] === 0 && data[i + 2] === 0xFF) {
								data[i + 0] = 0;
								data[i + 1] = 0;
								data[i + 2] = 0;
								data[i + 3] = 0;
							}
						}
					}
					tempCtx.putImageData(imageData, 0, 0);
					imageStock[src] = {
						src,
						loaded: true,
						img: tempCanvas,
					};
					if (callback) {
						callback(imageStock[src]);
					}
				});
				return;	
			}

			if (splitPop === "shaved") {
				this.prepareImage(src.split("|").slice(0,-1).join("|"), stock => {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = stock.img.naturalWidth || stock.img.width;
					tempCanvas.height = stock.img.naturalHeight || stock.img.height;
					const tempCtx = tempCanvas.getContext("2d");
					tempCtx.drawImage(stock.img, 0, 0);

					imageStock[src] = {
						src,
						loaded: true,
						img: tempCanvas,
					};
					if (callback) {
						callback(imageStock[src]);
					}
				});
				return;
			}

			if (!spriteData) {
				const stock = { src };
				const img = new Image();
				img.src = src;
				this.loadPending = true;
				img.addEventListener("load", () => {
					stock.loaded = true;
					this.sceneData.lastFileLoaded = src;

					this.loadPending = false;
					if (callback) {
						callback(stock);
					}
				});
				img.addEventListener("error", () => {
					this.addLoadError(src);
					delete imageStock[src];
					this.loadPending = false;

					if (this.countLoadError > MAX_LOAD_ERRORS) {
						this.tooManyErrors();
						return;
					}
					this.delayAction(game => {
						this.prepareImage(src, data => {
							this.removeLoadError(src);
							if (callback) {
								callback(data);
							}
						});
					}, 5000);
				});
				stock.img = img;
				imageStock[src] = stock;
			} else if (callback) {
				callback(spriteData);
			}
		}

		createLoop(callback) {
			const self = this;
			let previousTime = 0;
			function step(timestamp) {
				callback(timestamp - previousTime);
				previousTime = timestamp;
			    self.requestId = requestAnimationFrame(step);
			}
			self.requestId = requestAnimationFrame(step);
		}

		play() {
			this.initGame();
			const firstScene = this.config.scenes.filter(({startScene})=>startScene)[0];
			this.loadScene(firstScene);
		}

		addScene(scene) {
			this.config.scenes.push(scene);
			this.onSceneAdded(scene);
		}

		onSceneAdded(scene) {
			if (this.sceneData) {
				this.sceneData.lastFileLoaded = `config/${scene.name}`;
			}
			if (!this.sceneByName) {
				this.sceneByName = {};
			}
			this.sceneByName[scene.name] = scene;
		}

		loadScene(scene, restoreMapInfo) {
			this.initScene();
			const { map, sprites, doors, arrowGrid, events, customCursor,
				onScene, onSceneRefresh, onSceneShot, onSceneHoldItem, onSceneUseItem,
				onSceneForward, onSceneBackward, onSceneBattle, onScenePunch, onSceneRotate,
			} = scene;
			this.map = toMap(map);
			if (!restoreMapInfo && this.map) {
				const mapInfo = this.getMapInfo(this.map, this.door);
				if (mapInfo) {
					const { pos, rotation } = mapInfo;
					this.pos = pos;
					this.rotation = rotation;
				}
			}
			this.sprites = sprites || [];
			this.doors = doors;
			this.events = events;
			this.arrowGrid = arrowGrid || null;
			this.onSceneRefresh = onSceneRefresh || nop;
			this.onScene = onScene || nop;
			this.onSceneShot = onSceneShot || nop;
			this.onSceneHoldItem = onSceneHoldItem || nop;
			this.onSceneUseItem = onSceneUseItem || nop;
			this.onSceneForward = onSceneForward || nop;
			this.onSceneBackward = onSceneBackward || nop;
			this.onSceneBattle = onSceneBattle || nop;
			this.onScenePunch = onScenePunch || nop;
			this.onSceneRotate = onSceneRotate || nop;
			this.customCursor = customCursor;

			this.checkMotionAvailable();
		}

		get now() {
			return this.data ? this.data.time : 0;
		}

		set now(value) {
			this.data.time = value;
		}

		get pos() {
			return this.data.pos;
		}

		set pos(value) {
			this.data.pos = value;
		}

		get rotation() {
			return this.data.rotation;
		}

		set rotation(value) {
			this.data.rotation = value;
		}

		get battle() {
			return this.data.battle;
		}

		set battle(value) {
			this.data.battle = value;
		}

		set chest(value) {
			this.data.chest = value;
		}

		get chest() {
			return this.data.chest;
		}

		handleSceneEvents() {
			if (!this.sceneTime) {
				this.sceneTime = this.data.time;
				this.onScene(this);

				this.sprites.forEach((sprite, index) => {
					if (sprite.onScene) {
						sprite.onScene(this, sprite);
					}
					if (sprite.init) {
						if (!this.sceneData.inited) {
							this.sceneData.inited = {};
						}
						if (!this.sceneData.inited[index]) {
							this.sceneData.inited[index] = this.now;
							sprite.init(this, sprite);
						}
					}
				});

				if (this.facingEvent() && !this.facingEvent().foe) {
					this.checkEvents();
				}

				const { yupa } = game.data;
				if (yupa) {
					yupa.rotation = (this.rotation + 4) % 8;
				}
			}
			this.onSceneRefresh(this);
			if(this.battle && !this.data.gameOver) {
				this.onSceneBattle(this, this.battle);
			}
		}

		refreshSprites() {			
			this.sprites.forEach(sprite => {
				if (sprite.onRefresh && this.sceneTime) {
					if (this.evaluate(sprite.hidden, sprite)) {
						return;
					}
					sprite.onRefresh(this, sprite);
				}
			});
		}

		displaySprites() {
			this.sprites.forEach(sprite => {
				const { src, hidden } = sprite;			
				if (this.evaluate(hidden, sprite)) {
					return;
				}
				const processedSrc = this.evaluate(src, sprite);

				if (processedSrc) {
					this.prepareImage(processedSrc);
				}
				this.displayImage(ctx, sprite);
			});
		}

		refresh(dt) {
			if (this.paused && this.gameLoaded) {
				return;
			}
			this.data.time += dt;
			this.handleSceneEvents();
			if (this.sceneTime) {
				this.refreshMove();
				this.refreshActions();
			}
			if (this.sceneTime) {
				this.checkMouseHover();
				this.checkUseItem();				
			}

			if (this.sceneTime) {
				this.refreshSprites();
				this.displaySprites();
				this.displayFade(this);

				this.displayDialog();
				this.displayInventory();
				this.displayPickedUp();

				this.displayGameOver();
				this.displayArrows();
				this.displayCursor();
				this.displayTips();
				this.displayInventoryTips();
				this.displayTouchscreen();
				this.cleanupData();
			}
			if (this.refreshCallback) {
				this.refreshCallback();
			}
		}

		displayGameOver() {
			if (this.data.gameOver) {
				ctx.fillStyle = "#998800";
				if (this.mouse) {
					const { y } = this.mouse;
					const selection = Math.floor(y / 10) - 4;
					if (selection >= 0 && selection <= 1) {
						ctx.fillRect(0, 40 + selection * 10, 64, 6);
					}
				}

				tempCtx.globalAlpha = Math.min(1, (this.now - this.data.gameOver) / 3000);
				tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
				tempCtx.globalAlpha = 1;
				if (this.sceneData.gameOverMessage) {
					const lines = this.sceneData.gameOverMessage.split("\n");
					lines.forEach((msg, index) => {
						this.displayTextLine(tempCtx, {msg, x: 1, y: 15 + Math.round(index - lines.length/2) * 7})
					});
				} else {
					this.displayTextLine(tempCtx, {msg: "GAME OVER",  x:11, y:20 });					
				}
				this.displayTextLine(tempCtx, {msg: "try again",  x:16, y:40 });
				this.displayTextLine(tempCtx, {msg: "start over", x:14, y:50 });
				this.displayOutlinedImage(tempCtx.canvas, "black", 4, 2);
			}
		}

		displayEnding() {
			if (this.data.theEnd) {
				tempCtx.globalAlpha = Math.min(1, (this.now - this.data.theEnd) / 3000);
				tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
				tempCtx.globalAlpha = 1;
				const progress = Math.min(1, Math.max(0, (this.now - this.data.theEnd) / 10000));
				const antiProgress = 1 - progress;
				const letter = 5;
				const y = Math.round(antiProgress * 20 + progress * 25);

				if (this.now - this.data.theEnd < 1000) {
					this.displayTextLine(tempCtx, {
						msg: "ESCAPE FROM",
						x: 10, y:10,
					});
				} else if (this.now - this.data.theEnd > 10000) {					
					this.displayTextLine(tempCtx, {
						msg: "upcoming:",
						x: 10, y:10,
					});
					this.displayTextLine(tempCtx, {
						msg: "the saga",
						x: 10, y:40,
					});
					this.displayTextLine(tempCtx, {
						msg: "continues",
						x: 15, y:46,
					});
				}


				this.displayTextLine(tempCtx, {
					msg: "L",
					x: 5 + Math.round((antiProgress * 0 + progress * 8) * letter), y,
				});
				this.displayTextLine(tempCtx, {
					msg: "A",
					x: 5 + Math.round((antiProgress * 1 + progress * 1) * letter), y,
				});
				this.displayTextLine(tempCtx, {
					msg: "B",
					x: 5 + Math.round((antiProgress * 2 + progress * 0) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "B",
					x: 5 + Math.round((antiProgress * 3 + progress * 2) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "Y",
					x: 5 + Math.round((antiProgress * 4 + progress * 3) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "R",
					x: 5 + Math.round((antiProgress * 5 + progress * 10) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "I",
					x: 5 + Math.round((antiProgress * 6 + progress * 6) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "T",
					x: 5 + Math.round((antiProgress * 7 + progress * 7) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "H",
					x: 5 + Math.round((antiProgress * 8 + progress * 5) * letter), y
				});
				this.displayTextLine(tempCtx, {
					msg: "E",
					x: 5 + Math.round((antiProgress * 9 + progress * 9) * letter), y
				});


				this.displayOutlinedImage(tempCtx.canvas, "#660000", 4, 2);
			}
		}

		processText(text, addOnly) {
			if (text.indexOf("~") >= 0) {
				text.split("~").forEach(a => this.processText(a, addOnly));
				return text;
			}

			if (!this.translate) {
				this.translate = {};
			}
			if (!this.translate[text]) {
				this.translate[text] = {};
				if (window.updateTranslationLink && !addOnly) {
					const request = new XMLHttpRequest();
			  		request.open("GET", `${window.updateTranslationLink}${encodeURIComponent(text)}`);
					request.send();
				}
			}
			return text;
		}

		displayTextLine(ctx, {msg, x, y, spacing, alpha, noTranslate, dark}) {
			const src = dark ? ASSETS.ALPHABET_DARK : ASSETS.ALPHABET;
			if (!imageStock[src]) {
				return;
			}

			if (!noTranslate) {
				msg = this.processText(msg);
			}

			const letterTemplate = {
				src: src, col:10, row:11, size: ALPHA_SIZE,
				offsetX: 20, offsetY: 20,
				index: game => Math.floor(game.now / 100) % 62,
				isText: true,
				alpha,
			};
			letterTemplate.offsetY = y;
			let spaceX = x;
			for (let c = 0; c < msg.length; c++) {
				const code = msg.charCodeAt(c);
				const ALPHA = ALPHAS[code] || ALPHAS[0];
				const { index } = ALPHA;
				letterTemplate.offsetX = spaceX;
				letterTemplate.index = index;
				this.displayImage(ctx, letterTemplate);
				if (typeof(ALPHA.width)==='undefined') {
					maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

					this.displayImage(maskCtx, {
						src: letterTemplate.src,
						col: letterTemplate.col,
						row: letterTemplate.row,
						size: letterTemplate.size,
						offsetX: 0, offsetY: 0,
						index: letterTemplate.index,
						isText: letterTemplate.isText,
						alpha: 1,
					});

					const [ LETTER_WIDTH, LETTER_HEIGHT ] = letterTemplate.size;
					const { data } = maskCtx.getImageData(0, 0, LETTER_WIDTH, LETTER_HEIGHT);

					const PIXEL_SIZE = 4;
					let foundW = -1;
					for (let w = LETTER_WIDTH-1; w >= 0; w--) {
						for (let h = LETTER_HEIGHT-1; h >= 0; h--) {
							const offset = (h*LETTER_WIDTH + w) * PIXEL_SIZE;
							if (data[offset + PIXEL_SIZE - 1] !== 0) {
								foundW = w;
								break;
							}
						}
						if (foundW >= 0) {
							break;
						}
					}
					ALPHA.width = foundW + 1;
				}
				if (ALPHA.width) {
					spaceX += ALPHA.width + (spacing || 1);
				}
			}
			return spaceX - x;
		}

		checkHoveredDialog() {
			if (!this.dialog) {
				return;
			}
			const { pendingTip} = this;
			if (pendingTip && !pendingTip.talker) {
				return;
			}
			const { index, conversation, time } = this.dialog;
			const frame = Math.min(3, Math.floor((this.now - time) / 80));
			if (this.bagOpening || this.useItem || this.pendingTip && !this.pendingTip.removeLock || this.dialog.paused) {
				this.dialog.hovered = null;
				return;
			}

			if (!conversation[index]) {
				throw new Error(`Dialog index ${index} out of bound.`);
			}

			const {options, offsetY} = conversation[index];
			const offY = this.evaluate(offsetY, conversation[index]) || 0;

			const filteredOptions = options.filter(option => !option.hidden || !this.evaluate(option.hidden, option));
			const y = this.mouse ? Math.floor((this.mouse.y - 43 - offY) / 7) : -1;
			ctx.fillStyle = this.dialog.highlightColor || "#009988aa";
			if (y >= 0 && y < filteredOptions.length) {
				const { msg, cantSelect } = filteredOptions[y];
				if (this.evaluate(msg) && !this.evaluate(cantSelect)) {
					this.dialog.hovered = filteredOptions[y];
				} else {
					this.dialog.hovered = null;
				}
			} else {
				this.dialog.hovered = null;
			}			
		}

		displayDialog() {
			if (!this.dialog) {
				return;
			}
			this.checkHoveredDialog();

			const { pendingTip} = this;
			if (pendingTip && !pendingTip.talker) {
				return;
			}
			const { index, conversation, time } = this.dialog;
			const frame = Math.min(3, Math.floor((this.now - time) / 80));
			if (this.bagOpening || this.useItem || this.pendingTip && !this.pendingTip.removeLock || this.dialog.paused) {
				this.dialog.hovered = null;
				return;
			}

			if (!conversation[index]) {
				throw new Error(`Dialog index ${index} out of bound.`);
			}

			const {options, offsetY} = conversation[index];
			const offY = this.evaluate(offsetY, conversation[index]) || 0;

			const dialogTime = this.now - this.dialog.time;
			const dialogShift = Math.round((dialogTime < 50 ? (50 - dialogTime) / 50 : 0) * 4) + offY;

			const filteredOptions = options.filter(option => !option.hidden || !this.evaluate(option.hidden, option));
			const y = this.mouse ? Math.floor((this.mouse.y - 43 - offY) / 7) : -1;
			ctx.fillStyle = this.dialog.tapped && Math.floor(this.now / 50) % 2 === 0 ? "#00443355" : (this.dialog.highlightColor || "#009988aa");
			let selectedRow;
			if (y >= 0 && y < filteredOptions.length) {
				const { msg, cantSelect } = filteredOptions[y];
				if (this.evaluate(msg) && !this.evaluate(cantSelect)) {
					ctx.fillRect(0, dialogShift + y * 7 + 42, 64, 7);
					selectedRow = y;
				}
			}

			tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
			filteredOptions.forEach((option, row) => {
				const msg = this.evaluate(option.msg);
				if (msg) {
					this.displayTextLine(tempCtx, {msg, x: 2, y: dialogShift + row * 7 + 43,});
				}
			});
			this.displayOutlinedImage(tempCtx.canvas, "#001144", 16);
		}

		displayOutlinedImage(image, color, intensity, size) {
			ctx.shadowColor = color;
			ctx.shadowBlur = size || 1;
			for (let i = 0; i < intensity; i++) {
				ctx.drawImage(image, 0, 0);
			}
			ctx.shadowBlur = 0;			
		}

		displayInventory() {
			if (this.bagOpening && (this.frameIndex === 2 || this.frameIndex === 3)) {
				for (let i in this.inventory) {
					if (i !== this.useItem && (!this.pickedUp || i !== this.pickedUp.item)) {
						const { item, image, col, row } = this.inventory[i];
						this.displayImage(ctx, { src: image, col, row, index: this.frameIndex-1 });
					}
				}
			}
			if (this.useItem) {
				if (!this.inventory[this.useItem]) {
					// fix bug
					this.useItem = null;
				} else {
					const { image, col, row } = this.inventory[this.useItem];
					this.displayImage(ctx, { src: image, col, row, index: 3 });
				}
			}
		}

		displayPickedUp() {
			if (!this.pickedUp) {
				return;
			}
			const {item, time, image, tip, col, row, index } = this.pickedUp;
			this.displayFade({
				fade: Math.min(.8, (this.now - time) / 500),
				fadeColor:"#333333",
			});
			this.displayImage(ctx, {src:image, col, row, index});
			tip.fade = Math.min(1, (this.now - (tip.time + (tip.text.length + 15) * tip.speed)) / 350);
			const flash = this.sceneData.flashTip && this.now - this.sceneData.flashTip < 30;
			this.displayText(tip, flash);
			if (tip.fade >= 1 && !tip.done) {
				tip.done = true;
				if (tip.onDone) {
					tip.onDone(this);
				}
			}			
		}

		displayImage(ctx, sprite) {
			const {src, scale, index, side, col, row, size, hidden, offsetX, offsetY, alpha, custom, ending, isText, globalCompositeOperation, flipH } = sprite;			
			if (this.evaluate(hidden, sprite)) {
				return;
			}
			if (ending) {
				this.displayEnding();
				return;
			}
			if (custom) {
				custom(game, sprite, ctx);
				return;
			}
			const processedSrc = this.evaluate(src, sprite);

			if (!processedSrc) {
				const fade = this.evaluate(sprite.fade);
				const fadeColor = this.evaluate(sprite.fadeColor);
				if (fade > 0 && fadeColor) {
					ctx.globalAlpha = fade;
					ctx.fillStyle = fadeColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.globalAlpha = 1.0;
				}
				return;
			}
			const spriteData = imageStock[processedSrc];
			if (!spriteData) {
				return;
			}

			const [ imgWidth, imgHeight ] = size || [64,64];
			const spriteScale = this.evaluate(scale, sprite) || 1;
			let frameIndex = this.evaluate(index, sprite) || 0;
			let dstX = this.evaluate(offsetX, sprite)||0;
			let dstY = this.evaluate(offsetY, sprite)||0;
			let srcX = (frameIndex % (col||2)) * imgWidth;
			let srcY = Math.floor(frameIndex / (col||2)) * imgHeight;
			let srcW = imgWidth;
			let srcH = imgHeight;
			let dstW = imgWidth;
			let dstH = imgHeight;

			switch(this.evaluate(side, sprite)) {
				case LEFT:
					srcW /= 2;
					dstW /= 2;
					break;
				case RIGHT:
					srcW /= 2;
					dstW /= 2;
					srcX += srcW;
					dstX += dstW;
					break;
			}
			dstW *= spriteScale;
			dstH *= spriteScale;

			const alphaColor = this.evaluate(alpha, sprite);
			if (alphaColor) {
				ctx.globalAlpha = alphaColor;
			}
			let shiftX = 0, shiftY = 0;
			if (this.battle && this.battle.playerHit && !isText) {
				const hitTime = Math.max(10, this.now - this.battle.playerHit);
				if (hitTime < 500) {
					const intensity = 2;
					shiftX = Math.round((Math.random() - .5) * intensity * (200 / hitTime));
					shiftY = Math.round((Math.random() - .5) * intensity * (200 / hitTime));
				}
			}
			if (this.sceneData.shakeTime && !isText) {
				const hitTime = Math.max(10, this.now - this.sceneData.shakeTime);
				if (hitTime < 500) {
					const intensity = 1;
					shiftY += Math.round((Math.random()-.5) * intensity * (200 / hitTime));
				}
			}
			if (globalCompositeOperation) {
				ctx.globalCompositeOperation = this.evaluate(globalCompositeOperation, sprite);
			}

			if (flipH) {
				ctx.translate(64, 0);
				ctx.scale(-1, 1);
			}
			ctx.drawImage(spriteData.img, srcX, srcY, srcW, srcH, dstX + shiftX, dstY + shiftY, dstW, dstH);
			if (flipH) {
				ctx.scale(-1, 1);
				ctx.translate(-64, 0);
			}
			if (alphaColor) {
				ctx.globalAlpha = 1.0;
			}
			if (globalCompositeOperation) {
				ctx.globalCompositeOperation = "source-over";
			}
		}

		displayTouchscreen() {
			if (this.touchActive) {
				for (let i in TOUCH_SPRITES) {
					const { onRefresh, hidden } = TOUCH_SPRITES[i];
					if (!this.evaluate(hidden)) {
						if (onRefresh) {
							onRefresh(game, TOUCH_SPRITES[i]);
						}
					}
				}


				touchCtx.clearRect(0, 0, 64, 32);
				if (!this.hideCursor && !this.waitCursor) {
					for (let i in TOUCH_SPRITES) {
						this.displayImage(touchCtx, TOUCH_SPRITES[i]);
					}
				}
				for (let i = 0; i < this.touchList.length; i++) {
					const {identifier, pageX, pageY, force} = this.touchList[i];
					const px = (pageX - touchCanvas.offsetLeft) / touchCanvas.offsetWidth * touchCanvas.width;
					const py = (pageY - touchCanvas.offsetTop) / touchCanvas.offsetHeight * touchCanvas.height;

					touchCtx.beginPath();
					touchCtx.strokeStyle = "#33336666";
					touchCtx.arc(px, py, force*4, 0, Math.PI * 2);
					touchCtx.stroke();
				}
			}
		}

		clickBag() {
			if (this.processingBag) {
				return;
			}
			if (this.emptyBag()) {
				return;
			}
			if (this.frameIndex === 3) {
				if (this.useItem) {
					this.useItem = null;
				} else {
					for (let i in this.inventory) {
						const { item, image, col, row } = this.inventory[i];
						if (this.isMouseHover({src:image, index:this.frameIndex-1, col, row}, this.mouse)) {
							this.useItem = item;
							this.useItemTime = this.now;
						}
					}
				}
				this.arrow = 0;
			}
			this.openBag(this.now, game => {
				this.onSceneHoldItem(game, this.useItem);
			});
		}

		clickMenu() {
			this.sceneData.showStats = 0;
			this.openMenu(this.now);
		}

		see(name) {
			if (!this.data.seen[name]) {
				this.data.seen[name] = this.now;
			}
		}

		gunFiredWithin(millis) {
			return this.gunFired && this.now - this.gunFired < millis;
		}

		delayAction(callback, delay) {
			console.assert(delay, "delayAction missing delay");
			this.actions.push({
				time: this.now,
				command: "delay",
				onDone: callback,
				delay,
				active: true,
				started: false,
			});
		}

		screenshot() {
			tempCtx.canvas.width = 28;
			tempCtx.canvas.height = 28;
			tempCtx.imageSmoothingEnabled = true;

			tempCtx.drawImage(ctx.canvas,
				0, 0, ctx.canvas.width, ctx.canvas.height,
				0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
			const uri = tempCtx.canvas.toDataURL();
			tempCtx.canvas.width = canvas.width;
			tempCtx.canvas.height = canvas.height;
			return uri;
		}

		save(name, image) {
			this.saveData(name, image, this.data);
		}

		saveData(name, image, data) {
			if (typeof(name)==='undefined') {
				name = LAST_CONTINUE;
			}
			const saves = JSON.parse(localStorage.getItem(SAVES_LOCATION) || "{}");
			saves[name] = JSON.parse(JSON.stringify(data));
			saves[name].image = image || data.image || this.screenshot();
			localStorage.setItem("saves", JSON.stringify(saves));			
		}

		deleteSave(name) {
			if (typeof(name)!=='undefined') {
				const saves = JSON.parse(localStorage.getItem(SAVES_LOCATION) || "{}");
				delete saves[name];
				localStorage.setItem("saves", JSON.stringify(saves));
			}
		}

		getLoadData(name) {
			if (typeof(name)==='undefined') {
				name = LAST_CONTINUE;
			}
			const saves = JSON.parse(localStorage.getItem(SAVES_LOCATION) || "{}");
			return saves[name];			
		}

		load(name) {
			this.playTheme(null);
			const triedAgain = this.data.gameOver;
			this.data = this.getLoadData(name);
			this.setupStats();
			if (triedAgain) {
				this.data.stats.life = Math.max(this.data.stats.maxLife / 2, this.data.stats.life)
				this.data.stats.state.drank = 0;
				this.data.stats.state.ate = 0;
			}
			this.gotoScene(this.sceneName, this.door, true);
			if (this.data.theme) {
				this.playTheme(this.data.theme.song, {volume:this.data.theme.volume});
			}
			for (let id in this.imageStock) {
				if (this.imageStock[id].org) {
					this.imageStock[id].img = this.imageStock[id].org;
				}
			}
			if (this.data.images) {
				for (let src in this.data.images) {
					this.replaceImage(src, this.data.images[src]);
				}
			}
		}

		replaceImage(id, src) {
			const img = new Image();
			img.addEventListener("load", e => {
				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				canvas.getContext("2d").drawImage(img, 0, 0);

				const stock = this.imageStock[id] = {
					img: canvas,
					loaded: true,
				};
			});

			img.addEventListener("error", () => {
				this.delayAction(game => {
					this.replaceImage(id, src);
				}, 5000);
			});

			img.src = this.data.images[id];
		}

		setupStats() {
			if (!this.data.stats) {
				this.data.stats = {
					life: 80,
					maxLife: 120,
					damage: 10,
					defense: 10,
					xp: 0,
					bonus: 0,
				};
			}
			if (!this.data.stats.state) {
				this.data.stats.state = {
					drank: 0,
					ate: 0,
				};
			}
		}

		checkIsBrave(callback) {
			const timeout = setTimeout(() => {
				request.cancel();
				callback(false);
			}, 3000);	


			const request = new XMLHttpRequest()
			request.open('GET', 'https://api.duckduckgo.com/?q=useragent&format=json', true)
			request.addEventListener("load", e => {
				clearTimeout(timeout);
				callback(request.responseText.toLowerCase().indexOf("brave")>=0);
			});
			request.addEventListener("error", e => {
				clearTimeout(timeout);
				callback(false);
			});
			request.send();	
		}

		getSaveList() {
			try {
				return JSON.parse(localStorage.getItem(SAVES_LOCATION) || "{}");
			} catch(e) {
				this.checkIsBrave(isBrave => {
					showError(isBrave
						? `Game blocked. Please disable Brave's Shield Protection for this site (Next to the URL bar).<br><img style="width:133px; height:38px; margin:10px" src="assets/brave-shield.png">`
						: "Browser not supported. Please try a different one.");
				});
				return {};
			}
		}

		restart() {
			this.load("clear");
			this.gotoScene("start-screen");
			this.data.gameOver = false;
		}

		gameOver(message, leaveTheme) {
			if (!this.data.gameOver) {
				this.waitCursor = true;
				this.data.gameOver = this.now;
				this.sceneData.gameOverMessage = message;
				this.hideCursor = false;
				this.delayAction(game => {
					this.waitCursor = false;
				}, 1000);
				this.useItem = null;
				if (!leaveTheme) {
					this.playTheme(null);
				}
			}
		}

		clear() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);			
		}

		blocking() {
			return this.battle && (this.arrow === BLOCK || this.arrow === BAG);
		}

		damagePlayer(damage, options) {
			const {shot, blocked} = options ? options : {};
			const { stats } = this.data;
			const calcDamage = damage * damage / Math.max(1, this.data.stats.defense);
			stats.life = Math.max(stats.life - calcDamage, blocked ? 1 : 0);
		}

		failEscape(callback) {
			this.battle.failedEscape = game.now;
			this.playErrorSound();
			this.showTip("I failed my escape!", callback, 20);
		}

		canEscape(battle) {
			if (battle && this.evaluate(battle.blockEscape, battle)) {
				return false;
			}
			if (!this.sceneData.freeFormMove) {
				const blocked = this.isBlocked(this.pos, 0, -1, true)
					&& this.isBlocked(this.pos, 1, 0, true)
					&& this.isBlocked(this.pos, -1, 0, true);
				return !blocked;
			}
			return true;
		}

		escapeBattle(callback) {
			if (this.currentScene.onEscapeBattle) {
				this.currentScene.onEscapeBattle(this, callback);
				return;
			}

			this.waitCursor = true;
			this.useItem = null;
			const battleTheme = this.battle.theme || SOUNDS.CHIN_TOK_THEME;
			this.playTheme(null);
			this.battle = null;
			this.setVisited(false);

			this.playSound(SOUNDS.HIT, {volume: .3});
			for (let i = 0; i < 5; i++) {
				this.delayAction(game => {
					game.playSound(SOUNDS.HIT, {volume:.3});
				}, 150 * (i+1));				
			}

			const { x, y, } = this.pos;
			if (!this.isBlocked(this.pos, 0, -1, true)) {
				game.move(game.now, "backward", game => {
					this.waitCursor = false;;
					this.playTheme(battleTheme, {volume:.2});
					if (callback)
						callback(this);					
				});
			} else if (!this.isBlocked(this.pos, 1, 0, true)) {
				this.turnLeft(this.now, game => {
					game.move(game.now, "backward", game => {
						game.waitCursor = false;
						this.playTheme(battleTheme, {volume:.2});
						if (callback)
							callback(this);					
					});
				});
			} else if (!this.isBlocked(this.pos, -1, 0, true)) {
				this.turnRight(this.now, game => {
					game.move(game.now, "backward", game => {
						game.waitCursor = false;
						this.playTheme(battleTheme, {volume:.2});
						if (callback)
							callback(this);					
					});
				});				
			}
		}

		damageFoe(damage, options) {
			const {shot, blocked} = options ? options : {};
			const calcDamage = shot ? damage : damage * damage / Math.max(1, this.battle.foeDefense);
			this.battle.foeLife = Math.max(blocked ? 1 : 0, this.battle.foeLife - calcDamage);
			if (!this.battle.foeLife) {
				this.battle.foeDefeated = this.now;
				this.useItem = null;
				this.playSound(SOUNDS.FOE_DEFEAT);
				this.playTheme(this.battle.theme || SOUNDS.CHIN_TOK_THEME, {volume:.2});
				if (this.battle.onWin) {
					this.data.stats.state = {
						ate: 0,
						drank: 0,
					};
					if (!shot && this.battle.xp) {
						this.battle.gainedXP = this.battle.xp;
						const currentLevel = this.getLevel(this.data.stats.xp);
						this.gainXP(this.battle.xp);
						if (currentLevel < this.getLevel(this.data.stats.xp)) {
							this.battle.gainedLevel = this.now;
							this.delayAction(game => {
								game.openMenu(game.now);
								game.data.stats.bonus = (game.data.stats.bonus||0) + 3;
								game.playSound(SOUNDS.JINGLE);
							}, 2000);
						}
					}
					this.battle.onWin(this, this.battle, shot);
				}

				this.sceneData.currentEventCell = null;
				this.sceneData.currentEventTriggered = null;
			}
		}

		gainXP(xp) {
			this.data.stats.xp = (this.data.stats.xp || 0) + (xp || 0);
			console.log("LEVEL: ", this.getLevel(this.data.stats.xp));
		}

		getLevel(xp) {
			return Math.max(2, Math.ceil(Math.log(xp))) - 1;
		}

		findChest(found, { item, count, image, cleared, message, hideFromInventory }) {
			this.chest = {
				found,
				opened: 0,
				checked: 0,
				count,
				item,
				image,
				cleared,
				message,
				hideFromInventory,
			};			
		}

		playSteps() {
			this.playSound(SOUNDS.HIT, {volume: .5});
			this.delayAction(game => {
				game.playSound(SOUNDS.HIT, {volume:.3});
			}, 300);
			this.delayAction(game => {
				game.playSound(SOUNDS.HIT, {volume:.2});
			}, 600);
			this.delayAction(game => {
				game.playSound(SOUNDS.HIT, {volume:.12});
			}, 900);
		}

		playErrorSound() {
			game.playSound(SOUNDS.ERROR);
			game.delayAction(game => game.playSound(SOUNDS.ERROR), 100);
		}

		toAlienDigits(s, size) {
			const ALIEN_DIGIT_0 = 1000;

			let str = "";
			while (s > 0 || str.length < size) {
				const num = s % 10;
				str = ALPHAS[ALIEN_DIGIT_0 + s % 10].char + str;
				s = Math.floor(s / 10);
			}
			return str;			
		}

		addToLife(value, color) {
			const { stats } = this.data;
			this.sceneData.lifeIncrease = {
				value: Math.min(value, stats.maxLife - stats.life), time: this.now,
				color,
			};
			stats.life = Math.min(stats.life + value, stats.maxLife);			
			if (!game.battle || game.battle.foeDefeated) {
				this.openMenu(this.now);
			}
		}

		dumdum() {
			const CHEATCODDE = "yupayupa";
		}

		babyHitlerYear() {
			return 2019;
		}

		getAnimation(dx, dy) {
			dx = dx < 0 ? -1 : dx > 0 ? 1 : 0;
			dy = dy < 0 ? -1 : dy > 0 ? 1 : 0;
			return ROTATION_FRAMES[dy + 1][dx + 1];
		}

		getSceneCount() {
			const srcs = {};
			let count = 0;
			const scripts = document.querySelectorAll("script");
			for (let i = 0; i < scripts.length; i++) {
				if (scripts[i].src.indexOf("config/") >= 0 && scripts[i].src.indexOf("config/config.js")<0) {
					count++;
				}
			}
			return count;
		}

		isTouchDevice() {
			return this.isTouch;
		}

		getOrientationText() {
			switch(ORIENTATIONS[Math.floor(game.rotation)]) {
				case "N":
					return "North";
					break;
				case "NE":
					return "North East";
					break;
				case "E":
					return "East";
					break;
				case "SE":
					return "South East";
					break;
				case "S":
					return "South";
					break;
				case "SW":
					return "South West";
					break;
				case "W":
					return "West";
					break;
				case "NW":
					return "North West";
					break;
			}
			return "Nowhere";
		}

		toggleFullScreen(forceFull) {
			if (document.fullscreenElement) {
				if (!forceFull) {
					document.exitFullscreen();
				}
			} else {
				try {
					if (document.body.webkitEnterFullScreen) {
					  document.body.webkitEnterFullScreen();
					} else if (document.body.mozRequestFullScreen) {
						document.body.mozRequestFullScreen();
					} else if(document.body.requestFullscreen) {
						document.body.requestFullscreen();
					} else {
						this.disableFullScreen = true;						
					}
				} catch(e) {
					this.disableFullScreen = true;
				}
//				document.querySelector("#viewport").requestFullscreen();										
			}			
		}
	}



	function Tone(context, value1, value2) {
	    this.context = context;
	    this.status = 0;
	    this.value1 = value1;
	    this.value2 = value2;
	}

	Tone.prototype.setup = function(){
	    this.osc1 = this.context.createOscillator();
	    this.osc2 = this.context.createOscillator();
	    this.osc1.frequency.value = this.value1;
	    this.osc2.frequency.value = this.value2;

	    this.gainNode = this.context.createGain();
	    this.gainNode.gain.value = 0.25;

	    this.filter = this.context.createBiquadFilter();
	    this.filter.type = "lowpass";
	    this.filter.frequency = 8000;

	    this.osc1.connect(this.gainNode);
	    this.osc2.connect(this.gainNode);

	    this.gainNode.connect(this.filter);
	    this.filter.connect(this.context.destination);
	}

	Tone.prototype.start = function(){
		if (!this.status) {
			this.setup();
		    this.osc1.start(0);
		    this.osc2.start(0);
		    this.status = 1;
		}
    }

	Tone.prototype.stop = function(){
		if (this.status) {
		    this.osc1.stop(0);
		    this.osc2.stop(0);
		    this.osc1 = null;
		    this.osc2 = null;
		    this.status = 0;
			if (this.ringerLFOSource) {
				this.ringerLFOSource.stop(0);
				this.ringerLFOSource = null;
			}
		}
	}

	Tone.prototype.createRingerLFO = function() {
	    // Create an empty 3 second mono buffer at the
	    // sample rate of the AudioContext
	    var channels = 1;
	    var sampleRate = this.context.sampleRate;
	    var frameCount = sampleRate * 3;
	    var arrayBuffer = this.context.createBuffer(channels, frameCount, sampleRate);

	    // getChannelData allows us to access and edit the buffer data and change.
	    var bufferData = arrayBuffer.getChannelData(0);
	    for (var i = 0; i < frameCount; i++) {
	        // if the sample lies between 0 and 0.4 seconds, or 0.6 and 1 second, we want it to be on.
	        if ((i/sampleRate > 0 && i/sampleRate < 0.4) || (i/sampleRate > 0.6 && i/sampleRate < 1.0)){
	            bufferData[i] = 0.25;
	        }
	    }

	    this.ringerLFOBuffer = arrayBuffer;
	}

	Tone.prototype.startRinging = function(){
	    this.start();
	    // set our gain node to 0, because the LFO is calibrated to this level
	    this.gainNode.gain.value = 0;
	    this.status = 1;

	    this.createRingerLFO();

	    this.ringerLFOSource = this.context.createBufferSource();
	    this.ringerLFOSource.buffer = this.ringerLFOBuffer;
	    this.ringerLFOSource.loop = true;
	    // connect the ringerLFOSource to the gain Node audio param
	    this.ringerLFOSource.connect(this.gainNode.gain);
	    this.ringerLFOSource.start(0);
	}

	return Game;
})();