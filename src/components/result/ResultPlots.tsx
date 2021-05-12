import TeX from '@matejmazur/react-katex';
import { Data } from 'plotly.js';
import React from 'react';
import Plot3d from '../Plot3d';

interface IProps {
  data: {
    u1: Data;
    u2: Data;
    rho1: Data;
    rho2: Data;
    u1Real?: Data;
    u2Real?: Data;
    rho1Real?: Data;
    rho2Real?: Data;
    u1Diff?: Data;
    u2Diff?: Data;
    rho1Diff?: Data;
    rho2Diff?: Data;
  };
}

const ResultPlots: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <Plot3d
        data={[data.u1]}
        title={
          <>
            Численное решение <TeX block math="u_1(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.u1Real]}
        title={
          <>
            Точное решение <TeX block math="u_1(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.u1Diff]}
        title={
          <>
            Погрешность <TeX block math="u_1(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.u2]}
        title={
          <>
            Численное решение <TeX block math="u_2(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.u2Real]}
        title={
          <>
            Точное решение <TeX block math="u_2(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.u2Diff]}
        title={
          <>
            Погрешность <TeX block math="u_2(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.rho1]}
        title={
          <>
            Численное решение <TeX block math="\rho_1(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.rho1Real]}
        title={
          <>
            Точное решение <TeX block math="\rho_1(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.rho1Diff]}
        title={
          <>
            Погрешность <TeX block math="\rho_1(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.rho2]}
        title={
          <>
            Численное решение <TeX block math="\rho_2(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.rho2Real]}
        title={
          <>
            Точное решение <TeX block math="\rho_2(x, t)" />
          </>
        }
      />
      <Plot3d
        data={[data.rho2Diff]}
        title={
          <>
            Погрешность <TeX block math="\rho_2(x, t)" />
          </>
        }
      />
    </>
  );
};

export default React.memo(ResultPlots);
