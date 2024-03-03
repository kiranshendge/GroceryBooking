import { Decimal } from "@prisma/client/runtime/library";

export class Product {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly price: Decimal,
        public readonly tags: string,
        public readonly quantity: Decimal,
    ){}
}