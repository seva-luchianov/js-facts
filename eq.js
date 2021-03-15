const utils = require('./utils');

module.exports = function() {
    // The 6 crippedled horslads of apocalyps
    let falses = ['""', '0', 'undefined', 'null', 'false', '[]'];
    let operators = ["<", "<=", "==", ">=", ">"];
    let permuted = [];
    let shit_list = [];
    let bueno_list = [];

    for (const f1 of falses) {
        next_false: for (const f2 of falses) {
            let expected = [false, true, true, true, false];

            for (const [p1, p2] of permuted) {
                if (p1 === f1 && p2 === f2) {
                    break next_false;
                }
            }

            next_operator: for (const o of operators) {
                if (o === '==' && f1 === f2) {
                    break next_operator;
                }
                let statement = `(${f1} ${o} ${f2})`;
                let result = eval(statement);
                (result === expected.pop() ? bueno_list : shit_list).push([statement, result]);
                permuted.push([f1, f2]);
            }
        }
    }

    let [bueno_statement, bueno_result] = utils.get_random(bueno_list);
    let [shit_statement, shit_result] = utils.get_random(shit_list);

    console.log(
        `Did you know in JS, ${bueno_statement} is ${bueno_result} but`,
        `${shit_statement} is ${bueno_result === shit_result ? "also " : ""}${shit_result}?`
    );
};