import { Button, Title1 } from "@fluentui/react-components";
import { ArrowClockwise24Regular } from "@fluentui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { ttcVehicleLocation } from "../components/fetch/queries.js";
import styles from "./RelativeVehiclePosition.module.css";

const VehicleLocation = lazy(
  () => import("../components/display/VehicleLocation.js")
);

export default function RelativeVehiclePosition() {
  const params = useParams();
  const stopNum = Number.parseInt(`${params.stopId}`);
  const vehicleId = Number.parseInt(`${params.vehicle}`);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  useEffect(() => {
    document.title = `Stop ID ${stopNum} | TO bus`;
  });

  const ttcVehicleLocationResponse = useQuery({
    ...ttcVehicleLocation(vehicleId),
    queryKey: [`ttc-vehicle-location-${vehicleId}`, lastUpdatedAt.toString()],
  });

  const onRefreshClick = useCallback(() => {
    setLastUpdatedAt(Date.now());
  }, []);

  return (
    <main className={styles["relative-vehicle-position"]}>
      <Title1>Vehicle {vehicleId}</Title1>
      <div className="buttons-row">
        <RefreshButton onClick={onRefreshClick} />
      </div>
      <Suspense>
        {ttcVehicleLocationResponse.data && (
          <VehicleLocation
            stopId={stopNum}
            vehicleId={vehicleId}
            data={ttcVehicleLocationResponse.data}
          />
        )}
      </Suspense>
    </main>
  );
}

function RefreshButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();

  const useOnClick = useCallback(() => {
    onClick();
  }, []);

  return (
    <Button onClick={useOnClick} icon={<ArrowClockwise24Regular />}>
      {t("buttons.refresh")}
    </Button>
  );
}
