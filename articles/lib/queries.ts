import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($offset: Int = 0) {
    qa_ai(order_by: {id: desc}, limit: 10, offset: $offset) {
      id
      title
      genid
      text
    }
  }
`;

export const GET_ARTICLES_COUNT = gql`
  query GetArticlesCount {
    qa_ai_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GET_ARTICLE_BY_GENID = gql`
  query GetArticleByGenid($_eq: String!) {
    qa_ai(where: {genid: {_eq: $_eq}}) {
      id
      date
      text
      title
    }
  }
`;
