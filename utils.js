module.exports = {
    get_random: function(list) {
        return list[Math.min(
            Math.floor(Math.random() * list.length),
            list.length - 1
        )];
    },
    random_range: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};