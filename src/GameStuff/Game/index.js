import React, { useEffect, useState } from 'react';
import Canvas from '../Canvas';
import * as d3 from "d3";
import {LargeAsteroid, MediumAsteroid, SmallAsteroid, Bullet} from './classes';

import Start from './Start';
import GameOver from './GameOver';
import styled from 'styled-components';

const Score = styled.div`
    position: fixed;
    left: 50%;
    margin-left: -100px;
    text-align: center;
    width: 200px;
    font-family: 'Russo One', sans-serif;
    font-size: 32px;
    z-index: 1000;
`;

const initialState = {
    score: 0,
    largeAsteroidsKilled: 0,
    mediumAsteroidsKilled: 0,
    smallAsteroidsKilled: 0,
    level: 0,
    asteroids: [],
    bullets: [],
    ship: {
        speed: 0,
        pos: {
            x: window.innerWidth / 2, 
            y:  window.innerHeight / 2
        },
        vel: {
            x: 0,
            y: 0
        },
        angle: 0
    },
    gameOver: false,
};


const initAsteroids = (level = 1) => {
    let numAsteroids = level + 4;
    let asteroids = [];
    let maxAsteroidStartingCount;

    const screenSizeArea = window.innerWidth * window.innerHeight;
    if (screenSizeArea < 400000) {
        maxAsteroidStartingCount = 5;
    }

    if (maxAsteroidStartingCount === 5) {
        numAsteroids = 5;
    }

    let pointMap = [];

    const doesntClashWithOtherExistingAsteroids = (x, y, pointMap = []) => {
        for (let p in pointMap) {
            if (x < pointMap[p].x + 75 &&  
                x > pointMap[p].x - 75 && 
                y < pointMap[p].y + 75 &&  
                y > pointMap[p].y - 75) {
                return false;
            }
        }
        return true;
    }

    for (let num = numAsteroids; num > 0; num--) {
        let asteroidType = Math.floor(Math.random() * (10)) + 1;
        let x = Math.floor(Math.random() * (window.innerWidth)) + 1;
        let y = Math.floor(Math.random() * (window.innerHeight)) + 1;
        let triesForNewPoints = 0;

        while (x > window.innerWidth / 2 - 200 && 
            x < window.innerWidth / 2 + 200 && 
            y > window.innerHeight / 2 - 200 && 
            y < window.innerHeight / 2 + 200 && 
            doesntClashWithOtherExistingAsteroids(x, y, pointMap)) {
                x = Math.floor(Math.random() * (window.innerWidth)) + 1;
                y = Math.floor(Math.random() * (window.innerHeight)) + 1;
                // give up if we've run out of sufficient room
                if (triesForNewPoints === 10) {
                    return asteroids; 
                }
            }
        
        pointMap.push({x: x, y: y});   

        if (asteroidType > 3) {
            asteroids.push(new LargeAsteroid(x, y));
        } else if (asteroidType > 1) {
            asteroids.push(new MediumAsteroid(x, y));
        } else {
            asteroids.push(new SmallAsteroid(x, y));
        }
    }
    return asteroids;
};


