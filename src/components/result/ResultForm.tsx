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
  rho10: 'cos(pi*x)+3',
  rho20: 'cos(pi*x)+2',
  gamma1: 0,
  gamma2: 0,
  v11: 1,
  v12: 0,
  v21: 0,
  v22: 1,
  epsilon: 0.1,
  delta: 0,
  beta1: 1,
  beta2: 1,
  a: 0.5,
  N: 50,
  M: 50,
  T: 1,
  epsilon0: 0.1,
  u1: 'e^(-t)*sin(pi*x)',
  u2: 'e^(-t)*sin(2*pi*x)',
  rho1: 'e^(-t)*(cos(pi*x)+3)',
  rho2: 'e^(-t)*(cos(pi*x)+2)',
};

export type FormTypes = typeof initialValues;

interface IProps {
  runWorker: (data: FormTypes) => void;
  isLoading: boolean;
}

const ResultForm: React.FC<IProps> = ({ runWorker, isLoading }) => {
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
        id="gamma1"
        className={classes.input}
        type="number"
        label={<TeX math="\gamma_1" />}
        {...formik.getFieldProps('gamma1')}
      />
      <TextField
        id="gamma2"
        className={classes.input}
        type="number"
        label={<TeX math="\gamma_2" />}
        {...formik.getFieldProps('gamma2')}
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
        id="delta"
        className={classes.input}
        type="number"
        label={<TeX math="\delta" />}
        {...formik.getFieldProps('delta')}
      />
      <TextField
        id="beta1"
        className={classes.input}
        type="number"
        label={<TeX math="\beta_1" />}
        {...formik.getFieldProps('beta1')}
      />
      <TextField
        id="beta2"
        className={classes.input}
        type="number"
        label={<TeX math="\beta_2" />}
        {...formik.getFieldProps('beta2')}
      />
      <TextField
        id="a"
        className={classes.input}
        type="number"
        label={<TeX math="a" />}
        {...formik.getFieldProps('a')}
      />
      <TextField
        id="T"
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
        id="epsilon0"
        className={classes.input}
        label={
          <span>
            Допустимая погрешность
            <TeX math="\varepsilon_0" />
          </span>
        }
        type="number"
        {...formik.getFieldProps('epsilon0')}
      />
      <TextField
        id="u1"
        className={classes.input}
        label={<TeX math="u_1" />}
        {...formik.getFieldProps('u1')}
      />
      <TextField
        id="u2"
        className={classes.input}
        label={<TeX math="u_2" />}
        {...formik.getFieldProps('u2')}
      />
      <TextField
        id="rho1"
        className={classes.input}
        label={<TeX math="\rho_1" />}
        {...formik.getFieldProps('rho1')}
      />
      <TextField
        id="rho2"
        className={classes.input}
        label={<TeX math="\rho_2" />}
        {...formik.getFieldProps('rho2')}
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

export default React.memo(ResultForm);
