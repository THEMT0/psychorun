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

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    //map.body.collideWorldBounds = true;
    //map.allowGravity = false;

    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    
    game.physics.arcade.gravity.y = 1000;
    
    //player creation and controls
    player = game.add.sprite(40, 30, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(40, 30);

    player.animations.add('left', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
    player.animations.add('turn', [3], 20, true);
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);

    game.camera.follow(player);
    
    star = game.add.sprite(game.world.randomX,game.world.randomY, 'starBig');
    game.physics.enable(star, Phaser.Physics.ARCADE);
    
    star.body.collideWorldBounds = true;
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
    //oMil = Math.floor(game.time.time) % 100;
}

//controls the time ticking ingame
function updateTimer() {
    minutes = Math.floor(game.time.time / 60000) % 60 - oMin;
    seconds = Math.floor(game.time.time/1000) % 60 - oSec;
    //milliseconds = Math.floor(game.time.time) % 100 - oMil;
    
    //if (milliseconds < 10)
      //  milliseconds = '0' + milliseconds;
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

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -450;
        jumpTimer = game.time.now + 250;
    }
    
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

window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
    }
    
    var bouncy;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something awesome.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, this.game.input.activePointer, 500, 500, 500 );
    }
};
