import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSocket } from './hooks/useSocket';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Arbitre from './pages/Arbitre';
import Spectateurs from './pages/Spectateurs';
import Historique from './pages/Historique';

function App() {
  const { matchState, isConnected, scorePoint, undoPoint, newSet, configureMatch } = useSocket();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/setup" 
            element={<Setup onConfigureMatch={configureMatch} />} 
          />
          <Route 
            path="/arbitre" 
            element={
              <Arbitre 
                matchState={matchState}
                scorePoint={scorePoint}
                undoPoint={undoPoint}
                newSet={newSet}
                isConnected={isConnected}
              />
            } 
          />
          <Route 
            path="/spectateurs" 
            element={
              <Spectateurs 
                matchState={matchState}
                isConnected={isConnected}
              />
            } 
          />
          <Route 
            path="/historique" 
            element={
              <Historique 
                matchState={matchState}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
