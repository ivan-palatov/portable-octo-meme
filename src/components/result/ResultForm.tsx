import TeX from '@matejmazur/react-katex';
import {
  Button,
  CircularProgress,
  Divider,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 30,
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
  divider: {
    marginTop: 20,
  },
}));

const validationSchema = Yup.object().shape({
  u10: Yup.string().required(
    'Начальное значение функции обязательно для заполнения'
  ),
  u20: Yup.string().required(
    'Начальное значение функции обязательно для заполнения'
  ),
  rho10: Yup.string().required(
    'Начальное значение функции обязательно для заполнения'
  ),
  rho20: Yup.string().required(
    'Начальное значение функции обязательно для заполнения'
  ),
  gamma1: Yup.number()
    .required('Обязательно для заполнения')
    .moreThan(1, 'Степень должна быть строго больше 1'),
  gamma2: Yup.number()
    .required('Обязательно для заполнения')
    .moreThan(1, 'Степень должна быть строго больше 1'),
  v11: Yup.number()
    .required('Обязательно для заполнения')
    .min(0, 'Коэффициент не может быть отрицательным'),
  v12: Yup.number()
    .required('Обязательно для заполнения')
    .min(0, 'Коэффициент не может быть отрицательным'),
  v21: Yup.number()
    .required('Обязательно для заполнения')
    .min(0, 'Коэффициент не может быть отрицательным'),
  v22: Yup.number()
    .required('Обязательно для заполнения')
    .min(0, 'Коэффициент не может быть отрицательным'),
  epsilon: Yup.number()
    .required('Обязательно для заполнения')
    .min(0, 'Коэффициент не может быть отрицательным')
    .lessThan(1, 'Коэффициент должен быть меньше единицы'),
  delta: Yup.number()
    .required('Обязательно для заполнения')
    .min(0, 'Коэффициент не может быть отрицательным')
    .lessThan(1, 'Коэффициент должен быть меньше единицы'),
  beta1: Yup.number().moreThan(1, 'Степень должна быть строго больше 1'),
  beta2: Yup.number().moreThan(1, 'Степень должна быть строго больше 1'),
  a: Yup.number()
    .required('Коэффициент a обязателен для заполнения')
    .moreThan(0, 'Коэффициент a должен быть строго больше нуля'),
  N: Yup.number()
    .required('Количество разбиений по времени обязательно для заполнения')
    .min(2, 'Количество разбиений должно быть больше 1')
    .integer('Количество разбиений должно быть целым числом'),
  M: Yup.number()
    .required(
      'Количество разбиений по пространственной переменной обязательно для заполнения'
    )
    .min(2, 'Количество разбиений должно быть больше 1')
    .integer('Количество разбиений должно быть целым числом'),
  T: Yup.number()
    .required('Верхняя граница по времени обязательна для заполнения')
    .moreThan(0, 'Верхняя граница по времени должна быть строго больше нуля'),
  u1: Yup.string().optional(),
  u2: Yup.string().optional(),
  rho1: Yup.string().optional(),
  rho2: Yup.string().optional(),
});

