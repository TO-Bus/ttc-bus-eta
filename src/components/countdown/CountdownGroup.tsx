import { Link as LinkFluent, Text, Title2 } from "@fluentui/react-components";
import { Link } from "react-router-dom";

import { LineStopEta } from "../../models/etaObjects";
import { CountdownRow } from "./CountdownRow";

export default function CountdownGroup(props: { detail: LineStopEta }) {
  const countdownRowList = props.detail.etas.map((item) => (
    <CountdownRow item={item} key={item.tripTag} />
  ));

  if (props.detail.etas.length === 0) {
    return null;
  } else
    return (
      <li>
        <div className="stopPredictionDetails">
          <Link to={`/lines/${props.detail.line}`} className="routerLink">
            <LinkFluent>
              <Title2>
                {props.detail.etas.length === 0
                  ? props.detail.line
                  : props.detail.line}
              </Title2>
            </LinkFluent>
          </Link>

          <Text>{props.detail.routeName}</Text>
          {countdownRowList}
        </div>
      </li>
    );
}
