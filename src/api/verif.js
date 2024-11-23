const {get} = require("axios");
const {query} = require("./bdd.js");

module.exports.sendMail = async (userID, mail) => {
    let re = false;
    if ((await query(`SELECT COUNT(*).nb FROM verif WHERE userID = "${userID}" AND TIMEDIFF(NOW(), date) > INTERVAL 15 MINUTE`)).length > 0) {
        re=true;
        await query(`DELETE FROM verif WHERE userID = "${userID}"`);
    }
    const response = await get(`https://parti-equinoxe.fr/api/verif/mail/${mail}`).catch((e) => {
        return {data: {error: e}};
    }).data;
    if (response.error) {
        console.log(response.data.error);
        return {valide: false, message: ":x: Une erreur est survenue."};
    }
    if (!response.valide) return {
        valide: false,
        messages: ":no_entry_sign: Cette adresse mail n'est pas enregistré comme adhérant."
    };
    await query(`INSERT INTO verif VALUES ("${userID}", "${response.code}", CURRENT_DATE)`);
}
module.exports.verifCode = async (userID, code) => {
    if ((await query(`SELECT COUNT(*).nb FROM verif WHERE userID = "${userID}" AND TIMEDIFF(NOW(), date) > INTERVAL 15 MINUTE AND code=${code}`)).length !==1) {
        return {valide: false, message: ":x: Le code n'est plus valide ou vous n'avez pas saisi le bon code."};
    }
}