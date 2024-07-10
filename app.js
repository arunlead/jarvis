document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector('.content');
    const openTabs = {}; // Object to store references to opened tabs
    const startButton = document.getElementById('startButton');

    const speak = (text, callback) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1;
        speech.volume = 1;
        speech.pitch = 1;

        if (callback) {
            speech.onend = callback;
        }

        window.speechSynthesis.speak(speech);
    };

    const wishMe = () => {
        const hour = new Date().getHours();
        let greeting;
        if (hour < 12) {
            greeting = "Good Morning Boss...";
        } else if (hour < 17) {
            greeting = "Good Afternoon Master...";
        } else {
            greeting = "Good Evening Sir...";
        }
        speak(`${greeting} Hello Arun.`);
    };

    let recognition = null;

    const setupSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onstart = () => {
            content.textContent = "Listening...";
            console.log("Speech recognition started");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
            content.textContent = transcript;
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            speak("Sorry, I didn't catch that. Can you please repeat?");
            restartRecognition();
        };

        recognition.onend = () => {
            console.log("Speech recognition ended, restarting...");
            restartRecognition();
        };
    };

    const restartRecognition = () => {
        if (recognition) {
            recognition.stop();
            recognition.start();
        }
    };

    const processCommand = (message) => {
        let handled = false; // Flag to track if the command was handled

        // Handle specific commands
        if (message.includes('hey') || message.includes('hello')) {
            const response = "Hello Sir, How May I Help You?";
            content.textContent = response;
            speak(response);
            handled = true;
        }

        if (message.includes('open google')) {
            const response = "Opening Google.";
            content.textContent = response;
            speak(response, () => {
                openTabs.google = window.open("https://www.google.com", "_blank");
            });
            handled = true;
        }

        if (message.includes('open youtube')) {
            const response = "Opening YouTube.";
            content.textContent = response;
            speak(response, () => {
                openTabs.youtube = window.open("https://www.youtube.com", "_blank");
            });
            handled = true;
        }

        if (message.includes('open facebook')) {
            const response = "Opening Facebook.";
            content.textContent = response;
            speak(response, () => {
                openTabs.facebook = window.open("https://www.facebook.com", "_blank");
            });
            handled = true;
        }

        if (message.includes('close google')) {
            if (openTabs.google) {
                const response = "Closing Google.";
                content.textContent = response;
                speak(response, () => {
                    openTabs.google.close();
                    delete openTabs.google;
                    content.textContent = "JARVIS is back to home.";
                });
            } else {
                speak("Google is not open.");
            }
            handled = true;
        }

        if (message.includes('close youtube')) {
            if (openTabs.youtube) {
                const response = "Closing YouTube.";
                content.textContent = response;
                speak(response, () => {
                    openTabs.youtube.close();
                    delete openTabs.youtube;
                    content.textContent = "JARVIS is back to home.";
                });
            } else {
                speak("YouTube is not open.");
            }
            handled = true;
        }

        if (message.includes('close facebook')) {
            if (openTabs.facebook) {
                const response = "Closing Facebook.";
                content.textContent = response;
                speak(response, () => {
                    openTabs.facebook.close();
                    delete openTabs.facebook;
                    content.textContent = "JARVIS is back to home.";
                });
            } else {
                speak("Facebook is not open.");
            }
            handled = true;
        }

        if (message.includes('close all')) {
            closeAllTabs();
            handled = true;
        }

        // Example of providing suggestions before searching
        if (!handled) {
            const searchTerm = message.trim();
            if (searchTerm) {
                suggestResponse(searchTerm);
                handled = true;
            }
        }

        // Default response for unrecognized commands
        if (!handled) {
            const response = "I'm sorry, I'm not sure how to help with that. Please try asking something else.";
            content.textContent = response;
            speak(response);
        }
    };

    const suggestResponse = (searchTerm) => {
        let suggestion = "";

        if (searchTerm.includes('how to')) {
            suggestion = `Here's a suggestion: To control airfall, try adjusting the air conditioning settings or using a fan.`;
        } else {
            suggestion = `Let me suggest: To control ${searchTerm}, you might consider...`; // Modify suggestions based on specific queries
        }

        // Speak the suggestion
        speak(suggestion, () => {
            // Perform Google search after suggestion
            window.open(`https://www.google.com/search?q=${searchTerm.replace(/\s/g, "+")}`, "_blank");
            const response = `Searching for "${searchTerm}" on Google. Here's what I found.`;
            content.textContent = response;
            speak(response);
        });
    };

    const closeAllTabs = () => {
        for (const tab in openTabs) {
            if (openTabs[tab]) {
                openTabs[tab].close();
                delete openTabs[tab];
            }
        }
        const response = "All tabs have been closed. JARVIS is back to home.";
        content.textContent = response;
        speak(response);
    };

    // Initialize JARVIS
    startButton.addEventListener('click', () => {
        if (!recognition) {
            setupSpeechRecognition();
        }
        speak("Initializing JARVIS...", () => {
            wishMe();
            recognition.start();
        });
    });
});
