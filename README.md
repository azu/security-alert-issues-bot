# security-alert-issues-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that [Probot] Sync GitHub Security Alerts and GitHub Issues.

## Features

Sync Security Alerts and Issues.

### Security Alert -> Issue

- Receive new [security alert](https://help.github.com/en/articles/about-security-alerts-for-vulnerable-dependencies#about-security-vulnerabilities) and Create new issue.
- Resolve security alert and Close the issue

### Issue -> Security Alert

- Close Issue and Resolve Security Alert
- Re-Open Issue and Unresolve Security Alert

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Contributing

If you have suggestions for how security-alert-issues-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 azu <azuciao@gmail.com>
