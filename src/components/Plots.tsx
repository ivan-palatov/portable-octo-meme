import { Data } from 'plotly.js';
import React from 'react';
import Plot3d from './Plot3d';

interface IProps {
  data: { u1: Data; u2: Data; rho1: Data; rho2: Data };
}

const Plots: React.FC<IProps> = ({ data }) => {
  if (!data.u1) return null;

  return (
    <>
      <Plot3d data={[data.u1]} title="U1" />
      <Plot3d data={[data.u2]} title="U2" />
      <Plot3d data={[data.rho1]} title="Rho1" />
      <Plot3d data={[data.rho2]} title="Rho2" />
    </>
  );
};

export default React.memo(Plots);
