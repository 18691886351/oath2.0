var localUtils = {
    type: function(o) {
        var s = Object.prototype.toString.call(o);
        return s.match(/\[object (.*?)\]/)[1].toLowerCase();
    }
}

module.exports = localUtils;

