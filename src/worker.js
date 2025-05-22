// Listen for incoming fetch events (HTTP requests)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handles the incoming request and returns an HTML response with the countdown.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTML response.
 */
async function handleRequest(request) {
  // Target date and time: January 19, 2038, 03:14:08 UTC
  const targetDateEpoch = new Date('2038-01-19T03:14:08Z').getTime();

  // HTML content for the countdown page
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Countdown to Y2K38</title>
      <style>
        body {
          font-family: 'Monaco', 'Lucida Console', 'monospace';
          background-color: #000000; /* True black background */
          color: #66FF66; /* Green text */
          margin: 0;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          box-sizing: border-box; /* Ensure padding doesn't make it exceed viewport */
        }
        #countdown-container {
          background-color: #000000; /* Match body background */
          border: 2px solid #66FF66; /* Green border */
          padding: 1.5rem;
          width: auto;
          min-width: 300px; /* Minimum width for readability */
          max-width: 90%; /* Max width for responsiveness */
          text-align: left; /* Align text to left, typical for terminals */
          box-shadow: 0 0 10px #66FF66; /* Optional: subtle glow effect */
        }
        h1 {
          font-family: inherit; /* Ensure consistency with body font */
          font-size: 0.9em; /* Adjusted for title bar */
          margin-top: 0;
          margin-bottom: 1em; /* Spacing below title bar */
          text-transform: uppercase;
          border-top: 1px solid #66FF66; /* Top border for title bar */
          border-bottom: 1px solid #66FF66; /* Separator line */
          padding-bottom: 0.5em;
          letter-spacing: 0.1em; /* Spacing for uppercase letters */
          background-color: inherit; /* Match container background */
          color: inherit; /* Match text color */
          text-align: center; /* Center title text */
        }
        #countdown {
          font-family: inherit; /* Ensure consistency with body font */
          font-size: 0.9em;
          line-height: 1.8; /* Increased line height for readability */
          white-space: pre;    /* Preserve newlines and spaces from JS */
          margin-top: 1em;
          margin-bottom: 1em;
        }
        p {
          font-family: inherit; /* Ensure consistency with body font */
          font-size: 0.8em;
          line-height: 1.6;
          margin-top: 1em;
          margin-bottom: 0; /* Remove bottom margin if it's the last element */
        }
        /* Blinking cursor effect for the "Loading..." text */
        .loading-text::after {
          content: '_';
          animation: blink 1s step-start infinite;
          margin-left: 2px;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      </style>
    </head>
    <body>
      <div id="countdown-container">
        <h1>System Monitor: Y2K38 Event</h1>
        <div id="countdown">
          <span class="loading-text">INITIALIZING COUNTDOWN SEQUENCE...</span>
        </div>
        <p>> The Y2K38 problem refers to the time encoding limit in many 32-bit systems at 03:14:07 UTC on 19 January 2038.</p>
      </div>

      <script>
        const targetEpochTime = ${targetDateEpoch};
        const countdownElement = document.getElementById('countdown');

        function formatTimeSegment(value, label) {
            // Pad numeric values (H, M, S) to 2 digits. Years and Days can be longer.
            const displayValue = (label === "YEARS" || label === "DAYS") ? value.toString() : value.toString().padStart(2, '0');
            // Pad labels for alignment. Max label length is 7 ("SECONDS"), pad to 8.
            const paddedLabel = label.padEnd(8, ' '); 
            return \`\${paddedLabel}: \${displayValue}\n\`; // Use \` for template literal
        }

        function updateCountdown() {
          const currentTime = new Date().getTime();
          const difference = targetEpochTime - currentTime;

          if (difference <= 0) {
            countdownElement.textContent = \`> Y2K38 THRESHOLD REACHED.\n> CHECK SYSTEM STATUS IMMEDIATELY.\`;
            countdownElement.classList.remove('loading-text'); // Remove blinking cursor
            if (intervalId) clearInterval(intervalId);
            return;
          }

          const seconds = Math.floor((difference / 1000) % 60);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
          const days = totalDays;

          // Update the countdown display
          // Using textContent to prevent HTML injection and preserve formatting from newlines
          countdownElement.textContent =
            formatTimeSegment(days, "DAYS") + // Use the modified 'days' variable
            formatTimeSegment(hours, "HOURS") +
            formatTimeSegment(minutes, "MINUTES") +
            formatTimeSegment(seconds, "SECONDS");
          countdownElement.classList.remove('loading-text'); // Remove blinking cursor once loaded
        }

        const intervalId = setInterval(updateCountdown, 1000);
        // Initial call to display the countdown immediately or show loading
        // The "Loading..." text is now part of the initial HTML.
        // updateCountdown(); // Call this to immediately show numbers, or let the interval do it.
        // For a more "typed out" feel, let the first interval update it.
        // Or, for immediate display:
        if (countdownElement.querySelector('.loading-text')) {
            // Keep loading text until first update
        } else {
             updateCountdown(); // If no loading text, update immediately (e.g. if JS reloads)
        }


      <\/script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}
