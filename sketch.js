let gameChar_x;
let gameChar_y;
let floorPos_y;
let isLeft;
let isRight;
let isFalling;
let isPlummeting;
let clouds;
let rocks_x;
let rocks_y;
let spikesY;
let spikeOffsetA;
let spikeOffsetB;
let largeTreesX;
let largeTreesY;
let smallTreesX;
let smallTreesY;
let mountains;
let sun_x;
let sun_y;
let cameraPosX;
let gameScore;
let treasureChest;
let lives;
let platforms;
let img
let enemies;
let gameStarted
let scoreNeeded;
let treasureChestLocked;
let canyons;
let collectables;
let canyonPosX;
let jumpSound;
let bgSound;
let musicStarted
let canyonSound
let collectableSound
let completeSound;
let endSound;
let endSoundPlayed
let spiderSound;


function preload() {

	soundFormats('mp3', 'wav');
	bgSound = loadSound("assets/bg.wav")
	bgSound.setVolume(0.15);
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.2);
	canyonSound = loadSound('assets/canyon.mp3');
	canyonSound.setVolume(0.05);
	collectableSound = loadSound('assets/collectable.wav');
	collectableSound.setVolume(0.2);
	completeSound = loadSound('assets/complete.wav');
	completeSound.setVolume(0.3);
	endSound = loadSound('assets/end.mp3');
	endSound.setVolume(0.3);
	spiderSound = loadSound('assets/spider.mp3');
	spiderSound.setVolume(0.3);

	img = loadImage("assets/img1.png")

}

function setup() {

	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	lives = 3;
	gameStarted = false;
	scoreNeeded = 10;
	treasureChestLocked = true;

}

function startGame() {

	gameStarted = true;
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	canyons = [];
	canyonPosX = -2000;
	for (let i = 0; i < 6; i++) {
		canyons.push({ x: canyonPosX, y: 410 })
		canyonPosX += 1070;
	}
	collectables = [];
	for (let i = 0; i < 10; i++) {
		collectables.push({ x: random(-3066, 3066), y: random(250, 403), isFound: false })
	}
	clouds = [{ x: -2300, y: 100 }, { x: -1000, y: 100 }, { x: 140, y: 90 }, { x: 1800, y: 70 }];
	rocks_x = [-3066, -2044, -1024, 0, 1024, 2044, 3066];
	rocks_y = 432;
	largeTreesX = [-1780, -1700, -2350, -1870, -1300, -700, -180, 815, 1810, 2100, 2680, 2800, 2950, 3400];
	largeTreesY = 355;
	smallTreesX = [-3830, -3650, -3550, -3150, -1400, -2700, -470, -400, 90, 2650, 1800, 2750, 4100, 5470, 5570, 5800, 7500];
	smallTreesY = 770;
	mountains = [{ x: -2800, y: 223 }, { x: -900, y: 223 }, { x: 580, y: 223 }, { x: 400, y: 223 }, { x: 1700, y: 223 }, { x: 3600, y: 223 }];
	sun_x = 270;
	sun_y = 120;
	cameraPosX = 0;
	spikesY = 580;
	spikeOffsetA = 0;
	spikeOffsetB = 0;
	gameScore = 0;
	treasureChest = { isReached: false, x_pos: 4050 }
	endSoundPlayed = false;
	treasureChestLocked = true;
	musicStarted = false;
	endSoundPlayed = false
	platforms = [];
	platforms.push(createPlatforms(110, floorPos_y - 90, 130))
	platforms.push(createPlatforms(1920, floorPos_y - 110, 150))
	platforms.push(createPlatforms(3300, floorPos_y - 110, 200))
	platforms.push(createPlatforms(-2200, floorPos_y - 110, 200))

	enemies = [];
	enemies.push(new Enemy(300, floorPos_y - 10, 100))
	enemies.push(new Enemy(1920, floorPos_y - 10, 100))
	enemies.push(new Enemy(3150, floorPos_y - 10, 100))
	enemies.push(new Enemy(-1050, floorPos_y - 10, 100))
	enemies.push(new Enemy(-2100, floorPos_y - 10, 100))

}

