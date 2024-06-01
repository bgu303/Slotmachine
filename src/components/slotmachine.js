import '../styles/slotmachine.css';
import { useState } from 'react';
import blop from "../audio/blop.mp3"
import explosion from "../audio/explosion.mp3"
import diamond from "../images/diamondv2.png"
import bomb from "../images/bombv2.jpg"

function SlotMachine() {
    const [losingNumbers, setlosingNumbers] = useState([]);
    const [mineValue, setmineValue] = useState(1);
    const [betValue, setBetValue] = useState(1);
    const [loseState, setLoseState] = useState(false);
    const [clickedIndexes, setClickedIndexes] = useState([])
    const [clickedIndexMine, setClickedIndexMine] = useState([])
    const [winAmount, setWinAmount] = useState(0);
    const [winPlusBet, setWinPlusBet] = useState(0);
    const [gameState, setGameState] = useState(false);
    const [totalAmount, setTotalAmount] = useState(1000);
    const boxes = Array.from({ length: 25 });

    const handleClick = (index) => {
        if (loseState === true || gameState === false) {
            return;
        }

        if (clickedIndexes.includes(index)) {
            return;
        }

        new Audio(blop).play();

        if (losingNumbers.includes(index)) {
            setLoseState(true);
            setClickedIndexMine(prevClickedIndexes => [...prevClickedIndexes, index]);
            setWinAmount(0);
            new Audio(explosion).play();
            console.log("PELI OHI");
            setGameState(false);
            return;
        }

        if (!loseState) {
            console.log("LISSÄÄ RAHAA");
            let minesRiskFactor = 0;

            if (mineValue >= 9) {
                minesRiskFactor = mineValue / 1.15; //Less rigged values for higher mine counts.
            }
            else if (mineValue >= 7) {
                minesRiskFactor = mineValue / 1.5;
            } else if (mineValue >= 5) {
                minesRiskFactor = mineValue / 2;
            } else {
                minesRiskFactor = mineValue / 5
            }

            const clicksRiskFactor = (clickedIndexes.length + 1) / 25; // More clicks -> more risk. the + 1 is added so the win starts to accumulating from the first click, not the 2nd.
            const baseWinAmount = betValue * minesRiskFactor * clicksRiskFactor;
            setWinAmount(winAmount + baseWinAmount);
            setClickedIndexes(prevClickedIndexes => [...prevClickedIndexes, index]);
        }
    }

    const handleSliderChange = (event) => {
        if (gameState === true) {
            return;
        }
        setmineValue(event.target.value)
    }

    const handleBetChange = (event) => {
        if (gameState === true) {
            return;
        }
        setBetValue(event.target.value);
    }

    const play = () => {
        if (betValue > totalAmount) {
            alert("You don't have the funds to make the bet");
            return;
        }

        if (gameState === true) {
            return;
        }

        setGameState(true);
        setLoseState(false);
        setClickedIndexes([]);
        setClickedIndexMine([]);
        setWinAmount(0);
        setWinPlusBet(0);
        setTotalAmount(totalAmount - betValue)
        const newlosingNumbers = new Set();
        while (newlosingNumbers.size < mineValue) {
            let randomNum = Math.floor(Math.random() * 25);
            newlosingNumbers.add(randomNum);
        }
        setlosingNumbers(Array.from(newlosingNumbers));
        console.log("Losing Numbers: " + Array.from(newlosingNumbers));
    };

    const cashOut = () => {
        if (gameState === false) {
            return;
        }

        if (loseState !== true) {
            setWinPlusBet(parseFloat(betValue) + parseFloat(winAmount.toFixed(2)));
            setTotalAmount(totalAmount + parseFloat(betValue) + parseFloat(winAmount.toFixed(2)));
            setGameState(false);
        }
    }

    const addFunds = () => {
        setTotalAmount(totalAmount + 1000)
    }

    return (
        <>
            <div className='containerDiv' style={{ textAlign: "center" }}>
                <h1 style={{ color: "white" }}>Jukka's Mines XD</h1>
                <h3 style={{ color: "white" }}>Your funds: {totalAmount.toFixed(2)} €</h3>
                <button style={{ backgroundColor: "black" }} onClick={() => addFunds()}>ADD FUNDS</button>
                <div className="grid-container">
                    {boxes.map((_, index) => (
                        <div
                        style={{
                            backgroundImage: clickedIndexes.includes(index) ? `url(${diamond})` : (clickedIndexMine.includes(index) ? `url(${bomb})` : ""),
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                            onClick={() => handleClick(index)}
                            key={index}
                            className="grid-item"
                        >
                        </div>
                    ))}
                </div>
                <div style={{marginTop: 50}}>
                    <span style={{ color: "white" }}>Mine count: </span><input
                        type="range"
                        min="1"
                        max="10"
                        value={mineValue}
                        onChange={handleSliderChange}
                        className="slider"
                    /><span style={{ color: "white" }}>{mineValue}</span><br />
                    <span style={{ color: "white" }}>Bet amount: </span><input
                        type="range"
                        min="1"
                        max="100"
                        value={betValue}
                        onChange={handleBetChange}
                        className="slider"
                    /><span style={{ color: "white" }}>{betValue} €</span><br />
                    <button style={{ marginTop: 20, backgroundColor: "green" }} onClick={() => play()}>PLAY</button><br />
                    {gameState && <button style={{ marginTop: "20", backgroundColor: "red" }} onClick={() => cashOut()}>CASH OUT</button>}
                    {gameState && <div style={{ color: "white", marginTop: 10 }}>Win amount: {winAmount.toFixed(2)} €</div>}
                    {loseState && <h3 style={{ color: "white", marginTop: 10 }}>YOU HIT A MINE! GAME OVER</h3>}
                    {winPlusBet !== 0 && <div style={{ color: "white", marginTop: 10 }}>CASHED OUT: {winPlusBet.toFixed(2)} €</div>}
                </div>
            </div>
        </>
    );
}

export default SlotMachine;