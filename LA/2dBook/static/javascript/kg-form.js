var margin = {top: 5.5, right: 3, bottom: 4, left: 3},
    width = (window.innerWidth - margin.left - margin.right)/16,
    height = (window.innerHeight - margin.top - margin.bottom)/16;

var svg = d3.select("#page1")
    .append("svg")
    .attr("id", "arc_diagram")
    .attr("viewBox", [0, 0, 16*(width + margin.left + margin.right), 16*(height + margin.top + margin.bottom)])
    .attr("width", width + "em")
    .attr("height", height + "em")
    .append("g")
    .attr("transform",`translate(${margin.left*16},${margin.top*16})`);

var isNodeClicked = false;

Promise.all([
    d3.json('static/data/tordfs_allforms_vsSecondarylink.json')
]).then(function(files) {
    data = files[0];

    var sorted_nodes = data.nodes
        .slice()
        .sort(function(a, b) {
            if (a.properties.rdfs__label < b.properties.rdfs__label) return -1;
            if (a.properties.rdfs__label > b.properties.rdfs__label) return 1;
            return 0;
        })

    var allRdfsLabels = sorted_nodes.map(function(d){return d.properties.rdfs__label})
    var x = d3.scalePoint()
        .range([0, width])
        .domain(allRdfsLabels)

    data.links.sort(function(a, b) {
        if (a.type === 'share_tech' && b.type !== 'share_tech') return -1;
        if (a.type !== 'share_tech' && b.type === 'share_tech') return 1;
        return 0;
    });

    var links = svg
        .selectAll('mylinks-primary')
        .data(data.links)
        .enter()
        .append('path')
        .attr('d', function (d) {
            start = x(d.properties.source_rdfs_label)*16    // X position of start node on the X axis
            end = x(d.properties.target_rdfs_label)*16      // X position of end node
            return ['M', start, 16*(height)-40,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', 16*(height)-40] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .attr('id', function(d, i) {
            return 'link' + i;
        })
        .style("fill", "none")
        .attr("stroke", function(d) {
            if (d.type === 'similar_form_to') {
                return '#4c5b6c';
            } else if (d.type === 'share_tech') {
                return '#667579';
            }
        })
        .style("stroke-width", function(d) {
            if (d.type === 'similar_form_to') {
                return "0.2em";
            } else if (d.type === 'share_tech') {
                return "0.11em";
            }
        })
        .style("stroke-opacity", function(d) {
            if (d.type === 'similar_form_to') {
                return 1;
            } else if (d.type === 'share_tech') {
                return 0.2;
            }
        });

    var nodes = svg
        .selectAll("mynodes")
        .data(sorted_nodes)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.properties.rdfs__label) + "em")})
        .attr("cy", height-1.875+"em")
        .attr("r", function(d){
            return getNodeSize(d.properties.linkCount);
        })
        .style("fill", function(d){ return '#e5dbcc'})//#F2E0C8 #F3E5DC #cec7b9
        .attr("stroke", "white")
        .attr("class", 'initCircles')
        .attr('cursor', 'pointer');

    var labels = svg
        .selectAll("mylabels")
        .data(sorted_nodes)
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text(function(d){ return(d.properties.ontoMA_name_zh)} )
        .style("text-anchor", "end")
        .attr("transform",d=>`translate(${x(d.properties.rdfs__label)*16},${height*16-5}) rotate(-45)`)
        .style("font-size", '0.5em');

    nodes
    .on('mouseover', function (event, d) {
        nodes
            .style('opacity', .2)
        d3.select(this)
            .style('opacity', 1)
        nodes.filter(function(node_d) {
            return data.links.some(function(link_d) {
                return link_d.properties.source_rdfs_label === d.properties.rdfs__label && link_d.properties.target_rdfs_label === node_d.properties.rdfs__label;
            });
        }).style('opacity', 1);
        links
            .attr('stroke', function (link_d) {
                if (link_d.properties.source_rdfs_label === d.properties.rdfs__label || link_d.properties.target_rdfs_label === d.properties.rdfs__label) {
                     return '#717b7f'
                } else {
                    return '#d0cdc9'
                }
            })
            .style('stroke-opacity', function (link_d) {
                if ((link_d.type === 'similar_form_to') && (link_d.properties.source_rdfs_label === d.properties.rdfs__label || link_d.properties.target_rdfs_label === d.properties.rdfs__label)) {
                    return 1
                } else if ((link_d.type === 'share_tech') && (link_d.properties.source_rdfs_label === d.properties.rdfs__label || link_d.properties.target_rdfs_label === d.properties.rdfs__label)) {
                    return 0.5
                } else {
                    return 0.1
                }
            })
            .style('stroke-width', function (link_d) {
                if ((link_d.type === 'similar_form_to') && (link_d.properties.source_rdfs_label === d.properties.rdfs__label || link_d.properties.target_rdfs_label === d.properties.rdfs__label)) {
                    return "0.625em"
                } else if ((link_d.type === 'share_tech') && (link_d.properties.source_rdfs_label === d.properties.rdfs__label || link_d.properties.target_rdfs_label === d.properties.rdfs__label)) {
                    return "0.2em"
                }
            })
            .filter(function(link_d) {
                return link_d.properties.source_rdfs_label === d.properties.rdfs__label || link_d.properties.target_rdfs_label === d.properties.rdfs__label;
            })
            .raise();
        labels
            .style("font-size", function(label_d) {
                if (label_d.properties.rdfs__label === d.properties.rdfs__label) {
                    return '0.75em';
                } else if (data.links.some(function(link_d) {
                    return link_d.properties.source_rdfs_label === d.properties.rdfs__label && link_d.properties.target_rdfs_label === label_d.properties.rdfs__label;
                })) {
                    return '0.75em';
                } else {
                    return '0.124em';
                }
            })
            .style("text-shadow", function(label_d) {
                return label_d.properties.rdfs__label === d.properties.rdfs__label ? "0.125em 0.125em 0.25em #000000" : "none"; //#2c3e50
            })
            .attr("y", 0)
        d3.select('#nodeLabel')
            .html('<span class="zh">' + d.properties.ontoMA_name_zh + '</span><br><span class="en">' + d.properties.name_en + '</span>')
            .style('display', 'block');
    })
    .on('mouseout', function (d) {
        nodes.style('opacity', 1)
        links
            .attr("stroke", function(d) {
                if (d.type === 'similar_form_to') {
                    return '#4c5b6c';
                } else if (d.type === 'share_tech') {
                    return '#667579';
                }
            })
            .style("stroke-width", function(d) {
                if (d.type === 'similar_form_to') {
                    return '0.1875em';
                } else if (d.type === 'share_tech') {
                    return "0.0625em";
                }
            })
            .style("stroke-opacity", function(d) {
                if (d.type === 'similar_form_to') {
                    return 1;
                } else if (d.type === 'share_tech') {
                    return 0.3;
                }
            })
            .lower();
        labels
            .style("font-size", "0.5em")
            .style("text-shadow", "none")
        d3.select('#nodeLabel')
            .style('display', 'none');
    })
    .on('click', function(event, d) {
        if (isNodeClicked) return;
        isNodeClicked = true;

        // add zoom-in transition effect here or on page2
        svg.append("circle")
            .attr("id", "nodeIn")
            .attr("cx", x(d.properties.rdfs__label)+"em")
            .attr("cy", height-1.875+"em")
            .attr("r", "0.75em")
            .style("fill", "#f3e5dc")
            .transition()
            .duration(600)
            .attr("r", width + "em")
            .attr("cx", width/2 + "em")
            .attr("cy", height/2 + "em")
            .style("fill", "#e5dbcc");

        setTimeout(function(){
            d3.select("#nodeIn")
            .transition()
            .duration(1200)
            .style("opacity", 0);
        }, 1400);

        $(".header_rec").addClass('fadeout');
        $(".legend_rec").addClass('fadeout');
        $(".footer_rec").addClass('fadeout');
        setTimeout(function(){
            $("#page1").css("display", "none");
            $(".header_rec").removeClass('fadeout');
            $(".legend_rec").removeClass('fadeout');
            $(".footer_rec").removeClass('fadeout');
        }, 1000);

        setTimeout(function(){
            var page2 = document.getElementById('page2');
            page2.style.visibility = 'visible';
            page2.style.opacity = 1;
        }, 1200);

        loadAndProcessData(function() {
            const nodeInPage2 = d3.select('#page2').select('#circle-bar')
                .selectAll('circle').filter(function(c) { return c.properties.rdfs__label === d.properties.rdfs__label; });
            nodeInPage2.dispatch('click');
        });
    });

    var backButton = d3.select(".door-icon")

    backButton.on("click", function() {
        isNodeClicked = false;
        d3.selectAll('#nodeIn').remove()
        d3.select(".kg-viz-svg").remove();
        d3.select(".info-box").style("display", "none");
        d3.selectAll(".reco-label").remove();
        d3.selectAll(".source-label").remove();
        d3.select('#circle-bar').selectAll('circle')
            .attr('r',"0.5em")
            .style('filter', '')
            .style('opacity', 0.4)
            .classed('selected-node', false)
            .classed('reco-nodes', false);
        d3.selectAll('.click-img').remove();
        d3.selectAll('.reco-link').remove();
        window.activeNode = null;
        document.getElementById('myVideo').pause();
        $("#page1").css("display", "block");

        nodes.transition()
            .duration(2000)
            .attr("cx", function(d){ return(x(d.properties.rdfs__label)+ "em")})
            .attr("cy", height-1.875+"em")
            .attr("r", function(d){
                return getNodeSize(d.properties.linkCount);
            })
          .style("opacity", 1);
        document.getElementById('page2').style.visibility = 'hidden';
        document.getElementById('page2').style.opacity = 0;
    });
}).catch(function(error) {
    console.error("Error loading the JSON files", error);
});

// Define the node size scale
function getNodeSize(numLinks) {
    if (numLinks === 0) return "0.375em"; // smallest nodes for just one link
    else if (numLinks === 1) return "0.5625em";
    else if (numLinks <= 20) return "0.75em"; // small nodes for 1-20 links
    else if (numLinks <= 40) return "0.9375em"; // medium nodes for 21-40 links
    else if (numLinks <= 60) return "1.0625em"; // large nodes for 41-60 links
    else if (numLinks <= 80) return "1.1875em"; // larger nodes for 61-80 links
    else return "1.3125em"; // largest nodes for more than 80 links
}