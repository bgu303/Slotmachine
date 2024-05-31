import '../styles/slotmachine.css';
import { useState } from 'react';

function SlotMachine() {
    const [losingNumbers, setlosingNumbers] = useState([]);
    const [sliderValue, setSliderValue] = useState(1);
    const [betValue, setBetValue] = useState(1);
    const [loseState, setLoseState] = useState(false);
    const [clickedIndexes, setClickedIndexes] = useState([])
    const [clickedIndexMine, setClickedIndexMine] = useState([])
    const [winAmount, setWinAmount] = useState(0);
    const [winPlusBet, setWinPlusBet] = useState(0);
    const [gameState, setGameState] = useState(false);
    const [totalAmount, setTotalAmount] = useState(100);
    const boxes = Array.from({ length: 25 });

    const handleClick = (index) => {
        if (loseState === true || gameState === false) {
            return;
        }

        if (clickedIndexes.includes(index)) {
            return;
        }

        if (losingNumbers.includes(index)) {
            setLoseState(true);
            setClickedIndexMine(prevClickedIndexes => [...prevClickedIndexes, index]);
            setWinAmount(0);
            console.log("PELI OHI");
            setGameState(false);
            return;
        }

        if (!loseState) {
            console.log("LISSÄÄ RAHAA");
            const minesRiskFactor = sliderValue / 5; // More mines -> more risk
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
        setSliderValue(event.target.value)
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
        while (newlosingNumbers.size < sliderValue) {
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
            <div style={{ textAlign: "center" }}>
                <h1>Jukka's Mines XD</h1>
                <h3>Your funds: {totalAmount.toFixed(2)} €</h3>
                <button onClick={() => addFunds()}>ADD FUNDS</button>
                <div className="grid-container">
                    {boxes.map((_, index) => (
                        <div
                            style={{
                                backgroundColor: clickedIndexes.includes(index) ? "green" : (clickedIndexMine.includes(index) ? "red" : "")
                            }}
                            onClick={() => handleClick(index)}
                            key={index}
                            className="grid-item"
                        >
                        </div>
                    ))}
                </div>
                <div>
                    <span>Mine count: </span><input
                        type="range"
                        min="1"
                        max="10"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="slider"
                    /><span>{sliderValue}</span><br />
                    <span>Bet amount: </span><input
                        type="range"
                        min="1"
                        max="100"
                        value={betValue}
                        onChange={handleBetChange}
                        className="slider"
                    /><span>{betValue} €</span><br />
                    <button style={{ marginTop: "20" }} onClick={() => play()}>PLAY</button><br />
                    <button style={{ marginTop: "20" }} onClick={() => cashOut()}>CASH OUT</button>
                    {!loseState && <div>Win amount: {winAmount.toFixed(2)} €</div>}
                    {loseState && <h3>YOU LOST THE GAME</h3>}
                    {winPlusBet !== 0 && <div>CASHED OUT: {winPlusBet.toFixed(2)} €</div>}
                </div>
            </div>
        </>
    );
}

export default SlotMachine;