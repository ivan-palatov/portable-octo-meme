import TeX from '@matejmazur/react-katex';
import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import UPage from '../components/u/UPage';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
}));

const UMain: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Typography variant="h6">Модельная задача 2</Typography>
      <TeX
        block
        math="\rho\frac{\partial u}{\partial t} + \rho u\frac{\partial u}{\partial x}=\frac{\partial}{\partial x}\left(v_{1}\frac{\partial u}{\partial x} + v_{2}\frac{\partial u_2}{\partial x}\right) + (-1)^{i+1}a(u_2-u)"
      />
      <TeX block math="x\in [0,1],\quad t\in [0,T]" />
      <TeX block math="u_2=u_2(x,t)" />
      <TeX block math="u\Big|_{x=0} = 0,\quad u\Big|_{x=1} = 0" />
      <TeX block math="u\Big|_{t=0} = u^0(x)" />
      <UPage />
    </div>
  );
};

export default UMain;
