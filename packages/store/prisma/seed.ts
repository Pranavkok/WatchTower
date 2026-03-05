import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
    await prisma.region.upsert({
        where: { id: "us-east-1" },
        update: {},
        create: {
            id: "us-east-1",
            name: "US East 1"
        }
    });
    console.log("Seeded region: us-east-1");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
