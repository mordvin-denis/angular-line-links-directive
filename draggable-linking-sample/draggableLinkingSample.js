'use strict';

angular.module('DraggableSampleModule', ['lineLinksModule', 'dragModule'])
    .controller('DraggableSampleController', function ($scope) {
        $scope.items = [
            {id: 0, title: 'Programming language features', left: 500, top: 0},
            {id: 1, title: 'Typing', left: 300, top: 70},
            {id: 2, title: 'Paradigm', left: 800, top: 70},
            {id: 3, title: 'Static', left: 100, top: 170},
            {id: 4, title: 'Dynamic', left: 500, top: 170},

            {id: 5, title: 'Procedural', left: 600, top: 170},
            {id: 6, title: 'Functional', left: 700, top: 170},
            {id: 7, title: 'OOP', left: 800, top: 170},
            {id: 9, title: 'Structural', left: 900, top: 170}
        ];

        $scope.items[1].dependencies = [{id: $scope.items[0].id, color: 'red'}];
        $scope.items[2].dependencies = [{id: $scope.items[0].id, color: 'red'}];

        $scope.items[3].dependencies = [{id: $scope.items[1].id, color: 'blue'}];
        $scope.items[4].dependencies = [{id: $scope.items[1].id, color: 'blue'}];

        $scope.items[5].dependencies = [{id: $scope.items[2].id, color: undefined}];
        $scope.items[6].dependencies = [{id: $scope.items[2].id, color: undefined}];
        $scope.items[7].dependencies = [{id: $scope.items[2].id, color: undefined}];
        $scope.items[8].dependencies = [{id: $scope.items[2].id, color: undefined}];

        $scope.onSelected = function(item) {
            alert('Item ' + item.id + ' selected');
        }
    });
