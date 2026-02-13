import React, { useState } from 'react';
import './App.css';
import Envelope from './components/Envelope/Envelope';

function App() {
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    setIsReset(true);
    setTimeout(() => setIsReset(false), 50);
  };

  return (
    <div className="app-container">
      {!isReset && <Envelope onReset={handleReset} />}
    </div>
  );
}

export default App;
