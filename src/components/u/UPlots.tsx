import { Data } from 'plotly.js';
import React from 'react';
import Plot3d from '../Plot3d';

interface IProps {
  data: {
    u: Data;
    uReal: Data;
    diff: Data;
  };
}

const UPlots: React.FC<IProps> = ({ data }) => {
  if (!data.u) return null;

  return (
    <>
      <Plot3d data={[data.u]} title="Численное решение U" />
      <Plot3d data={[data.uReal]} title="Точное решение U" />
      <Plot3d data={[data.diff]} title="Абсолютная погрешность" />
    </>
  );
};

export default React.memo(UPlots);
