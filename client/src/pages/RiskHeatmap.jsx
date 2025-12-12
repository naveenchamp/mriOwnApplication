// client/src/pages/RiskHeatmap.jsx
import React, {useState} from "react";
import styled from "styled-components";
import { ResponsiveHeatMap } from "@nivo/heatmap";
// removed unused `api` import

const Page=styled.div`margin-left:260px;padding:40px;color:${({theme})=>theme.colors.text}`;
const Title=styled.h1`font-size:28px;`;

export default function RiskHeatmap(){
  // initialize mock data instead of setting state in an effect
  const [data] = useState([
    { project: "P1", Budget: 80, Timeline: 60, Quality: 30, Safety: 20 },
    { project: "P2", Budget: 40, Timeline: 90, Quality: 60, Safety: 10 },
    { project: "P3", Budget: 20, Timeline: 25, Quality: 70, Safety: 40 }
  ]);

  return (
    <Page>
      <Title>Risk Heatmap</Title>
      <div style={{height:420}}>
        <ResponsiveHeatMap
          data={data}
          keys={["Budget","Timeline","Quality","Safety"]}
          indexBy="project"
          margin={{ top: 60, right: 60, bottom: 60, left: 100 }}
          forceSquare={true}
          colors={{ scheme: "reds" }}
          emptyColor="#222"
          enableLabels={true}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.8]] }}
        />
      </div>
    </Page>
  );
}
  