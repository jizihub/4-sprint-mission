import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app'
});
export class Article {
    // 다른 변수 캡슐화 하기 
    #title;
    #content;
    #writer;
    #createdAt;
    #likeCount;
    #createdAt;


    constructor(title, content, writer, likeCount = 0, createdAt = new Date()) {
        this.#title = title;
        this.#writer = writer;
        this.#likeCount = likeCount;
        this.#content = content;
        this.#createdAt = createdAt;
    }
    getTitle(){
        return this.#title;
    }

    getWriter(){
        return this.#writer;
    }

    getLikeCount(){
        return this.#likeCount;
    }

    setLikeCount(newLikeCount){
        if(newLikeCount < 0){
            throw new RangeError('음수는 값에 들어갈 수 없습니다.')
        } else {
            return this.#likeCount;
        }            
    }
    
    like() {
        this.#likeCount += 1;
        return this.likeCount;
    }

    getContent(){
        return this.#content;
    }

    getCreatedAt(){
        return this.#createdAt;
    }
}

export async function getArticlelist (params ={}){
    const {page, pageSize, keyword} = params;
    const res = instance.get(`/articles`,{params : {page, pageSize, keyword}})
        .then((value)=>{return value.data })
        .catch (error =>{ console.log('오류 발생!')});
    return res;          
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