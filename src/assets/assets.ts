import { Image, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Image[] = [
	// Backgrounds
	image('backgrounds/background', 'background'),
	image('backgrounds/playarea-base', 'playArea_base'),
	image('backgrounds/grid1', 'grid1'),
	image('backgrounds/grid2', 'grid2'),
	image('backgrounds/grid3', 'grid3'),
	image('backgrounds/grid4', 'grid4'),

	// Background tops
	image('backgrounds/grid1-top', 'grid1-top'),
	image('backgrounds/grid2-top', 'grid2-top'),
	image('backgrounds/grid3-top', 'grid3-top'),
	image('backgrounds/grid4-top', 'grid4-top'),

	// Cutscenes
	image('cutscenes/dummy1', 'cutscene_dummy1'),
	image('cutscenes/dummy2', 'cutscene_dummy2'),
	image('cutscenes/dummy3', 'cutscene_dummy3'),
	image('cutscenes/dummy4', 'cutscene_dummy4'),

	// Characters
	image('characters/player', 'player'),
	image('characters/worker', 'worker'),
	image('characters/workerSing', 'workerSing'),
	// WALK ANIMATION SHOULD LOOP LIKE THIS: walk1 - walk2 - walk3 - walk2
	image('characters/workerWalkDown1', 'workerWalk1'),
	image('characters/workerWalkDown2', 'workerWalk2'),
	image('characters/workerWalkDown3', 'workerWalk3'),
	image('characters/workerWorking', 'workerWork1'),
	image('characters/workerWorking2', 'workerWork2'),

	// ALT WORKER SKINS
	// Skin 1
	image('characters/workerAlt1', 'workerAlt1'),
	image('characters/workerAlt1Sing', 'workerAlt1Sing'),
	image('characters/workerAlt1WalkDown1', 'workerAlt1Walk1'),
	image('characters/workerAlt1WalkDown2', 'workerAlt1Walk2'),
	image('characters/workerAlt1WalkDown3', 'workerAlt1Walk3'),
	image('characters/workerAlt1Working', 'workerAlt1Work1'),
	image('characters/workerAlt1Working2', 'workerAlt1Work2'),

	// Skin 2
	image('characters/workerAlt2', 'workerAlt2'),
	image('characters/workerAlt2Sing', 'workerAlt2Sing'),
	image('characters/workerAlt2WalkDown1', 'workerAlt2Walk1'),
	image('characters/workerAlt2WalkDown2', 'workerAlt2Walk2'),
	image('characters/workerAlt2WalkDown3', 'workerAlt2Walk3'),
	image('characters/workerAlt2Working', 'workerAlt2Work1'),
	image('characters/workerAlt2Working2', 'workerAlt2Work2'),

	// Skin 3
	image('characters/workerAlt3', 'workerAlt3'),
	image('characters/workerAlt3Sing', 'workerAlt3Sing'),
	image('characters/workerAlt3WalkDown1', 'workerAlt3Walk1'),
	image('characters/workerAlt3WalkDown2', 'workerAlt3Walk2'),
	image('characters/workerAlt3WalkDown3', 'workerAlt3Walk3'),
	image('characters/workerAlt3Working', 'workerAlt3Work1'),
	image('characters/workerAlt3Working2', 'workerAlt3Work2'),
	
	// Skin 4
	image('characters/workerAlt4', 'workerAlt4'),
	image('characters/workerAlt4Sing', 'workerAlt4Sing'),
	image('characters/workerAlt4WalkDown1', 'workerAlt4Walk1'),
	image('characters/workerAlt4WalkDown2', 'workerAlt4Walk2'),
	image('characters/workerAlt4WalkDown3', 'workerAlt4Walk3'),
	image('characters/workerAlt4Working', 'workerAlt4Work1'),
	image('characters/workerAlt4Working2', 'workerAlt4Work2'),

	// Small size customers
	image('characters/smallCWalk1', 'small_customer_walk1'),
	image('characters/smallCWalk2', 'small_customer_walk2'),
	image('characters/smallCWalk3', 'small_customer_walk3'),
	image('characters/smallCSit1', 'small_customer_sit1'),

	image('characters/smallCWalk1_red', 'small_customer_walk1_red'),
	image('characters/smallCWalk2_red', 'small_customer_walk2_red'),
	image('characters/smallCWalk3_red', 'small_customer_walk3_red'),
	image('characters/smallCSit1_red', 'small_customer_sit1_red'),

	image('characters/smallCWalk1_aqua', 'small_customer_walk1_aqua'),
	image('characters/smallCWalk2_aqua', 'small_customer_walk2_aqua'),
	image('characters/smallCWalk3_aqua', 'small_customer_walk3_aqua'),
	image('characters/smallCSit1_aqua', 'small_customer_sit1_aqua'),

	image('characters/smallCWalk1_green', 'small_customer_walk1_green'),
	image('characters/smallCWalk2_green', 'small_customer_walk2_green'),
	image('characters/smallCWalk3_green', 'small_customer_walk3_green'),
	image('characters/smallCSit1_green', 'small_customer_sit1_green'),
	// Medium size customers
	image('characters/medCWalk1', 'medium_customer_walk1'),
	image('characters/medCWalk2', 'medium_customer_walk2'),
	image('characters/medCWalk3', 'medium_customer_walk3'),
	image('characters/medCSit1', 'medium_customer_sit1'),

	image('characters/medCWalk1_red', 'medium_customer_walk1_red'),
	image('characters/medCWalk2_red', 'medium_customer_walk2_red'),
	image('characters/medCWalk3_red', 'medium_customer_walk3_red'),
	image('characters/medCSit1_red', 'medium_customer_sit1_red'),

	image('characters/medCWalk1_aqua', 'medium_customer_walk1_aqua'),
	image('characters/medCWalk2_aqua', 'medium_customer_walk2_aqua'),
	image('characters/medCWalk3_aqua', 'medium_customer_walk3_aqua'),
	image('characters/medCSit1_aqua', 'medium_customer_sit1_aqua'),

	image('characters/medCWalk1_green', 'medium_customer_walk1_green'),
	image('characters/medCWalk2_green', 'medium_customer_walk2_green'),
	image('characters/medCWalk3_green', 'medium_customer_walk3_green'),
	image('characters/medCSit1_green', 'medium_customer_sit1_green'),
	// Large size customers
	image('characters/largeCWalk1', 'large_customer_walk1'),
	image('characters/largeCWalk2', 'large_customer_walk2'),
	image('characters/largeCWalk3', 'large_customer_walk3'),
	image('characters/largeCSit1', 'large_customer_sit1'),

	image('characters/largeCWalk1_red', 'large_customer_walk1_red'),
	image('characters/largeCWalk2_red', 'large_customer_walk2_red'),
	image('characters/largeCWalk3_red', 'large_customer_walk3_red'),
	image('characters/largeCSit1_red', 'large_customer_sit1_red'),

	image('characters/largeCWalk1_aqua', 'large_customer_walk1_aqua'),
	image('characters/largeCWalk2_aqua', 'large_customer_walk2_aqua'),
	image('characters/largeCWalk3_aqua', 'large_customer_walk3_aqua'),
	image('characters/largeCSit1_aqua', 'large_customer_sit1_aqua'),

	image('characters/largeCWalk1_green', 'large_customer_walk1_green'),
	image('characters/largeCWalk2_green', 'large_customer_walk2_green'),
	image('characters/largeCWalk3_green', 'large_customer_walk3_green'),
	image('characters/largeCSit1_green', 'large_customer_sit1_green'),
	// Sprite
	image('characters/moneybagSprite', 'moneybag_sprite'),

	// Items
	image('items/coin', 'coin'),
	image('items/bath1', 'bath_1'),
	image('items/bath1f', 'bath_1_front'),
	image('items/bath2', 'bath_2'),
	image('items/bath2f', 'bath_2_front'),
	image('items/bath3', 'bath_3'),
	image('items/bath3f', 'bath_3_front'),
	image('items/wax1', 'wax_1'),
	image('items/wax2', 'wax_2'),
	image('items/wax3', 'wax_3'),
	image('items/nail1', 'nail_1'),
	image('items/nail2', 'nail_2'),
	image('items/nail3', 'nail_3'),
	image('items/waitchair1', 'waitchair_1'),
	image('items/waitchair2', 'waitchair_2'),
	image('items/waitchair3', 'waitchair_3'),
	image('items/checkout', 'checkout'),

	// UI
	image('ui/angyv', 'angyv'),
	image('ui/bubble', 'bubble'),
	image('ui/exclamation', 'exclamation'),
	image('ui/happy', 'happy'),
	image('ui/love', 'love'),
	image('ui/money', 'money'),
	image('ui/question', 'question'),
	image('ui/sad', 'sad'),
	image('ui/timer', 'timer'),
	image('ui/plus', 'plus'),
	image('ui/wax', 'wax'),
	image('ui/nail', 'nail'),
	image('ui/bath', 'bath'),

	// Titlescreen
	image('titlescreen/background', 'title_background'),
	image('titlescreen/backgroundsitting', 'title_chairs'),
	image('titlescreen/backgroundbath', 'title_bath'),
	image('titlescreen/tail', 'title_tail'),
	image('titlescreen/hand', 'title_hand'),
	image('titlescreen/washbeartail', 'title_washbear_tail'),
	image('titlescreen/washbearhand', 'title_washbear_hand'),
	image('titlescreen/title', 'title_logo'),

	//temp
	image('temp/invwindow', 'invwindow'),
	image('temp/shopwindow', 'shopwindow'),
	image('temp/lugia', 'lugia'),
	image('temp/protogen', 'protogen'),
	image('temp/triceratops', 'triceratops'),
	image('temp/raptor', 'raptor'),
	image('temp/boykisser', 'boykisser'),
	image('temp/dragon', 'dragon'),
	image('temp/h1', 'h1'),
	image('temp/h2', 'h2'),
	image('temp/h3', 'h3'),
	image('temp/h4', 'h4'),
	image('temp/h5', 'h5'),
	image('temp/h6', 'h6'),
	image('temp/blanksq', 'blanksq'),

];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	// Title screen sparkle
	spritesheet('titlescreen/sparklesyass', 'sparklesyass', 64, 64),
	//temp
	spritesheet('temp/invbutton', 'invbutton', 240, 480),
	spritesheet('temp/fwbutton', 'fwbutton', 64, 262),
	spritesheet('temp/rock', 'rock', 100, 100),
	spritesheet('temp/coke', 'coke', 100, 100),
	spritesheet('temp/brocc', 'brocc', 100, 100),
	spritesheet('temp/hotdog', 'hotdog', 100, 100),
	spritesheet('temp/hourglass', 'hourglass', 100, 100),
	spritesheet('temp/hypnosis', 'hypnosis', 100, 100),
	spritesheet('temp/milk', 'milk', 100, 100),
	spritesheet('temp/pocky', 'pocky', 100, 100),
	spritesheet('temp/polish', 'polish', 100, 100),
	spritesheet('temp/snowglobe', 'snowglobe', 100, 100),
	spritesheet('temp/usb', 'usb', 100, 100),
	spritesheet('temp/pillowtalk', 'pillowtalk', 100, 100),
	spritesheet('temp/shuriken', 'shuriken', 100, 100),
	spritesheet('temp/redx', 'redx', 64, 64),
	spritesheet('temp/anger', 'anger', 64, 64),
	spritesheet('temp/ellipse', 'ellipse', 64, 64),
	spritesheet('temp/redsparks', 'redspark', 64, 64),
	spritesheet('temp/greensparks', 'greenspark', 64, 64),
	spritesheet('temp/defaultsparks', 'defaultspark', 64, 64),
	spritesheet('temp/blankspr', 'blankspr', 100, 100),
	spritesheet('temp/buybutton', 'buybutton', 120, 90),
	spritesheet('temp/otter', 'otter', 1080, 1080),
];

