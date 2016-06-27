import React from 'react';
import d3 from 'd3';

require('./Styles/TimeChart.css');

export default class D3TimeChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {range:'week', displace:0, tooltipPos: [0,0], tooltipVisible: false};
    this.format = d3.time.format("%Y-%m-%d");
    this.xdomain = d3.extent(props.data, d=>d.date);
    this.width = 500;
    this.height = 800;
    this.margin = {top: 10, right: 10, bottom: 30, left:30}
    this.colors = d3.scale.category10();
  }
  componentDidMount() {
    this.createChart(this.props);
  }
  changeRange(event){
    this.setState({displace: 0});
    this.setState({range: event.target.value});
    this.deselectTooltip();
  }
  clickLeft(){
    this.setState({displace: this.state.displace-1});
    this.deselectTooltip();
  }
  clickRight(){
    this.setState({displace: this.state.displace+1});
    this.deselectTooltip();
  }
  render () {
    //this is just run once when mounting for first time
    return (
      <div ref="wrapper" style={{width: '100%', height: '100%'}}>
        <div className={'fo'}>
          <div className="navbuttons">
            <button className="buttonLeft" onClick={this.clickLeft.bind(this)}>{'<'}</button>
            <button className="buttonRight" onClick={this.clickRight.bind(this)}>{'>'}</button>
          </div>
          <h3 className="title">{'Date'}</h3>
          <select className="rangeSelector" onChange={this.changeRange.bind(this)} value={this.state.range}>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="3months">3 Months</option>
          <option value="30days">30 days</option>
          </select>
        </div>

        // <D3Chart>
        //   <D3DataSeries/>
        //   <Line/>
        //   <XAxis/>
        //   <YAxis/>
        // </D3Chart>

        <svg ref="svg"/>
          <Tooltip visible={this.state.tooltipVisible} position={this.state.tooltipPos} content={this.state.tooltip} onClose={this.deselectTooltip.bind(this)}/>
      </div>
    );
  }
  componentDidUpdate(){
    if(this.preventupdate){
      this.preventupdate = false;
    }else{
      this.updateChart();
    }
  }
  createChart(props){ //run once after mounting

    this.place = d3.select(this.refs.wrapper).attr("class", "timelinechart");
    this.dimensions = this.place.node().getBoundingClientRect();
    this.width = this.dimensions.width;
    this.height = this.dimensions.height;
    this.margin.top = this.place.select('.fo').node().getBoundingClientRect().height+10;


    this.svgframe = this.place.select('svg').attr("class", "frame")
    .attr("width", '100%')
    .attr("height", '100%')
    //.attr('preserveAspectRatio','xMinYMin')
    const clippathname = "clippath"+(this.svgframe.node().getBoundingClientRect().left).toString()+(this.svgframe.node().getBoundingClientRect().top).toString()+Math.random();
    this.clippath = this.svgframe.append("clipPath").attr("id", clippathname).append("rect")
    .attr("x", this.margin.left-1)
    .attr("y", this.margin.top-1)
    .attr("width", this.width-this.margin.right-this.margin.left+2)
    .attr("height", this.height-this.margin.bottom-this.margin.top+2);
    this.backlines = this.svgframe.append("g").attr('class','backlines').attr('transform',"translate(" + (0) + "," + (this.height-this.margin.bottom) + ")");
    this.backbars = this.svgframe.append("g").attr('class','backbars').attr('transform',"translate(" + (0) + "," + (0) + ")");
    this.bottomAxis = this.svgframe.append("g").attr('class','bottomAxis').attr('transform',"translate(" + (0) + "," + (this.height-this.margin.bottom) + ")");
    this.sideAxis = this.svgframe.append("g").attr('class','sideAxis').attr('transform',"translate(" + (this.margin.left) + "," + (0) + ")");
    this.graph = this.svgframe.append("g").attr('class','graph');
    this.graphpath = this.graph.append("path").attr("clip-path", "url(#"+clippathname+")");
    this.points = this.svgframe.append("g").attr('class','points');
    this.frontbars = this.svgframe.append("g").attr('class','frontbars').attr('transform',"translate(" + (0) + "," + (0) + ")");

    this.rect = this.svgframe.append("rect")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("style", "fill:none;stroke-width:0")

    const therect = this.rect.node().getBoundingClientRect();
    this.ratio = therect.height/this.height;

    this.graphpath.style("stroke-width", 2/this.ratio);

    this.updateChart();

  }
  updateChart(){

    let {props, margin, width, height} = this;

    this.unitused = d3.time.day;
    const thisyear = d3.time.year(new Date());
    const thismonth = d3.time.month(new Date());
    const thisweek = d3.time.week(new Date());
    const thisday = d3.time.day(new Date());

    switch(this.state.range){
      case 'year':
      this.xdomain = [d3.time.year.offset(thisyear,1*this.state.displace),d3.time.year.offset(thisyear,1+1*this.state.displace)];
      this.place.select('.title').text(d3.time.format("%Y")(d3.time.year.offset(thisyear,1*this.state.displace)));
      break;
      case 'month':
      this.xdomain = [d3.time.month.offset(thismonth,1*this.state.displace),d3.time.month.offset(thismonth,1+1*this.state.displace)];
      this.place.select('.title').text(d3.time.format("%B %Y")(d3.time.month.offset(thismonth,1*this.state.displace)));
      break;
      case 'week':
      this.xdomain = [d3.time.week.offset(thisweek,1*this.state.displace),d3.time.week.offset(thisweek,1+1*this.state.displace)];
      this.place.select('.title').text(d3.time.format("%d %b %Y")(d3.time.week.offset(thisweek,1*this.state.displace))+" - "+d3.time.format("%d %b %Y")(d3.time.day.offset(d3.time.week.offset(thisweek,1+1*this.state.displace),-1)));
      break;
      case '3months':
      this.xdomain = [d3.time.month.offset(thismonth,-3-3*-this.state.displace),d3.time.month.offset(thismonth,-3*-this.state.displace)];
      this.place.select('.title').text(d3.time.format("%B %Y")(d3.time.month.offset(thismonth,-3-3*-this.state.displace))+" - "+d3.time.format("%B %Y")(d3.time.month.offset(thismonth,-1-3*-this.state.displace)));
      break;
      case '30days':
      this.xdomain = [d3.time.day.offset(thisday,-30-30*-this.state.displace),d3.time.day.offset(thisday,-30*-this.state.displace)];
      this.place.select('.title').text(d3.time.format("%d %b %Y")(d3.time.day.offset(thisday,-30-30*-this.state.displace))+" - "+d3.time.format("%d %b %Y")(d3.time.day.offset(thisday,-1-30*-this.state.displace)));
      break;
    }

      this.svgframe.select('.title').style("font-size", (12/this.ratio)+'px');

    this.fixeddata = [];

    const middle = (d)=>(new Date(this.unitused(d.date).getTime()+(this.unitused.offset(this.unitused(d.date),1)-this.unitused(d.date))/2));

    props.data.forEach((d,i)=>{
      if(this.fixeddata.length>0 && this.unitused(d.date).getTime() == this.unitused(this.fixeddata[this.fixeddata.length-1].date).getTime()){
        this.fixeddata[this.fixeddata.length-1].value += d.value;
      }else{
          this.fixeddata.push({date: d.date, datemiddle: middle(d), dateleft: this.unitused(d.date), dateright: this.unitused.offset(this.unitused(d.date),1), value: d.value});
      }
    });
    this.filtered = this.fixeddata.filter(d=>{return d.date>=this.xdomain[0] && d.date<=this.xdomain[1]});

    if(this.filtered.length <= 0){
      let copy = props.data.map(d=>{
        d.datemiddle = middle(d);
        d.dateleft = this.unitused(d.date);
        d.dateright = this.unitused.offset(this.unitused(d.date),1);
        return d;
      });
      this.filtered = copy;
    }

    this.ydomain = [0, d3.max(this.filtered, d=>d.value)];
    this.xscale = d3.time.scale().domain(this.xdomain).range([margin.left, width - margin.right]);
    this.yscale = d3.scale.linear().domain(this.ydomain).range([height - margin.bottom, margin.top]).nice();

    this.updateBottomAxis();
    this.updateSideAxis();
    this.updateBacklines();
    this.updateBackbars();
    this.updateFrontbars();
    this.updateGraph();
  }
  updateGraph(){
    let {props, xscale, yscale, graph, graphpath, format, margin, height, width} = this;

    this.updatePoint = this.points.selectAll('.point').data(this.filtered);
    this.enterPoint = this.updatePoint.enter().append('g')
    .attr('transform',d=>'translate(' + xscale(d.datemiddle) + ',' + yscale(d.value) +')')
    .attr('class','point');
    this.exitPoint = this.updatePoint.exit().remove();

    this.enterPoint.append('rect')
    .attr('x',-8/this.ratio/2)
    .attr('y',-8/this.ratio/2)
    .attr('width',8/this.ratio)
    .attr('height',8/this.ratio)
    const self = this;
    this.updatePoint.transition().duration(500).attr('transform',d=>'translate(' + xscale(d.datemiddle) + ',' + yscale(d.value) +')')

    const line = d3.svg.line().x(d=>xscale(d.datemiddle)).y(d=>yscale(d.value));
    graphpath.datum(this.fixeddata).transition().duration(500)
    .attr("class", "graphline").attr("d", line);
  }
  updateSideAxis(){
    let {props, sideAxis, yscale} = this;

    const yAxis = d3.svg.axis().scale(yscale).orient('left').tickSize(5).tickSubdivide(0).ticks(Math.floor(this.height/30)).outerTickSize(0);

    sideAxis.call(yAxis);
    sideAxis.selectAll('text').style("font-size", (12/this.ratio)+'px');

  }
  updateBackbars(){
    let {backbars, xscale, height, width, margin} = this;

    this.updateBar = backbars.selectAll('.bar').data(this.filtered);
    this.enterBar = this.updateBar.enter().append('rect').attr('y',d=>margin.top).attr('height',d=>height-margin.top-margin.bottom).attr('class','bar');
    this.exitBar = this.updateBar.exit().remove();

    this.updateBar.transition().duration(500)
     .attr('x',d=>xscale(d.dateleft))
     .attr('width',d=>(xscale(d.dateright)-xscale(d.dateleft)));

  }
  selectTooltip(){
    this.preventupdate = true;
    const point = this.points.selectAll('.point')[0][this.selectedBar];
    let rect = point.getBoundingClientRect();
    this.setState({tooltipVisible: true,
      tooltipPos: [rect.left+rect.width/2, rect.top+rect.height/2],
      tooltip: this.props.tooltip && this.props.tooltip(point.__data__)
    });
  }
  deselectTooltip(){
    this.setState({tooltipVisible: false});
    d3.select(this.points.selectAll('.point')[0][this.selectedBar]).classed('over', false);
    this.selectedBar = undefined;
  }
  updateFrontbars(){

    let {backbars, frontbars, xscale, height, width, margin, graph} = this;

    this.updateFrontBar = frontbars.selectAll('.frontbar').data(this.filtered);
    this.enterFrontBar = this.updateFrontBar.enter().append('rect').attr('y',d=>margin.top).attr('height',d=>height-margin.top-margin.bottom).attr('class','frontbar')
    .on("mouseover", (a,b)=>{
      d3.select(this.backbars.selectAll('.bar')[0][b]).classed('over', true);
      d3.select(this.points.selectAll('.point')[0][b]).classed('over', true);
    }).on("mouseleave", (a,b)=>{
      d3.select(this.backbars.selectAll('.bar')[0][b]).classed('over', false);
      if(this.selectedBar !== b){
        d3.select(this.points.selectAll('.point')[0][b]).classed('over', false);
      }
    })
    .style("cursor", "pointer")
    .on("click", (a,b)=>{
      this.selectedBar = b;
      this.points.selectAll('.point').classed('over', false);
      d3.select(this.points.selectAll('.point')[0][b]).classed('over', true);
      this.selectTooltip();
    });

    this.exitFrontBar = this.updateFrontBar.exit().remove();

    this.updateFrontBar.transition().duration(500)

     .attr('x',d=>xscale(d.dateleft))
     .attr('width',d=>(xscale(d.dateright)-xscale(d.dateleft)));
  }
  updateBacklines(){
    let {backlines, xscale, height, width, margin} = this;

    let xAxis = d3.svg.axis().scale(xscale).orient('top').tickSize(height-margin.bottom-margin.top).outerTickSize(0);
    switch(this.state.range){
      case 'year':
      xAxis.ticks(d3.time.months, 1).tickFormat(d=>'');
      break;
      case 'month':
      xAxis.ticks(d3.time.days, 1).tickFormat(d=>'');
      break;
      case 'week':
      xAxis.ticks(d3.time.days, 1).tickFormat(d=>'');
      break;
      case '3months':
      xAxis.ticks(d3.time.months, 1).tickFormat(d=>'');
      break;
      case '30days':
      xAxis.ticks(d3.time.days, 1).tickFormat(d=>'');
      break;
      default:
      xAxis.ticks(d3.time.months, 1).tickFormat(d=>'');
      this.xdomain = d3.extent(props.data, d=>d.date);
    }
    backlines.call(xAxis);
  }
  updateBottomAxis(){
    let {props, bottomAxis, xscale} = this;

    const xAxis = d3.svg.axis().scale(xscale).orient('bottom').tickSize(5);
    let factor = 1;

    switch(this.state.range){
      case 'year':
      factor = Math.max(Math.floor(600/this.width),1);
      xAxis.ticks(d3.time.months, factor).tickFormat(d3.time.format('%b'));
      break;
      case 'month':
      factor = Math.max(Math.floor(1000/this.width),1);
      xAxis.ticks(d3.time.days, factor).tickFormat(d3.time.format('%d'));
      break;
      case 'week':
      xAxis.ticks(d3.time.days, 1).tickFormat(d3.time.format('%d'));
      break;
      case '3months':
      factor = Math.max(Math.floor(400/this.width),1);
      const form = Math.floor(600/this.width)<=1?d3.time.format('%B  %Y'):d3.time.format('%b  %Y');
      xAxis.ticks(d3.time.months, factor).tickFormat(form);
      break;
      case '30days':
      factor = Math.max(Math.floor(1000/this.width),1);
      xAxis.ticks(d3.time.days, factor).tickFormat(d3.time.format('%d'));
      break;
      default:
      xAxis.ticks(d3.time.months, 1).tickFormat(d3.time.format('%B'));
      this.xdomain = d3.extent(props.data, d=>d.date);
    }

    bottomAxis.call(xAxis);
    bottomAxis.selectAll('text').style("font-size", (12/this.ratio)+'px');
    const len = this.bottomAxis.selectAll('.tick')[0].length;
    const sizeband = (this.bottomAxis.selectAll('line')[0][1].getBoundingClientRect().left-this.bottomAxis.selectAll('line')[0][0].getBoundingClientRect().left)/factor;
    this.bottomAxis.selectAll('.tick').each(function(d,i){ if(i==len-1) this.remove()})
    .select('text').attr('transform',"translate("+ (sizeband/2) +",0)");

  }
}

D3TimeChart.defaultProps = {
  data: []
};
