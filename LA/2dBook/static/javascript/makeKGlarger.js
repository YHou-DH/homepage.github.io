var fullscreenIcon = document.getElementById('fullscreen-toggle');
var closeButton = document.getElementById('smallscreen-toggle');
var kgViz = document.getElementById('kg-viz');

function toggleFullscreenOn() {
    var kgVizSvg = document.querySelector('.kg-viz-svg');
    if (kgVizSvg) {
        kgViz.classList.add('expanded');
        kgVizSvg.style.width = '100%';
        kgVizSvg.style.height = '100%';
        closeButton.style.display = 'block';
        fullscreenIcon.style.display = 'none';
    }
}

function toggleFullscreenOff() {
    var kgVizSvg = document.querySelector('.kg-viz-svg');
    if (kgVizSvg) {
        kgViz.classList.remove('expanded');
        kgVizSvg.style.width = '100%';
        kgVizSvg.style.height = 'auto';
        closeButton.style.display = 'none';
        fullscreenIcon.style.display = 'block';
    }
}

fullscreenIcon.addEventListener('click', toggleFullscreenOn);
closeButton.addEventListener('click', toggleFullscreenOff);

