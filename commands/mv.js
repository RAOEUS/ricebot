const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mv")
    .setDescription("Moves a message to another channel")
    .addStringOption((option) =>
      option
        .setName("messageid")
        .setDescription("The ID of the message you want to move")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The destination of the message")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for moving the message")
        .setRequired(true)
    )
    //Prohibit anyone in a guild from using the command unless a specific overwrite is configured or the user has the Administrator permission flag:
    .setDefaultMemberPermissions(0),
  async execute(interaction) {
    const messageId = interaction.options.getString("messageid");
    const curChannel = interaction.client.channels.cache.get(
      interaction.channelId
    );
    const channelDestination = interaction.options.get("channel").value;
    const reason = interaction.options.getString("reason");

    const message = await curChannel.messages.fetch(messageId);

    const destination =
      interaction.guild.channels.cache.get(channelDestination);

    const urls = [];
    if (message.attachments.size > 0) {
      message.attachments.forEach((file) => {
        urls.push(file.url);
      });
    }

    await destination.send({
      content: `*Post by <@${message.author.id}> moved from <#${interaction.channelId}>*:\n\n${message.content}`,
      files: urls,
    });

    await message.delete();

    await interaction.reply(
      `<@${message.author.id}>, your message has been moved to <#${channelDestination}> for the following reason:\n> ${reason}\nThank you for understanding.`
    );
  },
};
