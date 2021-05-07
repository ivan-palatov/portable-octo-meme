import { Data } from 'plotly.js';
import React from 'react';
import Plot3d from '../Plot3d';

interface IProps {
  data: {
    u1: Data;
    u2: Data;
    u1Real: Data;
    u2Real: Data;
    diff1: Data;
    diff2: Data;
  };
}

const UPlots: React.FC<IProps> = ({ data }) => {
  if (!data.u1) return null;

  return (
    <>
      <Plot3d data={[data.u1]} title="U1" />
      <Plot3d data={[data.u1Real]} title="U1 Точное" />
      <Plot3d data={[data.diff1]} title="Абсолютная погрешность для U1" />
      <Plot3d data={[data.u2]} title="U2" />
      <Plot3d data={[data.u2Real]} title="U2 Точное" />
      <Plot3d data={[data.diff2]} title="Абсолютная погрешность для U2" />
    </>
  );
};

export default React.memo(UPlots);
