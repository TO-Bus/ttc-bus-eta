import { Accordion, Title1 } from "@fluentui/react-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import RouteInfo from "../components/fetch/FetchRoute";

export default function Line() {
  const params = useParams();
  const { t } = useTranslation();

  const lineNum = parseInt(`${params.lineId}`);
  useEffect(() => {
    document.title = t("lines.browserTitle", { lineNum });
  });
  return (
    <main className="linePage">
      <Title1>{t("lines.number", { lineNum })}</Title1>
      <Accordion defaultOpenItems collapsible>
        <RouteInfo line={lineNum} />
      </Accordion>
    </main>
  );
}
