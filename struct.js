import *as s from 'superstruct'

export const CreateProduct = s.object({
 id: s.integer(),
 name: s.size(s.string(), 1, 30),
 description : s.min(s.string(), 0),
 price: s.min(s.number(),0),
 // tag: s.enums() 
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
 id: s.integer(),
 title: s.min(s.string(), o), 
 content: s.min(s.string, 200),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
 id: s.integer(),
 title: s.min(s.string(), o), 
 content: s.min(s.string, 200),
});

export const PatchComment = s.partial(CreateArticle);

/**
 *   id        Int     @id
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId Int?
  article   Article? @relation(fields: [articleId], references: [id], onDelete: Cascade)
  articleId Int?
  .... 관계 데이터...호고고곡?>>
 */