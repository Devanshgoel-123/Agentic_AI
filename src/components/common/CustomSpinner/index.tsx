"use client";
import { useEffect, useState } from "react";
import React from "react";
import { ring } from "ldrs";

interface Props {
  size: string;
  color: string;
}

export const CustomSpinner = ({ size, color }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      ring.register();
      setIsClient(true);
    }
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <>
      <l-ring
        size={size}
        stroke="5"
        bg-opacity="0"
        speed="2"
        color={color}
      ></l-ring>
    </>
  );
};
