export interface Article {
  id: string | number;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface CreateArticle {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface UpdateArticle extends CreateArticle {

}
