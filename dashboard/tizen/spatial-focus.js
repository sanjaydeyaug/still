(function () {
  'use strict';

  // Select geometry only; the caller owns key events, focus and scrolling.
  window.StillFocus = { next: function (scope, current, direction) {
    var elements = Array.prototype.slice.call(
      scope.querySelectorAll('button:not(:disabled),input:not(:disabled)')
    ).filter(function (element) { return element.getClientRects().length > 0; });
    if (elements.indexOf(current) < 0) return elements[0] || null;

    // Explicit neighbors keep wide Settings rows from losing to a nearer
    // navigation button when their centers are far apart horizontally.
    var axis = direction[1] < 0 ? 'up' : direction[1] > 0 ? 'down' : direction[0] < 0 ? 'left' : 'right';
    var neighborId = current.getAttribute && current.getAttribute('data-focus-' + axis);
    if (neighborId) {
      var neighbor = elements.filter(function (element) { return element.id === neighborId; })[0];
      if (neighbor) return neighbor;
    }

    var rect = current.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var best = null;
    var score = Infinity;
    elements.forEach(function (element) {
      if (element === current) return;
      var target = element.getBoundingClientRect();
      var dx = target.left + target.width / 2 - x;
      var dy = target.top + target.height / 2 - y;
      var forward = dx * direction[0] + dy * direction[1];
      var cross = Math.abs(dx * direction[1] + dy * direction[0]);
      if (forward > 8) {
        var candidateScore = forward + cross * 3;
        if (candidateScore < score) {
          score = candidateScore;
          best = element;
        }
      }
    });
    return best;
  }};
})();
