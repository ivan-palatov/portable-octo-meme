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
    width: '100%',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    rho10: 'cos(x*pi)+3/2',
    rho20: 'x+1',
    u10: 'sin(2*x*pi)',
    u20: 'sin(5*x*pi)',
    epsilon: 0.1,
    delta: 0.001,
    nu11: 0.5,
    nu12: 0,
    nu21: 0,
    nu22: 0.5,
    beta1: 0.1,
    beta2: 0.1,
    gamma1: 4,
    gamma2: 4,
    a: 1,
    T: 1,
    N: 20,
    M: 20,
    epsilon0: 0.01,
  });
  const [data, setData] = useState<{ [x: string]: Data }>({});
  const [loading, setLoading] = useState(false);

  const runWorker = () => {
    const worker = new Worker();
    setLoading(true);
    worker.postMessage({ ...state });
    worker.onerror = (e) => {
      console.log(e);
      setLoading(false);
    };
    worker.onmessage = (e) => {
      const { plot1, plot2 } = e.data;
      setData({ plot1, plot2 });
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
      <Typography variant="h6" align="center">
        Численное решение регуляризованной (релаксированной) задачи
      </Typography>
      <TeX
        block
        math="\frac{\partial \rho_i}{\partial t} + \frac{\partial}{\partial x}(\rho_i,u_i) = \varepsilon\frac{\partial^2 \rho_i}{\partial x^2},\quad \varepsilon>0,\quad i=1,2"
      />
      <TeX
        block
        math="\frac{\partial}{\partial t}(\rho_i u_i) + \frac{\partial}{\partial x}(\rho_i u_i^2) + \frac{\partial}{\partial x}(\rho_i^{\gamma_i}) + \frac{\partial}{\partial x}(\delta\rho_i^{\beta_i}) + \varepsilon\frac{\partial u_i}{\partial x}\frac{\partial \rho_i}{\partial x} = \frac{\partial}{\partial x}\Big( \nu_{i1}\frac{\partial u_1}{\partial x} + \nu_{i2}\frac{\partial u_2}{\partial x} \Big) + (-1)^{i+1}a(u_2 - u_1)"
      />
      <TeX
        block
        math="\frac{\partial \rho_i}{\partial x}\Big|_{x=0,1}=0,\quad u_i\big|_{x=1,2}=0;\quad i=1,2,\quad 0<t<T"
      />
      <TeX
        block
        math="\rho_i\big|_{t=0}=\rho_i^0(x),\quad u_i\big|_{t=0}=u_i^0(x);\quad i=1,2,\quad 0<x<1"
      />
      <TextField
        className={classes.input}
        label={<TeX math="\rho_1(x,0)" />}
        value={state.rho10}
        onChange={(e) =>
          setState((prev) => ({ ...prev, rho10: e.target.value }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\rho_2(x,0)" />}
        value={state.rho20}
        onChange={(e) =>
          setState((prev) => ({ ...prev, rho20: e.target.value }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="u_1(x,0)" />}
        value={state.u10}
        onChange={(e) => setState((prev) => ({ ...prev, u10: e.target.value }))}
      />
      <TextField
        className={classes.input}
        label={<TeX math="u_2(x,0)" />}
        value={state.u20}
        onChange={(e) => setState((prev) => ({ ...prev, u20: e.target.value }))}
      />
      <TextField
        className={classes.input}
        label={<TeX math="\varepsilon" />}
        value={state.epsilon}
        onChange={(e) =>
          setState((prev) => ({ ...prev, epsilon: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\delta" />}
        value={state.delta}
        onChange={(e) =>
          setState((prev) => ({ ...prev, delta: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\nu_{11}" />}
        value={state.nu11}
        onChange={(e) =>
          setState((prev) => ({ ...prev, nu11: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\nu_{12}" />}
        value={state.nu12}
        onChange={(e) =>
          setState((prev) => ({ ...prev, nu12: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\nu_{21}" />}
        value={state.nu21}
        onChange={(e) =>
          setState((prev) => ({ ...prev, nu21: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\nu_{22}" />}
        value={state.nu22}
        onChange={(e) =>
          setState((prev) => ({ ...prev, nu22: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\beta_1" />}
        value={state.beta1}
        onChange={(e) =>
          setState((prev) => ({ ...prev, beta1: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\beta_2" />}
        value={state.beta2}
        onChange={(e) =>
          setState((prev) => ({ ...prev, beta2: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\gamma_1" />}
        value={state.gamma1}
        onChange={(e) =>
          setState((prev) => ({ ...prev, gamma1: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="\gamma_2" />}
        value={state.gamma2}
        onChange={(e) =>
          setState((prev) => ({ ...prev, gamma2: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="a" />}
        value={state.a}
        onChange={(e) =>
          setState((prev) => ({ ...prev, a: parseFloat(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={<TeX math="T" />}
        value={state.T}
        type="number"
        onChange={(e) =>
          setState((prev) => ({ ...prev, T: parseInt(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={
          <span>
            Количество разбиений <TeX math="N" /> по <TeX math="t" />
          </span>
        }
        value={state.N}
        type="number"
        onChange={(e) =>
          setState((prev) => ({ ...prev, N: parseInt(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={
          <span>
            Количество разбиений <TeX math="M" /> по <TeX math="x" />
          </span>
        }
        value={state.M}
        type="number"
        onChange={(e) =>
          setState((prev) => ({ ...prev, M: parseInt(e.target.value) }))
        }
      />
      <TextField
        className={classes.input}
        label={
          <span>
            Точность <TeX math="\varepsilon_0" />
          </span>
        }
        value={state.epsilon0}
        type="number"
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            epsilon0: parseFloat(e.target.value),
          }))
        }
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
      {data.plot1 && <Plot3d data={[data.plot1]} title="График u1" />}
      {data.plot2 && <Plot3d data={[data.plot2]} title="График u2" />}
    </div>
  );
};

export default Home;
