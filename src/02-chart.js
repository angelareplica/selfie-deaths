import * as d3 from 'd3'

let margin = { top: 50, left: 125, right: 20, bottom: 100 }

let height = 600 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
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
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5'
  ])

// the simulation is a collection of forces about where we want our circles to go
// and how we want our circles to interact
var simulation = d3
  .forceSimulation()
  .force('x', d3.forceX(width / 2).strength(0.05)) // play around with those numbers
  .force('y', d3.forceY(width / 2).strength(0.05))
  .force(
    'collide',
    d3.forceCollide(function(d) {
      return radiusScale(d.Casualties) + 1
      // add 1 to push the circles out apart a bit more
    })
  )

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
    .attr('opacity', 0.5)
    .on('mouseover', function(d) {
      // Make the circle black
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 1)
      // .attr('r', d => radiusScale(d.Casualties) * 1.2)
      d3.select('#description').text(d.Description)
      d3.select('#info').style('display', 'block')
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 0.5)
      // .attr('r', d => radiusScale(d.Casualties))

      d3.select('#info').style('display', 'none')
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
