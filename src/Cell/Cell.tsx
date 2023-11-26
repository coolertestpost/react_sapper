/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './Cell.scss';
import { ICell } from '../types/cell';

type Props = {
  cellData: ICell,
  onGameOver: () => void,
  gameOver: boolean,
};

export const Cell: React.FC<Props> = ({ cellData, onGameOver, gameOver }) => {
  const [opened, setOpened] = useState(false);
  const [flag, setFlag] = useState(false);

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);

      return;
    }

    setOpened(true);
  }, [gameOver]);

  return (
    <div
      className="cell"
      onClick={() => {
        if (flag) {
          return;
        }

        if (cellData.hasBomb) {
          onGameOver();
        }

        setOpened(true);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        if (opened) {
          return;
        }

        if (flag) {
          setFlag(false);
        } else {
          setFlag(true);
        }
      }}
    >
      {opened && !flag && cellData.hasBomb ? (
        <span className="icon">
          <i className="fa-solid fa-bomb fa-shake" />
        </span>
      ) : flag && opened && !cellData.hasBomb ? <i className="fa-solid fa-xmark" style={{ color: 'ff0000', fontSize: 30 }} /> : flag ? <i className="fa-solid fa-flag" style={{ color: 'red' }} /> : opened && <span>{cellData.value}</span>}
    </div>
  );
};
