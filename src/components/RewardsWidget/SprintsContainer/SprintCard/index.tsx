"use client";
import React from "react";
import "./styles.scss";
import { SprintCardModal } from "./SprintCardModal";
import useCustomModal from "@/hooks/common/useCustomModal";
import Image from "next/image";
import { CategoryTask } from "@/store/types/rewards";
import { X_ICON } from "@/utils/images";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export const SprintCard = ({title,description,active,points,creative,id,index, category_id}:CategoryTask) => {
  const { open, handleClose, handleOpen } = useCustomModal();
  const {address}=useAccount();
  return (
    <motion.div
    initial={{
      opacity:0
    }}
    transition={{
      delay: 0.2 + (index || 0) / 30
    }}
    animate={{
      opacity:1
    }}
     className="Sprint">
      <div className="SprintDetails">
        <div className="Logo">
          <Image src={creative} height={30} width={30} alt="task logo" className="Icon"/>
        </div>
        <span className="Label">{title}</span>
      </div>
      <div className="SprintActions">
        <div className="SprintPoints">{points} points</div>
        <div className="SprintButton" onClick={()=>{
          address===undefined ? null:handleOpen();
        }}>
          View Details
        </div>
      </div>
      {
        open &&  <SprintCardModal open={open} handleClose={handleClose} taskId={id} description={description} title={title} points={points} creative={creative} category_id={category_id}/>
      }
    </motion.div>
  );
};
