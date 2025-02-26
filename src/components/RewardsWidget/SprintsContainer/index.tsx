"use client"
import React, { act, useState } from "react";
import "./styles.scss";
import { SprintCard } from "./SprintCard";
import { useMediaQuery } from "usehooks-ts";
import GradientText from "@/components/common/GradientText";
import { easeInOut, motion } from "framer-motion";
import Box from "@mui/material/Box";
import { FaSortDown } from "react-icons/fa6";
import { useFetchCategoryTask } from "@/hooks/Rewards/useFetchCategoryTask";
import { CategoryTask } from "@/store/types/rewards";
import { NEW_TASKS, NO_TASKS } from "@/utils/images";
import { FaSortUp } from "react-icons/fa6"
import Image from "next/image";
import { CustomSpinner } from "@/components/common/CustomSpinner";
import { useRewardsStore } from "@/store/rewards-store";
import { useShallow } from "zustand/react/shallow";
import { useAccount } from "wagmi";

export const SprintsContainer = () => {
  const mobileDevice=useMediaQuery('(max-width:600px)')
  const {address}=useAccount();
  const [open,setOpen]=useState<boolean>(false);
  const {
    activeTab
  }=useRewardsStore(useShallow((state)=>({
    activeTab:state.activeTab
  })))
  const {tasks,loading}=useFetchCategoryTask(activeTab);
  const Category=[
    {
      name:"All",
      categoryId:5
    },
    {
      name:"Social Sprints",
      categoryId:1
    },
    {
      name:"Volume Sprints",
      categoryId:2
    },
    {
      name:"Daily Missions",
      categoryId:3
    },
    {
      name:"Campaign Sprints",
      categoryId:4
    },
    
  ]
  const currentItem=Category.filter((item)=>item.categoryId===activeTab);
  return (
    <div className={`SprintsContainer ${open ? "InActive":""}`}>
     {!mobileDevice ? <div className="TabsContainer">
        {
          Category.map((item)=>{
            return <div key={item.categoryId} className={activeTab===item.categoryId ? "ActiveTab" : "Tab"} onClick={()=>{
              useRewardsStore.setState({
                activeTab:item.categoryId
              })
            }}>
              {item.name}
            </div>
          })
        }
      </div>
      :
      <div className="TabHeadingMobile">
        <div className="ActiveTab" onClick={()=>{
            setOpen(true)
          }}>
          <GradientText text={currentItem[0].name}/>
          {!open && <div >
          <FaSortDown className="downIcon"/>
          </div>
        }
        </div>
       {open && 
        <motion.div 
        initial={{
             opacity: open ? 1:0
          }}
        transition={{ times: [0, 0.1, 0.9, 1] }}
        animate={{ 
          opacity: open ? 1:0,
        }}
        className="DropdownContainerWrapper">
          <div className="dropdownContainer">
          {Category.map((item, index) => (
              <Box key={index} className={index===Category.length-1 ? "NavigationLink LastLink":"NavigationLink"} onClick={()=>{
                useRewardsStore.setState({
                  activeTab:item.categoryId
                })
                setOpen(false)
          }}>
              <GradientText text={item.name}/>
              {index===0 ? <FaSortUp className="upIcon"/>:""}
            </Box>
            ))}
          </div>
            
        </motion.div>}
          </div>
      }
      <div  className={`SprintsBottomContainer ${open ? "InActive":""}`}>
      {!loading ? tasks.length>0 ? <div className="ActiveSprints">
      {
        tasks.map((item:CategoryTask,index:number)=>{
          return <SprintCard key={item.id} id={item.id} title={item.title} description={item.description} active={item.active} points={item.points} creative={item.creative} category_id={item.category_id} index={index}/>
        })
      }
      </div>
      :
      <div className="NoTaskDisplay">
        <Image src={NO_TASKS} height={65} width={65} alt="no tasks"/>
        <span>New Tasks are coming</span>
      </div>
      :
      <CustomSpinner size="30" color="#757575"/>
      }
      </div>
     
    </div>
  );
};
