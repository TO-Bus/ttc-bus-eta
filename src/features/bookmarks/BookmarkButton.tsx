import { Button } from "@fluentui/react-components";
import { Bookmark24Filled, Bookmark24Regular } from "@fluentui/react-icons";
import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addStopBookmark } from "./stopBookmarkSlice";

export function BookmarkButton(props: {
  stopId: number;
  name: string;
  ttcId: number;
}) {
  const dispatch = useAppDispatch();
  const stopBookmarks = useAppSelector((state) => state.stopBookmarks);
  const checkAndAddBookmark = (stopId: number) => {
    console.log(`${stopId}`);

    dispatch(
      addStopBookmark({
        stopId,
        name: props.name,
        ttcId: props.ttcId,
      })
    );
  };
  const checkBookmarkStatus = useCallback(() => {
    if (stopBookmarks.ids.includes(props.stopId)) {
      console.log(stopBookmarks.ids);
    } else {
      checkAndAddBookmark(props.stopId);
    }
  }, [props.stopId]);

  return (
    <Button
      icon={
        stopBookmarks.ids.includes(props.stopId) ? (
          <Bookmark24Filled />
        ) : (
          <Bookmark24Regular />
        )
      }
      onClick={checkBookmarkStatus}
    />
  );
}
