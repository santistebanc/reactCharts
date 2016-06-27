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
  render () {

    const outrad = Math.min(this.state.dimensions.width/5,this.state.dimensions.height/3.5);
    const inrad = (outrad/4)*2;
    const piePosition = {x: Math.max(10+outrad,this.state.dimensions.width/2-70), y: this.state.dimensions.height/2};
    const legendPosition = {x: Math.min(piePosition.x+20+outrad,this.state.dimensions.width-110), y: this.state.dimensions.height/2-outrad};

    return <ChartFrame onChange={this.handleChangeChartFrame.bind(this)} initialDimensions={this.state.dimensions}>
              <Pie outerRadius={outrad} innerRadius={inrad} position={piePosition} data={this.props.data} dataKeys={this.props.dataKeys}/>
              <Legend position={legendPosition} data={this.props.data} dataKeys={this.props.dataKeys} />
           </ChartFrame>
  }
}

D3PieChart.defaultProps = {
  data: [],
  dataKeys: {xIndex:'name', yIndex:'value'}
};
