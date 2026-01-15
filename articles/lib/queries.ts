import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($offset: Int = 0, $where: qa_ai_bool_exp = {}) {
    qa_ai(order_by: {id: desc}, limit: 10, offset: $offset, where: $where) {
      id
      title
      genid
      text
    }
  }
`;

export const GET_ARTICLES_COUNT = gql`
  query GetArticlesCount($where: qa_ai_bool_exp = {}) {
    qa_ai_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const SEARCH_ARTICLES = gql`
  query SearchArticles($where: qa_ai_bool_exp!) {
    qa_ai(order_by: {id: desc}, where: $where, limit: 10) {
      id
      title
      genid
      text
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
