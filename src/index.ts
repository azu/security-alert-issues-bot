import lodash from "lodash";
import {Application} from 'probot' // eslint-disable-line no-unused-vars
const getConfig = require('probot-config');
type Config = {
    // https://lodash.com/docs/#template
    titleTemplate?: string;
    bodyTemplate?: string;
    // Default labels
    labels?: string[];
}
const CONFIG_NAME = "security-alert-issues-bot.yml";
export = (app: Application) => {
    app.on('issues.opened', async (context) => {
        const issueComment = context.issue({body: 'Thanks for opening this issue!'});
        await context.github.issues.createComment(issueComment)
    });
    app.on("repository_vulnerability_alert.create", async context => {
        const config: Config = await getConfig(context, CONFIG_NAME, {
            titleTemplate: "Vulnerability found in <%= alert.affected_package_name %> <%= alert.affected_range %>",
            bodyTemplate: `
- Affected Package: [<%= alert.affected_package_name %>](https://www.npmjs.com/package/<%= alert.affected_package_name %>) <%= alert.affected_range %>
- Fixed in [<%= alert.fixed_in %>](https://npmfs.com/package/<%= alert.affected_package_name %>/<%= alert.fixed_in %>/)

**How to fix?**

Upgrade <%= alert.affected_package_name %> to version <%= alert.fixed_in %> or later. For example:

\`\`\`
"dependencies": {
  "<%= alert.affected_package_name %>": ">=<%= alert.fixed_in %>"
}
\`\`\`

or…

\`\`\`
"devDependencies": {
  "<%= alert.affected_package_name %>": ">=<%= alert.fixed_in %>"
}
\`\`\`

## Details

- [<%= alert.external_identifier %>](<%= alert.external_reference %>)

`,
            labels: ["security"]
        });
        const compiledTitle = lodash.template(config.titleTemplate);
        const compiledBody = lodash.template(config.bodyTemplate);
        const title = compiledTitle(context.payload);
        const body = compiledBody(context.payload);
        const labels = config.labels;
        const repo = context.payload.repository.name;
        const owner = context.payload.repository.owner.login;
        await context.github.issues.create({
            owner,
            repo,
            title,
            body,
            labels
        });
    });
}
