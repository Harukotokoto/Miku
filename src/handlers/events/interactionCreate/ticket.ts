import { Event } from '@/handlers/Event';
import { Colors, ComponentType, TextInputStyle } from 'discord.js';
import { Ticket } from '@/libraries/Classes/Modules/Ticket';
import { client } from '@/index';

export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        try {
            const ticket = new Ticket(interaction);
            if (interaction.customId === 'ticket_button') {
                await interaction.showModal({
                    title: 'Support Ticket',
                    customId: `ticket_modal-${interaction.message.id}`,
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    customId: 'topic',
                                    label: 'タイトル',
                                    style: TextInputStyle.Short,
                                    placeholder: '何について問い合わせますか？',
                                    minLength: 3,
                                    maxLength: 25,
                                    required: true,
                                },
                            ],
                        },
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    customId: 'issue',
                                    label: '問題',
                                    style: TextInputStyle.Paragraph,
                                    placeholder:
                                        'どのような問題が発生していますか',
                                    minLength: 5,
                                    maxLength: 250,
                                    required: true,
                                },
                            ],
                        },
                    ],
                });
            }

            if (interaction.customId === 'ticket_close') {
                const reply = await interaction.reply({
                    content: `<@!${interaction.user.id}> 5秒後にチケットを閉じます`,
                });

                setTimeout(async () => {
                    await ticket.close();
                    await reply.delete();
                }, 5000);
            }

            if (interaction.customId === 'reopen-ticket') {
                await ticket.reopen();
            }

            if (interaction.customId === 'write-logs') {
                await ticket.writeLogs();
            }

            if (interaction.customId === 'delete-ticket') {
                await ticket.deleteChannel();
            }
        } catch (e) {
            await client.errorLog.sendErrorLog({ message: e as string });

            await interaction.followUp({
                embeds: [
                    {
                        description:
                            'エラーが発生しました\n' +
                            '```\n' +
                            `${e}\n` +
                            '```',
                        color: Colors.Red,
                        footer: client.footer(),
                    },
                ],
            });
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('ticket_modal')) {
            const newChannel = await Ticket.create(interaction);

            if (!newChannel) {
                return;
            }

            await interaction.reply({
                content: `チケットを作成しました <#${newChannel}>`,
                ephemeral: true,
            });
        }
    }
});
