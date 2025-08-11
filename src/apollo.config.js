module.exports = {
    client: {
      service: {
        name: 'my-app', // Nombre de tu app
        url: 'http://localhost:3001/graphql', // Tu endpoint
        localSchemaFile: './src/graphql/schema.graphql', // Ruta al esquema descargado
      },
      includes: ['src/**/*.{ts,tsx,js,jsx,graphql,gql}'], // Archivos con queries/mutations
    },
  };