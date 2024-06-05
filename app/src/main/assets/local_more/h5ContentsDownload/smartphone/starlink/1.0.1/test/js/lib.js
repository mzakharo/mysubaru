/* javascript functions */
(function () {
    var lib = {};

    lib.parseGet = function () {
        var elm = null;
        var paramn = null;
        var paramv= null;
        var result = [];
        var i = 0;

        if (1 < window.location.search.length) {
            var q = window.location.search.substring(1);
            var p = q.split("&");
            for(i=0; i<p.length; i++) {
                elm = p[i].split("=");
                paramn = decodeURIComponent(elm[0]);
                paramv = decodeURIComponent(elm[1]);
                result[paramn] = paramv;
            }
        }
        if (result) return result;
        else return null;
    };

    window.lib = lib;
})();
