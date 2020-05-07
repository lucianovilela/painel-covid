import React, { useEffect, useState }from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';



export default function Chart({data, chave}) {
  const theme = useTheme();

  return (
     
    <React.Fragment>
      <Title>Caso de { chave } COVID-19 Hoje</Title>
      <ResponsiveContainer>
        <BarChart
          data={data?.sort((a,b)=>a[chave]-b[chave])}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="state" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              {chave} 
            </Label>
          </YAxis>
          <Bar type="fill" dataKey={chave} stroke={theme.palette.primary.main} dot={false} />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
