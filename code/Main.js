window.onload = function() {

    var coeff = 1;//2048/1500;
    var game = new Phaser.Game(Math.abs(coeff*2048), Math.abs(coeff*1500),Phaser.CANVAS,'gameContainer',null,false,true); // 800, 1260
    game.antialias = true;
    game.state.add('Boot', Base.Boot);
    game.state.add('Preloader', Base.Preloader);
    game.state.add('Game', Base.Game);
    game.state.start('Boot');

   // game.stage.smoothed = false;
   // Phaser.Canvas.setSmoothingEnabled(game.canvas);
} ;

