// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const numbers = [];
for (var i = 1; i <= 93; i++) {
   numbers.push(i);
}
let rdfs_label_list = [];
for (const i of numbers) {
    if (i < 10) {
        rdfs_label_list.push('taming_tiger_0' + i);
    } else {
        rdfs_label_list.push('taming_tiger_' + i);
    }
}

var activeNode = null;
function loadAndProcessData(callback) {
    d3.json("static/data/reco_links.json").then(function(data) {
        processData(data);

        if (callback && typeof callback === "function") {
            callback();
        }
    });
}


function processData(data) {

    const sorted_nodes = data.nodes
        .slice()
        .sort(function (a, b) {
            if (a.properties.rdfs__label < b.properties.rdfs__label) return -1;
            if (a.properties.rdfs__label > b.properties.rdfs__label) return 1;
            return 0;
        });
    sorted_nodes.forEach(node => {
        node.imgSrc = "/static/img/svg/" + node.properties.rdfs__label + ".svg";
    });

    const progress_bar = d3.select(".progress-bar");


    const screenWidth = window.innerWidth;
    let r;
    if (screenWidth >=1500) {
        r = 0.5;
    } else if (screenWidth < 1500 && screenWidth > 1200) {
        r = 0.4;
    } else {
        r = 0.4;
    }
    const width = progress_bar.node().getBoundingClientRect().width/16;
    const height = progress_bar.node().getBoundingClientRect().height/16;
    const left = (width - 1.4*r*sorted_nodes.length)*0.6;
    const left2 = left < 0 ? left : (-1)*left;
    const circle_bar = d3.select('#circle-bar')

    const circles = circle_bar.selectAll('circle')
        .data(sorted_nodes)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => i*r*1.4 + left +"em")
        .attr('cy', height*0.7+"em")
        .attr('r', r + "em")
        .style('fill', function(d){ return "#e5dbcc"}) //#F3E5DC
        .attr("stroke", "white")
        .attr("stroke-width", '0.15em')
        .attr('id', function(d) {return d.properties.rdfs__label});

    const circlePositions = new Map();

    circle_bar.selectAll('circle')
        .each(function(d) {
            const circle = d3.select(this);
            circlePositions.set(d.properties.rdfs__label, {
                x: circle.attr('cx'),
                y: circle.attr('cy')
            });
        });

    // let currentImage = null;
    // let activeNode = null;
    circles
        .on('mouseover', function (event, d) {
            if (activeNode === null) {
                circles.style('opacity', .4);
                d3.select(this)
                    .style('opacity', 1)
                d3.selectAll('.mouseover-img').remove();

                const wd = 16;
                const ht = 8.75;
                const c_x = parseFloat(d3.select(this).attr('cx')) - wd / 2;
                const c_y = parseFloat(d3.select(this).attr('cy')) - ht;
                const img = d3.select('.progress-bar').append('img')
                    .attr('src', d.imgSrc)
                    .style('position', 'absolute')
                    .style('width', wd + 'em')
                    .style('height', ht + 'em')
                    .style('left', c_x + 'em')
                    .style('top', c_y + 'em')
                    .style('pointer-events', 'none')  // 添加这一行来防止图片影响鼠标事件
                    .classed('dynamic-img mouseover-img', true);
                d.mouseoverImgElement = img;

                // get data from neo4j database
                // fetch('/second-page?node_rdfs_label=' + d.properties.rdfs__label)
                //     .then(response => response.json())
                //     .then(result => {
                //         window.recomd(result.recoInfo, result.recoLinks);
                //     })
                //     .catch(error => console.error('Error:', error));

                // get data from local files
                d3.json('static/data/all_forms_data/' + d.properties.rdfs__label + '.json')
                    .then(function (result) {
                        window.recomd(result.recoInfo, result.recoLinks);
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
            }
        })
        .on('mouseout', function (event, d) {
            if (activeNode === null) {
                circles.style('filter', '').classed('reco-nodes', false);
                circle_bar.selectAll(".reco-link").remove();
                circle_bar.selectAll(".reco-label").remove();
                circle_bar.selectAll(".source-label").remove();
                circles.style('opacity', 1)
                if (d.mouseoverImgElement) {
                    d.mouseoverImgElement.remove();
                    d.mouseoverImgElement = null;
                }
            }
        })
        .on('click', function(event, d) {
            if (activeNode !== null && !d3.select(this).classed('reco-nodes') && !d3.select(this).classed('selected-node')) {
                return;
            }

            if (activeNode === d || (autoNode && autoNode.data()[0].properties.rdfs__label === d.properties.rdfs__label)) {

                if (d.imgElement) {
                    d.imgElement.remove();
                    d.imgElement = null;
                }
                d3.selectAll('.dynamic-img ').remove();
                circles.style('filter', '').classed('reco-nodes', false);
                circle_bar.selectAll(".reco-link").remove();
                circles.style('opacity', 1);
                document.getElementById('myVideo').pause();

                activeNode = null;
                autoNode = null;
            } else if (activeNode === null || d3.select(this).classed('reco-nodes')) {
                if (rdfs_label_list.includes(d.properties.rdfs__label)) {
                    d3.selectAll('.dynamic-img').remove();
                    d3.select(".kg-viz-svg").remove();
                    d3.select(".info-box").style("display", "none");
                    circles.classed('selected-node', false).style('opacity', 0.4)
                        .transition()
                        .duration(300)
                        .ease(d3.easeSinOut)
                        .attr('r', r+"em");

                    d3.select(this).classed('selected-node', true).style('opacity', 1)
                        .transition()
                        .duration(300)
                        .ease(d3.easeSinOut);

                    const wd = 16;
                    const ht = 8.75;
                    const c_x = parseFloat(d3.select(this).attr('cx')) - wd / 2;
                    const c_y = parseFloat(d3.select(this).attr('cy')) - ht;
                    const img = d3.select('.progress-bar').append('img')
                        .attr('src', d.imgSrc)
                        .style('position', 'absolute')
                        .style('width', wd + 'em')
                        .style('height', ht + 'em')
                        .style('left', c_x + 'em')
                        .style('top', c_y + 'em')
                        .style('pointer-events', 'none')  // 添加这一行来防止图片影响鼠标事件
                        .classed('dynamic-img click-img', true);

                    d.imgElement = img;
                // currentImage = img;

                // get data from neo4j database
                // fetch('/second-page?node_rdfs_label=' + d.properties.rdfs__label)
                //     .then(response => response.json())
                //     .then(result => {
                //         window.displayNodeProperties(result.node_properties);
                //         window.draw(result.data);
                //         window.playVideoSegment(result.videoInfo, true);
                //         window.recomd(result.recoInfo, result.recoLinks);
                //     })
                //     .catch(error => console.error('Error:', error));

                // get data from local files
                    d3.json('static/data/all_forms_data/' + d.properties.rdfs__label + '.json')
                        .then(function (result) {
                            window.displayNodeProperties(result.node_properties);
                            window.draw(result.data);
                            window.playVideoSegment(result.videoInfo, true);
                            window.recomd(result.recoInfo, result.recoLinks);
                        })
                        .catch(function (error) {
                            console.error('Error:', error);
                        });

                    activeNode = d;
                }
            }
        })
}

window.loadAndProcessData = loadAndProcessData;
