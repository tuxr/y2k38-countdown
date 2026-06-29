import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  Y2K38_TARGET_EPOCH,
  buildBrowserScript,
  computeCountdownParts,
  formatCountdownDisplay,
  formatTimeSegment,
} from '../src/countdown.js';

describe('Y2K38_TARGET_EPOCH', () => {
  it('matches the last valid signed 32-bit Unix second', () => {
    assert.equal(Y2K38_TARGET_EPOCH, 2147483647 * 1000);
    assert.equal(new Date(Y2K38_TARGET_EPOCH).toISOString(), '2038-01-19T03:14:07.000Z');
  });
});

describe('formatTimeSegment', () => {
  it('pads hours, minutes, and seconds to two digits', () => {
    assert.equal(formatTimeSegment(3, 'HOURS'), 'HOURS   : 03\n');
    assert.equal(formatTimeSegment(9, 'MINUTES'), 'MINUTES : 09\n');
    assert.equal(formatTimeSegment(5, 'SECONDS'), 'SECONDS : 05\n');
  });

  it('does not pad days', () => {
    assert.equal(formatTimeSegment(4321, 'DAYS'), 'DAYS    : 4321\n');
  });
});

describe('computeCountdownParts', () => {
  it('decomposes a millisecond difference into day and time parts', () => {
    const oneDayOneHour = ((24 + 1) * 60 * 60 * 1000) + (2 * 60 * 1000) + (3 * 1000);
    assert.deepEqual(computeCountdownParts(oneDayOneHour), {
      days: 1,
      hours: 1,
      minutes: 2,
      seconds: 3,
    });
  });

  it('returns null when the target time has passed', () => {
    assert.equal(computeCountdownParts(0), null);
    assert.equal(computeCountdownParts(-1000), null);
  });
});

describe('formatCountdownDisplay', () => {
  it('formats a full countdown display', () => {
    const difference = (2 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000) + (5 * 60 * 1000) + (6 * 1000);
    assert.equal(
      formatCountdownDisplay(difference),
      'DAYS    : 2\nHOURS   : 04\nMINUTES : 05\nSECONDS : 06\n',
    );
  });

  it('shows the threshold message after expiry', () => {
    assert.equal(
      formatCountdownDisplay(-1),
      '> Y2K38 THRESHOLD REACHED.\n> CHECK SYSTEM STATUS IMMEDIATELY.',
    );
  });
});

describe('buildBrowserScript', () => {
  it('embeds the target epoch and countdown update logic', () => {
    const script = buildBrowserScript(Y2K38_TARGET_EPOCH);
    assert.match(script, new RegExp(`const targetEpochTime = ${Y2K38_TARGET_EPOCH};`));
    assert.match(script, /function formatCountdownDisplay/);
    assert.match(script, /updateCountdown\(\);/);
    assert.match(script, /setInterval\(updateCountdown, 1000\)/);
  });
});
