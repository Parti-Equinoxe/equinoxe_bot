const fs = require("fs");
const {cyan, redBright} = require("cli-color");
const configRoleReact = require("../../interactions/buttons/contribuer/config.json").blacklist;
const {roles} = require("../../api/permanent");

//const fileList = [];
const customIDList = [];

module.exports = (client) => {
    roleReact();
    let dirs = fs.readdirSync("./interactions/buttons/");
    if (dirs.length === 0) return;
    console.log(cyan.underline("Buttons chargés :"));
    dirs = dirs.filter((file) => !file.includes("."));
    dirs.push("../buttons");
    dirs.forEach((dir) => {
        // Check if the file is not double loaded
        const files = fs.readdirSync(`./interactions/buttons/${dir}/`).filter((file) => file.endsWith(".js"));
        if (files.length === 0) return;
        console.log(cyan.bold(`> ${dir === "../buttons" ? "sans catégorie" : dir} :`));
        files.forEach((file) => {
            //if (fileList.includes(file)) console.log(redBright.bold(`>> Le button ${file} est déjà chargé ou un deuxième fichier button à le même nom dans le dossier ${dir} !`));
            //fileList.push(file);
            const button = require(`../../interactions/buttons/${dir}/${file}`);
            if (button) {
                // Check if the button customID is defined
                if (button.customID === undefined) return console.log(redBright.bold(`>> Le button dans ${file} n'a pas de customID !`));
                // Check if another button don't have the same customID
                if (customIDList.includes(button.customID)) return console.log(redBright.bold(`>> Le button avec comme id ${button.customID} est déjà chargé ou un doublon existe dans le fichier ${file} situé dans le dossier ${dir} !`));
                customIDList.push(button.customID);

                //Si admin et userOnly non défini, on les défini à false :
                if (!button.admin) button.admin = false;
                if (!button.userOnly) button.userOnly = false;

                button.category = dir === "../buttons" ? "sans_categorie" : dir.toLowerCase();
                console.log(cyan(`  > ${button.customID}`));
                if (dir !== "../buttons") button.customID = `${dir}:${button.customID}`;
                client.buttons.set(button.customID, button);
            }
        });
    });
};

function roleReact() {
    const contribuer = fs.readdirSync("./interactions/buttons/contribuer").filter((file) => file.endsWith(".js")).map((file) => file.replace(".js", ""));
    const listeRoles = Object.keys(roles).filter((role)=> !role.includes("responsable") && !role.includes("referent")).filter((role) => !configRoleReact.includes(role) && !contribuer.includes(role));
    if (listeRoles.length === 0) return;
    console.log(cyan(`>> ${listeRoles.length} roleReact à ajouter :`));
    for (const role of listeRoles) {
        let code = "const {roles} = require(\"../../../api/permanent.js\");\nconst {rolereact} = require(\"../../../api/role.js\");\n"
        code += "module.exports = {\n";
        code += `    customID: \"${role}\",\n`;
        code += "    runInteraction: async (client, interaction) => {\n";
        code += `        return rolereact(interaction, roles.${role});\n    }\n}`;
        fs.writeFileSync(`./interactions/buttons/contribuer/${role}.js`, code);
        console.log(cyan(`- ${role}.js`));
    }
}