const Game = () => {
    const [gameState, setGameState] = useState(initialState);
    const [boost, setBoost] = useState(false);

    const [stopped, setStopped] = useState(false);
    const [showStartModal, setShowStartModal] = useState(true);

    const startGame = () => {
        setShowStartModal(false);
        setGameState(initialState);
    }

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
        setBoost(kp.u);

        if (!showStartModal) {
            setGameState(prevState => {
                if (!prevState.gameOver) {
                    const shipRotation = 5;
                    const velocityChange = .05 * prevState.level;

                    const newAngle = (kp.l && !kp.r) ? -shipRotation : (kp.r && !kp.l) ? shipRotation : 0;
                    const newSpeed = kp.u ? -velocityChange : 0;
                    
                    const bA = (prevState.ship.angle + newAngle);

                    const velX = prevState.ship.vel.x - newSpeed * (-Math.sin(Math.PI / 180 * bA));
                    const velY = prevState.ship.vel.y - newSpeed * (Math.cos(Math.PI / 180 * bA));

                    let newX = prevState.ship.pos.x - velX;
                    let newY = prevState.ship.pos.y - velY;
                    
                    let ship = prevState.ship;
                    let bullets = prevState.bullets;
                    let asteroids = prevState.asteroids;
                    let score = prevState.score;
                    let largeAsteroidsKilled = prevState.largeAsteroidsKilled;
                    let mediumAsteroidsKilled = prevState.mediumAsteroidsKilled;
                    let smallAsteroidsKilled = prevState.smallAsteroidsKilled;
                    let gameOver = false;
                    let level = prevState.level;

                    if (!asteroids.length) {    
                        level++;
                        asteroids = initAsteroids(level);
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


                    asteroids = asteroids.map((asteroid) => {
                        const newAngle = asteroid.angle + asteroid.rotation;
                        asteroid.angle = newAngle;
                        asteroid.x = getNextPositionX(asteroid.x - asteroid.velX);
                        asteroid.y = getNextPositionY(asteroid.y - asteroid.velY);
            
                        if (asteroid.x < ship.pos.x + 32 && 
                            asteroid.x > ship.pos.x - 32 && 
                            asteroid.y < ship.pos.y + 32 &&
                            asteroid.y > ship.pos.y - 32) {
                                asteroid.kill();
                                gameOver = true;
                                console.log("OUCH");
                            }

                        return asteroid;
                    }).filter(asteroid => asteroid.alive);

                    if (kp.s && largestBulletLife < 110) {
                        const bVelX = prevState.ship.vel.x + 5 * (-Math.sin(Math.PI / 180 * bA));
                        const bVelY = prevState.ship.vel.y + 5 * (Math.cos(Math.PI / 180 * bA));

                        const bX =  prevState.ship.pos.x + bVelX;
                        const bY =  prevState.ship.pos.y + bVelY; 
                        
                        const b = new Bullet(bVelX, bVelY, getNextPositionX(bX), getNextPositionY(bY), bA);
                        bullets.push(b);
                    }

                    bullets.forEach(b => {
                        asteroids.forEach(a => {
                            if (b.x > a.x - a.radius && 
                                b.x < a.x + a.radius && 
                                b.y > a.y - a.radius && 
                                b.y < a.y + a.radius) {
                                b.kill();
                                a.kill();

                                switch (a.type) {
                                    case "L":
                                        score += 5;
                                        largeAsteroidsKilled += 1;
                                        asteroids.push(new MediumAsteroid(a.x, a.y));
                                        asteroids.push(new MediumAsteroid(a.x, a.y));
                                        asteroids.push(new SmallAsteroid(a.x, a.y));
                                        break;
                                    case "M":
                                        score += 10;
                                        mediumAsteroidsKilled += 1;
                                        asteroids.push(new SmallAsteroid(a.x, a.y));
                                        asteroids.push(new SmallAsteroid(a.x, a.y));
                                        break;
                                    case "S":
                                        score += 20;
                                        smallAsteroidsKilled += 1;
                                        break;
                                    default: console.error('unexpected asteroid type');
                                }
                            }
                        });
                    }); 

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
                        bullets: [...bullets],
                        asteroids: [...asteroids],
                        score: score,
                        largeAsteroidsKilled: largeAsteroidsKilled,
                        mediumAsteroidsKilled: mediumAsteroidsKilled,
                        smallAsteroidsKilled: smallAsteroidsKilled,
                        gameOver: gameOver,
                        level: level
                    });
                } else {
                    return ({...prevState});
                }
            }); 

        }
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

            if (stopped) {
                t.stop();
            }

            return () => t.stop();
        // eslint-disable-next-line
    }, [showStartModal, stopped]);

    useEffect(() => {
        if (gameState.gameOver) {
            setStopped(true);
        }
    }, [gameState.gameOver]);

    return (
        <form>
            {showStartModal && <Start start={startGame}/>}
            {stopped && <GameOver finalState={gameState}/>}
            {!showStartModal && !stopped && <Score>Score: {gameState.score}</Score>}
            <Canvas gameState={gameState} 
                    setShipPosition={setShipPosition} 
                    boost={boost} 
                    bullets={gameState.bullets} 
                    asteroid={gameState.asteroids}
                    exploded={gameState.gameOver}/>
        </form>
        );
}

export default Game;