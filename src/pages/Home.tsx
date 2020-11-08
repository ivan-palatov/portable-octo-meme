import { Button, TextField, Typography } from '@material-ui/core';
import * as math from 'mathjs';
import { Data } from 'plotly.js';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import Worker from '../workers/sum.worker';

const f = math.parse('e^(-t)*sin(x)');
const originalData: Data = {
  x: Array(50 + 1)
    .fill(0)
    .map((_, i) => i * 0.02),
  y: Array(50 + 1)
    .fill(0)
    .map((_, i) => i * 0.1),
  z: Array(50 + 1)
    .fill(0)
    .map((_, i) =>
      Array(50 + 1)
        .fill(0)
        .map((_, j) => f.evaluate({ t: i * 0.1, x: j * 0.01 }))
    ),
  type: 'surface',
};

const Home: React.FC = () => {
  const [ksi, setKsi] = useState('sin(x)');
  const [mu1, setMu1] = useState('0');
  const [mu2, setMu2] = useState('sin(1)*e^(-t)');
  const [N, setN] = useState(100);
  const [M, setM] = useState(200);
  const [T, setT] = useState(5);
  const [X, setX] = useState(1);
  const [rho, setRho] = useState('e^(-t)*sin(x)');
  const [data, setData] = useState<{ [x: string]: Data }>({});

  const runWorker = () => {
    const worker = new Worker();
    worker.postMessage({ ksi, mu1, mu2, N, M, T, X, rho });
    worker.onerror = console.log;
    worker.onmessage = (e) => {
      const { plot, actualFunction, difference } = e.data;
      setData({ plot, actualFunction, difference });
    };
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="body1">
        Вычисление уравнений в частных производных параболического типа методом
        прогонки
      </Typography>
      <TextField
        style={{ marginTop: 5 }}
        label="Начальное условие"
        value={ksi}
        onChange={(e) => setKsi(e.target.value)}
      />
      <TextField
        style={{ marginTop: 5 }}
        label="Граничное условие при x=0"
        value={mu1}
        onChange={(e) => setMu1(e.target.value)}
      />
      <TextField
        style={{ marginTop: 5 }}
        label={`Граничное условие при x=${X}`}
        value={mu2}
        onChange={(e) => setMu2(e.target.value)}
      />
      <TextField
        style={{ marginTop: 5 }}
        label="Кол-во разбиений по t"
        type="number"
        value={N}
        onChange={(e) => setN(parseInt(e.target.value))}
      />
      <TextField
        style={{ marginTop: 5 }}
        label="Кол-во разбиений по x"
        type="number"
        value={M}
        onChange={(e) => setM(parseInt(e.target.value))}
      />
      <TextField
        style={{ marginTop: 5 }}
        label="Максимальное значение X"
        type="number"
        value={X}
        onChange={(e) => setX(parseInt(e.target.value))}
      />
      <TextField
        style={{ marginTop: 5 }}
        label="Максимальное значение T"
        type="number"
        value={T}
        onChange={(e) => setT(parseInt(e.target.value))}
      />
      <TextField
        style={{ marginTop: 5 }}
        label="Функция Pho (для проверки)"
        value={rho}
        onChange={(e) => setRho(e.target.value)}
      />
      <Button
        style={{ marginTop: 10 }}
        color="primary"
        variant="contained"
        onClick={runWorker}
      >
        Вычислить
      </Button>
      {data.plot && (
        <Plot data={[data.plot]} layout={{ yaxis: { title: { text: 't' } } }} />
      )}
      {data.actualFunction && (
        <Plot
          data={[data.actualFunction]}
          layout={{ yaxis: { title: { text: 't' } } }}
        />
      )}
      {data.difference && (
        <Plot
          data={[data.difference]}
          layout={{ yaxis: { title: { text: 't' } } }}
        />
      )}
    </div>
  );
};

export default Home;
