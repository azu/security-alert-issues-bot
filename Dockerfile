FROM node:10

LABEL version="1.0.0"
LABEL repository="https://github/azu/security-alert-issues-bot"
LABEL maintainer="azu <azuciao@gmail.com>"

LABEL com.github.actions.name="Security Alert Issues Action"
LABEL com.github.actions.description="Sync GitHub Security Alerts and GitHub Issues."
LABEL com.github.actions.icon="plus"
LABEL com.github.actions.color="green"

ENV PATH=$PATH:/app/node_modules/.bin
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

ENTRYPOINT ["probot", "receive"]
CMD ["/app/index.js"]
