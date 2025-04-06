import { Card, Link as LinkFluent, Text } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { subwayLines } from "../../data/ttc.js";
import { TtcBadge } from "../badges.js";
import RawDisplay from "../rawDisplay/RawDisplay.js";
import { ttcLines } from "./queries.js";

const parseRouteTitle = (input: string) => {
  const routeTitleRegex = /\d+-/;
  if (routeTitleRegex.test(input)) {
    return input.replace(routeTitleRegex, "");
  } else {
    return input;
  }
};

export function RoutesInfo() {
  const lineData = useQuery(ttcLines);
  const [routesDb, setRoutesDb] = useState<{ tag: number; title: string }[]>(
    []
  );

  useEffect(() => {
    if (lineData.data?.route && (lineData.data?.route.length ?? 0) > 0) {
      setRoutesDb(lineData.data.route);
      // addRoutes(lineData.data.route);
    }
  }, [lineData]);

  const routesCards = routesDb.map((routeItem) => {
    return (
      <li key={routeItem.tag} id={routeItem.tag.toString()}>
        <Card className="card-container clickableCard">
          <Link className="route-card" to={`/lines/${routeItem.tag}`}>
            <TtcBadge key={routeItem.tag} lineNum={`${routeItem.tag}`} />
            <Text>{parseRouteTitle(routeItem.title)}</Text>
          </Link>
        </Card>
      </li>
    );
  });

  return (
    <article>
      {/* <ul className="jumpbar">
        <li>
          <a href="#200">
            <LinkFluent><Button>
              Seasonal</Button></LinkFluent>
          </a>
        </li>
        <li><a href="#300"><LinkFluent><Button>Night</Button></LinkFluent></a></li>
        <li><a href="#300"><LinkFluent><Button>Community</Button></LinkFluent></a></li>
        <li><a href="#501"><LinkFluent><Button>Streetcar</Button></LinkFluent></a></li>
        <li><a href="#900"><LinkFluent><Button>Express</Button></LinkFluent></a></li>
      </ul> */}
      <JumpBar />
      <ul className="route-list">
        {subwayCards()}
        {routesCards}
      </ul>
      {lineData.data && <RawDisplay data={lineData} />}
    </article>
  );
}

function subwayCards() {
  const result = subwayLines.map((subwayLine) => {
    return (
      <li key={subwayLine.line}>
        <Card className="card-container clickableCard">
          <Link className="route-card" to={`/lines/${subwayLine.line}`}>
            <TtcBadge
              key={subwayLine.line}
              lineNum={subwayLine.line.toString()}
            />
            <Text>{parseRouteTitle(subwayLine.name)}</Text>
          </Link>
        </Card>
      </li>
    );
  });
  return result;
}

function JumpBar() {
  const jumpbarMap = [
    ["", "Regular"],
    [200, "Seasonal"],
    [300, "Night"],
    [501, "Streetcar"],
    [900, "Express"],
  ];

  const jumpbarItems = [];
  for (let index = 0; index < jumpbarMap.length; index++) {
    jumpbarItems.push(
      <li key={index}>
        <a href={`#${jumpbarMap[index][0]}`}>
          <LinkFluent>{jumpbarMap[index][1]}</LinkFluent>
        </a>
      </li>
    );
  }
  return <ul className="jumpbar">{jumpbarItems}</ul>;
}
