const DEMO = false;

const LEFT = 1, RIGHT = 2, FORWARD = 3, BACKWARD = 4, BAG = 5, DOOR = 6, FAR = 7, CLOSE = 8, FURTHER = 9, MENU = 10, BLOCK = 11;

const MAZE_ASSETS = {
	MAZE_ROTATION_BACKGROUND: "assets/maze-rotation-background.png",
	MAZE_ROTATION_WALLS: "assets/maze-rotation-walls.png",
	MAZE_ROTATION_CORNER: "assets/maze-rotation-corner.png",
	DUNGEON_MOVE:'assets/dungeon-move.png',
	FAR_SIDE:'assets/far-side.png',
	FAR_SIDE_CORNER:'assets/far-side-corner.png',
	FAR_WALL:'assets/far-wall.png',
	FURTHER_WALL:'assets/further-wall.png',
	FAR_DOOR:'assets/far-door.png',
	CLOSE_SIDE:'assets/close-side.png',
	CLOSE_SIDE_CORNER:'assets/close-side-corner.png',
	FAR_FAR_SIDE:'assets/side-far-far.png',
	CLOSE_WALL:'assets/close-wall.png',
	DOOR_OPEN:'assets/door-open.png',
	CLOSE_DOOR:'assets/close-door.png',
	FURTHER_SIDE:'assets/further-side.png',
	CLOSE_FURTHER_SIDE:'assets/close-further-side.png',

	DUNGEON_MOVE_SOLID:'assets/dungeon-move-solid.png|rotate-colors|rotate-colors',
	FAR_WALL_SOLID:'assets/far-wall-solid.png|rotate-colors|rotate-colors',
	CLOSE_WALL_SOLID:'assets/close-wall-solid.png|rotate-colors|rotate-colors',
	MAZE_ROTATION_BACKGROUND_SOLID: "assets/maze-rotation-background-solid.png|rotate-colors|rotate-colors",
	MAZE_ROTATION_WALLS_SOLID: "assets/maze-rotation-walls-solid.png|rotate-colors|rotate-colors",
	MAZE_ROTATION_CORNER_SOLID: "assets/maze-rotation-corner-solid.png|rotate-colors|rotate-colors",
	CLOSE_SIDE_SOLID:'assets/close-side-solid.png|rotate-colors|rotate-colors',

	DUNGEON_LOCK:'assets/dungeon-lock.png',
};

const MAZE_ASSETS_BLUE = Object.assign(...Object.entries(MAZE_ASSETS).map(([k,v])=>({[`${k}_BLUE`]:`${v}|rotate-colors`})));
const MAZE_ASSETS_RED = Object.assign(...Object.entries(MAZE_ASSETS).map(([k,v])=>({[`${k}_RED`]:`${v}|rotate-colors|rotate-colors`})));

