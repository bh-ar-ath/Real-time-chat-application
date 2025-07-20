document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById("messageInput");
    const chatWindow = document.getElementById("chat-window");
    const sendButton = document.getElementById("sendButton");

    function displayMessage(text, type) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", type);
        messageElement.innerText = text;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return messageElement;
    }

    async function sendMessage() {
        const userText = messageInput.value.trim();
        if (!userText) return; // Prevent sending empty messages

        displayMessage(userText, "sent");
        messageInput.value = ""; // Clear input
        messageInput.focus(); // Focus input for next message

        const typingMessage = displayMessage("Typing...", "received");

        try {
            const botResponse = await getAIResponse(userText);
            if (typingMessage) {
                chatWindow.removeChild(typingMessage);
            }
            displayMessage(botResponse, "received");
        } catch (error) {
            console.error("Error fetching AI response:", error);
            if (typingMessage) {
                chatWindow.removeChild(typingMessage);
            }
            displayMessage("Error: Could not get response. Try again.", "error");
        }
    }

    async function getAIResponse(userMessage) {
        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("AI response data:", data);
            return data.message || "I couldn't understand that. Try again!";
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Oops! Something went wrong. Try again later.";
        }
    }

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});