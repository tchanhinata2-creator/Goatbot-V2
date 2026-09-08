const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'nickall',
    description: 'Change the nickname of all members',
    
    async execute(message, args) {
        // Admin only
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('**You must be an administrator to use this command.**');
        }

        const nickname = args.join(' ');

        if (!nickname) {
            return message.reply('**Usage: Nickall <nickname>**');
        }

        let success = 0;
        let failed = 0;

        await message.guild.members.fetch();

        for (const member of message.guild.members.cache.values()) {
            if (member.user.bot) continue;

            try {
                await member.setNickname(nickname);
                success++;
            } catch (error) {
                failed++;
            }
        }

        const total = success + failed;

        return message.channel.send(
            `**Nickname changed successfully for ${total} members.**\n` +
            `**Success: ${success} members**\n` +
            `**Failed: ${failed} members**`
        );
    }
};
