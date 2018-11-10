var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')
var rows = require('./data.json')

const fields = Object.keys(rows[0]);
console.log(fields);

module.exports = createReactClass({
  getInitialState: function() {
    const dims = fields.map((r) => {
      return { 
        title:r.toUpperCase(), 
        value: r }
    });
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
      }]
    };
  },
  render () {
    return (<div>Report
      <ReactPivot rows={rows}
      dimensions={this.state.dims}
      reduce = { this.reduce}
      calculations={this.state.calculations}
      nPaginateRows={25} 
      activeDimensions={['DATE']}/></div>)
  },
  reduce (row, memo) {
    memo.earlyLoads = memo.earlyLoads || {};
    memo.loadDisplays = memo.loadDisplays || {};
    memo.loads = (memo.loads || 0) + (memo.earlyLoads[row.loadId] ? 0:1);
    memo.earlyLoads[row.loadId] = true;
    if (row.type === 'display') {
      memo.displays = (memo.displays || 0) + (!memo.loadDisplays[row.loadId] ? 1:0);
      memo.loadDisplays[row.loadId] = true;
    }
    
    memo.impressions = (memo.impressions || 0) + (row.type === 'impression' ? 1:0)

    return memo;
  }
})
