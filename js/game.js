(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function (ctx) {
    this.ctx = canvas.getContext("2d");
    this.asteroids = [];
    this.ship = new Asteroids.Ship([450, 225],[0,0]);
    this.bullets = [];
    //this.bindKeyHandlers();
  }

  Game.DIM_X = 900;
  Game.DIM_Y = 450;
  Game.INTERVAL_ID;
  Game.TIME = 0;
  Game.LAST_FIRED_BULLET = 0;

  Game.prototype.addAsteroids = function(numAsteroids) {
    for (var i =0; i < numAsteroids; i++) {
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
    }
  }

  Game.prototype.fireBullet = function() {
    this.bullets.push(this.ship.fireBullet());
  }
  
  Game.prototype.repositionLostShip = function() {
    if (this.ship.isOutOfBounds()) {
      var posX = this.ship.pos[0];
      var posY = this.ship.pos[1];
      
      if (posX < 0 || posX > 900) {
        this.ship.pos[0] = Math.abs(this.ship.pos[0] - 900);
        //this.asteroids[i].pos[1] = Math.abs(this.asteroids[i].pos[1] - 450); 
      }
      if (posY < 0 || posY > 450) {
        this.ship.pos[1] = Math.abs(this.ship.pos[1] - 450);
        //this.asteroids[i].pos[0] = Math.abs(this.asteroids[i].pos[0] - 900); 
      }
    }
  }

  Game.prototype.repositionLostAsteroids = function() {
    var that = this;
    for (var i = this.asteroids.length-1; i >= 0; i--) {
      if (this.asteroids[i].isOutOfBounds()) {
        var posX = this.asteroids[i].pos[0];
        var posY = this.asteroids[i].pos[1];
        
        if (posX < 0 || posX > 900) {
          this.asteroids[i].pos[0] = Math.abs(this.asteroids[i].pos[0] - 900);
          //this.asteroids[i].pos[1] = Math.abs(this.asteroids[i].pos[1] - 450); 
        }
        if (posY < 0 || posY > 450) {
          this.asteroids[i].pos[1] = Math.abs(this.asteroids[i].pos[1] - 450);
          //this.asteroids[i].pos[0] = Math.abs(this.asteroids[i].pos[0] - 900); 
        }
      }
    }
  }

  Game.prototype.removeAsteroid = function(idx) {
    this.asteroids.splice(idx, 1);
  }

  Game.prototype.removeBullet = function(idx) {
    this.bullets.splice(idx, 1);
  }


  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    var that = this;
    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(that.ctx);
    });
    this.bullets.forEach(function(bullet) {
      bullet.draw(that.ctx);
    });
    this.ship.draw(that.ctx);
  }

  Game.prototype.move = function() {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move();
    });
    this.bullets.forEach(function(bullet) {
      bullet.move();
    });
    this.ship.move();
  }
  
  Game.prototype.checkKeys = function() {
      if(key.isPressed("left")) {
        this.ship.turn(1);
      }
      if(key.isPressed("right")) {
        this.ship.turn(-1);
      }
      if(key.isPressed("up")) {
        this.ship.power(-2);
      }
      if(key.isPressed("down")) {
        this.ship.power(2);
      }

      if(key.isPressed("space")) {
          if (Game.TIME - Game.LAST_FIRED_BULLET >= 0.2) {
            this.fireBullet();
            Game.LAST_FIRED_BULLET = Game.TIME;
          }
      }
  }

  Game.prototype.checkCollisions = function() {

    for (var i = this.asteroids.length - 1; i >= 0; i--) {
      if (this.asteroids[i].isCollidedWith(this.ship)) {
        //Change to ALERT()
        console.log("BAM!");
        this.stop();
      }

      for (var j = this.bullets.length -1; j >= 0; j--) {
        if (this.bullets[j].isCollidedWith(this.asteroids[i])) {
          this.removeAsteroid(i);
          this.removeBullet(j);
          this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
        }
      }
    }
  }

  Game.prototype.step = function() {
    this.checkKeys();
    this.checkCollisions();
    this.repositionLostAsteroids();
    this.repositionLostShip();
    this.move();
    this.draw();
  }

  Game.prototype.start = function(numAsteroids) {
    var game = this;
    game.addAsteroids(numAsteroids);
    Game.INTERVAL_ID = setInterval(function() {
      game.step();
      Game.TIME = Math.round(Game.TIME * 100) / 100;
      Game.TIME += 0.03;
    }, 30);
  }

  Game.prototype.stop = function() {
    clearInterval(Game.INTERVAL_ID);
  }
})(this);