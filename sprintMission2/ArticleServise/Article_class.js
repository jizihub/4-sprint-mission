export class Article {
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