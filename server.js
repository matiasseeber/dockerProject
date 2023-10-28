import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import * as Sentry from "@sentry/node";

const app = express();

const sentryDSN = process.env.SENTRY_DSN;

Sentry.init({
    dsn: sentryDSN,
    environment: process.env.ENVIRONMENT || "DEV",
    includeLocalVariables: true,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app })
    ],
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(compression({
    filter: () => true,
    threshold: 0
}));
app.use(morgan("dev"));
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(cors());
app.options('*', cors());

app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use(bodyParser.json({
    limit: '10mb'
}));

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

dotenv.config();

const port = process.env.PORT || 8080;

export const callback = (req, res) => {
    try {
        if (!req.body.msg || req.body.msg != "Ping") throw new Error('Request Body should be "Ping"');
        res.status(200).json({ msg: "Pong" });
    } catch (error) {
        Sentry.captureException(error);
        res.status(400).json(error)
    }
};

app.post('/', callback);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;