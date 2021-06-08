import TeX from '@matejmazur/react-katex';
import { Button, makeStyles, Typography } from '@material-ui/core';
import 'katex/dist/katex.min.css';
import React from 'react';
import { matrixToString, saveToCsv } from '../../utils/saveToCsv';

interface IProps {
  data: any;
}

const useStyles = makeStyles({
  main: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  over: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 20,
  },
  button: {
    margin: '0 10px',
  },
});

const ResultDownload: React.FC<IProps> = (props) => {
  const classes = useStyles();

  if (!props.data.u1 || !props.data) {
    return null;
  }

  function save(name: 'u1' | 'u2' | 'rho1' | 'rho2') {
    const content = matrixToString(
      ['surface', ''].includes(props.data.plotType)
        ? (props.data[name] as any).z
        : props.data[name]
    );
    return () => saveToCsv(content, name);
  }

  return (
    <div className={classes.over}>
      <Typography variant="subtitle2">Скачать результаты</Typography>
      <div className={classes.main}>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          onClick={save('u1')}
        >
          <TeX math="u_1" />
        </Button>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          onClick={save('u2')}
        >
          <TeX math="u_2" />
        </Button>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          onClick={save('rho1')}
        >
          <TeX math="\rho_1" />
        </Button>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          onClick={save('rho2')}
        >
          <TeX math="\rho_2" />
        </Button>
      </div>
    </div>
  );
};

export default ResultDownload;
