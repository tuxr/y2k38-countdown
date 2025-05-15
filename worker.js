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
  // The 'Z' at the end signifies UTC
  const targetDateEpoch = new Date('2038-01-19T03:14:08Z').getTime();

  // HTML content for the countdown page
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Countdown to Y2K38</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background-color: #44a33c; /* Dark background */
          color: #e2e8f0; /* Light text */
          text-align: center;
          padding: 1rem;
        }
        #countdown-container {
          background-color: #2d3748; /* Slightly lighter dark card */
          padding: 2rem 1.5rem; /* Adjusted padding for potentially more content */
          border-radius: 0.75rem; /* Tailwind lg rounded */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          max-width: 700px; /* Increased max-width slightly for more segments */
          width: 100%;
        }
        h1 {
          font-size: 1.875rem; /* Tailwind text-3xl */
          line-height: 2.25rem; /* Tailwind leading-9 */
          font-weight: 700; /* Tailwind font-bold */
          margin-bottom: 1.5rem; /* Tailwind mb-6 */
          color: #63b3ed; /* A nice blue */
        }
        #countdown {
          /* font-size: 2.25rem; /* Tailwind text-4xl (Adjusted by time-value) */
          /* line-height: 2.5rem; /* Tailwind leading-10 (Adjusted by time-value) */
          font-weight: 600; /* Tailwind font-semibold */
          color: #f7fafc; /* Almost white */
          margin-bottom: 1.5rem; /* Tailwind mb-6 */
          letter-spacing: 0.025em; /* Slightly reduced letter spacing */
          display: flex; /* Use flexbox for better alignment of segments */
          flex-wrap: wrap; /* Allow wrapping on smaller screens */
          justify-content: center; /* Center segments */
          gap: 0.5rem; /* Gap between segments */
        }
        .time-segment {
            display: inline-block; /* Fallback, but flex items behave like block */
            min-width: 90px; /* Adjusted min-width for 5 segments */
            padding: 0.5rem;
        }
        .time-value {
            display: block;
            font-size: 2rem; /* Adjusted font size for numbers */
            font-weight: 700;
        }
        .time-label {
            display: block;
            font-size: 0.75rem; /* Smaller for labels */
            color: #a0aec0; /* Grayish text for labels */
            margin-top: 0.25rem;
        }
        p {
            font-size: 0.875rem; /* Tailwind text-sm */
            line-height: 1.25rem; /* Tailwind leading-5 */
            color: #a0aec0; /* Grayish text */
            margin-top: 1.5rem; /* Tailwind mt-6 */
        }
        /* Responsive adjustments */
        @media (max-width: 640px) {
          h1 {
            font-size: 1.5rem; /* text-2xl */
          }
          #countdown-container {
            padding: 1.5rem 1rem;
          }
          .time-segment {
            min-width: 60px; /* Smaller min-width for mobile */
            padding: 0.25rem;
          }
           .time-value {
            font-size: 1.5rem; /* Further adjusted for mobile */
          }
          .time-label {
            font-size: 0.65rem; /* Smaller labels for mobile */
          }
        }
         @media (max-width: 420px) { /* Extra small screens */
            .time-segment {
                min-width: 50px;
                flex-basis: calc(33.33% - 1rem); /* Try to fit 3 per row */
            }
            .time-value {
                font-size: 1.25rem;
            }
         }
      </style>
    </head>
    <body>
      <div id="countdown-container">
        <h1>Countdown to 03:14:08 UTC on January 19, 2038</h1>
        <div id="countdown">
          Loading...
        </div>
        <p>This is the moment many 32-bit systems may encounter the "Year 2038 problem" if not updated.</p>
      </div>

      <script>
        // The target date and time (in milliseconds since epoch) is injected here by the worker
        const targetEpochTime = ${targetDateEpoch};

        const countdownElement = document.getElementById('countdown');

        function formatTimeSegment(value, label) {
            // For years and days, padStart might not be strictly necessary if they can exceed 2 digits
            // but it doesn't harm for smaller numbers and keeps consistency for H, M, S.
            const displayValue = (label === "Years" || label === "Days") ? value.toString() : value.toString().padStart(2, '0');
            return \`<div class="time-segment">
                        <span class="time-value">\${displayValue}</span>
                        <span class="time-label">\${label}</span>
                    </div>\`;
        }

        function updateCountdown() {
          const currentTime = new Date().getTime();
          const difference = targetEpochTime - currentTime;

          if (difference <= 0) {
            countdownElement.innerHTML = "<span class='text-2xl text-green-400'>The Y2K38 moment has arrived!</span>";
            // Clear flex styling if only one message is shown
            countdownElement.style.display = 'block'; 
            if (intervalId) clearInterval(intervalId); // Stop the interval
            return;
          }

          // Calculate time components
          const seconds = Math.floor((difference / 1000) % 60);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          
          const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
          
          // Approximate years as 365 days. For a general countdown, this is usually acceptable.
          // A more precise calculation would involve complex date logic for leap years.
          const years = Math.floor(totalDays / 365); 
          const days = totalDays % 365;

          // Update the countdown display with styled segments
          countdownElement.innerHTML =
            formatTimeSegment(years, "Years") +
            formatTimeSegment(days, "Days") +
            formatTimeSegment(hours, "Hours") +
            formatTimeSegment(minutes, "Minutes") +
            formatTimeSegment(seconds, "Seconds");
        }

        // Update the countdown every second
        const intervalId = setInterval(updateCountdown, 1000);

        // Initial call to display the countdown immediately without waiting for the first second
        updateCountdown();
      <\/script>
    </body>
    </html>
  `;

  // Return the HTML content
  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}
