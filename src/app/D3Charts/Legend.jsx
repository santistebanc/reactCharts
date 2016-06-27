import React from 'react';
import d3 from 'd3';

export default class Legend extends React.Component {
  render () {
    return (
      <g transform={"translate(" + this.props.position.x + "," + this.props.position.y + ")"}>
        <rect width={this.props.width} height={this.props.height} style={{fill:'lightblue', strokeWidth:1, stroke:'black'}} />
        <text>
          <tspan x="0" dy="1em">Legend Here</tspan>
        </text>
      </g>
    );
  }
}

Legend.defaultProps = {
  data: [],
  outerRadius: 100,
  innerRadius: 150,
  position: {x:0,y:0},
  height: 200,
  width: 100,
  colors: d3.scale.category10()
};
