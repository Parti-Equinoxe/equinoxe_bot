//https://www.nosdeputes.fr

const axios = require("axios");
module.exports.getDeputes = async () => {
    const data = (await axios.get("https://www.nosdeputes.fr/recherche/?object_name=Parlementaire&format=json&count=500")).data;
    console.log(data);
    /*for (const d of data) {

    }*/
}
//https://www.npmjs.com/package/node-ical
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
    console.log(result);
    return result;
}
module.exports.getDeputeInfoByID = async (id) => {
    const data = (await axios.get(`https://www.nosdeputes.fr//api/document/Parlementaire/${id}/json`)).data;
    if (!data) return false;
    return data.depute;
}
module.exports.getDeputeInfoBySlug = async (slug) => {
    const data = (await axios.get(` https://www.nosdeputes.fr/${slug}/json`)).data;
    console.log(data);
    if (!data) return false;
    return data.depute;
}