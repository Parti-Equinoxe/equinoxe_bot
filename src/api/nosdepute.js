//https://www.nosdeputes.fr

const axios = require("axios");
module.exports.getDeputes = async () => {
    const data = (await axios.get("https://www.nosdeputes.fr/recherche/?object_name=Parlementaire&format=json&count=500")).data;
    /*for (const d of data) {

    }*/
}
//https://www.npmjs.com/package/node-ical
/**
 * @param {string} nom - le nom du deputé
 * @return {[{slug: string, nom: string}]}
 */
module.exports.searchDepute = async (nom) => {
    const data = (await axios.get(`https://www.nosdeputes.fr/recherche/${nom}?object_name=Parlementaire&format=json&count=15`)).data;
    let result = [];
    for (const d of data.results) {
        const info = await this.getDeputeInfoByID(d.document_id);
        if (!info) continue;
        result.push({
            slug: info.slug,
            nom: info.nom,
        });
    }
    return result;
}
/**
 * @param {string} id - l'id du depute
 * @return {Object} l'info du députe
 */
module.exports.getDeputeInfoByID = async (id) => {
    const data = (await axios.get(`https://www.nosdeputes.fr//api/document/Parlementaire/${id}/json`)).data;
    if (!data) return false;
    return data.depute;
}
/**
 * @param {string} slug - le slug du depute
 * @return {Object} l'info du députe
 */
module.exports.getDeputeInfoBySlug = async (slug) => {
    const data = (await axios.get(` https://www.nosdeputes.fr/${slug}/json`)).data;
    if (!data) return false;
    return data.depute;
}