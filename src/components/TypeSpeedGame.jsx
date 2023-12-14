import React, { useState, useEffect, useRef, useCallback } from 'react';
import classes from './TypeSpeedGame.module.css';

const QUOTE_API_URL = 'http://api.quotable.io/random';

function TypeSpeedGame() {
    const [quote, setQuote] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(null);
    const startTime = useRef(new Date());

    const startTimer = useCallback(() => {
        startTime.current = new Date();
        setTimer(0);
        intervalRef.current = setInterval(() => {
            setTimer(Math.floor((new Date() - startTime.current) / 1000));
        }, 1000);
    }, []);


    const renderNewQuote = useCallback(async () => {
        try {
            const fetchedQuote = await getRandomQuote();
            setQuote(fetchedQuote);
            setInputValue('');
            clearInterval(intervalRef.current);
            startTimer();
        } catch (error) {
            console.error("Failed to fetch quote:", error);
        }
    }, [startTimer]);

    const getRandomQuote = async () => {
        const response = await fetch(QUOTE_API_URL);
        const data = await response.json();
        return data.content;
    };

    const handleTextareaChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);

        const arrayQuote = quote.split('');
        const arrayValue = newValue.split('');
        let correct = true;

        arrayQuote.forEach((character, index) => {
            if (arrayValue[index] == null || character !== arrayValue[index]) {
                correct = false;
            }
        });

        if (correct) renderNewQuote();
    };


    useEffect(() => {
        renderNewQuote();
        return () => clearInterval(intervalRef.current);
    }, [renderNewQuote]);

    return (
        <div className={classes.wrapper}>
            <div className={classes.timer}>{timer}</div>
            <div className={classes.container}>
                <div className={classes['quote-display']}>
                    {quote.split('').map((character, index) => (
                        <span key={index} className={inputValue[index] === character ? classes.correct : inputValue[index] ? classes.incorrect : ''}>
                            {character}
                        </span>
                    ))}
                </div>
                <textarea
                    id="quoteInput"
                    className={classes['quote-input']}
                    autoFocus
                    value={inputValue}
                    onChange={handleTextareaChange}
                ></textarea>
            </div>
        </div>
    );
}

export default TypeSpeedGame;
