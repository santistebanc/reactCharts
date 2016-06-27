import React from 'react';
import d3 from 'd3';
import ChartFrame from './ChartFrame.jsx'
import Pie from './Pie.jsx'
import Legend from './Legend.jsx'

//require('./Styles/PieChart.css');

export default class D3PieChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {dimensions: {width: 100, height: 100}}
  }
  handleChangeChartFrame(newDimensions){
    this.setState({dimensions: newDimensions});
  }
  curateData(data){
    const xIndex='name';
    const yIndex='value';

  }
  render () {

    const outrad = Math.min(this.state.dimensions.width/5,this.state.dimensions.height/3.5);
    const inrad = (outrad/4)*2;
    const piePosition = {x: this.state.dimensions.width/2-100, y: this.state.dimensions.height/2};
    const legendPosition = {x: this.state.dimensions.width/2+100, y: this.state.dimensions.height/2};

    return <ChartFrame onChange={this.handleChangeChartFrame.bind(this)} initialDimensions={this.state.dimensions}>
              <Pie outerRadius={outrad} innerRadius={inrad} position={piePosition} data={}/>
              <Legend position={legendPosition} />
           </ChartFrame>
  }
}

D3PieChart.defaultProps = {
  data: []
};
