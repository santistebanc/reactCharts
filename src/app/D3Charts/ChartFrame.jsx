import React from 'react';
import d3 from 'd3';

export default class ChartFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {width: this.props.initialDimensions.width, height: this.props.initialDimensions.height}
  }
  componentDidMount() {
    const br = this.refs.wrapper.getBoundingClientRect();
    const newDimensions = {width: br.width, height: br.height};
    this.props.onChange(newDimensions); //inform that the dimensions have changed
    this.setState(newDimensions); //will rerender second time so the chart expands to container dimensions
  }
  render () {

    return (
      <div ref="wrapper" style={{width: '100%', height: '100%'}}>
        <svg className={'svgframe'} width={'100%'} height={'100%'}>
          <rect width={this.state.width} height={this.state.height} style={{fill:'none', strokeWidth:1, stroke:'grey'}}/>
          {this.props.children}
        </svg>
      </div>
    );
  }
}
ChartFrame.defaultProps = {
  onChange:()=>{/*does nothing*/},
  width: 100,
  height: 100
};
