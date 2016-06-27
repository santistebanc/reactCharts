import React from 'react';
import d3 from 'd3';
import PieSlice from './PieSlice.jsx'

export default class Pie extends React.Component {
  render () {
    const arc = d3.svg.arc().innerRadius(this.props.innerRadius).outerRadius(this.props.outerRadius);
    const pieData = d3.layout.pie();
    let values = []
    let total = 0;

    this.props.data.forEach((item, index) => {
            const value = Math.abs(item[this.props.dataKeys.yIndex]);
            total += value;
            values.push(value);
    });
    const pieDataValues = pieData(values);
    const slices = this.props.data.map((slice, index) =>
          <PieSlice key={index}
                    name={slice[this.props.dataKeys.xIndex]}
                    value={slice[this.props.dataKeys.yIndex]}
                    color={this.props.colors(index)}
                    total={total}
                    pieData={pieDataValues[index]}
                    arc={arc} />
    );

    return <g transform={"translate(" + this.props.position.x + "," + this.props.position.y + ")"}>
              {slices}
           </g>
  }
}

Pie.defaultProps = {
  data: [],
  dataKeys: {},
  outerRadius: 100, //these are arbitrary values, only in case it is not specified in the component
  innerRadius: 150, //...
  position: {x:0,y:0},
  colors: d3.scale.category10()
};
