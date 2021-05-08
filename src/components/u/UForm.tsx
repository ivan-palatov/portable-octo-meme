import TeX from '@matejmazur/react-katex';
import {
  Button,
  CircularProgress,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useFormik } from 'formik';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
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

const initialValues = {
  u0: 'sin(pi*x)',
  uOther: 'e^(t)*sin(2*pi*x)',
  rho: 'e^(-t)*cos(pi*x/2)',
  v1: 0.3,
  v2: 0.5,
  a: 0.6,
  N: 50,
  M: 50,
  T: 1,
  f:
    'e^(-t)*sin(pi*x)*(-e^(-t)*cos(pi*x)+pi*e^(-2*t)*cos(pi*x/2)*cos(pi*x)+pi^2*0.3-0.6) + e^t*sin(2*pi*x)*(4*pi^2*0.5+0.6)',
  uReal: 'e^(-t)*sin(pi*x)',
};

export type FormTypes = typeof initialValues;

interface IProps {
  runWorker: (data: FormTypes) => void;
  isLoading: boolean;
}

const UForm: React.FC<IProps> = ({ runWorker, isLoading }) => {
  const classes = useStyles();
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log('Sending data to worker...');
      runWorker(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="classes.main">
      <TextField
        id="u0"
        className={classes.input}
        label={<TeX math="u^0(x)" />}
        {...formik.getFieldProps('u0')}
      />
      <TextField
        id="uOther"
        className={classes.input}
        label={<TeX math="u_2(x,t)" />}
        {...formik.getFieldProps('uOther')}
      />
      <TextField
        id="rho"
        className={classes.input}
        label={<TeX math="\rho(x,t)" />}
        {...formik.getFieldProps('rho')}
      />
      <TextField
        id="v1"
        className={classes.input}
        type="number"
        label={<TeX math="v_{1}" />}
        {...formik.getFieldProps('v1')}
      />
      <TextField
        id="v2"
        className={classes.input}
        type="number"
        label={<TeX math="v_{2}" />}
        {...formik.getFieldProps('v2')}
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
        {...formik.getFieldProps('T')}
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
      <TextField
        id="f"
        className={classes.input}
        label={<TeX math="f(x,t)" />}
        {...formik.getFieldProps('f')}
      />
      <TextField
        id="uReal"
        className={classes.input}
        label={
          <span>
            Точное решение <TeX math="u(x,t)" />
          </span>
        }
        {...formik.getFieldProps('uReal')}
      />
      <div className={classes.wrapper}>
        <Button
          style={{ marginTop: 10 }}
          color="primary"
          variant="contained"
          disabled={isLoading}
          type="submit"
        >
          Вычислить
        </Button>
        {isLoading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </form>
  );
};

export default React.memo(UForm);
