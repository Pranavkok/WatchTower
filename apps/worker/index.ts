import axios from "axios";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { xAckBulk, xReadGroup } from "redisstream/client";
import { prismaClient } from "store/client";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) throw new Error("REGION_ID not provided");
if (!WORKER_ID) throw new Error("WORKER_ID not provided");

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendEmailAlert(to: string, url: string) {
    await mailer.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: `🚨 Alert: ${url} is down`,
        text: `Your monitored website ${url} appears to be down. WatchTower detected this outage and will notify you when it recovers.`,
    });
}

async function sendWhatsAppAlert(to: string, url: string) {
    await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${to}`,
        body: `🚨 WatchTower Alert: Your website ${url} is down!`,
    });
}

async function notifyIfNeeded(websiteId: string, url: string) {
    const previousTick = await prismaClient.website_tick.findFirst({
        where: { website_id: websiteId },
        orderBy: { createdAt: "desc" },
        skip: 1, // skip the one we just created
    });

    // Only notify on first Down or Up→Down transition
    if (previousTick && previousTick.status !== "Up") return;

    const website = await prismaClient.website.findUnique({
        where: { id: websiteId },
    });
    if (!website) return;

    const promises: Promise<unknown>[] = [];

    if (website.notify_email) {
        promises.push(
            sendEmailAlert(website.notify_email, url)
                .then(() => console.log(`Email sent to ${website.notify_email}`))
                .catch((e) => console.error("Email failed:", e.message))
        );
    }
    if (website.notify_phone) {
        promises.push(
            sendWhatsAppAlert(website.notify_phone, url)
                .then(() => console.log(`WhatsApp sent to ${website.notify_phone}`))
                .catch((e) => console.error("WhatsApp failed:", e.message))
        );
    }

    await Promise.all(promises);
}

async function main() {
    while (1) {
        const response = await xReadGroup(REGION_ID, WORKER_ID);

        if (!response) continue;

        let promises = response.map(({ message }) => fetchWebsite(message.url, message.id));
        await Promise.all(promises);

        xAckBulk(REGION_ID, response.map(({ id }) => id));
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>((resolve) => {
        const startTime = Date.now();

        axios.get(url, { timeout: 10000 })
            .then(async () => {
                const endTime = Date.now();
                await prismaClient.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Up",
                        region_id: REGION_ID,
                        website_id: websiteId,
                    },
                });
                resolve();
            })
            .catch(async () => {
                const endTime = Date.now();
                await prismaClient.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Down",
                        region_id: REGION_ID,
                        website_id: websiteId,
                    },
                });
                await notifyIfNeeded(websiteId, url);
                resolve();
            });
    });
}

main();