/* Audios */
const audios: Audio[] = [
	music('bgm_intro', 'm_main_menu'),
	music('salonbase', 'm_salonbase'),
	music('saloncutscene', 'm_saloncutscene'),
	music('salondowntime', 'm_salondowntime'),
	sound('place', 'place', 0.5),
	sound('return', 'return', 0.5),
	sound('scroll', 'scroll', 0.5),
	sound('cashmoney', 'cashmoney', 0.5),
	sound('button', 'button', 0.5),
	sound('tree/rustle', 't_rustle', 0.5),
	sound('tree/escape', 'fail', 0.5),
	sound('crit', 'crit', 0.5),
	sound('sparkle', 'sparkle', 0.5),
	sound('polish', 'polish', 0.5),
	sound('snip', 'snip', 0.5),
	sound('goldbath', 'goldbath', 0.5),
	sound('fail', 'rip', 0.5),
	sound('sqk', 'sqk', 0.5),
	sound('squish1', 'squish1', 0.5),
	sound('squish2', 'squish2', 0.5),
	sound('endday', 'endday', 0.5),
	sound('chomp', 'chomp', 0.5),
	sound('bite', 'bite', 0.5),
	sound('doink', 'doink', 0.5),
	sound('slurp', 'slurp', 0.5),
	sound('pickupcustomer', 'pickup', 0.5),
	sound('dropcustomer', 'drop', 0.5),
	sound('tree/meme_explosion_sound', 'meme_explosion_sound', 0.5),

	sound("turtle/air", "air", 0.5),
	sound("turtle/flail", "flail", 0.5),
	sound("turtle/grab", "grab", 0.5),
	sound("turtle/land", "land", 0.5),
	sound("turtle/letgo1", "letgo1", 0.5),
	sound("turtle/letgo2", "letgo2", 0.5),
	sound("turtle/letgo3", "letgo3", 0.5),
	sound("turtle/miss", "miss", 0.5),
	sound("turtle/missLand", "missLand", 0.5),
	sound("turtle/score", "score", 0.5),
	sound("turtle/slip", "slip", 0.5),
	sound("turtle/toss", "toss", 0.5),
	sound("turtle/trick", "trick", 0.5),
	sound("turtle/trip", "trip", 0.5),
];

/* Fonts */
await loadFont('DynaPuff-Medium', 'Game Font');

export {
	images,
	spritesheets,
	audios
};