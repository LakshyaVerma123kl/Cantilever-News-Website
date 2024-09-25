export interface articles {
  source: { id: string; name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

export interface user {
  _id: string;
  username: string;
  email: string;
  password: string;
  name: string;
}
