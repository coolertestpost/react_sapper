/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import './Board.scss';
import { Cell } from '../Cell';
import { ICell } from '../types/cell';
import { checkAheadAndBehind, checkBombsInRightAndLeft, checkForBombs } from './checkers';

const countOfCells = 252;

const toFullRoundCellsIndexes: number[] = [];

const setToFullRoundCellsIndexes = () => {
  for (let i = 0; i < 17; i++) {
    toFullRoundCellsIndexes.push(i);
  }

  for (let i = 18; i < countOfCells - 18; i += 18) {
    toFullRoundCellsIndexes.push(i);
    toFullRoundCellsIndexes.push(i - 1);
  }

  toFullRoundCellsIndexes.push(countOfCells - 19);

  for (let i = countOfCells; i > countOfCells - 19; i--) {
    toFullRoundCellsIndexes.push(i);
  }

  toFullRoundCellsIndexes.sort((a, b) => a - b);
};

const setBomb = (cellsToField: ICell[]): ICell[] => {
  const cellsArray = cellsToField;
  const index = Math.floor(Math.random() * cellsArray.length);

  if (!cellsArray[index].hasBomb) {
    cellsArray[index].hasBomb = true;

    return cellsArray;
  }

  return setBomb(cellsArray);
};

const setValue = (cellsToField: ICell[], index: number): ICell[] => {
  const cellsArray = cellsToField;
  let bombCount = 0;

  bombCount = checkBombsInRightAndLeft({
    cellsArray,
    index,
    bombCount,
  });

  for (let i = 17; i < 20; i++) {
    bombCount = checkAheadAndBehind({
      cellsArray,
      index,
      bombCount,
      payload: i,
    });
  }

  cellsArray[index].value = bombCount;

  return cellsArray;
};

type CheckForBombsFunctionProps = {
  index: number,
  cell: number,
  cellsArray: ICell[],
  bombCount: number,
  side: 'right' | 'left',
};

const checkForBombsInNotFullRoundedCells = ({
  index,
  cell,
  cellsArray,
  bombCount,
  side,
}: CheckForBombsFunctionProps): number => {
  let countBomb = bombCount;

  if (index !== cell) {
    return countBomb;
  }

  countBomb = checkAheadAndBehind({
    cellsArray,
    index,
    bombCount: countBomb,
    payload: 18,
  });

  switch (side) {
    case 'right': {
      countBomb = checkForBombs({
        cellsArray,
        index,
        bombCount: countBomb,
        action: 'decrement',
        payload: 17,
      });

      countBomb = checkForBombs({
        cellsArray,
        index,
        bombCount: countBomb,
        action: 'increment',
        payload: 19,
      });

      countBomb = checkForBombs({
        cellsArray,
        index,
        bombCount: countBomb,
        action: 'increment',
        payload: 1,
      });

      break;
    }

    case 'left': {
      countBomb = checkForBombs({
        cellsArray,
        index,
        bombCount: countBomb,
        action: 'increment',
        payload: 17,
      });

      countBomb = checkForBombs({
        cellsArray,
        index,
        bombCount: countBomb,
        action: 'decrement',
        payload: 19,
      });

      countBomb = checkForBombs({
        cellsArray,
        index,
        bombCount: countBomb,
        action: 'decrement',
        payload: 1,
      });
      break;
    }

    default:
      break;
  }

  return countBomb;
};

const setValueForNotFullRounded = (cellsToField: ICell[], index: number): ICell[] => {
  const cellsArray = cellsToField;
  let bombCount = 0;
  let oneTwo = false;

  if (toFullRoundCellsIndexes.slice(1, 17).includes(index)) {
    bombCount = checkBombsInRightAndLeft({
      cellsArray,
      index,
      bombCount,
    });

    for (let i = 17; i < 20; i++) {
      bombCount = checkForBombs({
        cellsArray,
        index,
        bombCount,
        action: 'increment',
        payload: i,
      });
    }
  }

  toFullRoundCellsIndexes.slice(17, toFullRoundCellsIndexes.length - 19)
    .forEach((cell) => {
      if (oneTwo) {
        oneTwo = false;

        bombCount = checkForBombsInNotFullRoundedCells({
          index,
          cell,
          cellsArray,
          bombCount,
          side: 'right',
        });

        return;
      }

      bombCount = checkForBombsInNotFullRoundedCells({
        index,
        cell,
        cellsArray,
        bombCount,
        side: 'left',
      });

      oneTwo = true;
    });

  if (toFullRoundCellsIndexes.slice(toFullRoundCellsIndexes.length - 18, toFullRoundCellsIndexes.length - 2).includes(index)) {
    bombCount = checkAheadAndBehind({
      cellsArray,
      index,
      bombCount,
      payload: 1,
    });

    for (let i = 17; i < 20; i++) {
      bombCount = checkForBombs({
        cellsArray,
        index,
        bombCount,
        action: 'decrement',
        payload: i,
      });
    }
  }

  if (cellsArray[0].id === index) {
    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'increment',
      payload: 1,
    });

    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'increment',
      payload: 18,
    });

    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'increment',
      payload: 19,
    });
  }

  if (cellsArray[cellsArray.length - 1].id === index) {
    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'decrement',
      payload: 1,
    });

    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'decrement',
      payload: 18,
    });

    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'decrement',
      payload: 19,
    });
  }

  if (cellsArray[cellsArray.length - 18].id === index) {
    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'increment',
      payload: 1,
    });

    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'decrement',
      payload: 18,
    });

    bombCount = checkForBombs({
      cellsArray,
      index,
      bombCount,
      action: 'decrement',
      payload: 17,
    });
  }

  cellsArray[index].value = bombCount;

  return cellsArray;
};

export const Board: React.FC = () => {
  const [cells, setCells] = useState<ICell[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setToFullRoundCellsIndexes();
    let cellsToField = [];

    for (let i = 0; i < countOfCells; i++) {
      if (toFullRoundCellsIndexes.includes(i)) {
        cellsToField.push({
          id: i,
          value: i,
          hasBomb: false,
          fullRounded: false,
        });
      } else {
        cellsToField.push({
          id: i,
          value: i,
          hasBomb: false,
          fullRounded: true,
        });
      }
    }

    for (let i = 0; i < 40; i++) {
      cellsToField = setBomb(cellsToField);
    }

    for (let i = 0; i < cellsToField.length; i++) {
      if (!toFullRoundCellsIndexes.includes(i)) {
        cellsToField = setValue(cellsToField, i);
      } else {
        cellsToField = setValueForNotFullRounded(cellsToField, i);
      }
    }

    setCells(cellsToField);
  }, []);

  return (
    <>
      {gameOver && (
        <div className="blocking" />
      )}

      <div className="board">
        {cells.map((cell) => (
          <Cell key={cell.id} cellData={cell} onGameOver={() => setGameOver(true)} gameOver={gameOver} />
        ))}
      </div>
    </>
  );
};
