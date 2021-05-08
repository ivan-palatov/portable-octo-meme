import TeX from '@matejmazur/react-katex';
import { Data } from 'plotly.js';
import React from 'react';
import Plot3d from '../Plot3d';

interface IProps {
  data: { u1: Data; u2: Data; rho1: Data; rho2: Data };
}

const ResultPlots: React.FC<IProps> = ({ data }) => {
  if (!data.u1) return null;

  return (
    <>
      <Plot3d data={[data.u1]} title={<TeX block math="u_1(x, t)" />} />
      <Plot3d data={[data.u2]} title={<TeX block math="u_2(x, t)" />} />
      <Plot3d data={[data.rho1]} title={<TeX block math="\rho_1(x, t)" />} />
      <Plot3d data={[data.rho2]} title={<TeX block math="\rho_2(x, t)" />} />
    </>
  );
};

export default React.memo(ResultPlots);
