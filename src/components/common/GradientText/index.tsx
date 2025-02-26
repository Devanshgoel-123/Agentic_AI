import React from "react";
import "./styles.scss";

interface Props {
  text: string;
}

const GradientText = ({ text }: Props) => {
  return <span className="GradientText">{text}</span>;
};

export default GradientText;
