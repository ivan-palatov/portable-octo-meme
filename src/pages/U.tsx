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
import Worker from '../workers/u.worker';

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
    width: '100%',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
}));

const U: React.FC = () => {
  const classes = useStyles();

  const [u0, setU0] = useState('sin(pi*x)');
  const [rho, setRho] = useState('e^(-t)*cos(pi*x/2)');
  const [f, setF] = useState(
    'e^(-t)*sin(pi*x)*(1*pi^2 + (pi*e^(-t)*cos(pi*x) - 1)*e^(-t)*cos(pi*x/2))'
  );
  const [V, setV] = useState('1');
  const [N, setN] = useState(100);
  const [M, setM] = useState(200);
  const [T, setT] = useState(1);
  const [u, setU] = useState('e^(-t)*sin(pi*x)');
  const [data, setData] = useState<{ [x: string]: Data }>({});
  const [loading, setLoading] = useState(false);

  const runWorker = () => {
    const worker = new Worker();
    setLoading(true);
    worker.postMessage({ u0, rho, f, V, N, M, T, u });
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
    <div className={classes.main}>
      <Typography variant="h6">Модельная задача 2</Typography>
      <TeX
        block
        math="\rho\frac{\partial u}{\partial t} + \rho u\frac{\partial u}{\partial x}=V\frac{\partial^2 u}{\partial x^2} + f(x,t),\quad x\in [0,1],\quad t\in [0,T]"
      />
      <TeX block math="u\Big|_{x=0} = 0, u\Big|_{x=1} = 0" />
      <TeX block math="u\Big|_{t=0} = u^0(x)" />
      <TeX block math="\rho = \rho(x,t)" />
      <TextField
        className={classes.input}
        label={<TeX math="u^0(x)" />}
        value={u0}
        onChange={(e) => setU0(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="\rho(x,t)" />}
        value={rho}
        onChange={(e) => setRho(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="f (x,t)" />}
        value={f}
        onChange={(e) => setF(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="V" />}
        value={V}
        onChange={(e) => setV(e.target.value)}
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
            <TeX math="u(x,t)" /> (для проверки)
          </span>
        }
        value={u}
        onChange={(e) => setU(e.target.value)}
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

export default U;
