import { createClient } from "redis";

const client = await createClient({
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {url: string, id: string}
type MessageType = {
    id: string,
    message: {
        url: string,
        id: string
    }
    //@ts-ignore
}

const STREAM_NAME = "betteruptime:website";

async function xAdd({url, id}: WebsiteEvent) {
    await client.xAdd(
        STREAM_NAME, '*', {
            url,
            id
        }
    );
}

export async function xAddBulk(websites: WebsiteEvent[]) {
    for (let i = 0; i < websites.length; i++) {
        await xAdd({
            url: websites[i].url,
            id: websites[i].id
        })
    }
}

async function ensureGroupExists(consumerGroup: string) {
    try {
        await client.xGroupCreate(STREAM_NAME, consumerGroup, '$', { MKSTREAM: true });
    } catch (err: any) {
        if (!err?.message?.includes('BUSYGROUP')) {
            throw err;
        }
    }
}

export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> {
    await ensureGroupExists(consumerGroup);

    const res = await client.xReadGroup(
        consumerGroup, workerId, {
            key: STREAM_NAME,
            id: '>'
        }, {
        'COUNT': 5
        }
    );

    //@ts-ignore
    let messages: MessageType[] | undefined = res?.[0]?.messages;

    return messages;
}

async function xAck(consumerGroup: string, eventId: string) {
    await client.xAck(STREAM_NAME, consumerGroup, eventId)
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
    eventIds.map(eventId => xAck(consumerGroup, eventId));
}