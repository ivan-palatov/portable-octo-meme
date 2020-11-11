import { Data } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';

interface IProps {
  title?: string;
  data: Data[];
}

const Plot3d: React.FC<IProps> = ({ data, title }) => {
  return (
    <Plot
      data={data}
      layout={{
        scene: { yaxis: { title: 't' }, zaxis: { title: 'p' } },
        autosize: true,
        title,
      }}
    />
  );
};

export default React.memo(Plot3d);
