/** Unix epoch ms for the last valid signed 32-bit second (2038-01-19T03:14:07Z). */
export const Y2K38_TARGET_EPOCH = 2147483647 * 1000;

export function formatTimeSegment(value, label) {
  const displayValue = label === 'DAYS' ? value.toString() : value.toString().padStart(2, '0');
  const paddedLabel = label.padEnd(8, ' ');
  return `${paddedLabel}: ${displayValue}\n`;
}

export function computeCountdownParts(differenceMs) {
  if (differenceMs <= 0) {
    return null;
  }

  return {
    days: Math.floor(differenceMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((differenceMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((differenceMs / (1000 * 60)) % 60),
    seconds: Math.floor((differenceMs / 1000) % 60),
  };
}

export function formatCountdownDisplay(differenceMs) {
  if (differenceMs <= 0) {
    return '> Y2K38 THRESHOLD REACHED.\n> CHECK SYSTEM STATUS IMMEDIATELY.';
  }

  const parts = computeCountdownParts(differenceMs);
  return (
    formatTimeSegment(parts.days, 'DAYS') +
    formatTimeSegment(parts.hours, 'HOURS') +
    formatTimeSegment(parts.minutes, 'MINUTES') +
    formatTimeSegment(parts.seconds, 'SECONDS')
  );
}

export function buildBrowserScript(targetEpoch) {
  return `
const targetEpochTime = ${targetEpoch};
const countdownElement = document.getElementById('countdown');
let intervalId;

${formatCountdownDisplay.toString()}

function updateCountdown() {
  const difference = targetEpochTime - Date.now();
  countdownElement.textContent = formatCountdownDisplay(difference);
  countdownElement.classList.remove('loading-text');
  if (difference <= 0 && intervalId) {
    clearInterval(intervalId);
  }
}

updateCountdown();
intervalId = setInterval(updateCountdown, 1000);
`.trim();
}
