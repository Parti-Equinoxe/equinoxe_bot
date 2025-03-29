const fs = require('fs');
const path = require('path');
const pathForAlias = "../data/utils/"
const pathForLongText = "../data/utils/textes/";
const replaceAliasRgx = new RegExp("alias<(?<file>\\w+?)>:(?<var>.+?):");
const replaceTextRgx = new RegExp("longtext<(?<file>\\w+?)>");

/**
 * Remplace les alias dans un objet et renvois le resulta dans un nouvel objet
 * @param {Object} obj l'object à remplacer les alias
 * @returns {string} le nouvel object avec les alias remplacés
 */
function replaceAliasInObject(obj) {
    const newObj = {};
    for (const key in obj) {
        const field = obj[key];
        if (typeof field === 'string') {
            newObj[replaceAlias(key, false)] = replaceAlias(field);
        } else if (typeof field === 'object') {
            newObj[replaceAlias(key, false)] = replaceAliasInObject(field);
        } else {
            newObj[replaceAlias(key, false)] = field;
        }
    }
    return newObj;
}

// Remontée une exception si une erreur survient ?
/**
 * Remplace tous alias respectant le forma de replaceAliasRgx "alias<(?<file>\\w+)>:(?<var>.+)" dans un string
 * @param {string} str le string à remplacer les alias
 * @param {boolean} emptyIfError si true, remplace l'alias avec une string vide si une erreur survient, sinon conserver l'alias avec l'erreur ajouter
 * @returns {string} le string avec les alias remplacés
 */
function replaceAlias(str, emptyIfError = true) {
    return str.replace(replaceAliasRgx, (match, file, varName) => {
        const filePath = path.join(__dirname, `${pathForAlias}${file}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`Le fichier ${filePath} est introuvable.`, match);
            return emptyIfError ? "" : match + "_error(file not found)";
        }
        let fileContent;
        try {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            console.error(`Erreur lors de la lecture du fichier ${filePath}:`, match, error);
            return emptyIfError ? "" : match + "_error(file read error)";
        }
        const value = getValueFromPath(fileContent, varName);
        if (value === undefined) {
            console.error(`La variable (string) ${varName} n'existe pas dans le fichier ${file}.`, match);
            return emptyIfError ? "" : match + "_error(var not found)";
        }
        if (typeof value !== 'string') {
            console.error(`La variable ${varName} dans le fichier ${file} n'est pas un string.`, match);
            return emptyIfError ? "" : match + "_error(var not string)";
        }
        return value;
    }).replace(replaceTextRgx, (match, file, varName) => {
        const filePath = path.join(__dirname, `${pathForLongText}${file}.txt`);
        if (!fs.existsSync(filePath)) {
            console.error(`Le fichier ${filePath} est introuvable.`, match);
            return emptyIfError ? "" : match + "_error(file not found)";
        }
        let fileContent;
        try {
            fileContent = fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            console.error(`Erreur lors de la lecture du fichier ${filePath}:`, match, error);
            return emptyIfError ? "" : match + "_error(file read error)";
        }
        return fileContent;
    });
}

/**
 * Récupère une valeur dans un object en suivant un chemin "valeurs.sous-valeur"
 * @param {Object} jsonObject l'object dans le quelle rechercher la valeur
 * @param {String} path le chemin pour accéder à la valeur
 * @returns {any} la valeur si trouvé, sinon undefined
 */
function getValueFromPath(jsonObject, path) {
    if (!path) {
        return jsonObject;
    }
    const keys = path.split('.');
    let value = jsonObject;
    for (const key of keys) {
        value = value[key];
        if (!value) {
            return undefined;
        }
    }
    return value;
}

class ConfigHandler {
    constructor(configPath) {
        this.configPath = configPath;
        this.reload();
        console.log(this.config);
    }

    /**
     * @typedef {Object} PossibleResult
     * @property {boolean} sucess si la valeur a été trouvé
     * @property {any} value la valeur trouvé
     */

    /**
     * recharge la configuration
     * @returns {void}
     */
    reload() {
        try {
            this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        } catch (error) {
            console.error('Erreur lors du rechargement de la configuration:', error);
            return;
        }
        try {
            this.config = replaceAliasInObject(this.config);
        }
        catch (error) {
            console.error('Erreur lors du remplacement des alias:', error);
            return;
        }
    }

    /**
     * récupère une valeur dans la configuration
     * @param {string} fieldName le nom du champ à chercher du forma "valeurs.sous-valeur"
     * @throws si le champ n'existe pas
     * @returns {any} la valeur du champ
     */
    get(fieldName) {
        const value = getValueFromPath(this.config, fieldName);
        if (value === undefined)
            throw new Error(`The field ${fieldName} do not exist in the config.`);
        return value;
    }

    /**
     * essaye de trouve la premier valeur dans la config qui repsecte le prédicat
     * @param {function(string, any): boolean} predicate le prédictat pour trouver la première valeur, en premier paramètre la clé et en deuxième la valeur
     * @param {PossibleResult} result le résultat de la recherche { sucess: boolean, value: any, key: string }, doit être initialisé
     * @param {string} path le chemin pour accéder à la valeur
     * @returns {boolean} true si une valeur a été trouvé, false sinon
     */
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

    /**
     * essaye de trouve le premier champs dans la config
     * @param {string} fieldName le nom du champ à chercher du forma "valeurs.sous-valeur"
     * @param {PossibleResult} result le résultat de la recherche { sucess: boolean, value: any }, doit être initialisé
     * @returns {boolean} true si le champ a été trouvé, false sinon
     */
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