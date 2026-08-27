-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `n8nWebhookUrl` VARCHAR(500) NULL,
    ADD COLUMN `whatsappWebhookToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_whatsappWebhookToken_key` ON `organizations`(`whatsappWebhookToken`);
