import * as d3 from 'd3'

let margin = { top: 50, left: 125, right: 20, bottom: 100 }

let height = 600 - margin.top - margin.bottom
let width = 900 - margin.left - margin.right

const svg = d3
  .select('#force-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radiusScale = d3
  .scaleSqrt()
  .domain([1, 100])
  .range([10, 80])

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
    '#845EC2',
    '#D65DB1',
    '#FF6F91',
    '#FF9671',
    '#FFC75F',
    '#F9F871',
    '#9BDE7E',
    '#4BBC8E'
  ])
var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

var forceXSeparate = d3
  .forceX(function(d) {
    if (d.Type === 'Fall') {
      return 100
    } else if (d.Type === 'Transport') {
      return 300
    } else if (d.Type === 'Drowned') {
      return 500
    } else if (d.Type === 'Electrocution') {
      return 700
    } else if (d.Type === 'Firearm') {
      return 100
    } else if (d.Type === 'Animal') {
      return 300
    } else if (d.Type === 'Other') {
      return 500
    } else if (d.Type === 'Fire') {
      return 700
    }
  })
  .strength(0.05)

var forceYSeparate = d3
  .forceY(function(d) {
    if (d.Type === 'Fall') {
      return 200
    } else if (d.Type === 'Transport') {
      return 200
    } else if (d.Type === 'Drowned') {
      return 200
    } else if (d.Type === 'Electrocution') {
      return 200
    } else if (d.Type === 'Firearm') {
      return 450
    } else if (d.Type === 'Animal') {
      return 450
    } else if (d.Type === 'Other') {
      return 450
    } else if (d.Type === 'Fire') {
      return 450
    }
  })
  .strength(0.08)

var forceXCombine = d3.forceX(width / 2).strength(0.05)
var forceYCombine = d3.forceY(height / 2).strength(0.05)

// the simulation is a collection of forces about where we want our circles to go
// and how we want our circles to interact
var simulation = d3
  .forceSimulation()
  .force('x', d3.forceX(width / 2).strength(0.05)) // play around with those numbers
  .force('y', d3.forceY(width / 2).strength(0.05))
  .force(
    'collide',
    // replacing the below function with a number will change the spacing between circles
    // we make it a function bc we wnat to make it different for every circle
    d3.forceCollide(function(d) {
      return radiusScale(d.Casualties) + 1
      // add 1 to push the circles out apart a bit more
    })
  )
  .force('charge', d3.forceManyBody().strength(-3))

d3.csv(require('./data/selfiedeaths.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))
function ready(datapoints) {
  var circles = svg
    .selectAll('.death')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'death')
    .attr('r', d => radiusScale(d.Casualties))
    .attr('fill', d => colorScale(d.Type))
    .attr('opacity', 0.7)
    .on('mousemove', function(d) {
      div
        .html(d.Description)
        .style('left', d3.event.pageX + 'px')
        // .style('right', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
        .style('display', 'block')
})
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 1)
      div
        .transition()
        .duration(200)
        .style('opacity', 1)
      div
        .html(d.Description)
        .style('left', d3.event.pageX + 'px')
        // .style('right', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 0.7)
      div
        .transition()
        .duration(500)
        .style('opacity', 0)
    })
  // .on('mouseover', function(d) {
  //   d3.select(this)
  //     .transition()
  //     .duration(100)
  //     .attr('opacity', 1)
  //   // .attr('r', d => radiusScale(d.Casualties) * 1.2)
  //   d3.select('#description').text(d.Description)
  //   d3.select('#info').style('display', 'block')
  // })
  // .on('mouseout', function(d) {
  //   d3.select(this)
  //     .transition()
  //     .duration(100)
  //     .attr('opacity', 0.5)
  //   // .attr('r', d => radiusScale(d.Casualties))

  //   d3.select('#info').style('display', 'none')
  // })

  d3.select('#start').on('stepin', () => {
    // console.log('something happened')
    // svg.selectAll('.label-industry').style('visibility', 'hidden')
    // svg.selectAll('.label-gender').style('visibility', 'hidden')
    // div.style('display', 'inline')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.01)
      .restart()
  })

  d3.select('#split-death-type').on('stepin', () => {
    // svg.selectAll('.label-industry').style('visibility', 'visible')
    // svg.selectAll('.label-gender').style('visibility', 'hidden')
    // div.style('opacity', 1)

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      .alphaTarget(0.7)
      .restart()
  })

  simulation.nodes(datapoints).on('tick', ticked)

  // creation a function called ticked
  // to grab the circles and automatically update their x and y based on datapoints
  function ticked() {
    circles
      .attr('cx', function(d) {
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      })
  }
}
