(function () {
  'use strict';

  // Select controls by row and section; the caller owns keys and scrolling.
  window.StillFocus = { next: function (scope, current, direction) {
    var elements = Array.prototype.slice.call(
      scope.querySelectorAll('button:not(:disabled),input:not(:disabled)')
    ).filter(function (element) { return element.getClientRects().length > 0; });
    if (elements.indexOf(current) < 0) return elements[0] || null;
    function closest(element, selector) { return element.closest ? element.closest(selector) : null; }
    var axis = direction[1] < 0 ? 'up' : direction[1] > 0 ? 'down' : direction[0] < 0 ? 'left' : 'right';
    var neighborId = current.getAttribute && current.getAttribute('data-focus-' + axis);
    if (neighborId) {
      var neighbor = elements.filter(function (element) { return element.id === neighborId; })[0];
      if (neighbor) return neighbor;
    }
    var rect = current.getBoundingClientRect();
    var x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    var vertical = direction[1] !== 0;
    var candidates = elements.filter(function (element) {
      if (element === current) return false;
      var target = element.getBoundingClientRect();
      if (vertical) {
        // Controls sharing a row are Left/Right neighbors, never Up/Down.
        return direction[1] < 0 ? target.top + target.height <= rect.top + 8 : target.top >= rect.top + rect.height - 8;
      }
      return (target.left + target.width / 2 - x) * direction[0] > 8;
    });
    if (vertical) {
      var page = closest(current, '.view');
      var pageName = page && ((page.getAttribute && page.getAttribute('data-nav-parent')) || page.id.replace(/-view$/, ''));
      if (direction[1] < 0 && closest(current, '#results')) {
        var searchField = elements.filter(function (element) { return element.id === 'search-input'; })[0];
        if (searchField) return searchField;
      }
      var inPage = page && candidates.filter(function (element) { return closest(element, '.view') === page; });
      if (inPage && inPage.length) {
        // Keep detail controls in their column, rather than jumping to a sidebar.
        var sidebar = closest(current, '.settings-sidebar');
        var column = inPage.filter(function (element) { return !!closest(element, '.settings-sidebar') === !!sidebar; });
        candidates = column;
        if (!column.length && direction[1] < 0) {
          var ownTab = elements.filter(function (element) { return element.getAttribute && element.getAttribute('data-view') === pageName; })[0];
          if (ownTab) return ownTab;
        }
        var region = closest(current, '.settings-pane,.settings-categories,#library,#favorites,#results,.search-box,.page-actions,.system-grid,.volume-row');
        var local = region && candidates.filter(function (element) { return closest(element, '.settings-pane,.settings-categories,#library,#favorites,#results,.search-box,.page-actions,.system-grid,.volume-row') === region; });
        if (local && local.length) candidates = local;
      } else if (page && direction[1] < 0) {
        // Only leave a page at its top, and return to its own tab.
        var tab = elements.filter(function (element) { return element.getAttribute && element.getAttribute('data-view') === pageName; })[0];
        if (tab) return tab;
      } else if (closest(current, 'header nav') && direction[1] > 0) {
        var content = candidates.filter(function (element) { return closest(element, '.view') && !closest(element, '.settings-sidebar'); });
        if (content.length) candidates = content;
      }
    }
    var best = null, score = Infinity;
    candidates.forEach(function (element) {
      var target = element.getBoundingClientRect();
      var dx = target.left + target.width / 2 - x, dy = target.top + target.height / 2 - y;
      var forward = dx * direction[0] + dy * direction[1];
      var cross = Math.abs(dx * direction[1] + dy * direction[0]);
      // Vertical distance chooses the immediate row; horizontal distance breaks ties.
      var candidateScore = vertical ? Math.abs(dy) * 10000 + cross : forward + cross * 3;
      if (candidateScore < score) { score = candidateScore; best = element; }
    });
    return best;
  }};
})();
