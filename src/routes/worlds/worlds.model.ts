// External dependencies
import { Document } from "mongodb";
import { ObjectId } from "mongodb";
import { CollectionConfig } from "../../services/database.service";

// JSON Schema
export const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        diameter: { type: "number" },
        type: { enum: ['terrestrial', 'jovian'] },
        id: { type: "string" },
    },
    required: ["name", "diameter", "type"],
};

export const collectionConfig = new CollectionConfig({
    dbName: "space",
    collectionName: "worlds",
    indexes: [{ name: 1, type: -1 }],
    schema: schema,
});

// Class Implementation
export default class World extends Document {
    constructor(
        public name: string,
        public diameter: number,
        public type: string, //terrestrial and jovian
        public id?: ObjectId,
    ) {
        super();
    }

    static fromObject(obj: World): World {
        const { name, diameter, type, id } = obj;
        return new World(name, diameter, type, id);
    }

    get idString(): string {
        return this.id?.toHexString() as string;
    }

    get schema(): object {
        return schema;
    }
}
