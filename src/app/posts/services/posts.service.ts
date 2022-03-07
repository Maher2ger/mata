import { Post } from '../models/post.model';
import {HttpClient} from '@angular/common/http';
import { Injectable } from "@angular/core";
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })

export class PostService {
    public posts: Post[] = [];
    public numberOfPosts: number = 0;

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        this.posts.length = 0;
        const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
        let myPromise = new Promise<any>((resolve, reject) => {
            this.http.get<{message: string, posts: any, numberOfPosts: number}>('http://localhost:3000/api/posts'+queryParams)
                .pipe(map((postData) => {
                    console.log(postData);
                        return {
                            posts: postData.posts.map((post:any) => {
                                return {
                                    title: post.title,
                                    content: post.content,
                                    id: post._id,
                                    imgPath: post.imgPath
                                }
                            }),
                            numberOfPosts: postData.numberOfPosts
                        }
                    }
                ))
                .subscribe((postsData) => {
                    for (let post of postsData.posts) {
                        this.posts.push(post);
                    };

                    this.numberOfPosts = postsData.numberOfPosts;
                    resolve({posts: this.posts, numberOfPosts: this.numberOfPosts});
                })

        })

         let a = myPromise.then((value) => {
             return value;
         });
        return a;}

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
                post.id = response.post.id;
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
    sendPost () {
        return {posts: this.posts, numberOfPosts: this.numberOfPosts};
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
