
const baseUrl = "/worlds";

const database = {
    type: "mongodb",
    dbName: "space",
    collectionName: "worlds",
    indexes: [{ name: 1, type: -1 }],
    //schema: schema, //TODO: make mongo schema
};

// JSON Schema
const schema = {
    World: {
        type: "object",
        properties: {
            _id: { type: "string" },
            name: { type: "string" },
            diameter: { type: "number" },
            type: { enum: ['terrestrial', 'jovian'] },
        },
        required: ["name", "diameter", "type"],
    },
    WorldList: {
        type: "array",
        items: { $ref: "#/components/schemas/World" },
    },
};

module.exports = {
    baseUrl,
    database,
    schema,
};
