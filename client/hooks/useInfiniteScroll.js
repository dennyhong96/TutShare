import React, { useCallback, useState, useRef } from "react";

const useInfiniteScroll = (newItemsLength, limit, loadMoreCallback) => {
  const observerRef = useRef();
  const prevItemsLength = useRef(0);
  const numItemsToSkip = useRef(newItemsLength);
  const [isLoading, setLoading] = useState(false);

  // Infinite Scrolling
  const lastNodeRef = useCallback(
    (lastNodeRef) => {
      if (!newItemsLength) return;
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting && // If the last current last node is on the screen
          newItemsLength - prevItemsLength.current >= limit // And there are more nodes to fetch
        ) {
          loadMoreCallback();
        }
      });
      if (lastNodeRef) observerRef.current.observe(lastNodeRef); // Observe the last node
    },
    [isLoading, newItemsLength]
  );

  return {
    setLoading,
    isLoading,
    lastNodeRef,
    numItemsToSkip,
    prevItemsLength,
  };
};

export default useInfiniteScroll;
