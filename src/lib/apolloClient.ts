import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  // link: createHttpLink({ uri: 'https://api.github.com/graphql' }),
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
  },
})

export default client