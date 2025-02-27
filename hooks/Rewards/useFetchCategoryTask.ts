import { GET_REWARD_CATEGORY_TASK } from "@/components/graphql/queries/getRewardsCategoryTask";
import { CategoryTask } from "@/store/types/rewards";
import { useQuery } from "@apollo/client";



export const useFetchCategoryTask=(category_id:Number,all?:boolean)=>{
    const {data,loading}=useQuery(GET_REWARD_CATEGORY_TASK,{
        variables:{
          categoryId:category_id,
          all:category_id===5 || false
        },
        skip:category_id===0
})
  const tasks:CategoryTask[]=data?.getTasksForCategories || []
  return {
    tasks,
    loading,
  }
}