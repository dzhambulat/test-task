var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')
var rows = require('./data.json')

module.exports = createReactClass({
  getInitialState: function() {
    const fields = Object.keys(rows[0]);
    console.log(fields);
    const dims = fields.map((r)=>{return {title:r.toUpperCase(), value: r}});
    console.log(dims);
    return {
      dims: dims,
      calculations:[ {
        title: 'Loads', value: 'loads',
        template: function(val, row) {
          return val.toFixed(0);
        }
      },
      {
        title: 'Displays', value: 'displays',
        template: function(val, row) {
          return val.toFixed(0);
        }
      },
      {
        title: 'Impressions', value: 'impressions',
        template: function(val, row) {
          return val.toFixed(0);
        }
      },
      {
        title: 'Load Rate', value: 'impressions',
        template: function(val, row) {
          return (row.loads / row.impressions * 100).toFixed(1) + ' %';
        }
      },
      {
        title: 'Display Rate', value: 'impressions',
        template: function(val, row) {
          return (row.displays / row.loads * 100).toFixed(1) + ' %';
        }
      }],
      reduce: this.reduceScope()
      };
  },
  reduceScope () {
    let loads = {};
    return (row, memo)=>{
      if(!memo.loadss) {
        memo.loadss = {};
      }
      memo.loads = (memo.loads || 0) + (memo.loadss[row.loadId] ? 0:1);
      memo.displays = (memo.displays || 0) + (row.type === 'display' ? 1:0);
      memo.impressions = (memo.impressions || 0) + (row.type === 'impression' ? 1:0)
      memo.loadss[row.loadId] = true;
      return memo;
    }
  },
  render () {
    return (<div>Report
      <ReactPivot rows={rows}
      dimensions={this.state.dims}
      reduce = { this.state.reduce}
      calculations={this.state.calculations}
      nPaginateRows={25} 
      activeDimensions={['DATE']}/></div>)
  }
})
