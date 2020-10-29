import Blaster from './images/Rocket/blaster.png';
import LgAsteroid from './images/Asteroids/large-asteroid.png';
import MdAsteroid from './images/Asteroids/medium-asteroid.png';
import SmAsteroid from './images/Asteroids/small-asteroid.png';

export class Bullet {
    constructor (velX, velY, x, y, angle) {
        this.velX = velX;
        this.velY = velY;
        this.y = y;
        this.x = x;
        this.angle = angle;
        this.src = Blaster;
        this.radius = 4;
        this.life = 120; // stay alive for 2 seconds
    }

    decreaseLife() {
        this.life -= 1;
    }

    isDead() {
        return this.life <= 0;
    }

    kill() {
        this.life = 0;
    }
};

export class Asteroid {
    constructor (x, y, velX, velY, angle) {
        this.x = x; 
        this.y = y;
        this.velX = velX * (Math.round(Math.random()) ? 1 : -1);
        this.velY = velY * (Math.round(Math.random()) ? 1 : -1);
        this.angle = angle;
        this.dir = Math.floor(Math.random() * (2)) + 1 === 2 ? -1 : 1;
        this.alive = true;
    }

    getSpeed = () => Math.sqrt(this.velX * this.velX + this.velY * this.velY);
    getAngle = () => Math.atan2(this.velY, this.velX);
    kill() {this.alive = false;}

};

export class LargeAsteroid extends Asteroid {
    constructor(x, y) {
        const angle = Math.floor(Math.random() * (360)) + 1;
        const velX = (Math.floor(Math.random() * (2)) + 1) + 1 * (-Math.sin(Math.PI / 180 * angle));
        const velY = (Math.floor(Math.random() * (2)) + 1) + 1 * (Math.cos(Math.PI / 180 * angle));
        super(x, y, velX, velY, angle);
        this.src = LgAsteroid;
        this.radius = 32;
        this.rotation = Math.round(Math.random()) ? 1 : -1;
        this.mass = 3;
        this.type = "L";
    }
};

export class MediumAsteroid extends Asteroid {
    constructor(x, y) {
        const angle = Math.floor(Math.random() * (360)) + 1;
        const velX = (Math.floor(Math.random() * (2)) + 1) + 1.5 * (-Math.sin(Math.PI / 180 * angle));
        const velY = (Math.floor(Math.random() * (2)) + 1) + 1.5 * (Math.cos(Math.PI / 180 * angle));
        super(x, y, velX, velY, angle);
        this.src = MdAsteroid;
        this.radius = 24;
        this.rotation = Math.round(Math.random()) ? 1 : -1;
        this.mass = 2;
        this.type = "M";
    }
};

export class SmallAsteroid extends Asteroid {
    constructor(x, y) {
        const angle = Math.floor(Math.random() * (360)) + 1;
        const velX = (Math.floor(Math.random() * (3)) + 1) + 2 * (-Math.sin(Math.PI / 180 * angle));
        const velY = (Math.floor(Math.random() * (3)) + 1) + 2 * (Math.cos(Math.PI / 180 * angle));
        super(x, y, velX, velY, angle);
        this.src = SmAsteroid;
        this.rotation = Math.round(Math.random()) ? 1 : -1;
        this.radius = 16;
        this.mass = 1;
        this.type = "S";
    }
};