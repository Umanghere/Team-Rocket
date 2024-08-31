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
        }
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Toggle Chatbot visibility
document.getElementById('toggleChatbot').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('chatbot').classList.toggle('hidden');
});

document.getElementById('hideChatbotButton').addEventListener('click', function () {
    document.getElementById('chatbot').classList.add('hidden');
});

// Handle Chatbot input and display
document.getElementById('sendChatButton').addEventListener('click', function () {
    const chatInput = document.getElementById('chatInput').value.trim();
    if (chatInput) {
        const chatContent = document.getElementById('chatContent');

        // User's message
        const userMessage = document.createElement('p');
        userMessage.textContent = `You: ${chatInput}`;
        chatContent.appendChild(userMessage);

        // Scroll to the bottom
        chatContent.scrollTop = chatContent.scrollHeight;

        // Clear input
        document.getElementById('chatInput').value = '';

        // Chatbot response
        setTimeout(() => {
            const botResponse = document.createElement('p');
            botResponse.textContent = `EaseStudy Bot: ${getBotResponse(chatInput)}`;
            chatContent.appendChild(botResponse);

            // Scroll to the bottom after bot response
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 500); // Delay for a more realistic response
    }
});

// Basic function to mimic bot responses
function getBotResponse(input) {
    const lowerCaseInput = input.toLowerCase();

    // Simple keywords and responses
    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
        return 'Hello! How can I assist you today?';
    } else if (lowerCaseInput.includes('how are you')) {
        return 'I am just a bot, but I\'m here to help you!';
    } else if (lowerCaseInput.includes('help')) {
        return 'Sure! I can assist you with using EaseStudy. What do you need help with?';
    } else if (lowerCaseInput.includes('video')) {
        return 'To play a video, just paste the YouTube link and click the play button!';
    } else if (lowerCaseInput.includes('thank you')) {
        return 'You\'re welcome! Happy studying!';
    } else {
        return 'I\'m not sure how to respond to that. Could you try asking something else?';
    }
}
