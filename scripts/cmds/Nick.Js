module.exports = {
	config: {
		name: "nickall",
		aliases: ["Nickall", "nick", "unnick"],
		version: "1.0",
		author: "ChatGPT",
		countDown: 10,
		role: 1,
		description: {
			en: "Change or remove nicknames of all group members"
		},
		category: "box chat",
		guide: {
			en: "   {pn} <nickname>: change the nickname of all members"
				+ "\n   {pn} unnick: remove nicknames from all members"
		}
	},

	langs: {
		en: {
			missingNickname: "⚠ | Please enter a nickname.",
			changing: "⏳ | Changing nicknames, please wait...",
			removing: "⏳ | Removing nicknames, please wait...",
			resultNick: "**Nickname changed successfully for %1 members.**\n**Success: %2 members**\n**Failed: %3 members**",
			resultUnnick: "**Nicknames removed successfully for %1 members.**\n**Success: %2 members**\n**Failed: %3 members**",
			noPermission: "⚠ | Only admins can use this command."
		}
	},

	onStart: async function ({ message, event, args, api, role, getLang }) {

		if (role < 1)
			return message.reply(getLang("noPermission"));

		const action = args[0]?.toLowerCase();

		// Get group members
		const threadInfo = await api.getThreadInfo(event.threadID);
		const members = threadInfo.participantIDs || [];

		if (members.length === 0)
			return message.reply("⚠ | No members found.");

		// UNNICK
		if (action === "unnick") {
			message.reply(getLang("removing"));

			let success = 0;
			let failed = 0;

			for (const userID of members) {
				try {
					await new Promise((resolve, reject) => {
						api.changeNickname(
							"",
							event.threadID,
							userID,
							(err) => {
								if (err)
									return reject(err);
								resolve();
							}
						);
					});

					success++;
				}
				catch (error) {
					failed++;
				}
			}

			const total = success + failed;

			return message.reply(
				getLang("resultUnnick", total, success, failed)
			);
		}

		// NICKALL
		const nickname = args.join(" ").trim();

		if (!nickname)
			return message.reply(getLang("missingNickname"));

		message.reply(getLang("changing"));

		let success = 0;
		let failed = 0;

		for (const userID of members) {
			try {
				await new Promise((resolve, reject) => {
					api.changeNickname(
						nickname,
						event.threadID,
						userID,
						(err) => {
							if (err)
								return reject(err);
							resolve();
						}
					);
				});

				success++;
			}
			catch (error) {
				failed++;
			}
		}

		const total = success + failed;

		return message.reply(
			getLang("resultNick", total, success, failed)
		);
	}
};