function draw() {

	////////////INSTRUCTIONS////////
	if (!gameStarted) {
		background(20, 30, 40);
		fill(255, 215, 0);
		textSize(48);
		textAlign(CENTER, CENTER);
		text("MINER'S QUEST", width / 2, height / 4);
		fill(0, 150);
		rect(width / 2 - 300, height / 2 - 100, 600, 200, 20);
		fill(255);
		textSize(20);
		text("INSTRUCTIONS:", width / 2, height / 2 - 50);
		textSize(16);
		text("• Press W or ↑ to JUMP", width / 2, height / 2 - 10);
		text("• Press A/← or D/→ to MOVE", width / 2, height / 2 + 20);
		text("• Collect crystals for points", width / 2, height / 2 + 50);
		text("• Avoid spiders and canyons", width / 2, height / 2 + 80);
		fill(255, 215, 0);
		textSize(24);
		text("PRESS W TO START", width / 2, height - 100);
		return;
	}

	//////////////DRAWING CODE////////
	cameraPosX = gameChar_x - width / 2; //camera
	let worldCharX = gameChar_x;
	let distanceToSun = abs(worldCharX - sun_x);// background
	let redValue = map(distanceToSun, 0, 3584, 100, 50);
	let greenValue = map(distanceToSun, 0, 3584, 30, 10);
	let blueValue = 0;

	redValue = constrain(redValue, 50, 100);
	greenValue = constrain(greenValue, 10, 30);
	background(redValue, greenValue, blueValue);
	noStroke(); //ground
	fill(70, 35, 15);
	rect(0, rocks_y, width, height - floorPos_y);
	push()
	translate(-cameraPosX, 0);
	stroke(0); // Sun
	strokeWeight(3);
	fill(180, 90, 30);
	ellipse(sun_x, sun_y, 130, 125);
	noStroke()

	drawMountains() //Function calls
	drawRocks()
	drawTrees()
	drawClouds()
	for (let i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i])
		checkCanyon(canyons[i])
	}
	for (let i = 0; i < collectables.length; i++) {
		if (collectables[i].isFound == false) {
			drawCollectables(collectables[i])
			checkCollectable(collectables[i])
		}
	}
	for (let i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}

	////////THE GAME CHARACTER////////
	if (isLeft == true && isFalling == true) {
		fill(139, 69, 19)//axe 
		quad(gameChar_x + 6.5, gameChar_y - 36.4, gameChar_x + 6.5, gameChar_y - 37.7, gameChar_x - 11.7, gameChar_y - 31.85, gameChar_x - 11.7, gameChar_y - 30.55)
		fill(169, 169, 169)
		quad(gameChar_x + 7.8, gameChar_y - 40.3, gameChar_x + 4.55, gameChar_y - 41.6, gameChar_x + 7.8, gameChar_y - 31.2, gameChar_x + 9.75, gameChar_y - 34.45)
		fill(119, 136, 153) //lamp
		ellipse(gameChar_x - 18.2, gameChar_y - 27.3, 6.5, 9.1)
		fill(0)
		ellipse(gameChar_x - 18.2, gameChar_y - 27.3, 3.9, 6.5)
		fill(255, 215, 0)
		rect(gameChar_x - 22.1, gameChar_y - 26, 9.1, 11.7)
		fill(218, 165, 32)
		triangle(gameChar_x - 22.1, gameChar_y - 26, gameChar_x - 22.1, gameChar_y - 14.3, gameChar_x - 17.55, gameChar_y - 20.15)
		triangle(gameChar_x - 13, gameChar_y - 26, gameChar_x - 17.55, gameChar_y - 20.15, gameChar_x - 13, gameChar_y - 14.3)
		fill(119, 136, 153)
		rect(gameChar_x - 22.1, gameChar_y - 26, 9.1, 2.6)
		rect(gameChar_x - 22.1, gameChar_y - 16.9, 9.1, 2.6)
		fill(80, 100, 120) //right leg
		quad(gameChar_x - 0, gameChar_y - 11.7, gameChar_x - 10.4, gameChar_y - 15.6, gameChar_x - 10.4, gameChar_y - 11.7, gameChar_x - 1.3, gameChar_y - 7.8)
		ellipse(gameChar_x - 10.4, gameChar_y - 13, 3.9, 3.9)
		quad(gameChar_x - 7.8, gameChar_y - 11.7, gameChar_x - 11.7, gameChar_y - 14.3, gameChar_x - 15.6, gameChar_y - 6.5, gameChar_x - 11.7, gameChar_y - 5.2)
		fill(128, 128, 128) //right boot
		quad(gameChar_x - 11.05, gameChar_y - 5.2, gameChar_x - 14.95, gameChar_y - 8.45, gameChar_x - 18.2, gameChar_y - 4.55, gameChar_x - 14.3, gameChar_y - 1.3)
		ellipse(gameChar_x - 16.9, gameChar_y - 6.5, 4.55, 3.9)
		fill(80, 100, 120)//left leg
		quad(gameChar_x - 0, gameChar_y - 10.4, gameChar_x - 4.55, gameChar_y - 10.4, gameChar_x - 4.55, gameChar_y - 3.9, gameChar_x - 0, gameChar_y - 3.9)
		ellipse(gameChar_x - 1.17, gameChar_y - 11.7, 7.8, 3.9)
		ellipse(gameChar_x - 1.95, gameChar_y - 3.9, 5.2, 5.2)
		quad(gameChar_x + 2.6, gameChar_y - 4.55, gameChar_x - 1.3, gameChar_y - 5.2, gameChar_x - 1.3, gameChar_y - 1.3, gameChar_x + 2.6, gameChar_y - 0.65)
		fill(128, 128, 128) //left boot
		quad(gameChar_x + 6.5, gameChar_y - 4.55, gameChar_x + 1.3, gameChar_y - 4.55, gameChar_x + 1.3, gameChar_y, gameChar_x + 6.5, gameChar_y - 0.65)
		ellipse(gameChar_x + 3.9, gameChar_y, 5.2, 6.5)
		fill(60, 90, 110) //left rect body
		rect(gameChar_x + 2.6, gameChar_y - 36.4, -11.7, 24.7)
		fill(80, 120, 150) //middle triangle body
		triangle(gameChar_x - 9.1, gameChar_y - 36.4, gameChar_x - 9.1, gameChar_y - 28.6, gameChar_x + 1.3, gameChar_y - 36.4)
		fill(245, 222, 179) //head
		ellipse(gameChar_x - 5.2, gameChar_y - 42.9, 16.9, 14.3)
		fill(165, 99, 71) //hair
		ellipse(gameChar_x - 0, gameChar_y - 45.5, 7.8, 15.6)
		fill(0) //eye
		ellipse(gameChar_x - 11.05, gameChar_y - 42.9, 1.95, 3.9)
		fill(245, 222, 179) //nose
		ellipse(gameChar_x - 13, gameChar_y - 40.3, 2.6, 2.6)
		fill(218, 165, 32) //cap
		arc(gameChar_x - 5.2, gameChar_y - 45.5, 20.8, 26, PI, 0)
		fill(255, 204, 0)
		arc(gameChar_x - 5.2, gameChar_y - 45.5, 19.5, 20.8, PI, 0)
		fill(218, 165, 32)
		rect(gameChar_x + 6.5, gameChar_y - 48.1, -24.05, 2.6)
		fill(218, 165, 32) //light on helmet
		rect(gameChar_x - 15.6, gameChar_y - 54.6, 2.6, 3.9)
		fill(0)
		rect(gameChar_x - 16.9, gameChar_y - 55.25, 1.3, 5.2)
		noFill(); //smile
		stroke(0);
		strokeWeight(0.78);
		arc(gameChar_x - 9.75, gameChar_y - 40.95, 5.2, 5.2, 0.20 * PI, 0.60 * PI);
		noStroke()
		fill(25, 10, 60) //belt
		rect(gameChar_x + 2.6, gameChar_y - 18.2, -11.7, 3.9)
		fill(222, 184, 135) //ear
		ellipse(gameChar_x - 3.25, gameChar_y - 43.55, 3.9, 5.2)
		fill(80, 100, 120) //hand right
		ellipse(gameChar_x - 0.91, gameChar_y - 29.9, 3.9, 3.9)
		quad(gameChar_x + 1.3, gameChar_y - 29.9, gameChar_x - 2.6, gameChar_y - 29.9, gameChar_x - 5.85, gameChar_y - 26, gameChar_x - 3.9, gameChar_y - 23.4)
		ellipse(gameChar_x - 5.2, gameChar_y - 24.7, 2.6, 3.9)
		quad(gameChar_x - 3.9, gameChar_y - 26, gameChar_x - 8.45, gameChar_y - 33.8, gameChar_x - 11.05, gameChar_y - 32.5, gameChar_x - 5.2, gameChar_y - 22.1)
		fill(255, 215, 0, 70) //light triangle
		triangle(gameChar_x - 11.7, gameChar_y - 52, gameChar_x - 33.8, gameChar_y - 41.6, gameChar_x - 33.8, gameChar_y - 63.7)
		fill(245, 222, 179) //ellipse eof peach hand over the axe
		ellipse(gameChar_x - 9.1, gameChar_y - 32.5, 4.55, 3.9)
		fill(80, 100, 120) //left hand
		quad(gameChar_x - 9.1, gameChar_y - 28.6, gameChar_x - 14.3, gameChar_y - 30.55, gameChar_x - 15.6, gameChar_y - 27.95, gameChar_x - 9.1, gameChar_y - 24.7)
		fill(245, 222, 179)
		ellipse(gameChar_x - 14.95, gameChar_y - 29.51, 3.9, 3.9)
	}
	else if (isRight && isFalling) {
		fill(119, 136, 153) //lamp
		ellipse(gameChar_x + 18.2, gameChar_y - 27.3, 6.5, 9.1)
		fill(0)
		ellipse(gameChar_x + 18.2, gameChar_y - 27.3, 3.9, 6.5)
		fill(255, 215, 0)
		rect(gameChar_x + 13, gameChar_y - 26, 9.1, 11.7)
		fill(218, 165, 32)
		triangle(gameChar_x + 22.1, gameChar_y - 26, gameChar_x + 22.1, gameChar_y - 14.3, gameChar_x + 17.55, gameChar_y - 20.15)
		triangle(gameChar_x + 13, gameChar_y - 26, gameChar_x + 17.55, gameChar_y - 20.15, gameChar_x + 13, gameChar_y - 14.3)
		fill(119, 136, 153)
		rect(gameChar_x + 13, gameChar_y - 26, 9.1, 2.6)
		rect(gameChar_x + 13, gameChar_y - 16.9, 9.1, 2.6)
		fill(80, 100, 120)//right leg
		quad(gameChar_x + 2.6, gameChar_y - 11.7, gameChar_x + 13, gameChar_y - 15.6, gameChar_x + 13, gameChar_y - 11.7, gameChar_x + 3.9, gameChar_y - 7.8)
		ellipse(gameChar_x + 13, gameChar_y - 13, 3.9, 3.9)
		quad(gameChar_x + 10.4, gameChar_y - 11.7, gameChar_x + 14.3, gameChar_y - 14.3, gameChar_x + 18.2, gameChar_y - 6.5, gameChar_x + 14.3, gameChar_y - 5.2)
		fill(128, 128, 128) //right boot
		quad(gameChar_x + 13.65, gameChar_y - 5.2, gameChar_x + 17.55, gameChar_y - 8.45, gameChar_x + 20.8, gameChar_y - 4.55, gameChar_x + 16.9, gameChar_y - 1.3)
		ellipse(gameChar_x + 19.5, gameChar_y - 6.5, 4.55, 3.9)
		fill(80, 100, 120) //left leg
		quad(gameChar_x + 2.6, gameChar_y - 10.4, gameChar_x + 7.15, gameChar_y - 10.4, gameChar_x + 7.15, gameChar_y - 3.9, gameChar_x + 2.6, gameChar_y - 3.9)
		ellipse(gameChar_x + 3.77, gameChar_y - 11.7, 7.8, 3.9)
		ellipse(gameChar_x + 4.55, gameChar_y - 3.9, 5.2, 5.2)
		quad(gameChar_x, gameChar_y - 4.55, gameChar_x + 3.9, gameChar_y - 5.2, gameChar_x + 3.9, gameChar_y - 1.3, gameChar_x + 0, gameChar_y - 0.65)
		fill(128, 128, 128) //left boot
		quad(gameChar_x - 5.2, gameChar_y - 4.55, gameChar_x, gameChar_y - 4.55, gameChar_x, gameChar_y, gameChar_x - 5.2, gameChar_y - 0.65)
		ellipse(gameChar_x - 2.6, gameChar_y, 5.2, 6.5)
		fill(60, 90, 110) //left rect body
		rect(gameChar_x + 0, gameChar_y - 36.4, 11.7, 24.7)
		fill(80, 120, 150) //middle triangle body
		triangle(gameChar_x + 11.7, gameChar_y - 36.4, gameChar_x + 11.7, gameChar_y - 28.6, gameChar_x + 1.3, gameChar_y - 36.4)
		fill(80, 100, 120) //left hand
		quad(gameChar_x + 11.7, gameChar_y - 28.6, gameChar_x + 16.9, gameChar_y - 30.55, gameChar_x + 18.2, gameChar_y - 27.95, gameChar_x + 11.7, gameChar_y - 24.7)
		fill(245, 222, 179)
		ellipse(gameChar_x + 17.55, gameChar_y - 29.51, 3.9, 3.9)
		fill(245, 222, 179) //head
		ellipse(gameChar_x + 7.8, gameChar_y - 42.9, 16.9, 14.3)
		fill(165, 99, 71) //hair
		ellipse(gameChar_x + 2.6, gameChar_y - 45.5, 7.8, 15.6)
		fill(0) //eye
		ellipse(gameChar_x + 13.65, gameChar_y - 42.9, 1.95, 3.9)
		fill(245, 222, 179) //nose
		ellipse(gameChar_x + 15.6, gameChar_y - 40.3, 2.6, 2.6)
		fill(218, 165, 32) //cap
		arc(gameChar_x + 7.8, gameChar_y - 45.5, 20.8, 26, PI, 0)
		fill(255, 204, 0)
		arc(gameChar_x + 7.8, gameChar_y - 45.5, 19.5, 20.8, PI, 0)
		fill(218, 165, 32)
		rect(gameChar_x - 3.9, gameChar_y - 48.1, 24.05, 2.6)
		fill(218, 165, 32) //light on helmet
		rect(gameChar_x + 15.6, gameChar_y - 54.6, 2.6, 3.9)
		fill(0)
		rect(gameChar_x + 18.2, gameChar_y - 55.25, 1.3, 5.2)
		noFill(); //smile
		stroke(0);
		strokeWeight(0.78);
		arc(gameChar_x + 12.35, gameChar_y - 40.95, 5.2, 5.2, 0.40 * PI, 0.80 * PI);
		noStroke()
		fill(25, 10, 60) //belt
		rect(gameChar_x + 0, gameChar_y - 18.2, 11.7, 3.9)
		fill(222, 184, 135) //ear
		ellipse(gameChar_x + 5.85, gameChar_y - 43.55, 3.9, 5.2)
		fill(80, 100, 120) //hand right
		ellipse(gameChar_x + 4.55, gameChar_y - 29.9, 3.9, 3.9)
		quad(gameChar_x + 2.6, gameChar_y - 29.9, gameChar_x + 6.5, gameChar_y - 29.9, gameChar_x + 9.75, gameChar_y - 26, gameChar_x + 7.8, gameChar_y - 23.4)
		ellipse(gameChar_x + 9.1, gameChar_y - 24.7, 2.6, 3.9)
		quad(gameChar_x + 7.8, gameChar_y - 26, gameChar_x + 12.35, gameChar_y - 33.8, gameChar_x + 14.95, gameChar_y - 32.5, gameChar_x + 9.1, gameChar_y - 22.1)
		fill(245, 222, 179)
		ellipse(gameChar_x + 13, gameChar_y - 32.5, 4.55, 3.9)
		fill(255, 215, 0, 70) //light triangle
		triangle(gameChar_x + 18.2, gameChar_y - 52, gameChar_x + 33.8, gameChar_y - 41.6, gameChar_x + 33.8, gameChar_y - 63.7)
		fill(139, 69, 19)//axe in hand
		quad(gameChar_x - 3.9, gameChar_y - 36.4, gameChar_x - 3.9, gameChar_y - 37.7, gameChar_x + 14.3, gameChar_y - 31.85, gameChar_x + 14.3, gameChar_y - 30.55)
		fill(169, 169, 169)
		quad(gameChar_x - 5.2, gameChar_y - 40.3, gameChar_x - 1.95, gameChar_y - 41.6, gameChar_x - 5.2, gameChar_y - 31.2, gameChar_x - 7.15, gameChar_y - 34.45)
	}
	else if (isLeft) {
		fill(60, 90, 110) //right rect body
		rect(gameChar_x - 6.5, gameChar_y - 37.7, 11.7, 24.7)
		fill(80, 120, 150) //middle triangle body
		triangle(gameChar_x - 6.5, gameChar_y - 37.7, gameChar_x - 6.5, gameChar_y - 29.9, gameChar_x + 3.9, gameChar_y - 37.7)
		fill(245, 222, 179) //head
		ellipse(gameChar_x - 2.6, gameChar_y - 44.2, 16.9, 14.3)
		fill(165, 99, 71) //hair
		ellipse(gameChar_x + 2.6, gameChar_y - 46.8, 7.8, 15.6)
		fill(0) //eye
		ellipse(gameChar_x - 8.45, gameChar_y - 44.2, 1.95, 3.9)
		fill(245, 222, 179) //nose
		ellipse(gameChar_x - 10.4, gameChar_y - 41.6, 2.6, 2.6)
		fill(218, 165, 32) //cap
		arc(gameChar_x - 2.6, gameChar_y - 46.8, 20.8, 26, PI, 0)
		fill(255, 204, 0);
		arc(gameChar_x - 2.6, gameChar_y - 46.8, 19.5, 20.8, PI, 0)
		fill(218, 165, 32)
		rect(gameChar_x - 14.95, gameChar_y - 49.4, 24.05, 2.6)
		fill(218, 165, 32) //light on helemt
		rect(gameChar_x - 13, gameChar_y - 55.9, 2.6, 3.9)
		fill(0)
		rect(gameChar_x - 14.3, gameChar_y - 56.55, 1.3, 5.2)
		noFill(); //smile
		stroke(0);
		strokeWeight(0.78);
		arc(gameChar_x - 7.15, gameChar_y - 42.25, 5.2, 5.2, 0.20 * PI, 0.60 * PI);
		noStroke()
		fill(25, 10, 60) //belt
		rect(gameChar_x - 6.5, gameChar_y - 19.5, 11.7, 3.9)
		fill(119, 136, 153) //lamp
		ellipse(gameChar_x - 14.3, gameChar_y - 22.1, 6.5, 9.1)
		fill(0)
		ellipse(gameChar_x - 14.3, gameChar_y - 22.1, 3.9, 6.5)
		fill(255, 215, 0)
		rect(gameChar_x - 18.2, gameChar_y - 20.8, 9.1, 11.7)
		fill(218, 165, 32)
		triangle(gameChar_x - 18.2, gameChar_y - 20.8, gameChar_x - 18.2, gameChar_y - 9.1, gameChar_x - 13.65, gameChar_y - 14.95)
		triangle(gameChar_x - 9.1, gameChar_y - 20.8, gameChar_x - 13.65, gameChar_y - 14.95, gameChar_x - 9.1, gameChar_y - 9.1)
		fill(119, 136, 153)
		rect(gameChar_x - 18.2, gameChar_y - 20.8, 9.1, 2.6)
		rect(gameChar_x - 18.2, gameChar_y - 11.7, 9.1, 2.6)
		fill(222, 184, 135) //ear
		ellipse(gameChar_x - 0.65, gameChar_y - 44.85, 3.9, 5.2)
		fill(80, 100, 120) //hand left
		ellipse(gameChar_x - 1.3, gameChar_y - 31.2, 3.9, 5.2)
		rect(gameChar_x - 3.25, gameChar_y - 31.2, 3.9, 7.8)
		ellipse(gameChar_x - 1.3, gameChar_y - 24.7, 3.9, 5.2)
		rect(gameChar_x - 13, gameChar_y - 26, 13, 3.9)
		fill(245, 222, 179)
		ellipse(gameChar_x - 13, gameChar_y - 24.05, 5.2, 5.2)
		fill(80, 100, 120) //hand right
		quad(gameChar_x + 5.2, gameChar_y - 35.1, gameChar_x + 10.4, gameChar_y - 31.2, gameChar_x + 7.8, gameChar_y - 26, gameChar_x + 5.2, gameChar_y - 28.6)
		ellipse(gameChar_x + 9.88, gameChar_y - 27.95, 4.55, 6.5)
		quad(gameChar_x + 9.1, gameChar_y - 31.2, gameChar_x + 11.7, gameChar_y - 26, gameChar_x + 10.4, gameChar_y - 19.5, gameChar_x + 6.5, gameChar_y - 20.8)
		fill(245, 222, 179) //stick over hand
		ellipse(gameChar_x + 7.8, gameChar_y - 19.5, 5.2, 5.2)
		fill(139, 69, 19) //axe stick in hand
		quad(gameChar_x + 5.2, gameChar_y - 23.4, gameChar_x + 11.7, gameChar_y - 15.6, gameChar_x + 10.4, gameChar_y - 14.3, gameChar_x + 5.2, gameChar_y - 20.8)
		fill(60, 90, 110) //left leg
		quad(gameChar_x - 6.5, gameChar_y - 14.3, gameChar_x - 1.3, gameChar_y - 13, gameChar_x - 6.5, gameChar_y - 0, gameChar_x - 11.7, gameChar_y - 0)
		fill(128, 128, 128) //left boot
		quad(gameChar_x - 10.79, gameChar_y - 3.9, gameChar_x - 5.2, gameChar_y - 2.6, gameChar_x - 7.8, gameChar_y + 3.9, gameChar_x - 13, gameChar_y + 2.6)
		ellipse(gameChar_x - 12.09, gameChar_y - 0, 6.5, 5.2)
		fill(60, 90, 110) //right leg
		quad(gameChar_x - 4.55, gameChar_y - 13, gameChar_x + 1.95, gameChar_y - 13, gameChar_x + 2.6, gameChar_y - 6.89, gameChar_x - 1.56, gameChar_y - 3.9)
		quad(gameChar_x - 1.95, gameChar_y - 4.55, gameChar_x + 2.6, gameChar_y - 7.8, gameChar_x + 9.1, gameChar_y - 0.65, gameChar_x + 4.55, gameChar_y + 1.3)
		fill(128, 128, 128) //right boot
		quad(gameChar_x, gameChar_y, gameChar_x + 5.2, gameChar_y - 5.2, gameChar_x + 10.14, gameChar_y - 0, gameChar_x + 4.81, gameChar_y + 3.9)
		ellipse(gameChar_x + 2.73, gameChar_y + 1.82, 6.5, 5.2)
		fill(255, 215, 0, 70) //light triangle
		triangle(gameChar_x - 13, gameChar_y - 53.3, gameChar_x - 28.6, gameChar_y - 42.9, gameChar_x - 28.6, gameChar_y - 65)
	}
	else if (isRight) {
		fill(119, 136, 153) //lamp
		ellipse(gameChar_x - 5.2, gameChar_y - 19.5, 6.5, 9.1)
		fill(0)
		ellipse(gameChar_x - 5.2, gameChar_y - 19.5, 3.9, 6.5)
		fill(255, 215, 0)
		rect(gameChar_x - 10.4, gameChar_y - 18.2, 9.1, 11.7)
		fill(218, 165, 32)
		triangle(gameChar_x - 1.3, gameChar_y - 18.2, gameChar_x - 1.3, gameChar_y - 6.5, gameChar_x - 5.85, gameChar_y - 12.35)
		triangle(gameChar_x - 10.4, gameChar_y - 18.2, gameChar_x - 5.85, gameChar_y - 12.35, gameChar_x - 10.4, gameChar_y - 6.5)
		fill(119, 136, 153)
		rect(gameChar_x - 10.4, gameChar_y - 18.2, 9.1, 2.6)
		rect(gameChar_x - 10.4, gameChar_y - 9.1, 9.1, 2.6)
		fill(60, 90, 110) //right rect body
		rect(gameChar_x - 1.3, gameChar_y - 39, 11.7, 24.7)
		fill(80, 120, 150) //middle triangle body
		triangle(gameChar_x + 10.4, gameChar_y - 39, gameChar_x + 10.4, gameChar_y - 31.2, gameChar_x + 0, gameChar_y - 39)
		fill(245, 222, 179) //head
		ellipse(gameChar_x + 6.5, gameChar_y - 45.5, 16.9, 14.3)
		fill(165, 99, 71) //hair
		ellipse(gameChar_x + 1.3, gameChar_y - 48.1, 7.8, 15.6)
		fill(0) //eye
		ellipse(gameChar_x + 12.35, gameChar_y - 45.5, 1.95, 3.9)
		fill(245, 222, 179) //nose
		ellipse(gameChar_x + 14.3, gameChar_y - 42.9, 2.6, 2.6)
		fill(218, 165, 32) //cap
		arc(gameChar_x + 6.5, gameChar_y - 48.1, 20.8, 26, PI, 0)
		fill(255, 204, 0)
		arc(gameChar_x + 6.5, gameChar_y - 48.1, 19.5, 20.8, PI, 0)
		fill(218, 165, 32)
		rect(gameChar_x - 5.2, gameChar_y - 50.7, 24.05, 2.6)
		fill(218, 165, 32) //light on helmet
		rect(gameChar_x + 14.3, gameChar_y - 57.2, 2.6, 3.9)
		fill(0)
		rect(gameChar_x + 16.9, gameChar_y - 57.85, 1.3, 5.2)
		noFill(); //smile
		stroke(0);
		strokeWeight(0.78);
		arc(gameChar_x + 11.05, gameChar_y - 43.55, 5.2, 5.2, 0.40 * PI, 0.80 * PI);
		noStroke()
		fill(25, 10, 60) //belt
		rect(gameChar_x - 1.3, gameChar_y - 20.8, 11.7, 3.9)
		fill(222, 184, 135) //ear
		ellipse(gameChar_x + 4.55, gameChar_y - 46.15, 3.9, 5.2)
		fill(80, 100, 120) //hand right 
		ellipse(gameChar_x + 5.2, gameChar_y - 32.5, 3.9, 5.2)
		rect(gameChar_x + 3.25, gameChar_y - 32.5, 3.9, 7.8)
		ellipse(gameChar_x + 5.2, gameChar_y - 26, 3.9, 5.2)
		rect(gameChar_x + 3.9, gameChar_y - 27.3, 13, 3.9)
		fill(245, 222, 179)
		ellipse(gameChar_x + 16.9, gameChar_y - 25.35, 5.2, 5.2)
		fill(80, 100, 120) //hand left
		quad(gameChar_x - 1.3, gameChar_y - 36.4, gameChar_x - 6.5, gameChar_y - 32.5, gameChar_x - 3.9, gameChar_y - 27.3, gameChar_x - 1.3, gameChar_y - 29.9)
		ellipse(gameChar_x - 5.98, gameChar_y - 29.25, 4.55, 6.5)
		quad(gameChar_x - 5.2, gameChar_y - 32.5, gameChar_x - 7.8, gameChar_y - 27.3, gameChar_x - 6.5, gameChar_y - 20.8, gameChar_x - 2.6, gameChar_y - 22.1)
		fill(245, 222, 179) //hand over stick
		ellipse(gameChar_x - 3.9, gameChar_y - 20.8, 5.2, 5.2)
		fill(60, 90, 110) //right leg
		quad(gameChar_x + 10.4, gameChar_y - 15.6, gameChar_x + 5.2, gameChar_y - 14.3, gameChar_x + 10.4, gameChar_y - 1.3, gameChar_x + 15.6, gameChar_y - 1.3)
		fill(128, 128, 128) //right boot
		quad(gameChar_x + 14.69, gameChar_y - 5.2, gameChar_x + 9.1, gameChar_y - 3.9, gameChar_x + 11.7, gameChar_y + 2.6, gameChar_x + 16.9, gameChar_y + 1.3)
		ellipse(gameChar_x + 15.99, gameChar_y - 1.3, 6.5, 5.2)
		fill(60, 90, 110) //left leg
		quad(gameChar_x + 8.45, gameChar_y - 14.3, gameChar_x + 1.95, gameChar_y - 14.3, gameChar_x + 1.3, gameChar_y - 8.19, gameChar_x + 5.46, gameChar_y - 5.2)
		quad(gameChar_x + 5.85, gameChar_y - 5.85, gameChar_x + 1.3, gameChar_y - 9.1, gameChar_x - 5.2, gameChar_y - 1.95, gameChar_x - 0.65, gameChar_y + 0)
		fill(128, 128, 128) //left boot
		quad(gameChar_x + 2.6, gameChar_y - 3.25, gameChar_x - 1.3, gameChar_y - 6.5, gameChar_x - 6.24, gameChar_y - 1.3, gameChar_x - 0.91, gameChar_y + 2.6)
		ellipse(gameChar_x, gameChar_y, 6.5, 5.2)
		fill(255, 215, 0, 70) //light triangle
		triangle(gameChar_x + 16.9, gameChar_y - 54.6, gameChar_x + 32.5, gameChar_y - 44.2, gameChar_x + 32.5, gameChar_y - 66.3)
		fill(139, 69, 19) //axe in hand
		quad(gameChar_x + 25.35, gameChar_y - 33.8, gameChar_x + 26, gameChar_y - 32.5, gameChar_x + 11.7, gameChar_y - 16.9, gameChar_x + 9.1, gameChar_y - 16.9)
		fill(169, 169, 169)
		quad(gameChar_x + 20.8, gameChar_y - 36.4, gameChar_x + 28.6, gameChar_y - 28.6, gameChar_x + 29.9, gameChar_y - 31.2, gameChar_x + 23.4, gameChar_y - 37.7)
	}
	else if (isFalling || isPlummeting) {
		fill(70, 100, 120) //left rect body
		rect(gameChar_x - 15.6, gameChar_y - 42.9, 11.7, 24.7)
		fill(60, 90, 110) //right rect body
		rect(gameChar_x - 3.9, gameChar_y - 42.9, 11.7, 24.7)
		fill(80, 120, 150)//middle triangle body
		triangle(gameChar_x - 14.3, gameChar_y - 42.9, gameChar_x + 6.5, gameChar_y - 42.9, gameChar_x - 3.9, gameChar_y - 36.4)
		rect(gameChar_x - 13.65, gameChar_y - 36.4, 5.85, 3.9) //left pocket
		ellipse(gameChar_x - 10.4, gameChar_y - 31.85, 5.85, 3.9)
		rect(gameChar_x - 0.65, gameChar_y - 36.4, 5.85, 3.9)//right pocket
		ellipse(gameChar_x + 2.6, gameChar_y - 31.85, 5.85, 3.9)
		fill(25, 10, 60) //belt + belt light
		quad(gameChar_x - 15.6, gameChar_y - 20.8, gameChar_x - 15.6, gameChar_y - 24.7, gameChar_x + 7.8, gameChar_y - 26, gameChar_x + 7.8, gameChar_y - 22.1)
		fill(255, 204, 0)
		quad(gameChar_x - 6.5, gameChar_y - 25.35, gameChar_x - 2.6, gameChar_y - 25.675, gameChar_x - 2.6, gameChar_y - 21.45, gameChar_x - 6.5, gameChar_y - 21.45)
		fill(245, 222, 179) //tilted face
		ellipse(gameChar_x - 3.9, gameChar_y - 49.4, 18.2, 14.3)
		fill(255, 204, 0); //cap yellow
		arc(gameChar_x - 5.2, gameChar_y - 53.3, 20.8, 19.5, PI - 0.2, -0.2) //radians
		fill(218, 165, 32)
		quad(gameChar_x - 15.6, gameChar_y - 52, gameChar_x + 4.55, gameChar_y - 57.2, gameChar_x + 5.2, gameChar_y - 54.6, gameChar_x - 14.3, gameChar_y - 49.4)
		quad(gameChar_x - 11.7, gameChar_y - 62.4, gameChar_x - 5.2, gameChar_y - 63.7, gameChar_x - 2.6, gameChar_y - 54.6, gameChar_x - 9.1, gameChar_y - 52)
		fill(220, 150, 32)
		quad(gameChar_x - 10.4, gameChar_y - 63.7, gameChar_x - 7.8, gameChar_y - 64.35, gameChar_x - 5.2, gameChar_y - 55.9, gameChar_x - 7.8, gameChar_y - 54.6)
		stroke(0) //light
		strokeWeight(1.3);
		fill(255)
		ellipse(gameChar_x - 7.15, gameChar_y - 58.5, 3.9, 3.9)
		noStroke()
		fill(255) //eyes
		ellipse(gameChar_x - 7.8, gameChar_y - 48.75, 3.9, 3.9)
		ellipse(gameChar_x + 0, gameChar_y - 50.7, 3.9, 3.9)
		fill(0)
		ellipse(gameChar_x - 7.8, gameChar_y - 48.75, 2.6, 2.6)
		ellipse(gameChar_x + 0, gameChar_y - 50.7, 2.6, 2.6)
		fill(222, 184, 135) //ears
		ellipse(gameChar_x + 5.2, gameChar_y - 52.65, 3.9, 5.2)
		ellipse(gameChar_x - 13, gameChar_y - 48.1, 3.9, 5.2)
		noFill(); //smile
		stroke(0);
		strokeWeight(0.78);
		arc(gameChar_x - 3.9, gameChar_y - 48.1, 9.75, 5.85, 0.10 * PI, 0.65 * PI);
		noStroke()
		fill(60, 90, 110) //righthand
		quad(gameChar_x + 5.2, gameChar_y - 37.7, gameChar_x + 6.5, gameChar_y - 43.16, gameChar_x + 15.6, gameChar_y - 39, gameChar_x + 13, gameChar_y - 35.1)
		ellipse(gameChar_x + 14.3, gameChar_y - 37.7, 5.2, 5.2)
		quad(gameChar_x + 13, gameChar_y - 39, gameChar_x + 16.9, gameChar_y - 49.4, gameChar_x + 20.8, gameChar_y - 46.8, gameChar_x + 16.9, gameChar_y - 36.4)
		fill(119, 136, 153) //lamp in right hand
		ellipse(gameChar_x + 20.8, gameChar_y - 46.8, 6.5, 9.1)
		fill(0)
		ellipse(gameChar_x + 20.8, gameChar_y - 46.8, 3.9, 6.5)
		fill(255, 215, 0)
		rect(gameChar_x + 16.9, gameChar_y - 45.5, 9.1, 11.7)
		fill(218, 165, 32)
		triangle(gameChar_x + 16.9, gameChar_y - 45.5, gameChar_x + 16.9, gameChar_y - 33.8, gameChar_x + 21.45, gameChar_y - 39.65)
		triangle(gameChar_x + 26, gameChar_y - 45.5, gameChar_x + 21.45, gameChar_y - 39.65, gameChar_x + 26, gameChar_y - 33.8)
		fill(119, 136, 153)
		rect(gameChar_x + 16.9, gameChar_y - 45.5, 9.1, 2.6)
		rect(gameChar_x + 16.9, gameChar_y - 36.4, 9.1, 2.6)
		fill(245, 222, 179) //hand over lamp
		ellipse(gameChar_x + 18.85, gameChar_y - 48.1, 5.2, 5.2)
		fill(60, 90, 110) //left hand
		quad(gameChar_x - 24.7, gameChar_y - 36.4, gameChar_x - 15.6, gameChar_y - 42.9, gameChar_x - 14.3, gameChar_y - 37.7, gameChar_x - 23.4, gameChar_y - 32.5)
		ellipse(gameChar_x - 24.7, gameChar_y - 33.8, 3.9, 3.9)
		quad(gameChar_x - 32.5, gameChar_y - 41.6, gameChar_x - 29.9, gameChar_y - 44.2, gameChar_x - 22.1, gameChar_y - 35.1, gameChar_x - 26, gameChar_y - 32.5)
		fill(139, 69, 19) //pickaxe
		quad(gameChar_x - 28.6, gameChar_y - 55.9, gameChar_x - 27.3, gameChar_y - 55.9, gameChar_x - 33.8, gameChar_y - 35.1, gameChar_x - 35.1, gameChar_y - 35.1)
		fill(169, 169, 169)
		quad(gameChar_x - 29.9, gameChar_y - 58.5, gameChar_x - 24.7, gameChar_y - 58.5, gameChar_x - 24.7, gameChar_y - 55.9, gameChar_x - 29.9, gameChar_y - 55.9)
		triangle(gameChar_x - 29.9, gameChar_y - 58.5, gameChar_x - 32.5, gameChar_y - 57.2, gameChar_x - 29.9, gameChar_y - 55.9)
		triangle(gameChar_x - 24.7, gameChar_y - 58.5, gameChar_x - 22.1, gameChar_y - 57.2, gameChar_x - 24.7, gameChar_y - 55.9)
		fill(245, 222, 179) //hand over axe
		ellipse(gameChar_x - 31.2, gameChar_y - 42.9, 5.2, 5.2)
		fill(60, 90, 110) //left leg
		quad(gameChar_x - 11.7, gameChar_y - 22.1, gameChar_x - 5.2, gameChar_y - 19.5, gameChar_x - 5.2, gameChar_y - 10.4, gameChar_x - 10.79, gameChar_y - 13)
		ellipse(gameChar_x - 8.06, gameChar_y - 11.7, 5.85, 9.1)
		quad(gameChar_x - 16.9, gameChar_y - 10.4, gameChar_x - 15.6, gameChar_y - 15.6, gameChar_x - 7.8, gameChar_y - 11.7, gameChar_x - 9.1, gameChar_y - 7.15)
		fill(128, 128, 128) //left boot
		quad(gameChar_x - 18.2, gameChar_y - 16.9, gameChar_x - 13.65, gameChar_y - 14.3, gameChar_x - 16.9, gameChar_y - 10.4, gameChar_x - 21.45, gameChar_y - 13)
		quad(gameChar_x - 20.15, gameChar_y - 18.2, gameChar_x - 15.6, gameChar_y - 15.6, gameChar_x - 22.1, gameChar_y - 7.8, gameChar_x - 26, gameChar_y - 10.4)
		ellipse(gameChar_x - 23.92, gameChar_y - 9.1, 3.9, 3.9)
		fill(60, 90, 110) //right leg
		quad(gameChar_x - 1.3, gameChar_y - 18.2, gameChar_x + 5.2, gameChar_y - 18.2, gameChar_x + 8.45, gameChar_y - 11.05, gameChar_x + 2.6, gameChar_y - 10.4)
		ellipse(gameChar_x + 5.46, gameChar_y - 10.4, 6.5, 6.5)
		quad(gameChar_x + 3.9, gameChar_y - 11.7, gameChar_x + 7.8, gameChar_y - 7.8, gameChar_x - 1.3, gameChar_y + 0.26, gameChar_x - 2.6, gameChar_y - 5.2)
		fill(128, 128, 128) //right boot
		quad(gameChar_x + 2.6, gameChar_y - 3.25, gameChar_x - 2.6, gameChar_y + 1.3, gameChar_x - 7.8, gameChar_y - 1.3, gameChar_x - 1.3, gameChar_y - 6.5)
		ellipse(gameChar_x, gameChar_y, 5.2, 5.2)
		fill(255, 215, 0, 70) //light triangle
		triangle(gameChar_x - 7.8, gameChar_y - 58.5, gameChar_x + 19.5, gameChar_y - 53.3, gameChar_x + 19.5, gameChar_y - 79.3)
	}
	else {
		fill(70, 100, 120) //left rect body
		rect(gameChar_x - 16.9, gameChar_y - 42.9, 11.7, 24.7)
		fill(60, 90, 110) //right rect body
		rect(gameChar_x - 5.2, gameChar_y - 42.9, 11.7, 24.7)
		fill(80, 120, 150) //middle triangle body
		triangle(gameChar_x - 15.6, gameChar_y - 42.9, gameChar_x + 5.2, gameChar_y - 42.9, gameChar_x - 5.2, gameChar_y - 36.4)
		rect(gameChar_x - 14.95, gameChar_y - 36.4, 5.85, 3.9) //left pocket
		ellipse(gameChar_x - 11.7, gameChar_y - 31.85, 5.85, 3.9)
		rect(gameChar_x - 1.95, gameChar_y - 36.4, 5.85, 3.9) //right pocket
		ellipse(gameChar_x + 1.3, gameChar_y - 31.85, 5.85, 3.9)
		fill(245, 222, 179) //head
		ellipse(gameChar_x - 5.2, gameChar_y - 49.4, 18.2, 14.3)
		fill(255, 204, 0); //cap yellow
		arc(gameChar_x - 5.2, gameChar_y - 52, 20.8, 19.5, PI, 0)
		fill(218, 165, 32)
		rect(gameChar_x - 15.6, gameChar_y - 54.6, 20.8, 2.6)
		rect(gameChar_x - 9.1, gameChar_y - 61.1, 6.5, 9.1)
		fill(220, 150, 32)
		rect(gameChar_x - 7.8, gameChar_y - 62.4, 3.9, 9.1)
		fill(255) //eyes
		ellipse(gameChar_x - 9.1, gameChar_y - 49.4, 5, 5)
		ellipse(gameChar_x - 1.3, gameChar_y - 49.4, 5, 5)
		fill(0)
		ellipse(gameChar_x - 9.1, gameChar_y - 49.4, 3, 3.3)
		ellipse(gameChar_x - 1.3, gameChar_y - 49.4, 3, 3.3)
		noFill(); //smile
		stroke(0);
		strokeWeight(0.78);
		arc(gameChar_x - 5.2, gameChar_y - 48.1, 9.75, 5.85, 0.25 * PI, 0.75 * PI);
		strokeWeight(1.3); //light
		fill(255)
		ellipse(gameChar_x - 5.2, gameChar_y - 58.5, 3.9, 3.9)
		fill(60, 90, 110) //left leg
		noStroke()
		rect(gameChar_x - 13, gameChar_y - 19.5, 6.5, 14.3)
		rect(gameChar_x - 3.9, gameChar_y - 19.5, 6.5, 14.3) //right leg
		fill(128, 128, 128) //right boots
		rect(gameChar_x - 3.9, gameChar_y - 5.2, 6.5, 7.15)
		ellipse(gameChar_x, gameChar_y, 7.8, 3.9)
		fill(128, 128, 128) //left boot
		rect(gameChar_x - 13, gameChar_y - 5.2, 6.5, 7.15)
		ellipse(gameChar_x - 13, gameChar_y, 3.9, 3.9)
		fill(25, 10, 60) //belt
		rect(gameChar_x - 16.9, gameChar_y - 24.7, 23.4, 3.9)
		fill(255, 204, 0) //yellow rectangle in middle of belt
		rect(gameChar_x - 7.8, gameChar_y - 24.7, 3.9, 3.9)
		fill(139, 69, 19)//pickaxe
		quad(gameChar_x - 24.7, gameChar_y - 40.3, gameChar_x - 23.4, gameChar_y - 40.3, gameChar_x - 18.2, gameChar_y - 19.5, gameChar_x - 19.5, gameChar_y - 19.5)
		fill(169, 169, 169)
		quad(gameChar_x - 27.3, gameChar_y - 42.9, gameChar_x - 22.1, gameChar_y - 42.9, gameChar_x - 22.1, gameChar_y - 40.3, gameChar_x - 27.3, gameChar_y - 40.3)
		triangle(gameChar_x - 27.3, gameChar_y - 42.9, gameChar_x - 29.9, gameChar_y - 41.6, gameChar_x - 27.3, gameChar_y - 40.3)
		triangle(gameChar_x - 22.1, gameChar_y - 42.9, gameChar_x - 19.5, gameChar_y - 41.6, gameChar_x - 22.1, gameChar_y - 40.3)
		fill(60, 90, 110) //left hand
		rect(gameChar_x - 19.5, gameChar_y - 39, 2.6, 10.4)
		ellipse(gameChar_x - 17.55, gameChar_y - 40.3, 3.9, 5.2)
		quad(gameChar_x - 13, gameChar_y - 28.6, gameChar_x - 15.6, gameChar_y - 31.2, gameChar_x - 20.8, gameChar_y - 27.3, gameChar_x - 19.5, gameChar_y - 24.7)
		fill(245, 222, 179)
		ellipse(gameChar_x - 20.8, gameChar_y - 26, 3.9, 3.9)
		fill(60, 90, 110) //right hand
		rect(gameChar_x + 6.5, gameChar_y - 39, 2.6, 10.4)
		ellipse(gameChar_x + 7.15, gameChar_y - 40.3, 3.9, 5.2)
		quad(gameChar_x + 6.5, gameChar_y - 28.6, gameChar_x + 6.5, gameChar_y - 33.8, gameChar_x + 15.6, gameChar_y - 27.3, gameChar_x + 14.3, gameChar_y - 24.7)
		fill(119, 136, 153) //lamp
		ellipse(gameChar_x + 14.3, gameChar_y - 27.3, 6.5, 9.1)
		fill(0)
		ellipse(gameChar_x + 14.3, gameChar_y - 27.3, 3.9, 6.5)
		fill(255, 215, 0)
		rect(gameChar_x + 10.4, gameChar_y - 26, 9.1, 11.7)
		fill(218, 165, 32)
		triangle(gameChar_x + 10.4, gameChar_y - 26, gameChar_x + 10.4, gameChar_y - 14.3, gameChar_x + 14.95, gameChar_y - 20.15)
		triangle(gameChar_x + 19.5, gameChar_y - 26, gameChar_x + 14.95, gameChar_y - 20.15, gameChar_x + 19.5, gameChar_y - 14.3)
		fill(119, 136, 153)
		rect(gameChar_x + 10.4, gameChar_y - 26, 9.1, 2.6)
		rect(gameChar_x + 10.4, gameChar_y - 16.9, 9.1, 2.6)
		fill(245, 222, 179) //hand over lamp
		ellipse(gameChar_x + 14.3, gameChar_y - 27.3, 3.9, 3.9)
		fill(222, 184, 135) //ears
		ellipse(gameChar_x - 14.3, gameChar_y - 50.05, 2.6, 5.2)
		ellipse(gameChar_x + 3.9, gameChar_y - 50.05, 2.6, 5.2)
	}

	drawtreasureChest()

	for (let i = 0; i < enemies.length; i++) { //enemies
		enemies[i].draw()
		let inContact = enemies[i].checkContact(gameChar_x, gameChar_y)
		if (inContact) {
			if (lives > 0) {

				startGame()
				lives -= 1
				break;
			}
		}
	}
	pop();

	checkPLayerDie()

	push(); //SCORE BOARD
	translate(width - 150 - 20, 20);
	noStroke();
	fill(0, 50);
	rect(0, 0, 130, 30, 4);
	fill(80, 80, 90);
	stroke(40);
	strokeWeight(2);
	rect(0, 0, 130, 30, 4);
	stroke(120);
	strokeWeight(2);
	line(5, -5, 5, -15);
	line(125, -5, 125, -15);
	noStroke();
	fill(212, 175, 55);
	textSize(16);
	textAlign(LEFT, CENTER);
	text("Score: " + gameScore, 10, 15);
	stroke(100, 100, 110, 150);
	strokeWeight(1);
	line(20, 5, 25, 8);
	line(50, 10, 55, 12);
	pop();

	if (lives < 1) { //GAME OVER
		fill(0, 150)
		rect(width / 2 - 175 / 2, height / 2 - 70 / 2, 175, 70, 10)
		stroke(255, 0, 0)
		strokeWeight(3)
		noFill()
		rect(width / 2 - 175 / 2, height / 2 - 70 / 2, 175, 70, 10)
		noStroke()
		fill(255, 0, 0)
		textSize(18)
		textAlign(CENTER, CENTER)
		text("GAME OVER", width / 2, height / 2)
		textSize(14)
		text("PRESS R TO RESTART", width / 2, height / 2 + 20)
		bgSound.stop()
		for (let i = 0; i < 5; i++) {
			fill(255, 100, 100, random(150, 255))
			noStroke()
			ellipse(width / 2 - 175 / 2 + random(0, 175), height / 2 - 70 / 2 + random(0, 70), 3, 3)
		}
		if (!endSoundPlayed) {
			endSound.play()
			endSoundPlayed = true
		}
		canyonSound.stop()
	}

	if (treasureChest.isReached == true) { //LEVEL COMPLETE
		bgSound.stop()
		canyonSound.stop()
		fill(0, 150)
		rect(width / 2 - 175 / 2, height / 2 - 70 / 2, 175, 70, 10)
		stroke(0, 255, 0)
		strokeWeight(3)
		noFill()
		rect(width / 2 - 175 / 2, height / 2 - 70 / 2, 175, 70, 10)
		noStroke()
		fill(255, 215, 0)
		textSize(18)
		textAlign(CENTER, CENTER)
		text("LEVEL COMPLETE", width / 2, height / 2)
		for (let i = 0; i < 5; i++) {
			fill(255, 255, 0, random(150, 255))
			noStroke()
			ellipse(width / 2 - 175 / 2 + random(0, 175), height / 2 - 70 / 2 + random(0, 70), 3, 3)
		}
	}

	if (!musicStarted) { //BACKGROUND SOUND LOOP
		bgSound.loop();
		musicStarted = true;
	}

	///////////INTERACTION CODE//////////
	if (lives >= 1 && treasureChest.isReached == false) {
		if (isPlummeting == false) {
			if (isLeft == true) {
				gameChar_x -= 7;
			}
			else if (isRight == true) {
				gameChar_x += 7;
			}
			if (gameChar_y < floorPos_y) {
				let isContact = false;
				for (let i = 0; i < platforms.length; i++) {
					if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
						isContact = true
						isFalling = false
						break;
					}
				}
				if (isContact == false) {
					isFalling = true;
					gameChar_y += 6;
				}
			}
			else {
				isFalling = false;
			}
			checktreasureChest();
		}
	}
}

