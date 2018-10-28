import * as d3 from 'd3'

let margin = { top: 50, left: 125, right: 20, bottom: 100 }

let height = 600 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var xPositionScale = d3
  .scaleLinear()
  .domain([0, 50])
  .range([0, width])

var yPositionScale = d3
  .scaleBand()
  .range([height, 0])
  .padding(0.25)

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

d3.csv(require('./data/selfiedeaths.csv')).then(ready)
.catch(err => console.log('Failed on', err))
function ready(datapoints) {

var types = datapoints.map(d => d.Type)
yPositionScale.domain(types)

let datapoints2011 = datapoints.filter(d => d.Year === '2011')
var nested2011 = d3
  .nest()
  .key(d => d.Type)
  .entries(datapoints2011)

let datapoints2013 = datapoints.filter(d => d.Year === '2013')
var nested2013 = d3
  .nest()
  .key(d => d.Type)
  .entries(datapoints2013)

let datapoints2014 = datapoints.filter(d => d.Year === '2014')
var nested2014 = d3
  .nest()
  .key(d => d.Type)
  .entries(datapoints2014)

let datapoints2015 = datapoints.filter(d => d.Year === '2015')
var nested2015 = d3
  .nest()
  .key(d => d.Type)
  .entries(datapoints2015)

let datapoints2016 = datapoints.filter(d => d.Year === '2016')
var nested2016 = d3
    .nest()
    .key(d => d.Type)
    .entries(datapoints2016)

let datapoints2017 = datapoints.filter(d => d.Year === '2017')
var nested2017 = d3
    .nest()
    .key(d => d.Type)
    .entries(datapoints2017)

let datapoints2018 = datapoints.filter(d => d.Year === '2018')
var nested2018 = d3
    .nest()
    .key(d => d.Type)
    .entries(datapoints2018)


svg
  .selectAll('.death-type')
  .data(nested2016)
  .enter()
  .append('rect')
  .attr('class', 'death-type')
  .attr('y', d => yPositionScale(d.key))
  .attr('x', 0)
  .attr('height', yPositionScale.bandwidth())
  .attr('width', 0)
  // .attr('width', d => {
  //   var casualties2016 = d.values.map(function(d) {
  //     return d.Casualties
  //   })
  //   let sumCasualties2016 = d3.sum(casualties2016)
  //   // console.log(sumCasualties2016)
  //   return xPositionScale(sumCasualties2016)
  // })
  .attr('fill', d => colorScale(d.key))
  .attr('opacity', 0.5)

var yAxis = d3
  .axisLeft(yPositionScale)
  .tickSize(0)
  .tickFormat(d => d)

svg
  .append('g')
  .attr('class', 'axis y-axis')
  .call(yAxis)

svg
  .selectAll('.y-axis text')
  .attr('fill', '#999999')
  .attr('dx', -10)

  var xAxis = d3
    .axisTop(xPositionScale)
    .tickValues([10, 20, 30, 40])
    .tickFormat(d => d)
    .tickSize(-height)

svg
  .append('g')
  .attr('class', 'axis x-axis')
  .call(xAxis)
  .lower()

svg.selectAll('.axis line').attr('stroke', '#ccc')
svg.selectAll('.axis path').attr('stroke', 'none')

svg.selectAll('.axis text').attr('font-size', 15)
svg.selectAll('.x-axis text').attr('fill', '#999999')

// SCROLLYTELLING! steps

d3.select('#blank').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .attr('width', 0)
})

d3.select('#eleven').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2011)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('width', d => {
    var casualties2011 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2011 = d3.sum(casualties2011)
    console.log('sum casualties 2011', sumCasualties2011)
    return xPositionScale(sumCasualties2011)
  })
    .attr('fill', d => colorScale(d.key))
})

d3.select('#thirteen').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2013)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('height', yPositionScale.bandwidth())
  .attr('width', d => {
    var casualties2013 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2013 = d3.sum(casualties2013)
    console.log('sum casualties 2013', sumCasualties2013)
    return xPositionScale(sumCasualties2013)
  })
  .attr('fill', d => colorScale(d.key))
})

d3.select('#fourteen').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2014)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('width', d => {
    var casualties2014 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2014 = d3.sum(casualties2014)
    return xPositionScale(sumCasualties2014)
  })
  .attr('fill', d => colorScale(d.key))
})

d3.select('#fifteen').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2015)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('width', d => {
    var casualties2015 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2015 = d3.sum(casualties2015)
    return xPositionScale(sumCasualties2015)
  })
  .attr('fill', d => colorScale(d.key))
})

d3.select('#sixteen').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2016)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('width', d => {
    var casualties2016 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2016 = d3.sum(casualties2016)
    return xPositionScale(sumCasualties2016)
  })
  .attr('fill', d => colorScale(d.key))
})

d3.select('#seventeen').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2017)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('width', d => {
    var casualties2017 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2017 = d3.sum(casualties2017)
    return xPositionScale(sumCasualties2017)
  })
  .attr('fill', d => colorScale(d.key))
})

d3.select('#eighteen').on('stepin', () => {
  svg
  .selectAll('.death-type')
  .data(nested2018)
  .transition()
  .attr('y', d => yPositionScale(d.key))
  .attr('width', d => {
    var casualties2018 = d.values.map(function(d) {
      return d.Casualties
    })
    let sumCasualties2018 = d3.sum(casualties2018)
    // console.log('sum casualties 2018', sumCasualties2018)
    return xPositionScale(sumCasualties2018)
  })
  .attr('fill', d => colorScale(d.key))
})

}
