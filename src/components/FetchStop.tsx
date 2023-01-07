import { Button, Text, Title1, Title2 } from "@fluentui/react-components";
import { ArrowClockwise24Regular } from "@fluentui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LineStopEta } from "../data/EtaObjects";
import { EtaPredictionXml } from "../data/EtaXml";
import { BookmarkButton } from "../features/bookmarks/BookmarkButton";
import { fluentStyles } from "../styles/fluent";
import RawDisplay from "./RawDisplay";
import CountdownGroup from "./countdown/CountdownGroup";
import { etaParser } from "./parser/EtaParser";

const { XMLParser } = require("fast-xml-parser");

function StopPredictionInfo(props: { stopId: number }): JSX.Element {
  const [data, setData] = useState<EtaPredictionXml>();
  const [stopId] = useState(props.stopId);
  const [etaDb, setEtaDb] = useState<LineStopEta[]>([]);
  const { t } = useTranslation();
  const overrides = fluentStyles();

  const fetchPredictions = (stop: number = stopId) => {
    fetch(
      `https://webservices.umoiq.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=${stop}`,
      {
        method: "GET",
      }
    ).then((response) => {
      response.text().then((str) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const dataJson = parser.parse(str);
        setData(dataJson);
        console.log(dataJson);
        setEtaDb(etaParser(dataJson));
      });
    });
  };

  const fetchPredictionsClick = useCallback(() => {
    fetchPredictions();
  }, []);

  function RefreshButton() {
    return (
      <Button
        className={overrides.refreshButton}
        onClick={fetchPredictionsClick}
        icon={<ArrowClockwise24Regular />}
      >
        {t("buttons.refresh")}
      </Button>
    );
  }

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (data !== undefined) {
    console.log(etaDb);

    if (data.body.Error === undefined) {
      return (
        <div className="directionsList list">
          {etaDb[0] !== undefined ? (
            <Title2 className="top-row">
              {etaDb[0].stopTag} - {etaDb[0].stopName}
            </Title2>
          ) : null}
          <div className="countdown-row">
            <RefreshButton />
            <BookmarkButton
              stopId={stopId}
              name={etaDb[0].stopName}
              ttcId={etaDb[0].stopTag}
            />
          </div>

          {etaDb.map((element) => (
            <CountdownGroup
              key={`${element.line}-${element.stopTag}`}
              detail={element}
            />
          ))}
          {etaDb.length === 1 && etaDb[0].line === "" ? (
            <Title1>{t("reminder.noRoute")}</Title1>
          ) : null}
          <RawDisplay data={data} />
        </div>
      );
    } else {
      // if (data.body.Error !== undefined)
      return (
        <div>
          <Title1>{t("reminder.failToLocate")}</Title1>
          <div className="countdown-row">
            <RefreshButton />
            <BookmarkButton
              stopId={stopId}
              name={etaDb[0].stopName}
              ttcId={etaDb[0].stopTag}
            />
          </div>
          <Text>{data.body.Error}</Text>
          <RawDisplay data={data} />
        </div>
      );
    }
  } else {
    return (
      <div>
        <Title1>{t("reminder.loading")}</Title1>
        <div className="countdown-row">
          <RefreshButton />
        </div>
      </div>
    );
  }
}
export default StopPredictionInfo;
