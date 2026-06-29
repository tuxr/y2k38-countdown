import {
  Y2K38_TARGET_EPOCH,
  buildBrowserScript,
  formatCountdownDisplay,
} from './countdown.js';

const RESPONSE_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'",
};

/**
 * Handles the incoming request and returns an HTML response with the countdown.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTML response.
 */
async function handleRequest(request) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        ...RESPONSE_HEADERS,
        Allow: 'GET',
      },
    });
  }

  const url = new URL(request.url);
  if (url.pathname !== '/') {
    return new Response('Not Found', {
      status: 404,
      headers: RESPONSE_HEADERS,
    });
  }

  const noscriptCountdown = formatCountdownDisplay(Y2K38_TARGET_EPOCH - Date.now());
  const browserScript = buildBrowserScript(Y2K38_TARGET_EPOCH);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Countdown to Y2K38</title>
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Monaco', 'Lucida Console', monospace;
          background-color: #000000; /* True black background */
          color: #66FF66; /* Green text */
          margin: 0;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        #countdown-container {
          background-color: #000000; /* Match body background */
          border: 2px solid #66FF66; /* Green border */
          padding: 1.5rem;
          width: auto;
          min-width: 280px; /* Reduced for very small screens */
          max-width: 90%; /* Max width for responsiveness */
          text-align: left; /* Align text to left, typical for terminals */
          box-shadow: 0 0 10px #66FF66; /* Optional: subtle glow effect */
        }
        h1 {
          font-family: inherit; /* Ensure consistency with body font */
          font-size: 1em; /* Increased base size */
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
          font-size: 1em; /* Increased for better readability */
          line-height: 1.8; /* Increased line height for readability */
          white-space: pre;    /* Preserve newlines and spaces from JS */
          margin-top: 1em;
          margin-bottom: 1em;
          overflow-x: auto; /* Allow horizontal scroll if needed */
        }
        p {
          font-family: inherit; /* Ensure consistency with body font */
          font-size: 0.85em; /* Slightly increased */
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

        /* Mobile-specific styles */
        @media (max-width: 768px) {
          body {
            padding: 0.5rem;
          }
          #countdown-container {
            padding: 1rem;
            min-width: 0; /* Remove min-width constraint on mobile */
            max-width: 95%; /* Use more of the screen on mobile */
          }
          h1 {
            font-size: 0.9em; /* Slightly smaller title on mobile */
            letter-spacing: 0.05em; /* Reduce letter spacing */
          }
          #countdown {
            font-size: 0.9em; /* Optimize countdown size for mobile */
          }
          p {
            font-size: 0.75em; /* Smaller description text on mobile */
            line-height: 1.5;
          }
        }

        /* Very small screens (iPhone SE, etc.) */
        @media (max-width: 375px) {
          body {
            padding: 0.25rem;
          }
          #countdown-container {
            padding: 0.75rem;
            border-width: 1px; /* Thinner border on very small screens */
          }
          h1 {
            font-size: 0.8em;
            margin-bottom: 0.75em;
          }
          #countdown {
            font-size: 0.85em;
            line-height: 1.6;
          }
          p {
            font-size: 0.7em;
          }
        }

        /* Desktop/larger screens */
        @media (min-width: 769px) {
          #countdown-container {
            min-width: 400px; /* Larger minimum on desktop */
            padding: 2rem; /* More generous padding */
          }
          h1 {
            font-size: 1.1em;
          }
          #countdown {
            font-size: 1.1em;
          }
          p {
            font-size: 0.9em;
          }
        }
      </style>
    </head>
    <body>
      <div id="countdown-container">
        <h1>System Monitor: Y2K38 Event</h1>
        <div id="countdown" aria-live="polite">
          <noscript>${noscriptCountdown}</noscript>
          <span class="loading-text">INITIALIZING COUNTDOWN SEQUENCE...</span>
        </div>
        <p>> The Y2K38 problem refers to the time encoding limit in many 32-bit systems at 03:14:07 UTC on 19 January 2038.</p>
      </div>

      <script>
${browserScript}
      <\/script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      ...RESPONSE_HEADERS,
      'content-type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

export default {
  fetch: handleRequest,
};
