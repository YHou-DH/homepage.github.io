window.progressBarAction = function(imgID){

    const r = 0.5;
    const height = 0.2*window.innerHeight/16;
    const width = d3.select(".progress-bar").node().getBoundingClientRect().width/16;
    const top = d3.select(".progress-bar").node().getBoundingClientRect().top/16;
    const left = (width - 1.6*r*93)*0.7;

    const circle_bar = d3.select('#circle-bar');
    circle_bar
        .transition()
        .duration(1400)
        .style('visibility', 'visible')
        .style('opacity', 1);

    const allnodes = d3.selectAll('.initCircles');
    allnodes.transition()
        .duration(1400)
        .attr("cx", function(d,i){ return i*r*1.6 + left + "em";})
        .attr("cy", function(d){return top + height + "em"; })
        .style('opacity', 0);

}
