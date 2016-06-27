import React from 'react';
import d3 from 'd3';

export default class PieSlice extends React.Component {
  componentDidMount() {
      console.log('Slice Mounted');
      this.setData();
  }
  componentDidUpdate() {
      console.log('Slice Updated');
      this.setData();
  }
  setData () {
        d3.select(this.refs.slice)
            .datum(this.props.pieData);

        d3.select(this.refs.path)
            .transition().duration(500)
            .attrTween('d', () => {
                var d = this.props.pieData;
                var i = d3.interpolate(d.startAngle, d.endAngle);
                return (t) => {
                    d.endAngle = i(t);
                    return this.props.arc(d);
                }
            });

        d3.select(this.refs.text)
            .attr('transform', () => {
                var d = this.props.pieData;
                return "translate(" + this.props.arc.centroid(d) + ")";
            });
    }
    onMouseOver() {

        d3.select(this.refs.slice)
            .transition()
            .duration(500)
            .ease('bounce')
            .attr('transform', (d) => {
                var dist = 10;
                d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                var x = Math.sin(d.midAngle) * dist;
                var y = (-Math.cos(d.midAngle) * dist);
                return 'translate(' + x + ',' + y + ')';
            });

        d3.select(this.refs.hoverText)
            .style('opacity', 1);
    }

    onMouseOut() {
        d3.select(this.refs.slice)
            .transition()
            .duration(500)
            .ease('bounce')
            .attr('transform', "translate(0,0)");

        d3.select(this.refs.hoverText)
            .style('opacity', 0);
    }
  render () {
    return <g ref="slice" onMouseOut={this.onMouseOut.bind(this)} onMouseOver={this.onMouseOver.bind(this)}>
      <path ref="path" d="" fill={this.props.color}></path>
        <text ref="text" fill="white" textAnchor="middle" dy=".35em">{this.props.value}</text>
        <text ref="hoverText" style={{"opacity": "0"}} fill={this.props.color} textAnchor="middle">
            <tspan x="0" dy="1em">
                {this.props.name}
            </tspan>
            <tspan x="0" dy="1em">
                { ((this.props.value / this.props.total) * 100).toFixed(1) + " %"}
            </tspan>
        </text>
    </g>
  }
}

PieSlice.defaultProps = {
  name: "",
  value: 0,
  total: 1,
  color: "red"
};
