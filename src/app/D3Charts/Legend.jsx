import React from 'react';
import d3 from 'd3';

export default class Legend extends React.Component {
  render () {
    return (
      <g transform={"translate(" + this.props.position.x + "," + this.props.position.y + ")"}>
        <rect width="50" height="100" style={{fill:'lightblue', strokeWidth:3, stroke:'black'}}>
          <text>Legend Goes Here</text>
        </rect>
      </g>
    );
  }
}

Legend.defaultProps = {
  data: [],
  outerRadius: 100,
  innerRadius: 150,
  position: {x:0,y:0},
  colors: d3.scale.category10()
};
