//borrowed works
//
//Anything related to the game timer: http://www.html5gamedevs.com/topic/1870-in-game-timer/ by Icculus
//background from Persona 4: Magatsu Inaba
//music taken from Lavendar Town tune, Pokemon Red and Blue
//character sprites taken from http://vincebetteridge.com/firefighter/
//platforms and level, most code derived from the starstruck phaser example

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/games/starstruck/tiles-2.png');
    game.load.spritesheet('dude', 'assets/firefighter.png', 40, 30);
    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/games/starstruck/star.png');
    game.load.image('starBig', 'assets/games/starstruck/star2.png');
    game.load.image('background', 'assets/background.png');
    game.load.audio('bgm', 'assets/bgm.mp3');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var bgm;

//Time-related variables
var timer;
var milliseconds = 0;
var seconds = 0;
var minutes = 0;
var oMil = 0;
var oSec = 0;
var oMin = 0;
var star;
var bestT = 'Last Time: ';

function create() {
    
    //building game settings
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';

    //background
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    
    //build level
    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    
    game.physics.arcade.gravity.y = 1000;
    
    //player creation and controls
    player = game.add.sprite(game.world.randomX, game.world.randomY, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    while(player.body.embedded)
    {
        player.reset(game.world.randomX, game.world.randomY);       
    }
    
    player.body.bounce.y = 0.2;
    player.body.setSize(16, 26, 12, 4);

    player.animations.add('left', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
    player.animations.add('turn', [3], 20, true);
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.add('idleLeft', [92, 93, 94, 95], true);
    player.animations.add('idleRight', [88, 89, 90, 91], true);

    game.camera.follow(player);
    
    //Building objective
    star = game.add.sprite(game.world.randomX,game.world.randomY, 'starBig');
    game.physics.enable(star, Phaser.Physics.ARCADE);
    star.body.collideWorldBounds = true;
    
    while(star.body.embedded)
    {
        star.reset(game.world.randomX, game.world.randomY);
    }
    
    star.body.bounce.set(1.0);
    //star.body.setSize(24,22);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //music
    bgm = game.add.audio('bgm');    
    bgm.play('', 0, 1, true);
    
    //on-screen timer
    var style = { font: "35px Arial", fill: "#52bace", align: "center" };
    timer = game.add.text(400, 0, '00:00:00', style);
    timer.fixedToCamera = true;
    
    oMin = Math.floor(game.time.time / 60000) % 60;
    oSec = Math.floor(game.time.time/1000) % 60;
    oMil = Math.floor(game.time.time) % 100;
}

//controls the time ticking ingame
function updateTimer() {
    minutes = Math.abs(Math.floor(game.time.time / 60000) % 60 - oMin);
    seconds = Math.abs(Math.floor(game.time.time/1000) % 60 - oSec);
    //milliseconds = Math.abs(Math.floor(game.time.time) % 100 - oMil);
    
    if (milliseconds < 10)
        milliseconds = '0' + milliseconds;
    if (seconds < 10)
        seconds = '0' + seconds;
    if (minutes < 10)
        minutes = '0' + minutes;
    
    timer.setText(minutes + ':' + seconds);
}

function update() {

    updateTimer();
    
    game.physics.arcade.collide(star, layer);
    game.physics.arcade.collide(player, layer);

    //player movement
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
        player.animations.play('left');
        facing = 'left';
    }
    
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
        player.animations.play('right');
        facing = 'right';
    }
    
    else
    {
            //player.animations.stop();
            if (facing == 'right')
            {
                player.animations.play('idleRight');
            }        
        
            else if (facing == 'left')
            {
                player.animations.play('idleLeft');
            }
                    
            facing = 'idle';
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -450;
        jumpTimer = game.time.now + 250;
    }
    
    //star movement
    star.body.acceleration.x = game.world.randomX;
    
    //win condition
    if(game.physics.arcade.collide(player, star))
    {
        bestT = 'Last Time: ' + minutes + ':' + seconds;
        create();
    }
    
    //text.text = game.time.time;
}

function render() {
    //game.debug.soundInfo(bgm, 20, 32);
    game.debug.text(bestT, 32, 32);
}