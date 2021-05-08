import { makeStyles } from '@material-ui/core';
import { Data } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';

interface IProps {
  title?: string | JSX.Element;
  data: Data[];
}

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Plot3d: React.FC<IProps> = ({ data, title }) => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      {title}
      <Plot
        data={data as any}
        layout={{
          scene: { yaxis: { title: 't' }, zaxis: { title: 'p' } },
          autosize: true,
          title: '',
        }}
      />
    </div>
  );
};

export default React.memo(Plot3d);
