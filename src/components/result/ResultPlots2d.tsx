import TeX from '@matejmazur/react-katex';
import { Data } from 'plotly.js';
import React from 'react';
import Plot2d from '../Plot2d';

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

const ResultPlots2d: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <Plot2d
        data={[data.u1]}
        zaxis="u1(x,t)"
        title={
          <>
            Численное решение <TeX block math="u_1(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.u1Real]}
        zaxis="u1(x,t)"
        title={
          <>
            Точное решение <TeX block math="u_1(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.u1Diff]}
        zaxis="z"
        title={
          <>
            Погрешность <TeX block math="u_1(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.u2]}
        zaxis="u2(x,t)"
        title={
          <>
            Численное решение <TeX block math="u_2(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.u2Real]}
        zaxis="u2(x,t)"
        title={
          <>
            Точное решение <TeX block math="u_2(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.u2Diff]}
        zaxis="z"
        title={
          <>
            Погрешность <TeX block math="u_2(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.rho1]}
        zaxis="P1(x,t)"
        title={
          <>
            Численное решение <TeX block math="\rho_1(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.rho1Real]}
        zaxis="P1(x,t)"
        title={
          <>
            Точное решение <TeX block math="\rho_1(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.rho1Diff]}
        zaxis="z"
        title={
          <>
            Погрешность <TeX block math="\rho_1(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.rho2]}
        zaxis="P2(x,t)"
        title={
          <>
            Численное решение <TeX block math="\rho_2(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.rho2Real]}
        zaxis="P2(x,t)"
        title={
          <>
            Точное решение <TeX block math="\rho_2(x, t)" />
          </>
        }
      />
      <Plot2d
        data={[data.rho2Diff]}
        zaxis="z"
        title={
          <>
            Погрешность <TeX block math="\rho_2(x, t)" />
          </>
        }
      />
    </>
  );
};

export default React.memo(ResultPlots2d);
