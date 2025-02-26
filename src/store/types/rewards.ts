export interface UserRewards{
    wallet_address:string;
    total_points:number;
    user_level:UserLevel
}

export interface UserLevel{
    level:string;
    name:string;
    description:string;
    image:string;
    min_points:number;
    max_points:number;
    creative:string;
}

export interface CategoryTask{
        id:number;
        title:string;
        description:string;
        active:true;
        points:number;
        category_id:number;
        creative:string;
        index?:number;
}

export interface Eligibility{
    eligible:boolean;
    claimed:boolean;
    socialTaskDone?:boolean;
}