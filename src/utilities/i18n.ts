import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import i18nextBackend from "i18next-node-fs-backend";
import { join } from "path";

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: join(__dirname, "../../../public/locales/{{lng}}/{{ns}}.json"),
    },
    fallbackLng: "en",
    preload: ["en"],
  });

const locale = i18nextMiddleware.handle(i18next);

export default locale;
