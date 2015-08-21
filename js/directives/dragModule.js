angular.module('dragModule', [])
  .directive('myDraggable', ['$document', function($document) {
    return {
      priority: 200,
      scope: {
        left: '=',
        top: '=',
        mouseUpCallback: '&'
      },
      link: function (scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;

        element.css({
          position: 'absolute',
          cursor: 'pointer'
        });

        if (scope.left !== undefined && scope.top !== undefined ) {
          x = scope.left;
          y = scope.top;

          element.css({
            top: scope.top + 'px',
            left: scope.left + 'px'
          });
        }

        element.on('mousedown', function (event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;

          scope.left = x;
          scope.top = y;

          scope.$apply();

          element.css({
            top: y + 'px',
            left: x + 'px'
          });
        }

        function mouseup() {
          if (scope.mouseUpCallback) {
            scope.mouseUpCallback();
          }

          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
      }
    };
  }]);
