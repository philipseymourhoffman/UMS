// ==UserScript==
// @name         Username Moderation Systems [UMS]
// @namespace    https://github.com/philipseymourhoffman
// @version      0.9
// @description  Automatically bans users with specific usernames in your kick chat
// @author       psh
// @match        https://kick.com/[your username here]
// @match        https://kick.com/dashboard/stream
// @grant        none
// ==/UserScript==

/*
 * Kick.com Chat Moderator
 *
 * Description:
 * This script automatically bans users with specified usernames containing bannable sequences in the chat on kick.com.
 *
 * How to Add or Remove Bannable Sequences:
 * - Locate the 'bannableSequences' array in the script configuration.
 * - Add or remove elements in the array to specify the sequences you want to ban.
 * - Each sequence should be enclosed in single quotes and separated by commas.
 * - Save the script after modifying the array.
 */

(function() {
    'use strict';

    // Configuration: Add or remove bannable sequences here
    const bannableSequences = [,]; // Example: ['sequence1', 'sequence2', 'sequence3']

    // Set to store usernames that have already triggered the action
    const triggeredUsernames = new Set();

    // Function to check if a username contains any bannable sequence
    function containsBannableSequence(username) {
        return bannableSequences.some(sequence => username.toLowerCase().includes(sequence.toLowerCase()));
    }

    // Function to type and send a message in chat
    function typeInChat(username) {
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            // Type the ban command character by character
            const banCommand = `/ban ${username}`;
            for (let i = 0; i < banCommand.length; i++) {
                setTimeout(() => {
                    messageInput.textContent += banCommand[i];
                    // Dispatch input event after each character to simulate typing
                    const inputEvent = new Event('input', { bubbles: true });
                    messageInput.dispatchEvent(inputEvent);
                }, i * 100); // Adjust typing speed here (time between each character)
            }

            // Simulate pressing the "Enter" key after typing the command
            setTimeout(() => {
                const enterKeyEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter'
                });
                messageInput.dispatchEvent(enterKeyEvent);
            }, banCommand.length * 100); // Adjust delay before pressing "Enter"
        }
    }

    // Function to monitor the chat and perform moderation
    function monitorChat() {
        const chatMessages = document.querySelectorAll('.chat-entry-username');
        chatMessages.forEach(message => {
            const username = message.textContent.trim();
            if (containsBannableSequence(username) && !triggeredUsernames.has(username)) {
                // Trigger the action only if the username contains a bannable sequence
                // and has not already been triggered
                typeInChat(username);
                triggeredUsernames.add(username); // Add the username to the set of triggered usernames
            }
        });
    }

    // Run the monitoring function periodically
    setInterval(monitorChat, 5000); // Adjust the interval as needed
})();
