import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [progress, setProgress] = useState(0);
  const [translationTime, setTranslationTime] = useState(''); // State to store translation time
  const [expectedTimeText, setExpectedTimeText] = useState('');
  let intervalId = null;

  const simulateProgress = (duration) => {
    let progressTime = 0;
    const interval = 100;

    intervalId = setInterval(() => {
      progressTime += interval;
      const calculatedProgress = (progressTime / duration) * 100;
      setProgress(calculatedProgress);

      if (progressTime >= duration) {
        clearInterval(intervalId);
        setProgress(95);
      }
    }, interval);
  };

  const handleTranslate = async () => {
    setTranslation('Translating...');
    setProgress(0);
    setTranslationTime(''); // Reset translation time info

    const expectedTime = 1000*(text.length*.05+2.3);

    simulateProgress(expectedTime);

    const startTime = Date.now();
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const endTime = Date.now();
    const duration = (endTime - startTime)/1000;

    if (response.ok) {
      const data = await response.json();
      setTranslation(data.translation);
      clearInterval(intervalId);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    } else {
      console.error('Translation failed');
      setTranslation('Translation failed. Please try again.');
      clearInterval(intervalId);
      setProgress(0);
    }

    // Update translation time state with the duration
    setTranslationTime(`Translation took ${duration} seconds, expected was about ${Math.round(expectedTime/1000)} seconds.`);
  };

  return (
    <div className="app">
      <h1>Latin to English Translator</h1>
      <span>Enter Latin text to translate to English. This translator is not perfect and can make mistakes. Consider checking important parts. The translator functions best with shorter texts that have sufficient context.</span>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter English text"
      />
      <button onClick={handleTranslate}>Translate</button>
      <div style={{ width: '100%', backgroundColor: '#ddd', marginTop: '10px' }}>
        <div
          style={{
            height: '20px',
            width: `${progress}%`,
            backgroundColor: progress === 100 ? 'green' : 'lightgreen',
            transition: 'width 0.1s ease-out',
          }}
        ></div>
      </div>
      <div className="translation">{translation}</div>
      {/* Display translation time */}
      {translationTime && <div className="translation-time">{translationTime}</div>}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
