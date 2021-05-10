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
  u10: 'sin(pi*x)',
  u20: 'sin(2*pi*x)',
  rho1: 'e^(t)*cos(pi*x/2)',
  rho2: 'e^(-t)*cos(pi*x/2)',
  v11: 0.3,
  v12: 0,
  v21: 0,
  v22: 0.3,
  a: 0.5,
  N: 50,
  M: 50,
  T: 1,
  f1:
    'e^t*(sin(pi*x)*(e^t*cos(pi*x/2)+e^(2*t)*cos(pi*x/2)*cos(pi*x) + 0.3*pi^2 + 0.5) + 0*4*pi^2*sin(2*pi*x)- 0.5*sin(2*pi*x))',
  f2:
    'sin(2*pi*x)*(cos(pi*x/2)+2*pi*e^t*cos(pi*x/2)*cos(2*pi*x) + 0.3*e^t*4*pi^2 + 0.5*e^t) + e^t*sin(pi*x)*(0*pi^2 - 0.5)',
  u1Real: 'e^(t)*sin(pi*x)',
  u2Real: 'e^(t)*sin(2*pi*x)',
};

export type FormTypes = typeof initialValues;

interface IProps {
  runWorker: (data: FormTypes) => void;
  isLoading: boolean;
}

const BothUForm: React.FC<IProps> = ({ runWorker, isLoading }) => {
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
        id="rho1"
        className={classes.input}
        label={<TeX math="\rho^0_1(x)" />}
        {...formik.getFieldProps('rho1')}
      />
      <TextField
        id="rho2"
        className={classes.input}
        label={<TeX math="\rho^0_2(x)" />}
        {...formik.getFieldProps('rho2')}
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
        id="f1"
        className={classes.input}
        label={<TeX math="f_1(x,t)" />}
        {...formik.getFieldProps('f1')}
      />
      <TextField
        id="f2"
        className={classes.input}
        label={<TeX math="f_2(x,t)" />}
        {...formik.getFieldProps('f2')}
      />
      <TextField
        id="u1Real"
        className={classes.input}
        label={<TeX math="u_1(x,t)" />}
        {...formik.getFieldProps('u1Real')}
      />
      <TextField
        id="u2Real"
        className={classes.input}
        label={<TeX math="u_2(x,t)" />}
        {...formik.getFieldProps('u2Real')}
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

export default React.memo(BothUForm);
