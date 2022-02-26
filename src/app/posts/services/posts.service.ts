import { Post } from '../models/post.model';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Injectable } from "@angular/core";
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })

export class PostService {
    public posts: Post[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.posts.length = 0;
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map((post:any) => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imgPath: post.imgPath
                    }
                    }
                )
                }
            ))
            .subscribe((posts) => {
                for (let post of posts) {
                    this.posts.push(post);
                }
            })

        return this.posts;

    }

    addPost (title:string, content: string, image: File) {

        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
            .subscribe((response) => {
                    const post: Post = {
                    id:response.post.id,
                    title: title,
                    content: content,
                    imgPath: response.post.imgPath,
                }
                const id = response.post.id;
                post.id = id;
                this.posts.push(post);
                this.router.navigate(['/']);
            })
    }

    deletePost (postId: string) {
        this.http.delete('http://localhost:3000/api/posts/'+postId)
            .subscribe(() => {
                console.log('the post with ID '+ postId+ ' has been deleted!');
                this.posts.forEach((value,index)=>{
                    if(value.id==postId) this.posts.splice(index,1);
                });
            })
    }

    getPost (id: string) {
        return {...this.posts.find(p => p.id === id)};
    }

    updatePost(id:string, title:string, content:string, image: File | string) {
        let postData: Post | FormData;
        if (typeof image === 'object') {
            postData = new FormData();
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image , title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imgPath: image
            }}


        this.http.put('http://localhost:3000/api/posts/'+id, postData)
            .subscribe((response)=>{
                this.router.navigate(['/']);
            })

    }
}
