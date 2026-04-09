import { Command } from "commander";
import { createArticleCommand } from "./commands/article.js";
import { configCommand } from "./commands/config.js";
import { analyticsCommand } from "./commands/analytics.js";
import { apiKeysCommand } from "./commands/api-keys.js";
import { advertisingCommand } from "./commands/advertising.js";
import { auditLogsCommand } from "./commands/audit-logs.js";
import { categoriesCommand } from "./commands/categories.js";
import { commentsCommand } from "./commands/comments.js";
import { dossiersCommand } from "./commands/dossiers.js";
import { linkerCommand } from "./commands/linker.js";
import { logsCommand } from "./commands/logs.js";
import { mediasCommand } from "./commands/medias.js";
import { newsletterCommand } from "./commands/newsletter.js";
import { notificationsCommand } from "./commands/notifications.js";
import { publicationsCommand } from "./commands/publications.js";
import { schedulingCommand } from "./commands/scheduling.js";
import { seoCommand } from "./commands/seo.js";
import { settingsCommand } from "./commands/settings.js";
import { socialCommand } from "./commands/social.js";
import { socialAccountsCommand } from "./commands/social-accounts.js";
import { socialAnalyticsCommand } from "./commands/social-analytics.js";
import { subscriptionsCommand } from "./commands/subscriptions.js";
import { usersCommand } from "./commands/users.js";

const program = new Command();

program
  .name("etheriatimes")
  .description("Etheria Times CLI - Create, preview and publish articles")
  .version("1.0.0")
  .enablePositionalOptions(false);

createArticleCommand(program);
configCommand(program);
analyticsCommand(program);
apiKeysCommand(program);
advertisingCommand(program);
auditLogsCommand(program);
categoriesCommand(program);
commentsCommand(program);
dossiersCommand(program);
linkerCommand(program);
logsCommand(program);
mediasCommand(program);
newsletterCommand(program);
notificationsCommand(program);
publicationsCommand(program);
schedulingCommand(program);
seoCommand(program);
settingsCommand(program);
socialCommand(program);
socialAccountsCommand(program);
socialAnalyticsCommand(program);
subscriptionsCommand(program);
usersCommand(program);

program.parse(process.argv);