const ASSETS = {
	ARROW_SIDE:'assets/arrow-side.png',
	ARROW_FORWARD:'assets/arrow-forward.png',
	ARROW_BACKWARD:'assets/arrow-backward.png',
	JAIL:'assets/jail.png',
	JAIL360:'assets/jail-360.png',
	WRITING:'assets/writing.png',
	PHOTO:'assets/photo.png',
	TILE:'assets/tile.png',
	BOTTLE:'assets/bottle.png',
	GRAB_WATER_BOTTLE:'assets/grab-water-bottle.png',
	GRAB_APPLE:'assets/grab-apple.png',
	BOTTLE_SHARDS:'assets/bottle-shards.png',
	BAG_OUT:'assets/bag-out.png',
	LAMP:'assets/light.png',
	LOCK:'assets/lock.png',
	EXIT_DOOR:'assets/exit-door.png',
	CAGE: 'assets/cage.png',
	DIMMING_LIGHT: 'assets/dimming-light.png',
	RIGHT_GUARD: 'assets/right-guard.png',
	LEFT_GUARD: 'assets/left-guard.png',
	ALPHABET_DARK:'assets/alphabet.png',
	ALPHABET:'assets/alphabet.png|invert-colors',
	GRAB_PHOTO:'assets/grab-photo.png',
	GRAB_PHOTO_SHOT:'assets/grab-photo-shot.png',
	ZOOM_GUARDS: 'assets/zoom-guards.png',
	GRAB_BOTTLE:'assets/grab-bottle.png',
	BIRTHDAY: 'assets/birthday.png',
	SPEECH_OUT: 'assets/speech-out.png',
	BRING_CAKE: 'assets/bring-cake.png',
	POOR_HITMAN: 'assets/poor-hitman.png',
	POOR_HITMAN_BACK: 'assets/poor-hitman-back.png',
	POOR_HITMAN_GUARD: 'assets/poor-hitman-guard.png',
	GUARDS_LAUGHING: 'assets/guards-laughing.png',
	HITMAN_LAUGH: 'assets/hitman-laugh.png',
	HITMAN_CAKE_FACE: 'assets/hitman-cake-face.png',
	GUARDS_ATTACK: 'assets/guards-attack.png',
	CAKE_TRASH: 'assets/cake-trash.png',
	CAKE_PIECE: 'assets/cake-piece.png',
	CAKE_FORK: 'assets/cake-fork.png',
	LIGHTER: 'assets/lighter.png',
	GRAB_CAKE:'assets/grab-cake.png',
	GRAB_FORK:'assets/grab-fork.png',
	GRAB_LIGHTER:'assets/grab-lighter.png',
	TILE_HOLE:'assets/tile-hole.png',
	GUN: 'assets/gun.png',
	SHOOTS: 'assets/shoots.png',
	GRAB_GUN: 'assets/grab-gun.png',
	HOLD_GUN: 'assets/hold-gun.png',
	ZOOM_GUARD_ALERT: 'assets/zoom-guard-alert.png',
	SHOOTS: "assets/shoots.png",
	EATER: "assets/eater.png",
	ALIEN_EATER: "assets/alien-eater.png",
	CAKE_BOOM: "assets/cake-boom.png",

	...MAZE_ASSETS,
	...Object.assign(...Object.entries(MAZE_ASSETS).map(([k,v])=>({[`${k}_1`]:`${v}|darken`}))),
	...Object.assign(...Object.entries(MAZE_ASSETS).map(([k,v])=>({[`${k}_2`]:`${v}|darken|darken`}))),

	...MAZE_ASSETS_BLUE,
	...Object.assign(...Object.entries(MAZE_ASSETS_BLUE).map(([k,v])=>({[`${k}_1`]:`${v}|darken`}))),
	...Object.assign(...Object.entries(MAZE_ASSETS_BLUE).map(([k,v])=>({[`${k}_2`]:`${v}|darken|darken`}))),

	...MAZE_ASSETS_RED,
	...Object.assign(...Object.entries(MAZE_ASSETS_RED).map(([k,v])=>({[`${k}_1`]:`${v}|darken`}))),
	...Object.assign(...Object.entries(MAZE_ASSETS_RED).map(([k,v])=>({[`${k}_2`]:`${v}|darken|darken`}))),

	GUARD: "assets/guard.png",
	GUARD_2: "assets/guard.png|rotate-colors|rotate-colors",
	MONSTER: "assets/monster.png",
	DUMMY: "assets/dummy.png",
	PUNCH: "assets/punch.png",
	TOILETS: "assets/toilets.png",
	BATHROOM: "assets/bathroom-background.png",
	TOILET_MONSTER: "assets/toilet-monster.png",
	VENDING_MACHINE: "assets/vending-machine.png",
	MACHINE: "assets/machine.png",
	COIN_1: "assets/coin-1.png",
	COIN_2: "assets/coin-2.png",
	GRAB_COIN: "assets/grab-coin.png",
	GRAB_COIN_DARKER: "assets/grab-coin.png|darken",
	VENDING_MACHINE_CLOSEUP: "assets/vending-machine-close.png",
	VENDING_MACHINE_GLASS: "assets/vending-machine-glass.png",
	VENDING_MACHINE_APPLE: "assets/vending-machine-apple.png",
	VENDING_MACHINE_BOTTLE: "assets/vending-machine-bottle.png",
	VENDING_MACHINE_COIN_SLOT: "assets/vending-machine-coin-slot.png",
	VENDING_MACHINE_COIN_RETURN: "assets/vending-machine-coin-return.png",
	ARCADE: "assets/arcade.png",
	ZOOM_ARCADE: "assets/zoom-arcade.png",
	ARCADE_ROOM: "assets/arcade-room.png",
	LOCKER_ROOM: "assets/locker-room.png",
	LOCKER_DOOR: "assets/locker-door.png",
	LOCK_BACK: "assets/lock-back.png",
	LOCK_DIGIT: "assets/lock-digit.png",
	LOCK_BLOCK: "assets/lock-block.png",
	ACCESS_CARD: "assets/access-card.png",
	GRAB_ACCESS_CARD: "assets/grab-access-card.png",
	SCAN_CARD: "assets/scan-card.png",
	FINAL_EXIT: "assets/final-exit.png",
	GATE: "assets/gate.png",
	OUTDOOR: "assets/outdoor.png",
//	CONGRATS: "assets/congrats.png|darken",
	COINSTART: "assets/coinstart.png",
	FLASH_SCREEN: "assets/flash-screen.png",
	ARCADE_HANDS: "assets/arcade-hands.png",
	TOP_5: "assets/top-5.png",
	MOON_BASE: "assets/moon-base.png",
	MOON_BASE_GUARD: "assets/moon-base-guard.png",
	TOILET_ZOOM: "assets/toilet-zoom.png",
	TOILET_ZOOM_BACKGROUND: "assets/toilet-zoom-background.png|rotate-colors|rotate-colors",
	MAP: "assets/map.png",
	FAR_MAP: "assets/far-map.png",
	SIDE_MAP:'assets/side-map.png',
	SIDE_FAR_MAP:'assets/side-far-map.png',
	SIDE_FURTHER_MAP:'assets/side-further-map.png',
	FLOOR_CEILING:'assets/floor-ceiling.png',
	MENU_OUT:'assets/menu-out.png',
	MENU_DISK:'assets/menu-disk.png',
	MENU_SOUND_ON:'assets/menu-sound-on.png',
	MENU_SOUND_OFF:'assets/menu-sound-off.png',
	MENU_PROFILE:'assets/menu-profile.png',
	MENU_OPTIONS:'assets/menu-options.png',
	MENU_PROFILE_NOTIFICATION: "assets/profile-notification.png",
	TREASURE_CHEST: "assets/treasure-chest.png",
	SLIMO: "assets/slime.png",
	SLIMAR: "assets/slime.png|rotate-colors|rotate-colors",
	STATS: "assets/stats.png",
	LEVEL_UP: "assets/level-up.png",
	DOORWAY:'assets/doorway.png',
	KEY_COUNT: "assets/key-count.png",
	GRAB_KEY:'assets/grab-key.png',
	SHOP_MONSTER:'assets/shop-monster.png',
	CAGE_OPENED: "assets/cage-opened.png",
	ZOOM_SHOP_MONSTER: "assets/zoom-shop-monster.png",
	SKELETON: "assets/skeleton.png",
	YUPA_DRY: "assets/yupa-dry.png",
	YUPA_DRY_CLOSE: "assets/yupa-dry-close.png",
	YUPA_SHAKE: "assets/yupa-shake.png",
	YUPA_ZOOM: "assets/yupa-zoom.png",
	WOOD: "assets/wood.png",
	SKELETON_ROPE: "assets/skeleton-rope.png",
	GRAB_ROPE: "assets/grab-rope.png",
	HITMAN_WALK: "assets/hitman-walk.png",
	HITMAN_BEARD_WALK: "assets/hitman-beard-walk.png",
	YUPA_WALK: "assets/yupa-walk.png",
	YUPA_GRAB_PHOTO: "assets/yupa-grab-photo.png",
	YUPA_DANCE: "assets/yupa-dance.png",
	GRAB_YUPA_BOTTLE: "assets/grab-yupa-bottle.png",
	DRINK_YUPA: "assets/drink-yupa.png",
	HOLE: "assets/hole.png",
	LADDER: "assets/ladder.png",
	BOTTOM: "assets/bottom.png",
	FEMBOT: "assets/fembot.png",
	CEILING_HOLE: "assets/ceiling-hole.png",
	CEILING_ROPE_MOVE: "assets/ceiling-rope-move.png",
	HOLE_BOTTOM: "assets/hole-bottom.png",
	THE_HOLE: "assets/the-hole.png",
	CEILING_HOLE_ONLY: "assets/ceiling-hole-only.png",
	HOLE_IN_CEILING_ROPE: "assets/hole-in-ceiling-rope.png",
	HOLE_IN_CEILING_HOLE: "assets/hole-in-ceiling-hole.png|darken",
	HOLE_IN_CEILING_BACK: "assets/hole-in-ceiling-back.png|darken",
	LAB_ENTRANCE: "assets/lab-entrance.png",
	ELECTRO_DIAL: "assets/electro-dial.png",
	BOTTLE_SLOT: "assets/bottle-slot.png",
	LAB_DOOR: "assets/lab-door.png",
	YUPA_IN_LAB: "assets/yupa-in-lab.png",
	LAB: "assets/lab.png",
	LAB_EXIT: "assets/lab-exit.png",
	LAB_MONSTER: "assets/lab-monster.png",
	LAB_MONSTER_WAKE: "assets/lab-monster-wake.png",
	LAB_MONSTER_BATTLE: "assets/lab-monster-battle.png",
	LAB_MONSTER_THROUGH_HOLE: "assets/lab-monster-through-hole.png",
	ROPE_CEILING: "assets/rope-ceiling.png",
	EXIT_OUT: "assets/exit-out.png|chroma-key-pink",
	EXIT_OUT_CARNAGE: "assets/exit-out-carnage.png|chroma-key-pink",
	EXIT_GATE: "assets/exit-gate.png|chroma-key-pink",
	GATE_OPEN: "assets/gate-open.png|chroma-key-pink",
	OUTSIDE: "assets/outside.png",
	OUTSIDE_CARNAGE: "assets/outside-carnage.png",
	OUTSIDE_BG: "assets/outside-bg.png",
	LANDSCAPE: "assets/landscape.png",
	SPACESHIP: "assets/spaceship.png",
	SPACESHIP_STAIRS: "assets/spaceship-stairs.png",
	HOTTUB: "assets/hottub.png",
	ALEXA: "assets/alexa.png",
	HUMAN_HOTTUB: "assets/human-hottub.png",
	YUPA_HOTTUB: "assets/yupa-hottub.png",
	HOTTUP_CLOSE_UP: "assets/hottub-close-up.png",
	HOTTUB_WATER_WAVE: "assets/hottub-water-wave.png",
	HUMAN_NO_HAND: "assets/human-no-hand.png",
	NO_HAND: "assets/no-hand.png",
	SARLIE_SHOP: "assets/sarlie-shop.png",
	SARLIE_HOSPITAL: "assets/sarlie-hospital.png",
	SARLIE_PLANET: "assets/sarlie-planet.png",
	SARLIE_PLANET_BG: "assets/sarlie-planet-bg.png",
	SARLIE_PLANET_WORLD: "assets/sarlie-planet-world.png",
	SARLIE_PLANET_WORLD_OVERLAY: "assets/sarlie-planet-world-overlay.png",
	PEDRO: "assets/pedro.png",
	ZOOM_YUPA_ALONE: "assets/zoom-yupa-alone.png",
	YUPA_GRAB_PHOTO_ALONE: "assets/yupa-grab-photo-alone.png",
	DOCTAR: "assets/doctar.png",
	YUPA_WOOPSIE: "assets/yupa-woopsie.png",
	HUMAN_WAH: "assets/human-wah.png",
	DOCTAR_ROOM: "assets/doctar-room.png",
	RAZOR: "assets/razor.png",
	BEARD: "assets/beard.png",
	BEARD_SHAVED: "assets/beard.png|shaved",
	HITMAN_ARGUES: "assets/hitman-argues.png",
	ARGUE_MOUTH: "assets/argue-mouth.png",
	GRAB_TICKETS: "assets/grab-tickets.png",
	EYES_OPEN: "assets/eyes-open.png",
	OPERATION_ROOM: "assets/operation-room.png",
	SHOP: "assets/shop.png",
	SHOPKEEPA: "assets/shopkeepa.png",
	YUPA_IN_SHOP: "assets/yupa-in-shop.png",
	SLOTS: "assets/slots.png",
	GRAB_WARP_DRIVE: "assets/grab-warp-drive.png",
	DATE_NIGHT: "assets/date-night.png",
	MONSTER_PLANET: "assets/monster-planet.png",
	SHOP_DOOR: "assets/shop-door.png",
	CAFEE: "assets/cafee.png",
	DATE_TABLE: "assets/date-table.png",
	CANDLE: "assets/candle.png",
	WAITER: "assets/waiter.png",
	DANCER: "assets/dancer.png",
	DANCER_2: "assets/dancer.png|darken",
	DANCER_3: "assets/dancer.png|darken|darken",
	DANCER_4: "assets/dancer.png|darken|darken|darken",
	TAMMY_SLOW: "assets/tammy-slow.png",
	NEXT_SCENE: "assets/next-scene.png",
	EVENING_DATE: "assets/evening-date.png",
	DOCTOR_LOBBY: "assets/doctor-lobby.png",
	DOCTOR_LOBBY_SARLIE: "assets/doctor-lobby-sarlie.png",
	DOCTOR_LOBBY_AMARI: "assets/doctor-lobby-amari.png",
	AMARI_BABY: "assets/amari-baby.png",
	ORIGIN_STORY: "assets/origin-story.png",
	HITLER: "assets/hitler.png|darken",
	FINAL_PLANET: "assets/final-planet.png",
	CRATER: "assets/crater.png",
	MOUNTAINS: "assets/mountains.png|darken",
	PLANET_ITEMS: "assets/planet-items.png",
	TOUCH_ARROWS: "assets/touch-arrows.png",
	TOUCH_PUNCH: "assets/touch-punch.png",
	FAR_FLOOR: "assets/far-floor.png",
	FLOOR: "assets/floor.png",
	CLOSE_FLOOR: "assets/close-floor.png",
	BRUSALIEN: "assets/brusalien.png",
	GRAB_COMPASS: "assets/grab-compass.png",
	MULTI_ARROWS: "assets/multi-arrows.png",
	MISSING_HAND_PUNCH: "assets/missing-hand-punch.png",
	HOOK_PUNCH: "assets/hook-punch.png",
	SUPER_PUNCH: "assets/super-punch.png",
	SIDE_BUTTONS: "assets/side-buttons.png",
	ESCAPE: "assets/escape.png",
	TAVERN_ENTRANCE: "assets/tavern-entrance.png",
	ARROW_CURSOR: "assets/arrow-cursor.png",
	POSTERS: "assets/posters.png",
	ZOOM_TAVERN_DOOR_SMOKE: "assets/zoom-tavern-door-smoke.png",
	ZOOM_TAVERN_DOOR_ROBOT: "assets/zoom-tavern-door-robot.png",
	ZOOM_TAVERN_DOOR_LADY: "assets/zoom-tavern-door-lady.png",
	ZOOM_TAVERN_DOOR: "assets/zoom-tavern-door.png",
	DARK_CLOTH_STRANGER: "assets/dark-cloth-stranger.png",
	GRAB_PLAYING_CARD: "assets/grab-playing-card.png",
	ROBOT_DIAL: "assets/robot-dial.png",
	LOOK_RIGHT_LEFT: "assets/look-right-left.png",
	INSIDE_TAVERN: "assets/inside-tavern.png",
	TAVERN_GANGSTA: "assets/tavern-gangsta.png",
	BABY_HITLER_WAITER: "assets/baby-hitler-waiter.png",
	INSIDE_TAVERN_PHONE: "assets/inside-tavern-phone.png",
	PHONE_SPLIT: "assets/phone-split.png",
	TAVERN_HITMAN_CLOSEUP: "assets/hitman-tavern-closeup.png",
	YUPA_BACK_WALK: "assets/yupa-back-walk.png",
	ERNEST: "assets/ernest.png",
	ZOOM_DICK: "assets/zoom-dick.png",
	SHUFFLE_CARDS: "assets/shuffle-cards.png",
	SHIFTY_EYES: "assets/shifty-eyes.png",
	TAVERN_GANGSTA_CARD_GAME: "assets/tavern-gangsta-card-game.png",
};

