window.recomd = function(recoInfo, recoLinks) {

    const circleBar = d3.select('#circle-bar');
    const circles = circleBar.selectAll('circle');
    const width = circleBar.node().getBoundingClientRect().width;
    const height = circleBar.node().getBoundingClientRect().height;

    circleBar.selectAll(".reco-label").remove();
    circleBar.selectAll(".source-label").remove();
    circles.classed('reco-nodes', false);
    circleBar.selectAll(".reco-link").remove();
    circles.style('filter', '').classed('reco-nodes', false);

    const circleSource = circles.filter(d => d.id === recoInfo.label);
    const fontSize = 16;
    const baseX = parseFloat(circleSource.attr("cx")) * fontSize - 20;
    const baseY = parseFloat(circleSource.attr("cy")) * fontSize + parseFloat(circleSource.attr("r"))*fontSize+ 35;
    circleSource.each(function(d){
        circleBar.append("text")
                .attr("class", "source-label")
                .attr("x", baseX)
                .attr("y", baseY)
                .attr("text-anchor", "middle")
                .text(d.properties.ontoMA_name_zh)
                .attr('font-size', '0.675em')
                .style('pointer-events', 'none')
                .attr("transform", `rotate(-45, ${baseX}, ${baseY})`);
    });

    if (!recoInfo.recomd || recoInfo.recomd.length === 0) return;

    recoInfo.recomd.forEach(rcd => {
        const circle = circles.filter(d => d.id === rcd.recomd_label);
        circle.style('opacity', 1).style('filter', 'url(#glow)').classed('reco-nodes', true);

        circle.each(function(d, i) {
            const circleSelection = d3.select(this);
            const fontSize = 16;
            const baseX = parseFloat(circleSelection.attr("cx")) * fontSize - 20;
            const baseY = parseFloat(circleSelection.attr("cy")) * fontSize + parseFloat(circleSelection.attr("r"))*fontSize + 35;
            circleBar.append("text")
                .attr("class", "reco-label")
                .attr("x", baseX)
                .attr("y", baseY)
                .attr("text-anchor", "middle")
                .text(d.properties.ontoMA_name_zh)
                .attr('font-size', '0.675em')
                .style('pointer-events', 'none')
                .attr("transform", `rotate(-45, ${baseX}, ${baseY})`);
        });
    });


    const circlePositions = new Map();

    const linkColors = {
        similar_move: "#D9B18F",
        share_tech: "#595856",
        share_principle: "#A6A6A6"
    };

    circles
        .each(function(d) {
            const circle = d3.select(this);
            circlePositions.set(d.id, {
                x: parseFloat(circle.attr('cx'))*16,
                y: parseFloat(circle.attr('cy'))*16
            });
        });

    circleBar.selectAll('link')
        .data(recoLinks)
        .enter()
        .append('path')
        .attr('class', 'reco-link')
        .attr('d', d => {
            const startX = circlePositions.get(d.start).x;
            const endX = circlePositions.get(d.end).x;
            const posY = circlePositions.get(d.end).y;
            const rx = Math.abs(endX - startX) / 2;
            const ry = (height/4 > rx) ? 0.4*rx : height/4;
            const sweepFlag = (startX - endX < 0) ? 1 : 0;
            const largeArcFlag = 0;
            return [
                'M', startX, posY,
                'A',
                rx, ry,
                0,
                largeArcFlag, sweepFlag,
                endX, posY
            ].join(' ');
        })
        .attr('fill', 'none')
        .attr('stroke', d => linkColors[d.type] || '#999')
        .attr('stroke-width', '0.15em');
}