function keyPressed() {

	if (!gameStarted && (keyCode == 87 || key == "w" || key == "W")) {
		gameStarted = true;
		startGame();
		return;
	}
	if (!gameStarted) {
		return;
	}
	if (key == 'r' || key == 'R') {
		lives = 3;
		gameScore = 0;
		treasureChest.isReached = false;
		startGame();
		return;
	}
	if (lives < 1 || treasureChest.isReached == true) {
		return;
	}
	if (isPlummeting == false) {
		if (keyCode == 65 || key == "ArrowLeft") {
			isLeft = true;
		}
		if (keyCode == 68 || key == "ArrowRight") {
			isRight = true;
		}
		if ((keyCode == 87 || key == "ArrowUp") && (gameChar_y == floorPos_y || isFalling == false)) {
			isFalling = true;
			gameChar_y -= 140;
			jumpSound.play()
		}
	}
}

function keyReleased() {

	if (keyCode == 65 || key == "ArrowLeft") {
		isLeft = false
	}
	if (keyCode == 68 || key == "ArrowRight") {
		isRight = false
	}
}

function drawClouds() {

	for (let i = 0; i < clouds.length; i++) {//CLOUD
		noStroke(); //cloud 1
		fill(220, 235, 205);
		ellipse(clouds[i].x, clouds[i].y, 100, 115);
		ellipse(clouds[i].x - 50, clouds[i].y + 10, 100, 80);
		ellipse(clouds[i].x + 50, clouds[i].y - 5, 100, 75);
		ellipse(clouds[i].x + 275, clouds[i].y + 30, 130, 100);//cloud 2
		ellipse(clouds[i].x + 230, clouds[i].y + 22, 100, 70);
		ellipse(clouds[i].x + 333, clouds[i].y + 36, 80, 70);
	}
}

