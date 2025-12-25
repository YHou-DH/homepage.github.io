// d3draw-kg.js
window.draw = function(data) {
    const width = d3.select("#kg-viz").node().getBoundingClientRect().width;
    const height = d3.select("#kg-viz").node().getBoundingClientRect().height;
    const types = Array.from(new Set(data.map(d => d.type)));
    //console.log(types);
    const nodes = Array.from(new Set(data.flatMap(l => [l.source_zh, l.target_zh])), id => {
        let nodeData = data.find(d => d.source_zh === id || d.target_zh === id);

        let isSource = nodeData.source_zh === id;

        return {
            id,
            name_zh: isSource ? nodeData.source_zh : nodeData.target_zh,
            name_en: isSource ? nodeData.source_en : nodeData.target_en,
            rdfs_label: isSource ? nodeData.source_rdfs_label : nodeData.target_rdfs_label,
            labels: isSource ? nodeData.source_labels : nodeData.target_labels
        };
    });
    const links = data.map(d => ({
        source: d.source_zh,  // 现在source是节点id
        target: d.target_zh,  // 现在target是节点id
        type: d.type
    }));
    // const color4link = ['#404556', '#60515c', '#777076', '#006466','#386775', '#20504e', '#20504e', '#193d31'];
    // const color4link = ['#123456', '#323973', '#7d7066', '#cec7b9','#d1bd8f']

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.length || 120))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.select("#kg-viz")
        .append("svg")
        .attr("class", "kg-viz-svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const svgGroup = svg.append("g");

    const zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on('zoom', (event) => {
            svgGroup.attr('transform', event.transform);
            svg.attr("viewBox", [-width / 2 / event.transform.k, -height / 2 / event.transform.k, width / event.transform.k, height / event.transform.k]);
        });

    svg.call(zoom);

    svg.append("defs")
        .append("clipPath")
        .attr("id", "svg-clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    svgGroup.attr("clip-path", "url(#svg-clip)");

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 11)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", d => getLinkColor(d))
        .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => getLinkColor(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const posi = 0.55;
    const linkText = svg.append("g")
        .attr("class", "link-text")
        .selectAll("text")
        .data(links)
        .join("text")
        .style("dominant-baseline", "left")
        .attr("x", d => (d.source.x + d.target.x)*posi)
        .attr("y", d => (d.source.y + d.target.y)*posi)
        .style("pointer-events", "none")
        .text(d => d.type)
        .style('font-size', '1em');

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", '0.1em')
        //.attr("r", "0.45em")
        .attr("r", d => {
            if (d.labels=="MA_form")
                return "0.75em"
            else
                return "0.45em"
            })
        .attr("fill", d => getColorByLabel(d.labels));

    node.append("text")
        .attr("x", "0.55em")
        .attr("y", "0.31em")
        .attr("font-size", '1em')
        //.text(d => d.id)
        .text(d => {
            if (data[0].source_zh!=d.id)
                return d.id
            else
                return ""
            })
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", "0.3em");

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        linkText
        .attr("x", d => {
            const path = linkArc(d);
            const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
            curve.setAttribute("d", path);
            const point = curve.getPointAtLength(curve.getTotalLength() * 0.6 );
            return point.x;
        })
        .attr("y", d => {
            const path = linkArc(d);
            const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
            curve.setAttribute("d", path);
            const point = curve.getPointAtLength(curve.getTotalLength() * 0.6 );
            return point.y;
        })
        .attr("dx", d => -d.type.length * 3);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });


    // components and interactions

    const tooltip_node = d3.select("#tooltip_node")
        .style('width', '13.5em')
        .style('height', '6.25em')
        .style('padding', '0.2em')
        .style('box-sizing', 'border-box');

    function onMouseOver(event, d) {

        tooltip_node.html("Name_ZH: " + d.name_zh + "<br/>" + "Name_EN: " + d.name_en)
            .transition()
            .duration(200)
            .style("opacity", 0.9)
    }

    function onMouseOut() {
        tooltip_node
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    node.on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut);

    const infoBox = d3.select("#info-box");
    const closeBtn = d3.select("#close-btn");
    const infoContent = d3.select("#info-content");
    let selectedNode = null;

    node.on("dblclick", function(event, d) {
        event.stopPropagation();
        selectedNode = d3.select(this);
        selectedNode.on("mouseover", null);
        node.classed("selected", false);
        d3.select(this)
            .classed("selected", true)
            .on("mouseover", null);


        var labelClasses = getLabelClass(d.labels);
        var strokeClass = getStrokeClass(d.labels);

        infoContent.html(
            '<div class="theme"><span class="title-inb">GUNG GEE FOK FU KUEN</span></div>' +
            '<div class="info-group"><span class="title-inb">NAME_ZH:</span> <span class="content">' + d.name_zh + '</span></div>' +
            '<div class="info-group"><span class="title-inb">NAME_EN:</span> <span class="content">' + d.name_en + '</span></div>' +
            '<div class="info-group"><span class="title-inb">RDFS_LABEL:</span> <span class="content">' + d.rdfs_label + '</span></div>' +
            '<div class="info-group"><span class="title-inb">LABEL:</span> <span class="content ' + labelClasses + ' ' + strokeClass + '">' + d.labels + '</span></div>'
        );

        const mouseX = event.clientX/16;
        const mouseY = event.clientY/16;

        infoBox.style("display", "block");
        const infoBoxWidth = infoBox.node().getBoundingClientRect().width/16;
        const infoBoxHeight = infoBox.node().getBoundingClientRect().height/16;

        const infoBoxX = mouseX - infoBoxWidth;
        const infoBoxY = mouseY - infoBoxHeight;

        infoBox.style("left", infoBoxX + "em")
              .style("top", infoBoxY + "em");

        infoBox.call(drag_infobox);
    });

    closeBtn.on("click", function() {
      infoBox.style("display", "none");
      if (selectedNode) {
        selectedNode.on("mouseover", onMouseOver);
      }
      selectedNode.classed("selected", false);
      selectedNode = null;
    });

    // node.on("contextmenu", function(event, d) {
    //         event.preventDefault();
    //         if (d.labels === "MA_form" && data[0].source_zh !== d.id) {
    //             const extendGroup = svg.append("g");
    //
    //             extendGroup.append("rect")
    //                 .attr("x", d.x)
    //                 .attr("y", d.y)
    //                 .attr("width", '4em')
    //                 .attr("height", '1.8em')
    //                 .attr("fill", "white")
    //                 .attr("stroke", "grey");
    //
    //             extendGroup.append("text")
    //                 .attr("x", d.x/16 + 2 + 'em')
    //                 .attr("y", d.y/16 + 0.9 + 'em')
    //                 .attr("text-anchor", "middle")
    //                 .attr("dominant-baseline", "middle")
    //                 .text("Extend");
    //
    //             extendGroup.on('click', function(event, d) {
    //                 // // get data from local files
    //                 // d3.json('static/data/all_forms_data/' + d.properties.rdfs__label + '.json')
    //                 //     .then(function (result) {
    //                 //         window.draw2(result.data);
    //                 //     })
    //                 //     .catch(function (error) {
    //                 //         console.error('Error:', error);
    //                 //     });
    //             });
    //
    //             svg.on("click", function() {
    //                 // const outside = d3.select(event.target).datum() !== d;
    //                 // if (outside) {
    //                 //     extendGroup.remove();
    //                 // }
    //                 extendGroup.remove();
    //             });
    //
    //             event.stopPropagation();
    //         }
    //     });

    return Object.assign(svg.node(), {scales: {color4link}});
}

