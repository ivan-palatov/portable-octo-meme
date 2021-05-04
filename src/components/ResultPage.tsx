import TeX from '@matejmazur/react-katex';
import {
  Button,
  CircularProgress,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useFormik } from 'formik';
import { Data } from 'plotly.js';
import React, { useReducer } from 'react';
import Plot3d from '../components/Plot3d';
import Worker from '../workers/main.worker';

interface IProps {}

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

enum EAction {
  TOGGLE_LOADING,
  UPDATE_ITERATIONS,
  UPDATE_DATA,
}

interface IAction {
  type: EAction;
  payload?: { [x: string]: any };
}

const initialValues = {
  u10: 'sin(pi*x)',
  u20: 'sin(pi*x)',
  rho10: 'cos(pi*x/2)',
  rho20: 'cos(pi*x/2)',
  v11: 1,
  v12: 1,
  v21: 1,
  v22: 1,
  epsilon: 0.01,
  a: 1,
  N: 50,
  M: 50,
  T: 1,
  epsilon0: 0.5,
};

const initialState = {
  isLoading: false,
  iterations: 0,
  data: {} as { u1: Data; u2: Data; rho1: Data; rho2: Data },
};

function reducer(
  state: typeof initialState,
  action: IAction
): typeof initialState {
  switch (action.type) {
    case EAction.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case EAction.UPDATE_ITERATIONS:
      return { ...state, iterations: action.payload!.iterations };
    case EAction.UPDATE_DATA:
      return { ...state, data: action.payload!.data };
    default:
      return state;
  }
}

const ResultPage: React.FC<IProps> = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log('Sending data to worker...');
      runWorker(values);
    },
  });

  function runWorker(values: typeof initialValues) {
    const worker = new Worker();
    dispatch({ type: EAction.TOGGLE_LOADING });
    worker.postMessage(values);
    worker.onerror = (e) => {
      console.warn(e);
      dispatch({ type: EAction.TOGGLE_LOADING });
    };
    worker.onmessage = (e) => {
      const { iterations, ...data } = e.data;
      dispatch({ type: EAction.UPDATE_DATA, payload: { data } });
      dispatch({ type: EAction.UPDATE_ITERATIONS, payload: { iterations } });
      dispatch({ type: EAction.TOGGLE_LOADING });
    };
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="u10"
          className={classes.input}
          label={<TeX math="u^0_1(x)" />}
          {...formik.getFieldProps('u10')}
        />
        <TextField
          id="u20"
          className={classes.input}
          label={<TeX math="u^0_2(x)" />}
          {...formik.getFieldProps('u20')}
        />
        <TextField
          id="rho10"
          className={classes.input}
          label={<TeX math="\rho^0_1(x)" />}
          {...formik.getFieldProps('rho10')}
        />
        <TextField
          id="rho20"
          className={classes.input}
          label={<TeX math="\rho^0_2(x)" />}
          {...formik.getFieldProps('rho20')}
        />
        <TextField
          id="v11"
          className={classes.input}
          type="number"
          label={<TeX math="v_{11}" />}
          {...formik.getFieldProps('v11')}
        />
        <TextField
          id="v12"
          className={classes.input}
          type="number"
          label={<TeX math="v_{12}" />}
          {...formik.getFieldProps('v12')}
        />
        <TextField
          id="v21"
          className={classes.input}
          type="number"
          label={<TeX math="v_{21}" />}
          {...formik.getFieldProps('v21')}
        />
        <TextField
          id="v22"
          className={classes.input}
          type="number"
          label={<TeX math="v_{22}" />}
          {...formik.getFieldProps('v22')}
        />
        <TextField
          id="epsilon"
          className={classes.input}
          type="number"
          label={<TeX math="\varepsilon" />}
          {...formik.getFieldProps('epsilon')}
        />
        <TextField
          id="a"
          className={classes.input}
          type="number"
          label={<TeX math="a" />}
          {...formik.getFieldProps('a')}
        />
        <TextField
          className={classes.input}
          label={<TeX math="T" />}
          type="number"
          {...formik.getFieldProps('a')}
        />
        <TextField
          id="N"
          className={classes.input}
          label="Кол-во разбиений по t"
          type="number"
          {...formik.getFieldProps('N')}
        />
        <TextField
          id="M"
          className={classes.input}
          label="Кол-во разбиений по x"
          type="number"
          {...formik.getFieldProps('M')}
        />
        <div className={classes.wrapper}>
          <Button
            style={{ marginTop: 10 }}
            color="primary"
            variant="contained"
            disabled={state.isLoading}
            type="submit"
          >
            Вычислить
          </Button>
          {state.isLoading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </form>
      {state.data.u1 && (
        <>
          <Plot3d data={[state.data.u1]} title="U1" />
          <Plot3d data={[state.data.u2]} title="U2" />
          <Plot3d data={[state.data.rho1]} title="Rho1" />
          <Plot3d data={[state.data.rho2]} title="Rho2" />
        </>
      )}
    </>
  );
};

export default ResultPage;
