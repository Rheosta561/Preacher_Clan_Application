export interface Constants {
  readonly API_URL: string;
  readonly APP_NAME: string;
  readonly APP_VERSION: string;
  readonly SUPPORT_EMAIL: string;
}

export interface PromoCardProps {
    title : string ; 
    subtitle : string ; 
    imageUrl : string ; 
    onPress : () => void ;

}



export interface Challenge {
    id : string ;
    title : string ;
    description : string ;
    points : number ;
    isCompleted : boolean ;
    participants : number ;
    
}