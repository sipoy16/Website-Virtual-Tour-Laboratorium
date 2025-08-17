var player;
var playersPlayingTmp = [];
var isInitialized = false;
var isPaused = false;

function loadTour() {
    if(player) return;

    var beginFunc = function(event){
        if(event.name == 'begin') {
            var camera = event.data.source.get('camera');
            if(camera && camera.get('initialSequence') && camera.get('initialSequence').get('movements').length > 0)
                return;
        }

        if(event.sourceClassName == "MediaAudio") return;

        isInitialized = true;

        player.unbind('preloadMediaShow', beginFunc, player, true);
        player.unbindOnObjectsOf('PanoramaPlayListItem', 'begin', beginFunc, player, true);
        player.unbind('stateChange', beginFunc, player, true);
        window.parent.postMessage("tourLoaded", '*');

        disposePreloader();
        onVirtualTourLoaded();
    };

    var settings = new TDV.PlayerSettings();
    settings.set(TDV.PlayerSettings.CONTAINER, document.getElementById('viewer'));
    settings.set(TDV.PlayerSettings.SCRIPT_URL, 'js/script.js?v=1755364789072');
    settings.set(TDV.PlayerSettings.WEBVR_POLYFILL_URL, 'lib/WebVRPolyfill.js?v=1755364789072');
    settings.set(TDV.PlayerSettings.HLS_URL, 'lib/Hls.js?v=1755364789072');
    settings.set(TDV.PlayerSettings.QUERY_STRING_PARAMETERS, 'v=1755364789072');
    window.tdvplayer = player = TDV.PlayerAPI.create(settings);

    player.bind('preloadMediaShow', beginFunc, player, true);
    player.bind('stateChange', beginFunc, player, true);
    player.bindOnObjectsOf('PanoramaPlayListItem', 'begin', beginFunc, player, true);
    player.bindOnObject('rootPlayer', 'start', function(e){
        var queryDict = {}; 
        location.search.substr(1).split("&").forEach(function(item) {
            var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]);
            queryDict[k] = v;
        });
        var item;
        if("media-index" in queryDict){
            item = setMediaByIndex(parseInt(queryDict["media-index"]) - 1);
        }
        else if("media-name" in queryDict){
            item = setMediaByName(queryDict["media-name"]);
        }
        else{
            item = setMediaByIndex(0);
        }
        if(item != undefined && "trigger-overlay-name" in queryDict){
            triggerOverlayByName(item, queryDict["trigger-overlay-name"], "trigger-overlay-event" in queryDict ? queryDict["trigger-overlay-event"] : "click");
        }

        player.getById('rootPlayer').bind('tourEnded', function(){
            onVirtualTourEnded();
        }, player, true);
    }, player, false);
}

function pauseTour() {
    isPaused = true;
    if(!isInitialized) return;

    var playLists = player.getByClassName('PlayList');
    for(var i = 0; i < playLists.length; i++) {
        var playList = playLists[i];
        var index = playList.get('selectedIndex');
        if(index != -1) {
            var item = playList.get('items')[index];
            var itemPlayer = item.get('player');
            if(itemPlayer && itemPlayer.pause) {
                playersPlayingTmp.push(itemPlayer);
                itemPlayer.pause();
            }
        }
    }

    player.getById('pauseGlobalAudios')();
}

function resumeTour() {
    isPaused = false;
    if(!isInitialized) return;

    while(playersPlayingTmp.length) {
        var viewer = playersPlayingTmp.pop();
        viewer.play();
    }

    player.getById('resumeGlobalAudios')();
}

function onVirtualTourLoaded() {
    if(isPaused) pauseTour();
}

function onVirtualTourEnded() { }

function getRootPlayer() {
    return window.tdvplayer !== undefined ? window.tdvplayer.getById('rootPlayer') : undefined;
}

function setMediaByIndex(index) {
    var rootPlayer = getRootPlayer();
    if(rootPlayer !== undefined) {
        return rootPlayer.setMainMediaByIndex(index);
    }
}

function setMediaByName(name) {
    var rootPlayer = getRootPlayer();
    if(rootPlayer !== undefined) {
        return rootPlayer.setMainMediaByName(name);
    }
}

function triggerOverlayByName(item, name, eventName) {
    var rootPlayer = getRootPlayer();
    if(rootPlayer !== undefined) {
        item.bind('begin', function(e){
            item.unbind('begin', arguments.callee, this);
            var overlay = rootPlayer.getPanoramaOverlayByName(item.get('media'), name);
            if(overlay)
                rootPlayer.triggerOverlay(overlay, eventName);
        }, rootPlayer);
    }
}

function showPreloader() {
    var preloadContainer = document.getElementById('preloadContainer');
    if(preloadContainer != undefined)
        preloadContainer.style.opacity = 1;
}

function disposePreloader() {
    var preloadContainer = document.getElementById('preloadContainer');
    if(preloadContainer == undefined)
        return;

    var transitionEndName = transitionEndEventName();
    if(transitionEndName) {
        preloadContainer.addEventListener(transitionEndName, hide, false);
        preloadContainer.style.opacity = 0;
        setTimeout(hide, 500);
    } else {
        hide();
    }

    function hide() {
        preloadContainer.style.visibility = 'hidden';
        preloadContainer.style.display = 'none';
    }

    function transitionEndEventName () {
        var el = document.createElement('div');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };
        for (var t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
        return undefined;
    }
}

function onLoad() {
    showPreloader();
    loadTour();
}
