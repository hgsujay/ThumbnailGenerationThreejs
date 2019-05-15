// Loades files from the filesystem and parses the 3d model file

var Loader = function (editor) {
    var scope = this;
    this.texturePath = '';
    this.loadFiles = function (files, callback) {
        if (files.length > 0) {
            var filesMap = createFileMap(files);
            var manager = new THREE.LoadingManager();
            manager.setURLModifier(function (url) {
                var file = filesMap[url];
                if (file) {
                    console.log('Loading', url);
                    return URL.createObjectURL(file);
                }
                return url;
            });
            for (var i = 0; i < files.length; i++) {
                scope.loadFile(files[i], manager, callback);
            }
        }
    };
    this.loadFile = function (file, manager, callback) {
        var filename = file.name;
        var extension = filename.split('.').pop().toLowerCase();
        var reader = new FileReader();
        reader.addEventListener('progress', function (event) {
            console.log('Loading', filename);
        });
        switch (extension) {
            case 'obj':
                reader.addEventListener('load', function (event) {
                    var contents = event.target.result;
                    var object = new THREE.OBJLoader().parse(contents);
                    object.name = filename;
                    callback(object);
                }, false);
                reader.readAsText(file);
                break;
            default:
                //alert( 'Unsupported file format (' + extension +  ').' );
                break;
        }
    };

    function createFileMap(files) {
        var map = {};
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            map[file.name] = file;
        }
        return map;
    }
};
