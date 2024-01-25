import {faker} from "@faker-js/faker";

export const generateProuct = () =>{
    const product = {
        id:faker.database.mongodbObjectId(),
        title:faker.commerce.product(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price({ min: 100, max: 200 }),
        thumbnail: faker.image.urlPicsumPhotos(),
        code: faker.commerce.isbn({ variant: 5, separator: '' }), 
        stock:faker.number.int({ min: 1, max: 10 }),
        category: faker.commerce.department(),
        statues: faker.datatype.boolean()
    }
    return product;
}