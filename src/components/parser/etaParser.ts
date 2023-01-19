import { EtaBusWithID, LineStopEta } from "../../data/etaObjects";
import { EtaBus, EtaDirection, EtaPredictionXml } from "../../data/etaXml";
import { parseRoute } from "./routeName";

const parseActualLineNum = (title: string) => {
  const found = title.match(/\w+ - (\w+) /);
  if (found === null) {
    return "";
  } else return `${found[1]}`.toLocaleUpperCase();
};

const pushIntoEta = (eta: EtaBusWithID[], item: EtaBus) => {
  return eta.push({
    id: `${item.tripTag}`,
    seconds: item.seconds,
    vehicle: item.vehicle,
    branch: item.branch,
    tripTag: item.tripTag,
    epochTime: item.epochTime,
    minutes: item.minutes,
    isDeparture: item.isDeparture,
    affectedByLayover: item.affectedByLayover,
    dirTag: item.dirTag,
    block: item.block,
  });
};

const parseSingleOrMultiEta = (
  input: EtaBus | EtaBus[],
  result: LineStopEta[]
) => {
  if (Array.isArray(input)) {
    for (const item of input) {
      pushIntoEta(result[result.length - 1].etas, item);
    }
  } else {
    const item = input;
    pushIntoEta(result[result.length - 1].etas, item);
  }
};

export const etaParser = (json: EtaPredictionXml) => {
  const result: LineStopEta[] = [];

  if (Object.keys(json).length === 0) {
    return [];
  }

  if (Array.isArray(json.body.predictions)) {
    for (const element of json.body.predictions) {
      // Only lines with etas are listed
      if (element.dirTitleBecauseNoPredictions === undefined) {
        if (Array.isArray(element.direction)) {
          const stopName = element.stopTitle;
          const stopTag = parseInt(element.stopTag);

          for (const el3 of element.direction) {
            result.push({
              line: parseActualLineNum(el3.title),
              stopName,
              routeName: parseRoute(el3.title),
              etas: [],
              stopTag,
            });
            parseSingleOrMultiEta(el3.prediction, result);
          }
        } else {
          result.push({
            line: parseActualLineNum(element.direction.title),
            stopName: element.stopTitle,
            routeName: parseRoute(element.routeTitle),
            etas: [],
            stopTag: parseInt(element.stopTag),
          });
          parseSingleOrMultiEta(element.direction.prediction, result);
        }
      } else {
        result.push({
          line: parseActualLineNum(element.dirTitleBecauseNoPredictions),
          stopName: element.stopTitle,
          routeName: parseRoute(element.routeTitle),
          etas: [],
          stopTag: parseInt(element.stopTag),
        });
      }
    }
    // if no line have ETA, keep a title
    if (result.length === 0) {
      result.push({
        line: "",
        stopName: json.body.predictions[0].stopTitle,
        routeName: "",
        etas: [],
        stopTag: parseInt(json.body.predictions[0].stopTag),
      });
    }
  } else {
    if (json.body.predictions.dirTitleBecauseNoPredictions === undefined) {
      if (Array.isArray(json.body.predictions.direction)) {
        // 1 prediction, 2 directions
        // Eg. stops/14761 returns 939A, 939B
        const predictionGroup = json.body.predictions;

        // const line = predictionGroup.direction.title;
        const stopName = predictionGroup.stopTitle;
        const stopTag = parseInt(predictionGroup.stopTag);
        if (Array.isArray(predictionGroup.direction)) {
          for (const element of predictionGroup.direction) {
            // Only lines with etas are listed
            if (element.dirTitleBecauseNoPredictions === undefined) {
              result.push({
                line: parseActualLineNum(element.title),
                stopName,
                routeName: "",
                etas: [],
                stopTag,
              });
              parseSingleOrMultiEta(element.prediction, result);
            } else {
              result.push({
                line: parseActualLineNum(element.dirTitleBecauseNoPredictions),
                stopName,
                routeName: "",
                etas: [],
                stopTag,
              });
            }
          }
        }

        // if no line have ETA, keep a title
        if (result.length === 0 && Array.isArray(json.body.predictions)) {
          result.push({
            line: "",
            stopName: json.body.predictions[0].stopTitle,
            routeName: "",
            etas: [],
            stopTag: parseInt(json.body.predictions[0].stopTag),
          });
        }
        return result;
      } else {
        const predictionGroup = json.body.predictions;
        // multiple lines => multiple directions

        const getLine = (input: EtaDirection | EtaDirection[]) => {
          if (Array.isArray(input)) {
            return parseActualLineNum(input[0].title);
          } else {
            return parseActualLineNum(input.title);
          }
        };

        result.push({
          line: getLine(predictionGroup.direction),
          stopName: predictionGroup.stopTitle,
          routeName: parseRoute(predictionGroup.routeTitle),
          etas: [],
          stopTag: parseInt(predictionGroup.stopTag),
        });

        parseSingleOrMultiEta(
          json.body.predictions.direction.prediction,
          result
        );
      }
    } else {
      result.push({
        line: parseActualLineNum(
          json.body.predictions.dirTitleBecauseNoPredictions
        ),
        stopName: json.body.predictions.stopTitle,
        routeName: "",
        etas: [],
        stopTag: parseInt(json.body.predictions.stopTag),
      });
    }
  }
  return result;
};