function drawMountains() {

	for (let i = 0; i < mountains.length; i++) { // Mountains 
		fill(32, 60, 80); //large mountain
		triangle(mountains[i].x, mountains[i].y, mountains[i].x - 140, mountains[i].y + 209, mountains[i].x + 81, mountains[i].y + 209);
		fill(255);
		triangle(mountains[i].x, mountains[i].y, mountains[i].x - 50, mountains[i].y + 74, mountains[i].x + 28, mountains[i].y + 70);
		triangle(mountains[i].x - 32, mountains[i].y + 72, mountains[i].x - 16, mountains[i].y + 72, mountains[i].x - 30, mountains[i].y + 92);
		triangle(mountains[i].x - 19, mountains[i].y + 72, mountains[i].x + 2, mountains[i].y + 71, mountains[i].x + 3, mountains[i].y + 124);
		triangle(mountains[i].x + 2, mountains[i].y + 71, mountains[i].x + 27, mountains[i].y + 68, mountains[i].x + 18, mountains[i].y + 91);
		fill(32, 60, 80); //small mountain
		triangle(mountains[i].x + 80, mountains[i].y + 63, mountains[i].x + 40, mountains[i].y + 210, mountains[i].x + 180, mountains[i].y + 209);
		fill(255);
		triangle(mountains[i].x + 80, mountains[i].y + 63, mountains[i].x + 108, mountains[i].y + 103, mountains[i].x + 69, mountains[i].y + 103);
		triangle(mountains[i].x + 70, mountains[i].y + 101, mountains[i].x + 78, mountains[i].y + 97, mountains[i].x + 75, mountains[i].y + 117);
		triangle(mountains[i].x + 78, mountains[i].y + 101, mountains[i].x + 87, mountains[i].y + 128, mountains[i].x + 93, mountains[i].y + 102);
		triangle(mountains[i].x + 107, mountains[i].y + 103, mountains[i].x + 93, mountains[i].y + 102, mountains[i].x + 100, mountains[i].y + 110);
	}
}

