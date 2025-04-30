const {readdirSync,} = require("node:fs");
const {readFileSync} = require("fs");
const activation = require("../../activation.json");
const config = {
    calendar: activation.calendar ? require("../data/utils/calendar.json") : {},
    roles: activation.roles ? require("../data/utils/roles.json") : {},
    salons: activation.salons ? require("../data/utils/salons.json") : {},
    categories: activation.categories ? require("../data/utils/categories.json") : {},
    files: activation.files ? getTexteFiles("./data/textes") : [],
    test: activation.test ? require("../data/utils/test.json") : {},
};
console.dir(config, {depth: null});

const regexAlias = /&&(\w+):(\w+)&&/g;//pattern : &&<type d'alias>:<nom>&&
const activation_keys = Object.keys(activation);

const aliasTypeTransform = {
    roles: (value) => config.roles[value] ? `<@&${config.roles[value]}>` : `##No role ${value}##`,
    files: (value) => {
        if (config.files.includes(value)) {
            let text = readFileSync(`./data/textes/${value}.txt`, "utf-8");
            //if (regexAlias.test(text)) text = remplaceAlias(text);
            return text;
        }
        return `##No file ${value}##`
    },
    salons: (value) => config.salons[value] ? `<#${config.salons[value]}>` : `##No salon ${value}##`,
};

function getTexteFiles(folder) {
    const files = readdirSync(folder);
    const textFiles = files.filter((file) => file.endsWith(".txt"));
    return textFiles.map((file) => file.replace(".txt", ""));
}

function remplaceAlias(text) {
    if (typeof text != "string") return text;
    console.log(`Testing : ""${text}""`);
    regexAlias.lastIndex = 0;
    let m;
    while ((m = regexAlias.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regexAlias.lastIndex) {
            regexAlias.lastIndex++;
        }
        const type = m[1], name = m[2];
        if (!aliasTypeTransform[type] || !aliasTypeTransform[type](name)) {
            console.log(`Cette alias n'existe pas : ${type}:${name}`);
            continue;
        }
        if (!activation[type]) continue;
        text = text.replaceAll(`&&${type}:${name}&&`, aliasTypeTransform[type](name));
        if (type === "files") regexAlias.lastIndex = 0;//sinon sa skip des matchs
    }
    return text;
}

function parcours_alias(obj) {
    for (const k in obj) {
        if (typeof obj[k] == "object") {
            parcours_alias(obj[k]);
        } else {
            if (regexAlias.test(obj[k])) {
                obj[k] = remplaceAlias(obj[k]);
            }
        }
    }
}

parcours_alias(config);

module.exports = new Proxy(config, {
    get(target, key) {
        if (!activation_keys.includes(key)) throw new Error(`La catégorie '${key}' n'existe pas !!`);
        if (!activation[key]) throw new Error(`La catégorie '${key}' n'est pas activé !!`);
        return target[key];
    }
});
