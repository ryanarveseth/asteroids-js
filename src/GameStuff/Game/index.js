import React, { useEffect, useState } from 'react';
import Canvas from '../Canvas';
import * as d3 from "d3";
import Blaster from '../images/Rocket/blaster.png';
import LgAsteroid from '../images/Asteroids/large-asteroid.png';
import MdAsteroid from '../images/Asteroids/medium-asteroid.png';
import SmAsteroid from '../images/Asteroids/small-asteroid.png';

const initialState = {
    score: 0,
    largeAsteroidsKilled: 0,
    mediumAsteroidsKilled: 0,
    smallAsteroidsKilled: 0,
    level: 1,

    asteroids: [],
    bullets: [],
    ship: {
        speed: 0,
        pos: {
            x: 0,
            y: 0 
        },
        vel: {
            x: 0,
            y: 0
        },
        angle: 0
    }
};

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
};

class Asteroid {
    constructor (x, y, speed, angle) {
        this.x = x; 
        this.y = y;
        this.speed = speed;
        this.angle = angle;
    }
};

class LargeAsteroid extends Asteroid {
    constructor(x, y, speed, angle) {
        super(x,y,speed,angle);
        this.src = LgAsteroid;
        this.radius = 32;
        this.rotation = Math.floor(Math.random() * (2 - 1) ) + 1;
    }
};

class MediumAsteroid extends Asteroid {
    constructor(x, y, speed, angle) {
        super(x, y, speed * 1.15, angle);
        this.src = MdAsteroid;
        this.radius = 24;
        this.rotation = Math.floor(Math.random() * (3 - 1) ) + 1;
    }
};

class SmallAsteroid extends Asteroid {
    constructor(x, y, speed, angle) {
        super(x, y, speed * 1.25, angle);
        this.src = SmAsteroid;
        this.rotation = Math.floor(Math.random() * (7 - 1) ) + 1;
        this.radius = 16;
    }
};


const initAsteroids = level => {

    return [];
};


const Game = () => {
    const [gameState, setGameState] = useState(initialState);
    const [boost, setBoost] = useState(false);

    let kp = {u: false, l: false, r: false, s: false};

    const setShipPosition = (x, y) => {
        setGameState(prevState => ({...prevState, ship: {...prevState.ship, pos: {x: x, y: y}}}));
    };

    const getNextPositionX = newX => {
        if (newX > window.innerWidth) {
            return 0;
        } else if (newX < 0) {
            return window.innerWidth;
        }
        return newX;
    };

    const getNextPositionY = newY => {
        if (newY > window.innerHeight) {
            return 0;
        } else if (newY < 0) {
            return window.innerHeight;
        }
        return newY;
    };

    const updateGameLoop = () => {
        const shipRotation = 6;
        const velocityChange = .25;

        setBoost(kp.u); 

        setGameState(prevState => {
            const newAngle = (kp.l && !kp.r) ? -shipRotation : (kp.r && !kp.l) ? shipRotation : 0;
            const newSpeed = kp.u ? -velocityChange : 0;
            
            const bA = (prevState.ship.angle + newAngle);
            let bS = prevState.ship.speed + newSpeed;

            const velX = prevState.ship.vel.x - newSpeed * (-Math.sin(Math.PI / 180 * bA));
            const velY = prevState.ship.vel.y - newSpeed * (Math.cos(Math.PI / 180 * bA));

            let newX = prevState.ship.pos.x - velX;
            let newY = prevState.ship.pos.y - velY;
            
            let bullets = prevState.bullets;
            let asteroids = prevState.asteroids;

            if (!asteroids.length) {
                asteroids = initAsteroids();
            }

            let largestBulletLife = 0;
            
            bullets = bullets.map((bullet, i) => {
                bullet.decreaseLife();
                if (bullet.life > largestBulletLife) {
                    largestBulletLife = bullet.life;
                }

                bullet.x = getNextPositionX(bullet.x - bullet.velX)
                bullet.y = getNextPositionY(bullet.y - bullet.velY)

                return bullet;
            }).filter(bullet => !bullet.isDead());

            asteroids = asteroids.map((asteroid, i) => {
                asteroid.decreaseLife();
                if (asteroid.life > largestBulletLife) {
                    largestBulletLife = asteroid.life;
                }

                asteroid.x = getNextPositionX(asteroid.x + asteroid.speed * (-Math.sin(Math.PI / 180 * asteroid.angle)));
                asteroid.y = getNextPositionY(asteroid.y + asteroid.speed * (Math.cos(Math.PI / 180 * asteroid.angle)));

                return asteroid;
            }).filter(asteroid => !asteroid.isDead());



            if (kp.s && largestBulletLife < 110) {
                console.log('newSpeed', newSpeed);
    
                const bVelX = prevState.ship.vel.x + 5 * (-Math.sin(Math.PI / 180 * bA));
                const bVelY = prevState.ship.vel.y + 5 * (Math.cos(Math.PI / 180 * bA));

                const bX =  prevState.ship.pos.x + bVelX;
                const bY =  prevState.ship.pos.y + bVelY; 
                
                const b = new Bullet(bVelX, bVelY, getNextPositionX(bX), getNextPositionY(bY), bA);
                bullets.push(b);
            }
    
            
            return ({...prevState, 
                ship: {
                    ...prevState.ship,
                    pos: {
                        x: getNextPositionX(newX), 
                        y: getNextPositionY(newY)
                    },
                    vel: {
                        x: velX,
                        y: velY
                    },
                    angle: prevState.ship.angle + newAngle,
                }, 
                bullets: [...bullets]
            });
        });
    };

    const handleKeyAction = (key) => {
        let newState = {};
        switch (key.code) {
            case "ArrowUp": // increase velocity
                newState.u = key.type !== "keyup";
                break;
            case "ArrowLeft":
                newState.l = key.type !== "keyup";
                break;
            case "ArrowRight":
                newState.r = key.type !== "keyup";
                break;
            case "Space": // Space
                newState.s = key.type !== "keyup";
                break;
            default: 
                return;
        }
        kp = {...kp, ...newState};
    };


    useEffect(() => {
        window.addEventListener('keydown', handleKeyAction);
        window.addEventListener('keyup', handleKeyAction);
        const t = d3.timer(updateGameLoop);
        return () => t.stop();
        // eslint-disable-next-line
    }, []);


    return <Canvas gameState={gameState} 
        setShipPosition={setShipPosition} 
        boost={boost} 
        bullets={gameState.bullets} 
        asteroid={gameState.asteroids}/>;
}

export default Game;