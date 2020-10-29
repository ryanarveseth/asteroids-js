import React from 'react';
import { Image } from 'react-bootstrap';
import styled from 'styled-components';
import keyboard from '../../images/keyboard.png';

const StartContainer = styled.div`
    width: 300px;
    height: auto;
    position: fixed;
    z-index: 2;
    left: calc(50% - 190px);
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

const Play = styled.button`
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

const Leave = styled.a`
display: inline-block;
justify-content: space-around;
    transition: .5s;
    width: 100%;
    font-family: 'Russo One', sans-serif;
    font-size: 21px;
    background: rgba(0, 0, 0, 0);
    border-radius: 3px;
    bottom: 10px;
    margin-top: 50px;
    color: red;
    border: 2px solid red;
    &:hover {
        color: black;
        background: red;
        text-decoration: none;
    }
    text-decoration: none;
    padding: 20px 0;
    text-align: center;

`;

const H1 = styled.h1`
    font-weight: normal;
    font-size: 40px;
    margin-top: 0;
`;


//largeAsteroidsKilled: largeAsteroidsKilled,
// mediumAsteroidsKilled: mediumAsteroidsKilled,
//smallAsteroidsKilled: smallAsteroidsKilled,


const Start = ({start}) => {
    return (
    <StartContainer>
        <Mid><H1>ASTEROIDS</H1></Mid>
        <p>shoot: spacebar</p>
        <p>turn left: left arrow key</p>
        <p>turn right: right arrow key</p>
        <p>accelerate: up arrow key</p>
        <Play onClick={start}>Start</Play>
        <Leave href="https://ryan-arveseth.com">ryan-arveseth.com</Leave>
    </StartContainer>
    );
};

export default Start;