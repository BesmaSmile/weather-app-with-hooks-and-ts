export function capitalizeFirstLetter(str:string){
    return str && str.length>0
        ? str[0].toUpperCase() +str.slice(1)
        : ''
}
