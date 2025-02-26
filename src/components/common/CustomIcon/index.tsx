import Image from "next/image";
import React from "react";

interface Props {
  src: string;
}

const CustomIcon = ({ src }: Props) => {
  return (
    <>
      <Image
        width={0}
        height={0}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src={src}
        alt="eddy"
        loading="lazy"
      />
    </>
  );
};

export default CustomIcon;
