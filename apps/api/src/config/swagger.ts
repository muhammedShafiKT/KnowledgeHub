import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication APIs",
      },
      {
        name: "Users",
        description: "User APIs",
      },
      {
        name: "Administration",
        description: "Admin APIs",
      },
    ],

    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },

  apis: ["./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
console.log(
  "Swagger paths:",
  Object.keys(swaggerSpec.paths || {})
);

export default swaggerSpec;