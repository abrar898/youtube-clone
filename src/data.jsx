import moment from 'moment';
export const API_KEY='AIzaSyA370ItNGHuCda1ZKZizpJzmXtdHGf4dbQ';
// export const API_KEY='AIzaSyAgXj7giPIMEWRtVrfujvxFO5NPQWEHwsg';
export const value_converter=(value)=>{
    if(value>=1000000){
        return Math.floor(value/1000000) + "M";
    }
    else if(value>=1000){
        return Math.floor(value/1000) + "K";
    }
    else{
        return value;
    }
}