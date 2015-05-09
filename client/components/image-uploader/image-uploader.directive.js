'use strict';

angular.module('pApp')
  .directive('imageUploader', function (Upload, $http) {
    return {
      templateUrl: 'components/image-uploader/image-uploader.html',
      restrict: 'EA',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$formatters.unshift(function(v) {
          scope.image = v;
        });
        element[0].addEventListener("dragover", function(e) {
          e = e || event;
          //console.log(e);
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }, false);       
        element[0].addEventListener("drop", function(e) {
          e = e || event;
          e.preventDefault();
        }, false);
        scope.upload = function($files) {
          if(!scope.uploading && $files && $files.length) {
            //TODO: check file type and size
            scope.uploading = true;
            Upload.upload({
              url: 'https://api.cloudinary.com/v1_1/parks-brainstorm/upload',
              fields: {
                upload_preset: 'dz2tvgod' 
              },
              file: $files[0]
            }).progress(function(e) {
              scope.progress = Math.floor(e.loaded * 100.0 / e.total);
              scope.status = 'Uploading... ' + scope.progress + '%';
            }).success(function(data) {
              if(data.resource_type==='raw' || data.format==='pdf') {
                $http.post('/api/screenshots', {url:data.url})
                .success(function(result) {
                  data.public_id = result.public_id;
                  ngModel.$setViewValue(data);
                  scope.image = data;
                  scope.uploading = false;
                });
              }
              else {
                ngModel.$setViewValue(data);
                scope.image = data;
                scope.uploading = false; 
              }
            });
          }
        };
      }
    };
  });