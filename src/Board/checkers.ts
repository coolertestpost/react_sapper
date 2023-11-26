/* eslint-disable max-len */
import { ICell } from '../types/cell';

type Props = {
  cellsArray: ICell[],
  index: number,
  bombCount: number,
  action?: 'decrement' | 'increment',
  payload: number,
};

const checkBehind = ({
  cellsArray,
  index,
  bombCount,
  payload,
}: Props) => {
  let countOfBombs = bombCount;

  if (cellsArray[index - payload]?.hasBomb) {
    countOfBombs += 1;
  }

  return countOfBombs;
};

const checkAhead = ({
  cellsArray,
  index,
  bombCount,
  payload,
}: Props) => {
  let countOfBombs = bombCount;

  if (cellsArray[index + payload]?.hasBomb) {
    countOfBombs += 1;
  }

  return countOfBombs;
};

export const checkForBombs = ({
  cellsArray,
  index,
  bombCount,
  action,
  payload,
}: Props) => {
  let countOfBombs = bombCount;

  switch (action) {
    case 'increment': {
      countOfBombs = checkAhead({
        cellsArray,
        index,
        bombCount: countOfBombs,
        payload,
      });

      break;
    }

    case 'decrement': {
      countOfBombs = checkBehind({
        cellsArray,
        index,
        bombCount: countOfBombs,
        payload,
      });

      break;
    }

    default:
      break;
  }

  return countOfBombs;
};

type CheckBombsInRightAndLeftProps = {
  cellsArray: ICell[],
  index: number,
  bombCount: number,
};

export const checkBombsInRightAndLeft = ({ cellsArray, index, bombCount }: CheckBombsInRightAndLeftProps) => {
  let countOfBombs = bombCount;

  countOfBombs = checkForBombs({
    cellsArray,
    index,
    bombCount: countOfBombs,
    action: 'increment',
    payload: 1,
  });

  countOfBombs = checkForBombs({
    cellsArray,
    index,
    bombCount: countOfBombs,
    action: 'decrement',
    payload: 1,
  });

  return countOfBombs;
};

type CheckAheadAndBehindProps = {
  cellsArray: ICell[],
  index: number,
  bombCount: number,
  payload: number,
};

export const checkAheadAndBehind = ({
  cellsArray,
  index,
  bombCount,
  payload,
}: CheckAheadAndBehindProps) => {
  let countOfBombs = bombCount;

  countOfBombs = checkForBombs({
    cellsArray,
    index,
    bombCount: countOfBombs,
    action: 'increment',
    payload,
  });

  countOfBombs = checkForBombs({
    cellsArray,
    index,
    bombCount: countOfBombs,
    action: 'decrement',
    payload,
  });

  return countOfBombs;
};
