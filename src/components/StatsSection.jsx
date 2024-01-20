import React, { useEffect, useRef, useState } from "react";

import silhouetteImg from "../assets/silhouette.svg";

const IncrementingStat = ({ targetCount, subheader, img }) => {
  const statHeaderRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 1000; // Animation duration in milliseconds
            const steps = 60; // Number of steps for the animation
            const stepSize = targetCount / steps;

            let currentCount = 0;

            const intervalId = setInterval(() => {
              currentCount += stepSize;

              // Ensure the count doesn't exceed the targetCount
              currentCount = Math.min(currentCount, targetCount);

              setCount(Math.round(currentCount));

              if (currentCount >= targetCount) {
                clearInterval(intervalId);
              }
            }, duration / steps);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statHeaderRef.current) {
      observer.observe(statHeaderRef.current);
    }

    return () => {
      if (statHeaderRef.current) {
        observer.unobserve(statHeaderRef.current);
      }
    };
  }, [targetCount]);

  return (
    <div className="stat">
      <div className="stat__figure">
        <img className="stat__img" src={img} alt="Silhouette"></img>
      </div>
      <h2 ref={statHeaderRef} className="stat__header">
        {count.toLocaleString()}
      </h2>
      <h3 className="stat__subheader">{subheader}</h3>
    </div>
  );
};

const StatsSection = ({ targetCount, subheader, img }) => {
  return (
    <IncrementingStat
      targetCount={targetCount}
      subheader={subheader}
      img={img}
    />
  );
};

export default StatsSection;