function drawRocks() {

	for (let i = 0; i < rocks_x.length; i++) {
		fill(60, 25, 10); //rockey ground top strip
		rect(rocks_x[i], rocks_y - 1, width, 15);
		fill(60, 25, 10);//rockey surface
		triangle(rocks_x[i] + 37, rocks_y, rocks_x[i] + 62, rocks_y - 23, rocks_x[i] + 116, rocks_y);
		triangle(rocks_x[i] + 80, rocks_y + 14, rocks_x[i] + 114, rocks_y + 31, rocks_x[i] + 155, rocks_y);
		triangle(rocks_x[i] + 233, rocks_y + 14, rocks_x[i] + 309, rocks_y + 29, rocks_x[i] + 358, rocks_y);
		triangle(rocks_x[i] + 358, rocks_y + 2, rocks_x[i] + 424, rocks_y - 18, rocks_x[i] + 472, rocks_y);
		triangle(rocks_x[i] + 233, rocks_y + 14, rocks_x[i] + 503, rocks_y + 29, rocks_x[i] + 537, rocks_y);
		triangle(rocks_x[i] + 472, rocks_y, rocks_x[i] + 600, rocks_y - 18, rocks_x[i] + 680, rocks_y);
		triangle(rocks_x[i] + 511, rocks_y, rocks_x[i] + 700, rocks_y + 29, rocks_x[i] + 770, rocks_y - 2);
		triangle(rocks_x[i] + 680, rocks_y + 2, rocks_x[i] + 833, rocks_y - 15, rocks_x[i] + 930, rocks_y);
		triangle(rocks_x[i] + 680, rocks_y, rocks_x[i] + 910, rocks_y + 23, rocks_x[i] + 940, rocks_y + 8);
		triangle(rocks_x[i] + 930, rocks_y, rocks_x[i] + 1000, rocks_y - 15, rocks_x[i] + 1024, rocks_y);
		triangle(rocks_x[i] + 930, rocks_y, rocks_x[i] + 960, rocks_y + 25, rocks_x[i] + 1024, rocks_y);
	}
}

