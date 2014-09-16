(function (root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function (pos, vel, radius, color) {
    Asteroids.MovingObject.call(this, pos, vel);
    this.radius = Ship.RADIUS;
    this.color = Ship.COLOR;
    this.borderColor = Ship.BORDER_COLOR;
    this.borderWidth = Ship.BORDER_WIDTH;
    this.angle = Ship.INITIAL_ANGLE;
    this.coords = Ship.COORDS;
    this.height = Ship.HEIGHT;
  };
  
  Ship.INITIAL_ANGLE = 0;
  Ship.RADIUS = 20;
  Ship.COLOR = 'rgba(0,0,0,0)';
  Ship.BORDER_COLOR = "#26ff00";
  Ship.BORDER_WIDTH = 0;
  Ship.MAX_VELOCITY = 5;
  
  Ship.RADIANS = -Math.PI / 180;

  Ship.inherits(Asteroids.MovingObject);
  
  Ship.prototype.draw = function(ctx) {
    var height = this.radius * (Math.sqrt(3)/2);
    
    ctx.save();
    
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = this.borderWidth;
    
    //ctx.save();
        
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(-this.angle * Ship.RADIANS);
    
    ctx.beginPath();
    
    ctx.moveTo(0, -height/2);
    ctx.lineTo(-this.radius/2, height/2);
    ctx.lineTo(this.radius/2, height/2);
    ctx.lineTo(0, -height/2);
    
    ctx.stroke();
    ctx.fill();
    
    ctx.closePath();
    ctx.restore();
  }
  
  Ship.prototype.turn = function(sign) {
    this.angle -= sign * 8.0;
  }
 
  Ship.prototype.power = function(impulse) {
      
    this.vel[0] += impulse * Math.sin(this.angle * Ship.RADIANS);
    this.vel[1] += impulse * Math.cos(this.angle * Ship.RADIANS);
    
    this.vel[0] = Math.min(this.vel[0], Ship.MAX_VELOCITY);
    this.vel[0] = Math.max(this.vel[0], -Ship.MAX_VELOCITY);
    this.vel[1] = Math.min(this.vel[1], Ship.MAX_VELOCITY);
    this.vel[1] = Math.max(this.vel[1], -Ship.MAX_VELOCITY);
  }

  Ship.prototype.fireBullet = function() {
    var bulVelX = -Math.sin(this.angle * Ship.RADIANS) * 10;
    var bulVelY = -Math.cos(this.angle * Ship.RADIANS) * 10;
    
    return new Asteroids.Bullet([this.pos[0], this.pos[1]], [bulVelX, bulVelY]);
  }

})(this);

