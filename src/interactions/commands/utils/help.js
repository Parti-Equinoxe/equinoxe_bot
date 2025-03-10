const {ChatInputCommandInteraction, Client, EmbedBuilder, MessageFlags} = require("discord.js");
const {readdirSync} = require("fs");
const {couleurs, roles} = require("../../../api/permanent.js");
const {userARole} = require("../../../api/role");
let dirsCategory = readdirSync("./interactions/commands/").filter((file) => !file.includes("."));
dirsCategory.push("../commands");
module.exports = {
	name: "help",
	options: [
		{
			name: "commande",
			description: "La commande dont vous voulez voir les informations.",
			type: 3,
			required: false,
			autocomplete: true,
		},
	],
	description: "La commande d'aide, avec la liste des commandes et leurs spécificités.",
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	runInteraction: async (client, interaction) => {
		const cmdName = interaction.options.getString("commande");
		if (!cmdName) {
			const noArgsEmbed = new EmbedBuilder().setColor(couleurs.noir).addFields([{
				name: "La liste des commandes :",
				value: "Une liste de toutes les catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez `/help <command>`",
			}]);
			
			for (let category of dirsCategory) {
				if (category !== "admin" || (userARole(interaction.member.roles.cache, roles.administrateur) || userARole(interaction.member.roles.cache, roles.bureau))) {
					if (category === "../commands") category = "sans_categorie";
					const cmdsUtilisable = client.commands.filter((cmd) => cmd.category === category.toLowerCase()).map((cmd) => {
						const cmdID = client.application.commands.cache.find((x) => x.name === cmd.name).id;
						if (!cmd.isCommandeGroupe) return `</${cmd.name}:${cmdID}>`;
						let cmds = [];
						for (const subCmd of cmd.options) {
							cmds.push(`</${cmd.name} ${subCmd.name}:${cmdID}>`);
						}
						return cmds.join(", ");
					}).join(", ");
					if (cmdsUtilisable.length > 0) {
						noArgsEmbed.addFields([
							{
								name: `__> ${(category !== "sans_categorie" ? category : "sans catégorie").replace(/(^\w|\s\w)/g, (firstLetter) => firstLetter.toUpperCase())} :__`,
								value: `${cmdsUtilisable === "" ? "Pas de commande" : cmdsUtilisable}`,
							},
						]);
					}
					
				}
			}
			return interaction.reply({embeds: [noArgsEmbed]});
		}
		const cmd = client.commands.get(cmdName);
		if (!cmd) return interaction.reply({
			content: `:x: \`${cmdName}\` n\'est pas une commande valide !`,
			flags: [MessageFlags.Ephemeral]
		});
		//usage :
		
		const cmdId = client.application.commands.cache.find(x => x.name === cmdName).id;
		//embed :
		if (cmd.isCommandeGroupe) {
			let fields = [{
				name: "Information : ",
				value: `\`\`\`yml\nCatégorie : ${cmd.category !== "sans_categorie" ? cmd.category : "sans catégorie"}\`\`\``
			}];
			for (const subCmd of cmd.options) {
				if (cmd.options) {
					fields.push({
						name: `Commande : </${cmdName} ${subCmd.name}:${cmdId}>`,
						value: `${subCmd.description}\n\`\`\`yml\nUsage : ${usage(subCmd, cmdName + " " + subCmd.name)}\n${options(subCmd)}\`\`\``
					});
				}
			}
			const embed = new EmbedBuilder()
				.setTitle(`Information sur le groupe de commande : __${cmdName}__`)
				.setDescription(cmd.description)
				.addFields(fields)
				.setColor(couleurs.noir)
				.setFooter({text: "💭 <> = obligatoire et [] = optionnel"});
			return interaction.reply({embeds: [embed]});
		}
		const embed = new EmbedBuilder()
			.setTitle(`Information sur la commande : </${cmdName}:${cmdId}>`)
			.setDescription(cmd.description)
			.addFields([{
				name: "Information : ",
				value: `\`\`\`yml\nCatégorie : ${cmd.category !== "sans_categorie" ? cmd.category : "sans catégorie"}\nUsage : ${usage(cmd, cmdName)}\`\`\``
			}])
			.setColor(couleurs.noir)
			.setFooter({text: "💭 <> = obligatoire et [] = optionnel"});
		if (cmd.options) {
			embed.addFields({
				name: "Les options de la commande :",
				value: `\`\`\`yml\n${options(cmd)}\`\`\``
			});
		}
		return interaction.reply({embeds: [embed]});
	},
	
	/**
	 * @param {AutocompleteInteraction} interaction
	 * @param {Client} client
	 */
	runAutocomplete: async (client, interaction) => {
		const focusedOptions = interaction.options.getFocused(true);
		let choices = client.commands?.map((c) => {
			if (c.category !== "admin" || (userARole(interaction.member.roles.cache, roles.administrateur) || userARole(interaction.member.roles.cache, roles.bureau))) {
				return c.name;
			}
		});
		//vire les undefined
		choices = choices.filter((c) => c);
		if (!choices) return;
		const filtered = choices.filter((c) => c.includes(focusedOptions.value.toLowerCase()));
		const filterLimite = filtered.slice(0, 15);
		await interaction.respond(filterLimite.map((c) => ({name: `/${c}`, value: c})));
	},
};

function usage(cmd, cmdName) {
	let usage = `/${cmdName}`;
	if (cmd.options) {
		for (const opt of cmd.options) {
			usage += ` ${(opt.required ? "<" : "[")}${opt.name}${(opt.required ? ">" : "]")}`;
		}
	}
	return usage;
}

function options(cmd) {
	let opts = "";
	if (cmd.options) {
		for (const opt of cmd.options) {
			opts += opt.name + " : " + opt.description + "\n";
		}
	}
	return opts;
}