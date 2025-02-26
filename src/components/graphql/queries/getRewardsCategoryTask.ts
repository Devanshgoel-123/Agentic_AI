import { gql } from "@apollo/client";

export const GET_REWARD_CATEGORY_TASK = gql`
  query getTasksForCategories($categoryId: Float! $all:Boolean) {
    getTasksForCategories(
      getTasksParams: { 
      categoryId: $categoryId
      all:$all
      }
    ) {
      id 
      title 
      contract_trigger
      amount_trigger
      category_id
      creative
      description
      points
      active
      start_timestamp
      end_timestamp
    }
  }
`;
