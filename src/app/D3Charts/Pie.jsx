import React from 'react';
import d3 from 'd3';

export default class Pie extends React.Component {
  render () {
    const arc = d3.svg.arc().innerRadius(this.props.innerRadius).outerRadius(this.props.outerRadius);
    const emptyDonutPath = arc.startAngle(0).endAngle(2*Math.PI);
    const total = data.reduce((sum,current)=>sum+current.value, 0);
    const values = data.map((slice)=>slice[this.props.yIndex])
    const slices = data.map((slice, index) => {
      const startAngle = 2*Math.PI*
      const endAngle = 2*Math.PI
          <PieSlice key={index}
                    name={slice[this.props.xIndex]}
                    value={slice[this.props.yIndex]}
                    color={colors(index)}
                    total={total}
                    arc={arc.startAngle(startAngle).endAngle(endAngle)} />
    });

    return <g transform={"translate(" + this.props.position.x + "," + this.props.position.y + ")"}>
            <path style={{fill:"#ccc"}} d={emptyDonutPath()} />
            {slices}
           </g>
  }
}

Pie.defaultProps = {
  data: [],
  outerRadius: 100,
  innerRadius: 150,
  position: {x:0,y:0},
  colors: d3.scale.category10()
};
