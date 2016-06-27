// updateChart(){
//
//   let {arc, mainchart, colors, props} = this;
//
//   let dynamicColor;
//   const lineLength = Math.min(this.width/13,this.height/10);
//   const percentageSize = Math.max(this.width/30,14);
//   const boxHeight = this.width/10;
//   const boxWidth = boxHeight+percentageSize*3.5;
//   const total = props.data.reduce((t,it)=>t+it.value,0);
//
//   const getAngle = d=>d.startAngle+(d.endAngle-d.startAngle)/2+Math.PI/2;
//   const labelEnd = d=>[Math.cos(getAngle(d))*-lineLength,Math.sin(getAngle(d))*-lineLength];
//   const flip = d=>labelEnd(d)[0]<=0;
//
//   let pie = function(data){
//     let ordered = data.slice(0).sort((a,b)=>b.value-a.value);
//     let list = [];
//     let accu = 0;
//     for(let i=0;i < ordered.length;i++){ //orders them intercalating high and low value
//       let d = i%2==0?ordered[Math.floor(i/2)]:ordered[ordered.length-Math.floor(i/2)-1];
//       let extra = 2*Math.PI*(d.value/total);
//       list[i] = {data:d, startAngle: accu, endAngle:accu+extra, padAngle: 0, value: d.value};
//       accu = accu+extra;
//     }
//     return list;
//   };
//
//   let update_slice = mainchart.selectAll(".pieslice").data(pie(props.data));
//   let enter_slice = update_slice.enter().append("g").attr("class", "pieslice");
//   let exit_slice = update_slice.exit().remove();
//
//   /*slices*/
//
//   function mouseOverSlice(data,i) {
//     const slice = mainchart.selectAll('.slice')[0][i];
//     const box = mainchart.selectAll('.box')[0][i];
//     const line = mainchart.selectAll('.labelLine')[0][i];
//     dynamicColor = slice.style.fill;
//       d3.select(slice).classed("mouseover", true).style('fill',d3.rgb(dynamicColor).brighter(0.5));
//       d3.select(slice.parentNode).transition().duration(200).attr("transform", d=>{
//         const center = arc.centroid(d);
//
//         return "translate(" + (center[0]/10) + "," + (center[1]/10) + ")";
//       });
//       d3.select(box).selectAll('*').transition().duration(200).attr("transform", d=>{
//         const center = arc.centroid(d);
//         return "translate(" + (center[0]/5) + "," + (center[1]/5) + ")";
//       })
//       d3.select(line).transition().duration(200).attr("transform", d=>{
//         const center = arc.centroid(d);
//         return "translate(" + (center[0]/8) + "," + (center[1]/8) + ")";
//       })
//   }
//   function mouseOutSlice(data,i) {
//     const slice = mainchart.selectAll('.slice')[0][i];
//     const box = mainchart.selectAll('.box')[0][i];
//     const line = mainchart.selectAll('.labelLine')[0][i];
//       d3.select(slice).classed("mouseover", false).style('fill',dynamicColor);
//       d3.select(slice.parentNode).transition().duration(200).attr("transform", "translate(0,0)")
//       d3.select(box).selectAll('*').transition().duration(200).attr("transform", "translate(0,0)")
//       d3.select(line).transition().duration(200).attr("transform", "translate(0,0)")
//   }
//
//   enter_slice.append("path")
//   .attr("class", "slice")
//   .style("fill", (d, i)=>colors(i))
//   .on('mouseover', mouseOverSlice)
//   .on('mouseout', mouseOutSlice)
//   .style("cursor", "pointer")
//   .on('click', data=>{
//     const centroid = this.arc.centroid(data);
//     const rect = this.rect.node().getBoundingClientRect();
//     const rate = rect.height/this.height;
//     const pos = [rect.left+(this.width/2+centroid[0])*rate,rect.top+(this.height/2+centroid[1])*rate];
//     this.selectTooltip(pos,data.data);
//   })
//   .attr("d", arc)
//   .each(function(d) {this._current = d; }); // store the initial values
//
//   update_slice.select(".slice").transition().duration(500)
//   .attrTween('d', function(d) {
//     let intSA = d3.interpolate(this._current.startAngle, d.startAngle);
//     let intEA = d3.interpolate(this._current.endAngle, d.endAngle);
//      this._current = d;
//      return function(t) {
//          d.startAngle = intSA(t);
//          d.endAngle = intEA(t);
//        return arc(d);
//      }
//    });
//
//    /*labels*/
//
//    let update_label = mainchart.selectAll(".pielabel").data(pie(props.data));
//    let enter_label = update_label.enter().append("g").attr("class", "pielabel");
//    let exit_label = update_label.exit().remove();
//
//    enter_label.on('mouseover', mouseOverSlice).on('mouseout', mouseOutSlice);
//   enter_label.append('line').attr("class",'labelLine');
//   let box = enter_label.append('g').attr('class','box');
//   box.append('rect')
//   .attr("width", boxWidth)
//   .attr("height", boxHeight)
//   .attr("style", "fill:white;fill-opacity:0;stroke-width:0;stroke:rgb(0,0,255)");
//   box.append('text').attr('class','percentage')
//   .attr("y", (boxHeight+percentageSize)/2)
//   .attr("font-size", percentageSize);
//   box.append('image').attr('class','picture')
//   .attr("y", 0)
//   .attr("width", boxHeight)
//   .attr("height", boxHeight);
//
//    update_label.transition().duration(500)
//     .attr("transform", d=>{
//       const center = arc.centroid(d);
//       return "translate(" + (center[0]) + "," + (center[1]) + ")"
//     })
//
//    update_label.select('.labelLine').transition().duration(500)
//    .attr('x1',0).attr('y1',0)
//    .attr('x2',d=>labelEnd(d)[0]).attr('y2',d=>labelEnd(d)[1])
//    .attr("style", "stroke-width:1;stroke:rgb(0,0,0)");
//
//    update_label.select('.box').transition().duration(500)
//    .attr("transform", d=>{
//      const px = labelEnd(d)[0];
//      const py = labelEnd(d)[1];
//      const extrax = flip(d)?boxWidth:0;
//      const extray = py<=0?boxHeight/2:boxHeight/2;
//      return "translate(" + (px-extrax) + "," + (py-extray) + ")"
//    });
//
//    update_label.select('.percentage').transition().duration(500)
//    .attr("x",d=>flip(d)?(boxWidth-5):(5))
//    .attr("text-anchor", d=>flip(d)?'end':'start')
//    .text(function(d) {
//      return Math.round(d.value/total*1000)/10+"%";
//    });
//
//     update_label.select('.picture').transition().duration(500)
//     .attr("x",d=>flip(d)?(0):(boxWidth-boxHeight))
//     .attr("xlink:href", d=>d.data.img);
//
// }
