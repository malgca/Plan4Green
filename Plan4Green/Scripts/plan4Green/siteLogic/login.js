var login = (function () {
    var links = {
        login: document.getElementById("loginLink"),
        signup: document.getElementById("signupLink")
    }

    init = function () {
        var linkEvents = (function (event) {
            logindown = function (event) {
                document.getElementById("loginForm").style.visibility = "collapse";
                document.getElementById("signupForm").style.visibility = "visible";
            }

            signupdown = function (event) {
                document.getElementById("loginForm").style.visibility = "visible";
                document.getElementById("signupForm").style.visibility = "collapse";
            }

            return {
                logindown: logindown,
                signupdown: signupdown
            }
        }());

        links.login.addEventListener("mousedown", linkEvents.logindown, false);
        links.signup.addEventListener("mousedown", linkEvents.signupdown, false);

        // ensure that we're looking at the login screen on start.
        document.getElementById("loginForm").style.visibility = "visible";
        document.getElementById("signupForm").style.visibility = "collapse";
    }

    window.addEventListener("load", init, false);
}());