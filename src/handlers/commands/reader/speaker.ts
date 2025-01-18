import { Command } from '@/handlers/Command';
import { Voicevox } from '@/modules/Voicevox';
import { ButtonStyle, Colors, ComponentType } from 'discord.js';
import Speaker from '@/models/Speaker';

export default new Command({
    name: 'speaker',
    description: '話者を設定します',
    execute: {
        interaction: async ({ interaction }) => {
            const allSpeakers = await Voicevox.getSpeakers();
            const PAGE_SIZE = 25;
            let currentPage = 0;
            const totalPages = Math.ceil(allSpeakers.length / PAGE_SIZE);

            const getPageSpeakers = (page: number) =>
                allSpeakers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

            const updateInteraction = async () => {
                await interaction.editReply({
                    embeds: [
                        {
                            title: `話者一覧 (ページ ${currentPage + 1}/${totalPages})`,
                            description: '話者を選択してください',
                            color: Colors.Blue,
                            footer: {
                                text: 'Powered by VOICEVOX',
                            },
                        },
                    ],
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.StringSelect,
                                    customId: 'speaker_name_select',
                                    placeholder: '話者を選択',
                                    options: getPageSpeakers(currentPage).map(
                                        (speaker) => ({
                                            label: speaker.name,
                                            value: speaker.name,
                                        }),
                                    ),
                                },
                            ],
                        },
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    customId: 'previous_page',
                                    label: '前のページ',
                                    style: ButtonStyle.Primary,
                                    disabled: currentPage === 0,
                                },
                                {
                                    type: ComponentType.Button,
                                    customId: 'next_page',
                                    label: '次のページ',
                                    style: ButtonStyle.Primary,
                                    disabled: currentPage === totalPages - 1,
                                },
                            ],
                        },
                    ],
                });
            };

            await interaction.followUp({
                embeds: [
                    {
                        title: `話者一覧 (ページ 1/${totalPages})`,
                        description: '話者を選択してください',
                        color: Colors.Blue,
                        footer: {
                            text: 'Powered by VOICEVOX',
                        },
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.StringSelect,
                                customId: 'speaker_name_select',
                                placeholder: '話者を選択',
                                options: getPageSpeakers(currentPage).map(
                                    (speaker) => ({
                                        label: speaker.name,
                                        value: speaker.name,
                                    }),
                                ),
                            },
                        ],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                customId: 'previous_page',
                                label: '前のページ',
                                style: ButtonStyle.Primary,
                                disabled: true,
                            },
                            {
                                type: ComponentType.Button,
                                customId: 'next_page',
                                label: '次のページ',
                                style: ButtonStyle.Primary,
                                disabled: totalPages <= 1,
                            },
                        ],
                    },
                ],
            });

            const msg = await interaction.fetchReply();
            const collector = msg.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 1000 * 60,
            });

            collector.on('collect', async (i) => {
                if (i.isButton()) {
                    if (i.customId === 'next_page') {
                        currentPage = Math.min(currentPage + 1, totalPages - 1);
                    } else if (i.customId === 'previous_page') {
                        currentPage = Math.max(currentPage - 1, 0);
                    }
                    await i.deferUpdate();
                    await updateInteraction();
                }

                if (i.isStringSelectMenu()) {
                    if (i.customId === 'speaker_name_select') {
                        const selectedName = i.values[0];

                        const selectedSpeaker = allSpeakers.find(
                            (speaker) => speaker.name === selectedName,
                        );

                        if (!selectedSpeaker || !selectedSpeaker.styles) {
                            await i.reply({
                                content:
                                    '選択した話者のスタイル情報が見つかりません。',
                                ephemeral: true,
                            });
                            return;
                        }

                        const speakerInfo = await Voicevox.getSpeakerInfo(
                            selectedSpeaker.styles[0].id,
                        );

                        const speakerName = selectedSpeaker.name;

                        await i.update({
                            embeds: [
                                {
                                    title: speakerName,
                                    description:
                                        `**サポートされているスタイル:**\n` +
                                        selectedSpeaker.styles
                                            .map(
                                                (style, index) =>
                                                    `${index + 1}. ${style.name}`,
                                            )
                                            .join('\n'),
                                    color: Colors.Blue,
                                    footer: {
                                        text: 'Powered by VOICEVOX',
                                    },
                                },
                            ],
                            components: [
                                {
                                    type: ComponentType.ActionRow,
                                    components: [
                                        {
                                            type: ComponentType.StringSelect,
                                            customId: 'speaker_name_select',
                                            placeholder: '話者を選択',
                                            options: getPageSpeakers(
                                                currentPage,
                                            ).map((speaker) => ({
                                                label: speaker.name,
                                                value: speaker.name,
                                            })),
                                        },
                                    ],
                                },
                                {
                                    type: ComponentType.ActionRow,
                                    components: [
                                        {
                                            type: ComponentType.StringSelect,
                                            customId: 'speaker_style_select',
                                            placeholder: 'スタイルを選択',
                                            options: selectedSpeaker.styles.map(
                                                (style) => ({
                                                    label: style.name,
                                                    value: style.id.toString(),
                                                }),
                                            ),
                                        },
                                    ],
                                },
                            ],
                        });
                    }

                    if (i.customId === 'speaker_style_select') {
                        const selectedStyleId = parseInt(i.values[0]);

                        const speakerInfo =
                            await Voicevox.getSpeakerInfo(selectedStyleId);

                        const speaker = await Speaker.findOne({
                            userId: interaction.user.id,
                        });
                        if (!speaker) {
                            const newSpeaker = new Speaker({
                                userId: interaction.user.id,
                                speakerId: selectedStyleId,
                            });

                            await newSpeaker.save();
                        } else {
                            speaker.speakerId = selectedStyleId;

                            await speaker.save();
                        }

                        await i.update({
                            embeds: [
                                {
                                    description: `${speakerInfo.speaker.name}を選択しました`,
                                    color: Colors.Blue,
                                    footer: {
                                        text: 'Powered by VOICEVOX',
                                    },
                                },
                            ],
                            components: [],
                        });
                    }
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({
                    components: [],
                });
            });
        },
    },
});
