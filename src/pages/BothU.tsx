import TeX from '@matejmazur/react-katex';
import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import BothUPage from '../components/bothU/BothUPage';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
}));

const BothU: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Typography variant="h6">
        Модельная задача 2, решённая системой
      </Typography>
      <TeX
        block
        math="\rho_i\frac{\partial u_i}{\partial t} + \rho_i u_i\frac{\partial u_i}{\partial x} + \frac{\partial \rho_i^{\gamma_i}}{\partial x}=\frac{\partial}{\partial x}\left(v_{i1}\frac{\partial u_1}{\partial x} + v_{i2}\frac{\partial u_2}{\partial x}\right) + (-1)^{i+1}a\left(u_2-u_1\right)"
      />
      <TeX block math="x\in [0,1],\quad t\in [0,T],\quad i=1,2" />
      <TeX
        block
        math="u_i\Big|_{x=0} = 0,\quad u_i\Big|_{x=1} = 0,\quad i=1,2"
      />
      <TeX block math="u_i\Big|_{t=0} = u_i^0(x),\quad i=1,2" />
      <BothUPage />
    </div>
  );
};

export default BothU;
