var login = (function () {
    var ajaxVars = {
        // list of available background images
        imageList: 'JSON/GetBackgroundImages'
    }

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
            backImage.style.width = window.innerWidth;
            backImage.style.width = window.innerHeight;
            backImage.src = absoluteToRelative(imagePath);
        }

        $.ajax({
            cache: false,
            type: "POST",
            url: ajaxVars.imageList,
            dataType: "json",
            data: JSON.stringify(ajaxVars.imageList),
            success: function (images) {
                var imageNum = Math.floor(Math.random() * 5);
                setBackground(images[imageNum]);
            }
        });

    }

    window.onload = init;
    // send item to json

    // show validation warnings

}());