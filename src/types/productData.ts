export interface Product{
    _id:string,
    _type:"product"
    title:string,
    isNew:boolean,
    description:string,
    discountPercentage:number,
    price:number,
    productImage:URL,
    showOverlay?:boolean ,
    tags:string[],
    quantity:number
}