const utils = require('../utils');
const api_keys = require('../api_keys.json');
const WolframAlphaAPI = require('wolfram-alpha-node')(api_keys.wolfram_alpha);
const Qty = require('js-quantities');

function get_comparisons(all_comparisons) {
    let to_compare = [];
    for (let i = 0; i < 2; i++) {
        let [values, queries] = utils.get_random(all_comparisons);
        let value = utils.get_random(values);
        let query = utils.get_random(queries);
        if (typeof value === "string") {
            to_compare.push({
                value: value,
                query: query.replace('?', value),
            });
        } else {
            value.query = query.replace('?', value.value);
            to_compare.push(value);
        }
    }
    return to_compare;
}

async function queryAPI(comparison) {
    let response = await WolframAlphaAPI.getShort(comparison.query);
    response_words = response.split(" ");
    if (response_words.includes("to")) {
        // x to y units
        return Qty(utils.random_range(
            response_words[0] * 1,
            response_words[2] * 1
        ) + response_words[3]);
    }

    // We don't care about approximations
    if (response_words[0] === "about") {
        response_words.shift();
    }

    // x units, y smaller-units
    let response_parts = response_words.join("").split(",");
    let result = Qty(response_parts.shift());
    for (let distance of response_parts) {
        result = result.add(distance);
    }
    return result;
}

function log_with_ratio(bigger, smaller) {
    console.log(`Did you know that the ${bigger.query} is equal to ${bigger.size.div(smaller.size)} ${smaller.value}s?`);
}

module.exports = function() {
    (async function(all_comparisons) {
        try {
            let [a, b] = await Promise.all(
                get_comparisons(all_comparisons).map(async function(comparison) {
                    comparison.size = comparison.size ? Qty(comparison.size) : await queryAPI(comparison);
                    return comparison;
                })
            );

            if (a.size.eq(b.size)) {
                console.log(`did you know that the ${a.query} is equal to 1 ${b.value}`);
            } else {
                log_with_ratio(...(a.size.gt(b.size) ? [a, b] : [b, a]));
            }
        } catch (error) {
            console.error("Failed to get your fun fact:\n", error);
        }
    })([
        [require('./animals.json'), ["length of a ?"]],
        [require('./planes.json'), ["wingspan of a ?", "length of a ?"]],
        [require('./mountains.json'), ["height of ?"]],
        [require('./rivers.json'), ["length of the ?"]]
    ]);
};