const video = document.getElementById('myVideo');
let isPlayingWholeVideo = false;
let currentVideoIndex = 0;
let videoList = [];
let isPlayingSequence = false;
let autoNode = null;

const playButton = d3.select('.play-button')
    .on('click', function () {
        if (isPlayingWholeVideo) {
            video.pause();
            videoList = [];
            currentVideoIndex = 0;
            isPlayingSequence = false;
            this.innerHTML = 'Auto Play';
            video.setAttribute('controls', '');
            d3.select('.progress-bar').classed('freeze', false);
        } else {
            video.removeAttribute('controls');
            this.innerHTML = 'Stop &#129784';//Exit Play //&#129784;
            d3.select('.progress-bar').classed('freeze', true);

            const label = d3.select('.selected-node').data()[0].properties.rdfs__label;
            const labelNumber = label.substring(label.length - 2);
            currentVideoIndex = parseInt(labelNumber, 10);

            createVideoList(currentVideoIndex);
            isPlayingSequence = true;
            playVideoSequence();
        }
        isPlayingWholeVideo = !isPlayingWholeVideo;
});

function createVideoList(startIndex) {
    videoList = [];
    for (let i = startIndex; i <= 93; i++) {
        if (i < 10) {
            videoList.push('taming_tiger_0' + i);
        } else {
            videoList.push('taming_tiger_' + i);
        }
    }
}

async function playVideoSequence() {
    if (!isPlayingSequence) return;

    for (let i = 0; i < videoList.length; i++) {
        const videoName = videoList[i];
        try {
            const response = await fetch('static/data/time_id_mapping.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const timeIdMapping = await response.json();
            const videoInfo = timeIdMapping[videoName];

            // get data from neo4j database
            //  fetch('/second-page?node_rdfs_label=' + videoName)
            //     .then(response => response.json())
            //     .then(result => {
            //         d3.select('#page2').select('#circle-bar').selectAll('circle').classed("selected-node", false).style('opacity', 0.4);
            //         d3.selectAll('.dynamic-img').remove();
            //         d3.select(".kg-viz-svg").remove();
            //         d3.select(".info-box").style("display", "none");
            //
            //         window.displayNodeProperties(result.node_properties);
            //         window.draw(result.data);
            //         window.recomd(result.recoInfo, result.recoLinks);
            //
            //          autoNode = d3.select('#page2').select('#circle-bar')
            //             .selectAll('circle').filter(function(c) { return c.properties.rdfs__label === videoName; });
            //          autoNode.classed("selected-node", true).style('opacity', 1);
            //
            //         const wd = 16;
            //         const ht = 8.75;
            //         const c_x = parseFloat(autoNode.attr('cx')) - wd / 2;
            //         const c_y = parseFloat(autoNode.attr('cy')) - ht;
            //         const img = d3.select('.progress-bar').append('img')
            //             .attr('src', 'static/img/svg/' + videoName + '.svg')
            //             .style('position', 'absolute')
            //             .style('width', wd + 'em')
            //             .style('height', ht + 'em')
            //             .style('left', c_x + 'em')
            //             .style('top', c_y + 'em')
            //             .style('pointer-events', 'none')
            //             .classed('dynamic-img auto-img', true);
            //
            //     })
            //     .catch(error => console.error('Error:', error));

            // get data from local files
            d3.json('static/data/all_forms_data/' + videoName + '.json')
                .then(function (result) {
                    d3.select('#page2').select('#circle-bar').selectAll('circle').classed("selected-node", false).style('opacity', 0.4);
                    d3.selectAll('.dynamic-img').remove();
                    d3.select(".kg-viz-svg").remove();
                    d3.select(".info-box").style("display", "none");

                    window.displayNodeProperties(result.node_properties);
                    window.draw(result.data);
                    window.recomd(result.recoInfo, result.recoLinks);

                    autoNode = d3.select('#page2').select('#circle-bar')
                        .selectAll('circle').filter(function (c) {
                            return c.properties.rdfs__label === videoName;
                        });
                    autoNode.classed("selected-node", true).style('opacity', 1);

                    const wd = 16;
                    const ht = 8.75;
                    const c_x = parseFloat(autoNode.attr('cx')) - wd / 2;
                    const c_y = parseFloat(autoNode.attr('cy')) - ht;
                    const img = d3.select('.progress-bar').append('img')
                        .attr('src', 'static/img/svg/' + videoName + '.svg')
                        .style('position', 'absolute')
                        .style('width', wd + 'em')
                        .style('height', ht + 'em')
                        .style('left', c_x + 'em')
                        .style('top', c_y + 'em')
                        .style('pointer-events', 'none')
                        .classed('dynamic-img auto-img', true);
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });


            await playVideoSegment2(videoInfo, true);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function playVideoSegment2(videoInfo, isVideoPlay) {
    return new Promise((resolve, reject) => {
        if (isVideoPlay) {
            const video = document.querySelector('video');
            if (!video) {
                console.error('Video element not found');
                reject('Video element not found');
                return;
            }

            video.currentTime = videoInfo.startTime;
            video.play();

            function checkTime() {
                if (video.currentTime >= videoInfo.endTime) {
                    video.pause();
                    video.removeEventListener('timeupdate', checkTime);
                    resolve();
                }
            }

            video.addEventListener('timeupdate', checkTime);
        } else {
            const video = document.querySelector('video');
            video.pause();
            resolve();
        }
    });
}

window.playVideoSegment = function(videoInfo, isVideoPlay) {
    if (!video) {
        console.error('Video element not found');
        return;
    }

    if (isVideoPlay) {
        video.removeEventListener('timeupdate', video._checkTime);

        video.currentTime = videoInfo.startTime;
        video.play();

        video._checkTime = function() {
            if (video.currentTime >= videoInfo.endTime) {
                video.pause();
                video.removeEventListener('timeupdate', video._checkTime);
            }
        };

        video.addEventListener('timeupdate', video._checkTime);
    } else {
        video.pause();
    }
}