function drawTrees() {

	for (let i = 0; i < largeTreesX.length; i++) { // Trees
		fill(100, 50, 5); //large tree
		rect(largeTreesX[i] + 40, largeTreesY, 15, 77); //trunk
		fill(74, 100, 71);
		noStroke();
		triangle(largeTreesX[i] + 45, largeTreesY - 40, largeTreesX[i] + 115, largeTreesY + 35, largeTreesX[i] - 25, largeTreesY + 35);
		triangle(largeTreesX[i] - 5, largeTreesY - 5, largeTreesX[i] + 95, largeTreesY - 5, largeTreesX[i] + 45, largeTreesY - 55);
		triangle(largeTreesX[i] + 10, largeTreesY - 35, largeTreesX[i] + 80, largeTreesY - 35, largeTreesX[i] + 45, largeTreesY - 75);
	}

	for (let i = 0; i < smallTreesX.length; i++) {
		push() //small tree
		scale(0.5);
		fill(100, 50, 5);
		rect(smallTreesX[i] + 40, smallTreesY + 22, 20, 70);
		fill(20, 90, 60);
		noStroke();
		triangle(smallTreesX[i] + 45, smallTreesY - 40, smallTreesX[i] + 115, smallTreesY + 35, smallTreesX[i] - 25, smallTreesY + 35);
		triangle(smallTreesX[i] - 5, smallTreesY - 5, smallTreesX[i] + 95, smallTreesY - 5, smallTreesX[i] + 45, smallTreesY - 55);
		triangle(smallTreesX[i] + 10, smallTreesY - 35, smallTreesX[i] + 80, smallTreesY - 35, smallTreesX[i] + 45, smallTreesY - 75);
		pop()
	}
}

