import axios from 'axios';
import { Article } from './Article_class';

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app'
});

export async function getArticlelist (params = {}){
    const { page, pageSize, keyword } = params;
    const res = instance.get(`/articles`,{ params : { page, pageSize, keyword }})
        .then((response) => { 
            console.log( '응답 데이터 :' + response.data )
            return response.data })
        .catch (error => { 
            console.error( '오류발생' )});
    return res;          
}


//fetch로 구현하기
const BASE_URL = 'https:// panda-market=api-crud.vercel.app'
 export async function getArticleList(params = {}){
    const url = new URL ('https:// panda-market=api-crud.vercel.app');
    Object.keys(params).forEach((key) => 
        url.searchParams.append)
 }

 
export async function getArticle(id){
    const res = instance.get(`/articles/${id}`)
        .then (response => {return response.data})
        .catch (error => {console.log('오류발생!');});
    return res;
} 

export async function createArticle(articleBody){
    const res = instance. post(`/articles`,articleBody)
        .then (response => {return response.data})
        .catch (error => {console.log('오류발생')}); 
    return res; 
}

export async function patchArticle (id, ArticleListType){
    const res = instance. patch(`/articles/${id}`,ArticleListType)
        .then (response => {return response.data})
        .catch(error => {console.log ('오류발생')});
    return res;
}

export async function deleteArticle(id){
 const res = instance. delete('/articles/${id}')
    .then (response => {return response.data})
    .catch(error => {console.log ('오류발생!');});
    return res;
}