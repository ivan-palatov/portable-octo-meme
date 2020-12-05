import {
  Button,
  CircularProgress,
  makeStyles,
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

  const [data, setData] = useState<{ [x: string]: Data }>({});
  const [loading, setLoading] = useState(false);

  const runWorker = () => {
    const worker = new Worker();
    setLoading(true);
    worker.postMessage('go');
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
      <Typography variant="h6" align="center">
        Проверка правильности решения уравнения для ро
      </Typography>
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
        <Plot3d data={[data.plot]} title="График полученный численно" />
      )}
      {data.actualFunction && (
        <Plot3d data={[data.actualFunction]} title="График функции" />
      )}
      {data.difference && (
        <Plot3d data={[data.difference]} title="Погрешность" />
      )}
    </div>
  );
};

export default Rho;
