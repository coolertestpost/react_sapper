/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import './App.scss';
import '@fortawesome/fontawesome-free/css/all.css';

import { Board } from './Board/Board';

export const App: React.FC = () => {
  return (
    <Board />
  );
};

export default App;
