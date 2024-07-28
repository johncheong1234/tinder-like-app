import React from 'react';
import './App.css';
import SwipeInterface from './components/SwipeInterface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tinder-like App</h1>
      </header>
      <main>
        <SwipeInterface />
      </main>
    </div>
  );
}

export default App;