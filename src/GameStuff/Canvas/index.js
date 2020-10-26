import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rocket from "../images/Rocket/rocket-ship.png";
import rocketWithBoost from "../images/Rocket/rocket-ship-with-boost.png";

const Canvas = ({gameState, setShipPosition, boost}) => {

    const [viewBox, setViewBox] = useState({width: window.innerWidth, height: window.innerHeight});
    const canvas = useRef();

    useEffect(() => {
        const handleResize = () => {
            setViewBox({width: window.innerWidth, height: window.innerHeight});
            setShipPosition(window.innerWidth / 2, window.innerHeight / 2);
        }
        setShipPosition(window.innerWidth / 2, window.innerHeight / 2);

        window.onresize = handleResize;
    }, []);

    useLayoutEffect(() => {
        const con = canvas.current;
        let c = con.getContext("2d");
        let ship = new Image();
        ship.src = boost ? rocketWithBoost : rocket; 

        gameState && gameState.bullets && gameState.bullets.forEach(bullet => {
            let b = new Image();
            b.src = bullet.src;
            b.onload = () => { 
                c.save();
                c.translate(bullet.x , bullet.y)
                c.rotate(bullet.angle * Math.PI / 180);
                c.drawImage(b, -16, -45);
                c.restore();
            }
        });

        gameState &&  gameState.asteroids && gameState.asteroids.forEach(asteroid => {
            let a = new Image();
            a.src = asteroid.src;
            a.onload = () => { 
                c.save();
                c.translate(asteroid.x , asteroid.y);
                c.rotate(asteroid.angle * Math.PI / 180);
                c.drawImage(a, -asteroid.radius, -asteroid.radius);
                c.restore();
            }
        })

       
        ship.onload = () => { 
            c.clearRect(0, 0, con.width, con.height); 
            c.save();
            c.translate(gameState.ship.pos.x , gameState.ship.pos.y);
            c.rotate(gameState.ship.angle * Math.PI / 180);
            c.drawImage(ship, -32, -32);
            c.restore();
        }
        // eslint-disable-next-line
    }, [boost, gameState.shipPosition, gameState.asteroids, gameState.bullets]);
    

 return (
    <canvas id="asteroids-canvas" ref={canvas}
         style={{background: "rgb(50,50,50)"}}
         width={viewBox.width}
         height={viewBox.height}
         viewBox={viewBox}>
    </canvas>
    );
}
export default Canvas;