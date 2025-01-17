import axios from 'axios';
import fs from 'fs';

export async function generateAudio(
    text: string,
    filepath: string,
    voice: string,
) {
    const audio_query = await axios.post(
        `${process.env.VOICEVOX_API}/audio_query?text=${encodeURI(text)}&speaker=${voice}`,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const synthesis = await axios.post(
        `${process.env.VOICEVOX_API}/synthesis?speaker=` + voice,
        audio_query.data,
        {
            responseType: 'arraybuffer',
            headers: {
                accept: 'audio/wav',
                'Content-Type': 'application/json',
            },
        },
    );

    fs.writeFileSync(filepath, Buffer.from(synthesis.data), 'binary');
}
