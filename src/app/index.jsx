import React from 'react';
import ReactDOM from 'react-dom';
import TimeChart from './D3Charts/TimeChart.jsx';
import PieChart from './D3Charts/PieChart.jsx';

let donutdata = ()=>[{ name: "Germany", value: Math.round(Math.random() * 100), img: './img/tiger.jpg' },
  { name: "France", value: Math.round(Math.random() * 100), img: './img/tiger.jpg' },
  { name: "USA", value: Math.round(Math.random() * 100), img: './img/tiger.jpg' },
  { name: "Serbia", value: Math.round(Math.random() * 100), img: './img/tiger.jpg' },
  { name: "India", value: Math.round(Math.random() * 100), img: './img/tiger.jpg' },
  { name: "Mexico", value: Math.round(Math.random() * 100), img: './img/tiger.jpg' }];

class Index extends React.Component {
  render () {
    return <div style={{height: 800, margin:'0 auto'}}>

      <PieChart data={donutdata()} />

      </div>;
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
