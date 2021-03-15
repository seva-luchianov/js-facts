const WolframAlphaAPI = require('wolfram-alpha-node')('XGUG3E-EGU55V252G');

const list = require('./rivers.json');
const qs = ["length of the ? River"];

let clean = [];

async function queryAPI(comparison) {
    let query = comparison.query.replace('?', comparison.value);
    console.log("query", query);
    try {
        await WolframAlphaAPI.getShort(query);
        return true;
    } catch (e) {
        return false;
    }
}

(async () => {
    for (const element of list) {
        let valid = true;
        for (const q of qs) {
            let result = await queryAPI({
                value: element,
                query: q
            });

            if (!result) {
                valid = false;
                console.log("delete", element);
                break;
            }
        }

        if (valid) {
            clean.push(element);
        }
    }

    console.log("clean:", clean.toString());
})();