export interface ChallengeType{
    title : string ;
    description : string ; 
    rules : string[] ; 
    createdAt? : Date ;
    isCompleted?: boolean ; 
}