function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `
}

drag = simulation => {

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

const groupColors = {
    "group-1": "#412524",
    "group-2": "#883a19",
    "group-3": "#be5f1b",
    "group-4": "#df8b46",
    "group-5": "#c7a46a",
    "group-6": "#cabcab"
};

function getLabelClass(label) {
    var baseClass = " label-content";
    switch (label) {
        case 'claw_tech':
        case 'fist_tech':
        case 'palm_tech':
        case 'elbow_tech':
        case 'hand_shape':
        case 'handwork':
        case 'stance':
        case 'leg_tech':
        case 'footwork':
        case 'bodywork':
        case 'body_bridge':
        case 'combo_tech':
            return 'group-1' + baseClass;
        case 'fighting_strategy':
        case 'symbolic_animal':
            return 'group-2' + baseClass;
        case 'MA_form':
            return 'group-3' + baseClass;
        case 'MA_tactic':
            return 'group-4' + baseClass;
        case 'Form_set':
        case 'MA_style':
        case 'MA_system':
        case 'MA_principle':
            return 'group-5' + baseClass;
        default:
            return 'group-6' + baseClass;
    }}

function getColorByLabel(label) {
    switch (label) {
        case 'claw_tech':
        case 'fist_tech':
        case 'palm_tech':
        case 'elbow_tech':
        case 'hand_shape':
        case 'handwork':
        case 'stance':
        case 'leg_tech':
        case 'footwork':
        case 'bodywork':
        case 'body_bridge':
        case 'combo_tech':
            return groupColors['group-1'];
        case 'fighting_strategy':
        case 'symbolic_animal':
            return groupColors['group-2'];
        case 'MA_form':
            return groupColors['group-3'];
        case 'MA_tactic':
            return groupColors['group-4'];
        case 'Form_set':
        case 'MA_style':
        case 'MA_system':
        case 'MA_principle':
            return groupColors['group-5'];
        default:
            return groupColors['group-6'];
    }
}

function getStrokeClass(label) {
    switch (label) {
        case 'claw_tech':
        case 'fist_tech':
        case 'palm_tech':
        case 'elbow_tech':
        case 'hand_shape':
        case 'handwork':
            return "subgroup-1";
        case 'stance':
        case 'leg_tech':
        case 'footwork':
            return "subgroup-2";
        case 'bodywork':
        case 'body_bridge':
            return "subgroup-3";
        case 'combo_tech':
            return "subgroup-4";
        default:
            return 'other-group';
    }
}

var drag_infobox = d3.drag()
    .on("start", function (event) {
        var current = d3.select(this);
        current.attr('z-index', 1001);
        offsetX = event.x/16 - parseFloat(current.style("left"));
        offsetY = event.y/16 - parseFloat(current.style("top"));
    })
    .on("drag", function (event) {
        d3.select(this)
          .style("left", (event.x/16 - offsetX) + "em")
          .style("top", (event.y/16 - offsetY) + "em");
    });

const color4link = {
    'contains': '#90ab9b',
    'similar_form_to': '#be6731',
    'represents':'#213e5a',
    'has_intent': '#e1d5b9',
    'employs':'#7b7872'}

function getLinkColor(type) {
    switch (type) {
        case 'contains':
            return color4link['contains'];
        case 'similar_form_to':
            return color4link['similar_form_to'];
        case 'represents':
            return color4link['represents'];
        case 'has_intent':
            return color4link['has_intent'];
        case 'employs':
            return color4link['employs'];
    }
}