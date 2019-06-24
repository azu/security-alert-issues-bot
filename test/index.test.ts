// You can import your modules
// import index from '../src/index'

import nock from "nock";
// Requiring our app implementation
import myProbotApp from "../src";
import {Probot} from "probot";
// Requiring our fixtures
import repository_vulnerability_alert_payload from "./fixtures/repository_vulnerability_alert.create.json";

nock.disableNetConnect();

describe("security-alert-issues-bot", () => {
    let probot: any;

    beforeEach(() => {
        probot = new Probot({id: 123, cert: "test"});
        // Load our app into probot
        const app = probot.load(myProbotApp);

        // just return a test token
        app.app = () => "test";
    });

    test("creates new issue when receive repository_vulnerability_alert.create", async done => {
        // Test that we correctly return a test token
        nock("https://api.github.com")
            .post("/app/installations/2/access_tokens")
            .reply(200, {token: "test"});
        nock("https://api.github.com")
            .get("/repos/azu/.github/contents/.github/security-alert-issues-bot.yml")
            .reply(404, {
                "message": "Not Found",
                "documentation_url": "https://developer.github.com/v3/repos/contents/#get-contents"
            });
        nock("https://api.github.com")
            .get("/repos/azu/github-webhook-SecurityVulnerability-test/contents/.github/security-alert-issues-bot.yml")
            .reply(404, {
                "message": "Not Found",
                "documentation_url": "https://developer.github.com/v3/repos/contents/#get-contents"
            });
        // Test that a comment is posted
        nock("https://api.github.com")
            .post("/repos/azu/github-webhook-SecurityVulnerability-test/issues", (body: any) => {
                done(expect(body).toMatchSnapshot());
                return true;
            })
            .reply(200);

        // Receive a webhook event
        await probot.receive({name: "repository_vulnerability_alert", payload: repository_vulnerability_alert_payload});
    });
});
