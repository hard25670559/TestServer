import { UpdateArticle } from './../models/article';
import { request } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import shortid from 'shortid';
import slug from 'slug';
import { Article, CreateArticle } from '../models/article';
import { User } from '../models/user';
import { getTokenFromRequest, verifyToken } from '../utils/auth';
import { getDatabase } from '../utils/database';

export const getArticles = (req: Request, res: Response, next: NextFunction) => {
  const db = getDatabase();

  res.json({ articles: (db.get('articles') as any).sort((a: Article, b: Article) => (a.createdAt > b.createdAt ? -1 : 1)) });
  next();
};

export const getArticle = (req: Request, res: Response, next: NextFunction) => {
  const db = getDatabase();
  console.log(req.params.id)

  const result = (db.get('articles') as any).find({ id: req.params.id });

  res.json({ article: result.value() });
  next();
};

export const articleTitleExist = (req: Request, res: Response, next: NextFunction) => {
  const db = getDatabase();

  const article = (db.get('articles') as any).find({ title: req.params.title }).value();

  res.json({ titleExist: !!article });
  next();
};

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  const db = getDatabase();
  const result = (db.get('articles') as any).find({ id: req.params.id });
  if (!result.value()) {
    res.status(404).json();
    next();
    return ;
  }


  (db.get('articles') as any).remove({ id: req.params.id }).write();

  res.status(204).json();
  next();
}

export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  const createArticle = (req.body || {}) as CreateArticle;

  if (!createArticle.title) {
    res.status(500).json({ message: 'Must enter title' });
    next();
    return;
  }

  const token = getTokenFromRequest(req);
  const user = (await verifyToken(token)) as User;

  const db = getDatabase();

  const author = (db.get('users') as any).find({ email: user.email }).value() as User;

  const article: Article = {
    id: ((db.get('articles').value() as any[]).length + 1).toString(),
    title: createArticle.title,
    description: createArticle.description,
    body: createArticle.body,
    tagList: createArticle.tagList,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: user.username
  };

  (db.get('articles') as any).push(article).write();

  res.status(200).json(article);
  next();
};

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  const updateArticle = (req.body || {}) as UpdateArticle;

  const db = getDatabase();

  const result = (db.get('articles') as any).find({ id: req.params.id });

  if (!result.value()) {
    res.status(404).json();
    next();
    return ;
  }

  if (!updateArticle.title) {
    res.status(500).json({ message: 'Must enter title' });
    next();
    return;
  }

  result.assign(updateArticle).write();

  res.status(200).json(result.value());
  next();


}
