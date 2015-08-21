angular.module('lineLinksModule', [])
.directive('lineLinksArea', ['$document', '$timeout', function($document, $timeout) {
    return {
      transclude: true,
      template: '<div style="position=relative;">' +
                    '<div style="position: absolute; z-index: 1000;" ng-transclude></div>' +
                    '<canvas style="position: absolute; z-index: 500;"></canvas>' +
                '</div>',
      controller: function($scope, $element) {
        var objectsMap = {};
        var linksMap = {};
        var connectionMap = {};

        var canvasEl = $element.find('canvas');
        var canvas = new fabric.Canvas(canvasEl[0]);
        canvas.setWidth($element.width());
        canvas.setHeight($element.height());

        var addMouseEvents = function(element, areaEl, linkLine, start) {
          var areaOffset = areaEl.offset();

          element.on('mousedown', function (event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          });

          function mousemove(event) {
            var centerX = element[0].offsetLeft + element.width() / 2;
            var centerY = element[0].offsetTop + element.height() / 2;

            if (start) {
              linkLine.set({x1: centerX, y1: centerY, opacity: 1});
            } else {
              linkLine.set({x2: centerX, y2: centerY, opacity: 1});
            }
            canvas.renderAll();
          }

          function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
          }
        };

        var createLine = function(objectElement, connectToElement, color, onSelected) {
          var startLinkObject = objectElement;
          var endLinkObject = connectToElement.closest('[line-link-object]');

          var startCenterX = startLinkObject[0].offsetLeft + startLinkObject.width() / 2;
          var startCenterY = startLinkObject[0].offsetTop + startLinkObject.height() / 2;

          var endCenterX = endLinkObject[0].offsetLeft + endLinkObject.width() / 2;
          var endCenterY = endLinkObject[0].offsetTop + endLinkObject.height() / 2;

          if (color == undefined) {
              color = 'Orange';
          }

          var linkLine = new fabric.Line([startCenterX, startCenterY, endCenterX, endCenterY],
              {
                stroke: color,
                hasControls: false,
                //hasBorders: false
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                shadow: true
              });

          if (onSelected) {
            linkLine.on('selected', onSelected);
          }

          canvas.add(linkLine);
          addMouseEvents(startLinkObject, $element, linkLine, true);
          addMouseEvents(endLinkObject, $element, linkLine, false);

          return linkLine;
        };

        var removeLine = function(objectId, connectionId) {
          if (objectId in linksMap && connectionId in linksMap[objectId]) {
            canvas.remove(linksMap[objectId][connectionId]);
            delete linksMap[objectId][connectionId];
          }
        };

        this.$addLinkConnection = function(id, element, objectId, color, onSelected) {
          connectionMap[objectId][id] = element;

          removeLine(objectId, id);
          $timeout(function() { linksMap[objectId][id] = createLine(objectsMap[id], element, color, onSelected) }, 0);
        };

        this.$addLinkObject = function(id, element) {
          objectsMap[id] = element;
          connectionMap[id] = {};

          if (!(id in linksMap)) {
            linksMap[id] = {};
          }
        };

        this.$removeLinkObject = function(id) {
          if (id in linksMap) {
            removeLine(id);
          }

          if (id in objectsMap) {
            delete objectsMap[id];
          }
        };

        this.$removeLinkConnection = function(id, objectId) {
          removeLine(objectId, id);

          if (objectId in connectionMap && id in connectionMap[objectId]) {
            delete connectionMap[objectId][id];
          }
        };
      }
    }
}])
.directive('lineLinkObject', function() {
  return {
    require: '^lineLinksArea',
      controller: function($scope, $element, $attrs) {
        var id = $scope.$eval($attrs["lineLinkObject"]);

        this.$getId = function() {
          return id;
        };
      },
      link: function(scope, element, attrs, lineLinksAreaController) {
        element.addClass("line-link-object");
        var id = scope.$eval(attrs["lineLinkObject"]);

        lineLinksAreaController.$addLinkObject(id, element);
        element.on('$destroy', function() {
          lineLinksAreaController.$removeLinkObject(id);
        });
      }
  }
})
.directive('lineLinkConnectTo', function() {
  return {
    require: ['^lineLinksArea', '^lineLinkObject'],
    link: function (scope, element, attrs, controllers) {
      var lineLinksAreaController = controllers[0];
      var lineLinkObject = controllers[1];

      element.addClass("line-link-connect-to");

      var connectToObjectid = scope.$eval(attrs["lineLinkConnectTo"]);
      var color = scope.$eval(attrs["lineLinkColor"]);

      if (color == undefined) {
        color = attrs["lineLinkColor"];
      }

      if (attrs['onSelected'] != undefined) {
          var onSelectedCallback = function() {
              scope.$eval(attrs['onSelected']);
          }
      } else {
        var onSelectedCallback = undefined;
      }

      var objectId = lineLinkObject.$getId();

      lineLinksAreaController.$addLinkConnection(connectToObjectid, element, objectId, color, onSelectedCallback);
      element.on('$destroy', function() {
          lineLinksAreaController.$removeLinkConnection(id);
      });
    }
  };
});