function drawCollectables(t_collectable) {

	if (t_collectable.isFound == false) {
		noStroke(); //large glow
		fill(180, 180, 200, 60);
		ellipse(t_collectable.x + 14, t_collectable.y, 60, 60);
		fill(180, 180, 200, 90);// inner glow
		ellipse(t_collectable.x + 14, t_collectable.y, 38, 38);
		noStroke();
		fill(180, 180, 190);
		triangle(t_collectable.x, t_collectable.y, t_collectable.x + 14, t_collectable.y + 15, t_collectable.x + 28, t_collectable.y);// largest triangle in t_collectable
		quad(t_collectable.x + 9, t_collectable.y - 8, t_collectable.x + 19, t_collectable.y - 8, t_collectable.x + 21, t_collectable.y, t_collectable.x + 7, t_collectable.y);
		fill(150, 150, 160);// middle dark triangle
		triangle(t_collectable.x + 9, t_collectable.y, t_collectable.x + 19, t_collectable.y, t_collectable.x + 14, t_collectable.y + 15);
		fill(200, 200, 210); // top left triangle
		triangle(t_collectable.x + 1, t_collectable.y, t_collectable.x + 9, t_collectable.y, t_collectable.x + 9, t_collectable.y - 8);
		fill(200, 200, 210);//top right fac
		triangle(t_collectable.x + 19, t_collectable.y - 8, t_collectable.x + 28, t_collectable.y, t_collectable.x + 19, t_collectable.y);
	}
}

