import React from 'react';
import d3 from 'd3';

export default class PieSlice extends React.Component {
  render () {
    return <g transform={"translate(" + this.props.position.x + "," + this.props.position.y + ")"}>
<path d=""
           </g>
  }
}

PieSlice.defaultProps = {
  data: [],
  position: {x:0,y:0}
};
