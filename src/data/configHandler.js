const fs = require('fs');
const path = require('path');

const replaceAliasRgx = new RegExp("alias<(?<file>\\w+)>:(?<var>.+)");
const replaceNotFound = "";

function replaceAliasInObject(obj) {
    for (const key in obj) {
        const field = obj[key];
        delete obj[key];
        if (typeof field === 'string') {
            obj[replaceAlias(key)] = replaceAlias(field);
        } else if (typeof field === 'object') {
            obj[replaceAlias(key)] = replaceAliasInObject(field);
        } else {
            obj[replaceAlias(key)] = field;
        }
    }
    return obj;
}

function replaceAlias(str) {
    return str.replace(replaceAliasRgx, (match, file, varName) => {
        const filePath = path.join(__dirname, `utils/${file}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`Le fichier ${filePath} est introuvable.`);
            return replaceNotFound;
        }
        let fileContent;
        try {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
            return replaceNotFound;
        }
        const value = getValueFromPath(fileContent, varName);
        if (value === undefined){
            console.error(`La variable (string) ${varName} n'existe pas dans le fichier ${file}.`);
            return replaceNotFound;
        }
        if (typeof value !== 'string') {
            console.error(`La variable ${varName} dans le fichier ${file} n'est pas un string.`);
            return replaceNotFound;
        }
        return value;
    });
}

function getValueFromPath(jsonObject, path) {
    if (!path) {
        return jsonObject;
    }
    const keys = path.split('.');
    let value = jsonObject;
    for (const key of keys) {
        value = value[key];
        if (value === undefined) {
            return undefined;
        }
    }
    return value;
}

class ConfigHandler {
    constructor(configPath) {
        this.configPath = configPath;
        this.config = {};

        this.reload();
    }

    reload() {
        try {
            this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        } catch (error) {
            console.error('Erreur lors du rechargement de la configuration:', error);
            return;
        }
        try {
            replaceAliasInObject(this.config);
        }
        catch (error) {
            console.error('Erreur lors du remplacement des alias:', error);
            return;
        }
    }

    get(fieldName) {
        const value = getValueFromPath(this.config, fieldName);
        if (value === undefined)
            throw new Error(`The field ${fieldName} do not exist in the config.`);
        return value;
    }

    // predicate: (key, value) => boolean
    // result: { sucess: boolean, value: any, key: string }
    tryGetFrist(predicate, result, path = "") {
        if (!result) {
            throw new Error("result need to be initalized.");
        }
        const value = getValueFromPath(this.config, path);
        for (const key in value) {
            if (predicate(key, value[key])) {
                result.sucess = true;
                result.key = key;
                result.value = value[key];
                return true;
            }
        }
        result.sucess = false;
        return false;
    }

    tryGet(fieldName, result) {
        if (!result) {
            throw new Error("result need to be initalized.");
        }
        const value = getValueFromPath(this.config, fieldName);
        if (value !== undefined) {
            result.sucess = true;
            result.value = this.config[fieldName];
            return true;
        }
        result.sucess = false;
        return false;
    }

}

module.exports = ConfigHandler;