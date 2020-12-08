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
import Worker from '../workers/rho.worker';

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
}));

const Rho: React.FC = () => {
  const classes = useStyles();

  const [rho0, setRho0] = useState('cos(pi*x)');
  const [u, setU] = useState('1');
  const [f, setF] = useState('-pi*e^(-t)*sin(pi*x)');
  const [epsilon, setEpsilon] = useState('pi^2');
  const [N, setN] = useState(100);
  const [M, setM] = useState(200);
  const [T, setT] = useState(1);
  const [rho, setRho] = useState('e^(-t)*cos(pi*x)');
  const [data, setData] = useState<{ [x: string]: Data }>({});
  const [loading, setLoading] = useState(false);

  const runWorker = () => {
    const worker = new Worker();
    setLoading(true);
    worker.postMessage({ rho0, u, f, N, M, T, rho, epsilon });
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Typography variant="body1">
        Вычисление <TeX math="\rho" /> для известного u
      </Typography>
      <TeX
        block
        math="\frac{\partial \rho}{\partial t} + \frac{\partial}{\partial x}(\rho u) = \varepsilon\frac{\partial^2 \rho}{\partial x^2} + f(x,t),\quad x\in [0,1],\quad t\in [0,T]"
      />
      <TeX
        block
        math="\frac{\partial \rho}{\partial x}\Big|_{x=0} = 0, \frac{\partial \rho}{\partial x}\Big|_{x=1} = 0"
      />
      <TeX block math="\rho(x, 0) = \rho_0(x)" />
      <TextField
        className={classes.input}
        label={<TeX math="\rho_0 (x)" />}
        value={rho0}
        onChange={(e) => setRho0(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="u (x,t)" />}
        value={u}
        onChange={(e) => setU(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="f (x,t)" />}
        value={f}
        onChange={(e) => setF(e.target.value)}
      />
      <TextField
        className={classes.input}
        label={<TeX math="\varepsilon" />}
        value={epsilon}
        onChange={(e) => setEpsilon(e.target.value)}
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

export default Rho;
