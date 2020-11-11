import TeX from '@matejmazur/react-katex';
import {
  Button,
  CircularProgress,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Data } from 'plotly.js';
import React, { useState } from 'react';
import Plot3d from '../components/Plot3d';
import Worker from '../workers/sum.worker';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -12,
  },
  input: {
    marginTop: 10,
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const [ksi, setKsi] = useState('5*sin(x)+x^3');
  const [mu1, setMu1] = useState('0');
  const [mu2, setMu2] = useState('5*sin(1)*e^(-t)+1');
  const [f, setF] = useState('-6*x');
  const [N, setN] = useState(100);
  const [M, setM] = useState(200);
  const [T, setT] = useState(5);
  const [X, setX] = useState(1);
  const [rho, setRho] = useState('5*e^(-t)*sin(x)+x^3');
  const [data, setData] = useState<{ [x: string]: Data }>({});
  const [loading, setLoading] = useState(false);

  const runWorker = () => {
    const worker = new Worker();
    setLoading(true);
    worker.postMessage({ ksi, mu1, mu2, N, M, T, X, rho, f });
    worker.onerror = (e) => {
      console.log(e);
      setLoading(false);
    };
    worker.onmessage = (e) => {
      const { plot, actualFunction, difference } = e.data;
      setData({ plot, actualFunction, difference });
      setLoading(false);
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
      <TeX
        block
        math="\frac{\partial \rho}{\partial t} = \frac{\partial^2 \rho}{\partial x^2} + f(x,t), x\in [0,X], t\in [0,T]"
      />
      <TeX
        block
        math="\rho\Big|_{x=0} = \mu_1 (t), \rho\Big|_{x=X} = \mu_2 (t)"
      />
      <TeX block math="\rho\Big|_{t=0} = \phi (x)" />
      <TextField
        className={classes.input}
        label={<TeX math="f(x,t)" />}
        value={f}
        onChange={(e) => setF(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="\phi (x)" />}
        value={ksi}
        onChange={(e) => setKsi(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="\mu_1 (t)" />}
        value={mu1}
        onChange={(e) => setMu1(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="\mu_2 (t)" />}
        value={mu2}
        onChange={(e) => setMu2(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="X" />}
        type="number"
        value={X}
        onChange={(e) => setX(parseInt(e.target.value))}
      />
      <TextField
        className={classes.input}
        label={<TeX math="T" />}
        type="number"
        value={T}
        onChange={(e) => setT(parseInt(e.target.value))}
      />

      <TextField
        className={classes.input}
        label="Кол-во разбиений по t"
        type="number"
        value={N}
        onChange={(e) => setN(parseInt(e.target.value))}
      />
      <TextField
        className={classes.input}
        label="Кол-во разбиений по x"
        type="number"
        value={M}
        onChange={(e) => setM(parseInt(e.target.value))}
      />
      <TextField
        className={classes.input}
        label={
          <span>
            <TeX math="\rho (x,t)" /> (для проверки)
          </span>
        }
        value={rho}
        onChange={(e) => setRho(e.target.value)}
      />
      <div className={classes.wrapper}>
        <Button
          style={{ marginTop: 10 }}
          color="primary"
          variant="contained"
          onClick={runWorker}
          disabled={loading}
        >
          Вычислить
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
      {data.plot && (
        <Plot3d data={[data.plot]} title="График численного решения" />
      )}
      {data.actualFunction && (
        <Plot3d data={[data.actualFunction]} title="График реального решения" />
      )}
      {data.difference && (
        <Plot3d data={[data.difference]} title="График погрешности" />
      )}
    </div>
  );
};

export default Home;
