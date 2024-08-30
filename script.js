let player;
let capturedTimes = new Set();
let timestampCounter = 1;

document.getElementById('playButton').addEventListener('click', function () {
    const videoUrl = document.getElementById('videoUrl').value;
    const startTime = document.getElementById('startTime').value || 0;

    if (videoUrl) {
        const videoId = extractVideoId(videoUrl);

        if (!player) {
            player = new YT.Player('videoContainer', {
                height: '315',
                width: '560',
                videoId: videoId,
                playerVars: { 'start': startTime },
                events: {
                    'onReady': onPlayerReady
                }
            });
        } else {
            player.loadVideoById(videoId, startTime);
        }
    } else {
        alert('Please paste a valid YouTube video link.');
    }
});

function onPlayerReady(event) {
    document.getElementById('controls').classList.remove('hidden');
}

document.getElementById('captureTimeButton').addEventListener('click', function () {
    if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        const roundedTime = Math.floor(currentTime); // Round to nearest second
        const formattedTime = formatTime(roundedTime);

        if (!capturedTimes.has(roundedTime)) {
            capturedTimes.add(roundedTime);

            const timeList = document.getElementById('timeList');
            const listItem = document.createElement('li');
            listItem.textContent = `Timestamp ${timestampCounter}: ${formattedTime}`;
            listItem.setAttribute('data-timestamp', `Timestamp ${timestampCounter}`);

            listItem.addEventListener('click', function () {
                const newName = prompt("Enter a new name for this timestamp:", listItem.getAttribute('data-timestamp'));
                if (newName) {
                    listItem.setAttribute('data-timestamp', newName);
                    listItem.textContent = `${newName}: ${formattedTime}`;
                }
            });

            timeList.appendChild(listItem);
            timestampCounter++;
        } else {
            console.log(`Timestamp ${formattedTime} already captured.`);
        }
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)([^&\n?#]+)/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