const SOUNDS = {
	HELLO:'sounds/hello.mp3',
	HAHAHA:'sounds/hahaha.mp3',
	BIRTHDAY:'sounds/birthday.mp3',
	HEY:'sounds/hey.mp3',
	GUN_SHOT:'sounds/gun-shot.mp3',
	DUD:'sounds/dud.mp3',
	ALIEN:'sounds/alien.mp3',
	HIT:'sounds/hit.mp3',
	PLAYER_HURT:'sounds/player-hurt.mp3',
	HIT_LAND:'sounds/hit-land.mp3',
	PICKUP:'sounds/pickup.mp3',
	EAT: 'sounds/eat.mp3',
	DRINK: 'sounds/drink.mp3',
	JAIL_CELL_THEME: 'sounds/jail-cell-theme.mp3',
	CHIN_TOK_THEME: 'sounds/chintok.mp3',
	ERROR: 'sounds/error.mp3',
	FUTURE_SONG_THEME: 'sounds/future-song.mp3',
	JINGLE: 'sounds/jingle.mp3',
	DARK_THEME: 'sounds/dark.mp3',
	BATTLE_THEME: 'sounds/battle-theme.mp3',
	FOE_DEFEAT: 'sounds/foe-defeat.mp3',
	LAZER: 'sounds/lazer.mp3',
	DOOR: 'sounds/door.mp3',
	UNLOCK: 'sounds/unlock.mp3',
	BEEP: 'sounds/beep.mp3',
	BOP: 'sounds/bop.mp3',
	YUPA: 'sounds/yupa.mp3',
	YUPA_HAHA: 'sounds/yupa-haha.mp3',
	FEMBOT: 'sounds/fembot.mp3',
	DIVING: 'sounds/diving.mp3',
	HUM: 'sounds/hum.mp3',
	GOGOL: 'sounds/gogol.mp3',
	SOUP_CHOU_THEME: 'sounds/soup-chou.mp3',
	OKAY: 'sounds/okay.mp3',
	YAP: 'sounds/yap.mp3',
	HUHUH: 'sounds/huhuh.mp3',
	SOFT_THEME: 'sounds/soft-song.mp3',
	ANIMAL_CRY: 'sounds/animal-cry.mp3',
	MUSETTE: 'sounds/musette.mp3',
	WAITER: 'sounds/waiter.mp3',
	YULA: 'sounds/yula.mp3',
	BABY_CRY: "sounds/baby-cry.mp3",
	GOLDMAN_THEME: "sounds/goldman.mp3",
	F1: "sounds/f1.mp3",
	RANDOM: "sounds/random.mp3",
	MYSTICA_THEME: "sounds/mystica.mp3",
	SELECT: "sounds/select.mp3",
	WEAKPUNCH: "sounds/weakpunch.mp3",
	ROBOT_VOICE: "sounds/robot-voice.mp3",
	HUM_LADY: "sounds/hum-lady.mp3",
	TURTLE_SONG_THEME: "sounds/turtle-song.mp3",
	HELLO_HUMAN: "sounds/hello-human.mp3",
	INVALID_NUMBER: "sounds/invalid-number.mp3",
	GRUMP: "sounds/grump.mp3",
	YES_BOSS: "sounds/yes-boss-low.mp3",
	YES_SIR: "sounds/yes-boss.mp3",
};

const ALPHAS = (() => {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz.,?'#@!♪()[]/-+_“”éè:© "
   	   + new Array(10).fill(null).map((a, index) => String.fromCharCode(1000 + index)).join("");
	const array = [];
	for(let c = 0; c < letters.length; c++) {
		array[letters.charCodeAt(c)] = { char: letters[c], index: c };
	}
	array[" ".charCodeAt(0)].width = 1;
	array[0] = { width:0, index: letters.length, char: '' };
	return array;
})();

const ALPHA_SIZE = [ 10, 11 ];

const ORIENTATIONS = ['N','NW','W','SW','S','SE','E','NE'];
const ARROWS = [
	null, 
	{ src:ASSETS.ARROW_SIDE, side:LEFT },
	{ src:ASSETS.ARROW_SIDE, side:RIGHT},
	{ src:ASSETS.ARROW_FORWARD},
	{ src:ASSETS.ARROW_BACKWARD},
];

const Cursor = {
	WAIT: "wait",
	NONE: "none",
};

const HIGHSCORE = 1305;
