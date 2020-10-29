import React, { useEffect } from 'react';
import styled from 'styled-components';
import NumberCounter from 'number-counter';

const GameoverContainer = styled.div`
    width: 300px;
    height: auto;
    position: fixed;
    z-index: 2;
    left: calc(50% - 150px);
    background: rgb(20, 20, 20);
    top: 50px;
    padding: 40px;
    border-radius: 3px;
    box-shadow: 3px 3px 7px 4px orange;
    color: white;
    font-family: 'Russo One', sans-serif;
    
    letter-spacing: 2px;
`;

const Mid = styled.div`
    
`;

const StartOver = styled.button`
    transition: .5s;
    width: 100%;
    font-family: 'Russo One', sans-serif;
    font-size: 24px;
    background: rgba(0, 0, 0, 0);
    border: 2px solid orange;
    color: orange;
    border-radius: 3px;
    &:hover { 
        background: orange;
        color: black;
    }
    bottom: 10px;
    height: 50px;
    margin-top: 50px;
`;

const H1 = styled.h1`
    font-weight: normal;
`;

const H4 = styled.h4`
    font-weight: normal;
`;

const Flex = styled.div`
    display: flex;
    justify-content: space-between;
`;


//largeAsteroidsKilled: largeAsteroidsKilled,
// mediumAsteroidsKilled: mediumAsteroidsKilled,
//smallAsteroidsKilled: smallAsteroidsKilled,


const GameOver = ({finalState}) => {

    useEffect(() => {
        // var xmlhttp = new XMLHttpRequest();
        // xmlhttp.onreadystatechange = function() {
        // if (this.readyState === 4 && this.status === 200) {
        //     var myObj = JSON.parse(this.responseText);
        //     console.log('response', myObj);
        // }
        // };
        // xmlhttp.open("POST", "https://ryan-arveseth.com/upload.php", true);
        // xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xmlhttp.send("score=" + finalState.score);
    }, []);

    return (
    <GameoverContainer>
        <H1>Game Over!</H1>
        <H4><Flex><span>Final Score:</span><span><NumberCounter end={finalState.score} delay={.5}/></span></Flex></H4>
        <Flex><span>Small Asteroids: </span><span><NumberCounter end={finalState.smallAsteroidsKilled} delay={.5}/></span></Flex>
        <Flex><span>Medium Asteroids: </span><span><NumberCounter end={finalState.mediumAsteroidsKilled} delay={.5}/></span></Flex>
        <Flex><span>Large Asteroids:</span><span><NumberCounter end={finalState.largeAsteroidsKilled} delay={.5}/></span></Flex>
        <StartOver type="submit">Play Again!</StartOver>
    </GameoverContainer>
    );
};

export default GameOver;