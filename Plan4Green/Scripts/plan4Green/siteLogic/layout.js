var layout = (function () {
    var init = function () {
        var setBackground = function (imagePath) {
            // converts an absoluate image name to a relative image name, necessary to load from localhost
            var absoluteToRelative = function (imageName) {
                var newName = imageName.substring(imageName.indexOf("Images", 0));
                var splits = newName.split("\\");

                newName = "../../";
                for (var i = 0; i < splits.length; i++) {
                    newName += splits[i];
                    if (i < splits.length - 1) {
                        newName += "/";
                    }
                }

                return newName;
            }

            var backImage = document.getElementById("backgroundImage");
            backImage.src = absoluteToRelative(imagePath);
        }

        ajax.get('/JSON/GetBackgroundImages', function (images) {
            var imageNum = Math.floor(Math.random() * 5);
            setBackground(images[imageNum]);
        });
    }
    window.addEventListener("load", init, false);
}());