const initialValues = {
  u10: 'sin(pi*x)',
  u20: 'sin(2*pi*x)',
  rho10: 'cos(pi*x)+3',
  rho20: 'cos(pi*x)+2',
  gamma1: 2,
  gamma2: 1.1,
  v11: 1,
  v12: 0,
  v21: 0,
  v22: 1,
  epsilon: 0.1,
  delta: 0,
  beta1: 1.1,
  beta2: 1.1,
  a: 0.5,
  N: 50,
  M: 50,
  T: 1,
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
    validationSchema,
    onSubmit: (values) => {
      console.log('Sending data to worker...');
      runWorker(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={classes.main}>
      <Divider variant="middle" />
      <Typography className={classes.divider} variant="caption">
        Начальные условия
      </Typography>
      <TextField
        id="u10"
        className={classes.input}
        label={<TeX math="u^0_1(x)" />}
        {...formik.getFieldProps('u10')}
        error={!!formik.errors.u10 && formik.touched.u10}
        helperText={formik.touched.u10 && formik.errors.u10}
      />
      <TextField
        id="u20"
        className={classes.input}
        label={<TeX math="u^0_2(x)" />}
        {...formik.getFieldProps('u20')}
        error={!!formik.errors.u20 && formik.touched.u20}
        helperText={formik.touched.u20 && formik.errors.u20}
      />
      <TextField
        id="rho10"
        className={classes.input}
        label={<TeX math="\rho^0_1(x)" />}
        {...formik.getFieldProps('rho10')}
        error={!!formik.errors.rho10 && formik.touched.rho10}
        helperText={formik.touched.rho10 && formik.errors.rho10}
      />
      <TextField
        id="rho20"
        className={classes.input}
        label={<TeX math="\rho^0_2(x)" />}
        {...formik.getFieldProps('rho20')}
        error={!!formik.errors.rho20 && formik.touched.rho20}
        helperText={formik.touched.rho20 && formik.errors.rho20}
      />
      <Typography className={classes.divider} variant="caption">
        Коэффициенты и степени
      </Typography>
      <TextField
        id="gamma1"
        className={classes.input}
        type="number"
        label={<TeX math="\gamma_1" />}
        {...formik.getFieldProps('gamma1')}
        error={!!formik.errors.gamma1 && formik.touched.gamma1}
        helperText={formik.touched.gamma1 && formik.errors.gamma1}
      />
      <TextField
        id="gamma2"
        className={classes.input}
        type="number"
        label={<TeX math="\gamma_2" />}
        {...formik.getFieldProps('gamma2')}
        error={!!formik.errors.gamma2 && formik.touched.gamma2}
        helperText={formik.touched.gamma2 && formik.errors.gamma2}
      />
      <TextField
        id="v11"
        className={classes.input}
        type="number"
        label={<TeX math="\nu_{11}" />}
        {...formik.getFieldProps('v11')}
        error={!!formik.errors.v11 && formik.touched.v11}
        helperText={formik.touched.v11 && formik.errors.v11}
      />
      <TextField
        id="v12"
        className={classes.input}
        type="number"
        label={<TeX math="\nu_{12}" />}
        {...formik.getFieldProps('v12')}
        error={!!formik.errors.v12 && formik.touched.v12}
        helperText={formik.touched.v12 && formik.errors.v12}
      />
      <TextField
        id="v21"
        className={classes.input}
        type="number"
        label={<TeX math="\nu_{21}" />}
        {...formik.getFieldProps('v21')}
        error={!!formik.errors.v21 && formik.touched.v21}
        helperText={formik.touched.v21 && formik.errors.v21}
      />
      <TextField
        id="v22"
        className={classes.input}
        type="number"
        label={<TeX math="\nu_{22}" />}
        {...formik.getFieldProps('v22')}
        error={!!formik.errors.v22 && formik.touched.v22}
        helperText={formik.touched.v22 && formik.errors.v22}
      />
      <TextField
        id="a"
        className={classes.input}
        type="number"
        label={<TeX math="a" />}
        {...formik.getFieldProps('a')}
        error={!!formik.errors.a && formik.touched.a}
        helperText={formik.touched.a && formik.errors.a}
      />
      <TextField
        id="T"
        className={classes.input}
        label={<TeX math="T" />}
        type="number"
        {...formik.getFieldProps('T')}
        error={!!formik.errors.T && formik.touched.T}
        helperText={formik.touched.T && formik.errors.T}
      />
      <Typography className={classes.divider} variant="caption">
        Коэффициенты и степени регуляризованной задачи
      </Typography>
      <TextField
        id="epsilon"
        className={classes.input}
        type="number"
        label={<TeX math="\varepsilon" />}
        {...formik.getFieldProps('epsilon')}
        error={!!formik.errors.epsilon && formik.touched.epsilon}
        helperText={formik.touched.epsilon && formik.errors.epsilon}
      />
      <TextField
        id="delta"
        className={classes.input}
        type="number"
        label={<TeX math="\delta" />}
        {...formik.getFieldProps('delta')}
        error={!!formik.errors.delta && formik.touched.delta}
        helperText={formik.touched.delta && formik.errors.delta}
      />
      <TextField
        id="beta1"
        className={classes.input}
        type="number"
        label={<TeX math="\beta_1" />}
        {...formik.getFieldProps('beta1')}
        error={!!formik.errors.beta1 && formik.touched.beta1}
        helperText={formik.touched.beta1 && formik.errors.beta1}
      />
      <TextField
        id="beta2"
        className={classes.input}
        type="number"
        label={<TeX math="\beta_2" />}
        {...formik.getFieldProps('beta2')}
        error={!!formik.errors.beta2 && formik.touched.beta2}
        helperText={formik.touched.beta2 && formik.errors.beta2}
      />
      <Typography className={classes.divider} variant="caption">
        Разбиения по времени и пространству
      </Typography>
      <TextField
        id="N"
        className={classes.input}
        label="Кол-во разбиений по t"
        type="number"
        {...formik.getFieldProps('N')}
        error={!!formik.errors.N && formik.touched.N}
        helperText={formik.touched.N && formik.errors.N}
      />
      <TextField
        id="M"
        className={classes.input}
        label="Кол-во разбиений по x"
        type="number"
        {...formik.getFieldProps('M')}
        error={!!formik.errors.M && formik.touched.M}
        helperText={formik.touched.M && formik.errors.M}
      />
      <Typography className={classes.divider} variant="caption">
        Точные значения функций (для проверки алгоритма, не обязательны)
      </Typography>
      <TextField
        id="u1"
        className={classes.input}
        label={<TeX math="u_1" />}
        {...formik.getFieldProps('u1')}
        error={!!formik.errors.u1 && formik.touched.u1}
        helperText={formik.touched.u1 && formik.errors.u1}
      />
      <TextField
        id="u2"
        className={classes.input}
        label={<TeX math="u_2" />}
        {...formik.getFieldProps('u2')}
        error={!!formik.errors.u2 && formik.touched.u2}
        helperText={formik.touched.u2 && formik.errors.u2}
      />
      <TextField
        id="rho1"
        className={classes.input}
        label={<TeX math="\rho_1" />}
        {...formik.getFieldProps('rho1')}
        error={!!formik.errors.rho1 && formik.touched.rho1}
        helperText={formik.touched.rho1 && formik.errors.rho1}
      />
      <TextField
        id="rho2"
        className={classes.input}
        label={<TeX math="\rho_2" />}
        {...formik.getFieldProps('rho2')}
        error={!!formik.errors.rho2 && formik.touched.rho2}
        helperText={formik.touched.rho2 && formik.errors.rho2}
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
