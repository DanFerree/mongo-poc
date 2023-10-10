// External dependencies
import { ObjectId/*, Document*/ } from "mongodb";
// Class Implementation
export default class World /*extends Document */ {
    constructor(
        public name: string,
        public diameter: number,
        public type: string, //terrestrial and jovian
        public id?: ObjectId,
    ) {
        // super();
    }
}
