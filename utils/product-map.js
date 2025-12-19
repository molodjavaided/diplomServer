export const createProductMap = (products) => {
   return new Map(products.map(product =>
        [product._id.toString(), product]
    ));
}