function drawCanyon(t_canyon) {

	fill(0);
	beginShape();
	vertex(t_canyon.x, t_canyon.y + 21);
	vertex(t_canyon.x + 80, t_canyon.y + 21);
	vertex(t_canyon.x + 114, t_canyon.y + 75);
	vertex(t_canyon.x + 114, t_canyon.y + 100);
	vertex(t_canyon.x + 99, t_canyon.y + 141);
	vertex(t_canyon.x + 77, t_canyon.y + 164);
	vertex(t_canyon.x, t_canyon.y + 165);
	vertex(t_canyon.x - 35, t_canyon.y + 146);
	vertex(t_canyon.x - 45, t_canyon.y + 117);
	vertex(t_canyon.x - 55, t_canyon.y + 80);
	vertex(t_canyon.x, t_canyon.y + 21);
	endShape(CLOSE);
	fill(90, 62, 50);
	triangle(t_canyon.x + 83, t_canyon.y + 22, t_canyon.x + 114, t_canyon.y + 75, t_canyon.x + 129, t_canyon.y + 83);
	triangle(t_canyon.x + 77, t_canyon.y + 166, t_canyon.x + 92, t_canyon.y + 147, t_canyon.x + 93, t_canyon.y + 150);
	triangle(t_canyon.x + 92, t_canyon.y + 147, t_canyon.x + 102, t_canyon.y + 153, t_canyon.x + 90, t_canyon.y + 152);
	triangle(t_canyon.x, t_canyon.y + 20, t_canyon.x - 55, t_canyon.y + 80, t_canyon.x - 62, t_canyon.y + 80);
	triangle(t_canyon.x - 55, t_canyon.y + 80, t_canyon.x - 62, t_canyon.y + 80, t_canyon.x - 35, t_canyon.y + 146);
	triangle(t_canyon.x - 25, t_canyon.y + 151, t_canyon.x - 16, t_canyon.y + 157, t_canyon.x - 31, t_canyon.y + 150);
	fill(29, 2, 0);
	beginShape();
	vertex(t_canyon.x + 90, t_canyon.y + 21)
	vertex(t_canyon.x + 117, t_canyon.y + 21)
	vertex(t_canyon.x + 155, t_canyon.y + 85)
	vertex(t_canyon.x + 121, t_canyon.y + 165)
	vertex(t_canyon.x + 98, t_canyon.y + 165)
	vertex(t_canyon.x + 119, t_canyon.y + 100)
	vertex(t_canyon.x + 118, t_canyon.y + 125)
	vertex(t_canyon.x + 138, t_canyon.y + 90)
	vertex(t_canyon.x + 90, t_canyon.y + 20)
	endShape(CLOSE);
	beginShape();
	vertex(t_canyon.x - 9, t_canyon.y + 20)
	vertex(t_canyon.x - 36, t_canyon.y + 42)
	vertex(t_canyon.x - 71, t_canyon.y + 78)
	vertex(t_canyon.x - 59, t_canyon.y + 96)
	vertex(t_canyon.x - 55, t_canyon.y + 128)
	vertex(t_canyon.x - 25, t_canyon.y + 165)
	vertex(t_canyon.x - 50, t_canyon.y + 165)
	vertex(t_canyon.x - 83, t_canyon.y + 97)
	vertex(t_canyon.x - 72, t_canyon.y + 65)
	vertex(t_canyon.x - 37, t_canyon.y + 21)
	vertex(t_canyon.x - 9, t_canyon.y + 20)
	endShape(CLOSE);
	spikeOffsetA = (sin(frameCount * 0.03) + 1) * 40; //spikesY movement
	spikeOffsetB = (sin(frameCount * 0.03 + 1) + 1) * 25;
	fill(180, 180, 190); //spikesY and t_canyon
	triangle(t_canyon.x, spikesY, t_canyon.x + 10, spikesY - 50 - spikeOffsetA, t_canyon.x + 20, spikesY);
	triangle(t_canyon.x + 20, spikesY, t_canyon.x + 30, spikesY - 40 - spikeOffsetB, t_canyon.x + 40, spikesY);
	triangle(t_canyon.x + 40, spikesY, t_canyon.x + 50, spikesY - 45 - spikeOffsetA, t_canyon.x + 60, spikesY);
	triangle(t_canyon.x + 60, spikesY, t_canyon.x + 70, spikesY - 35 - spikeOffsetB, t_canyon.x + 75, spikesY);
}

function checkCollectable(t_collectable) {

	if (dist(gameChar_x, gameChar_y, t_collectable.x + 10, t_collectable.y) < 65) {
		t_collectable.isFound = true;
		gameScore += 1;
		collectableSound.play()
	}
}

function checkCanyon(t_canyon) {

	if (gameChar_x > t_canyon.x && gameChar_x < (t_canyon.x + 75) && gameChar_y >= floorPos_y) {
		isPlummeting = true
		canyonSound.play()
		gameChar_y += 15

	}
}

function drawtreasureChest() {

	let boxCount = 3
	let spacing = 60

	push()
	stroke(120, 70, 20)
	strokeWeight(8)
	line(treasureChest.x_pos, floorPos_y, treasureChest.x_pos, floorPos_y - 60)
	if (gameScore >= scoreNeeded) {
		stroke(180, 180, 0)
	} else {
		stroke(100, 100, 100)
	}
	strokeWeight(3)
	line(treasureChest.x_pos, floorPos_y - 60, treasureChest.x_pos, floorPos_y - 50)
	noStroke()
	for (let i = 0; i < boxCount; i++) {
		let x = treasureChest.x_pos - spacing + i * spacing
		fill(139, 69, 19)
		rect(x - 25, floorPos_y - 50, 50, 40, 5)
		stroke(100, 50, 20)
		strokeWeight(2)
		line(x - 20, floorPos_y - 40, x + 20, floorPos_y - 40)
		line(x - 20, floorPos_y - 30, x + 20, floorPos_y - 30)
		line(x - 20, floorPos_y - 20, x + 20, floorPos_y - 20)
		noStroke()
		fill(160, 82, 45)
		triangle(x - 25, floorPos_y - 50, x + 25, floorPos_y - 50, x, floorPos_y - 60)
		if (i === 1) {
			if (treasureChest.isReached == true && gameScore >= scoreNeeded) {
				fill(255, 215, 0)
				rect(x - 20, floorPos_y - 48, 40, 20, 3)
				fill(160, 82, 45)
				push()
				translate(x, floorPos_y - 55)
				rotate(-PI / 4) // Open lid angle
				rect(-25, -5, 50, 10, 3)
				pop()
				fill(80)
				rect(x - 5, floorPos_y - 40, 10, 12, 2)
				fill(200)
				ellipse(x, floorPos_y - 34, 5, 5)
			}
			else {
				fill(255, 0, 0, 100) // Red tint - locked
				rect(x - 20, floorPos_y - 48, 40, 20, 3)
				fill(160, 82, 45)
				rect(x - 20, floorPos_y - 48, 40, 3) // Closed lid
				fill(255)
				textSize(10)
				textAlign(CENTER, CENTER)
				text("Need " + (scoreNeeded - gameScore), x, floorPos_y - 38)
			}
		}
	}
	pop()
}

function checktreasureChest() {

	let d = abs(gameChar_x - treasureChest.x_pos)
	if (d < 15 && gameScore >= scoreNeeded) {
		treasureChest.isReached = true
		completeSound.play()
	}
}

function checkPLayerDie() {

	if (gameChar_y >= 576) {
		lives -= 1
		if (lives > 0) {
			startGame()
		}
	}
	for (let i = 0; i < lives; i++) {
		push();
		translate(width - 80 - i * 35, 60);
		let pulse = 2 + sin(frameCount * 0.1) * 0.8;
		stroke(0);
		strokeWeight(pulse);
		fill(220, 0, 0);
		beginShape();
		vertex(0, 4);
		bezierVertex(-10, -6, -18, 6, 0, 16);
		bezierVertex(18, 6, 10, -6, 0, 4);
		endShape(CLOSE);
		pop();
	}
}

function createPlatforms(x, y, length) {

	let p = {
		x: x,
		y: y,
		length: length,

		draw: function () {
			image(img, this.x, this.y, this.length, 20)
		},

		checkContact: function (gc_x, gc_y) {
			if (gc_x > this.x && gc_x < this.x + this.length) {
				let d = this.y - gc_y
				if (d >= 0 && d < 5) {
					return true;
				}
			}
			return false;
		}
	}
	return p;
}

function Enemy (x, y, range) {
	this.x = x
	this.y = y
	this.range = range
	this.currentX = x;
	this.inc = 1;

	this.update = function () {
		this.currentX += this.inc;
		if (this.currentX >= this.x + this.range) {
			this.inc = -1
		}
		else if (this.currentX <= this.x) {
			this.inc = 1
		}
	}

	this.draw = function () {
		this.update()
		fill(20)
		stroke(60)
		strokeWeight(2)
		ellipse(this.currentX, this.y, 24, 16)
		ellipse(this.currentX, this.y - 12, 16, 12)
		stroke(50)
		strokeWeight(3)
		line(this.currentX - 12, this.y - 4, this.currentX - 22, this.y - 12)
		line(this.currentX - 12, this.y, this.currentX - 24, this.y + 4)
		line(this.currentX - 12, this.y + 4, this.currentX - 22, this.y + 12)
		line(this.currentX + 12, this.y - 4, this.currentX + 22, this.y - 12)
		line(this.currentX + 12, this.y, this.currentX + 24, this.y + 4)
		line(this.currentX + 12, this.y + 4, this.currentX + 22, this.y + 12)
		noStroke()
		fill(255, 0, 0)
		ellipse(this.currentX - 4, this.y - 14, 4, 4)
		ellipse(this.currentX + 4, this.y - 14, 4, 4)
		ellipse(this.currentX, this.y - 12, 3, 3)
	}
	this.checkContact = function (gc_x, gc_y) {
		let d = dist(gc_x, gc_y, this.currentX, this.y)

		if (d < 20) {
			spiderSound.play()
			return true
		}
		return false
	}
}
