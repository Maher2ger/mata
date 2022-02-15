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
                        id: post._id
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
        console.log(this.posts);
        return this.posts;

    }

    addPost (title:string, content: string) {
        const post: Post = {
            id: 'sadsad32e3dx',
            title: title,
            content: content
        };
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts',post)
            .subscribe((response) => {
                const id = response.postId;
                post.id = id;
                console.log(response.message);
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

    updatePost(id:string, title:string, content:string) {
        const post = {
            id: id,
            title: title,
            content: content
        }
        this.http.put('http://localhost:3000/api/posts/'+id, post)
            .subscribe((response)=>{
                this.router.navigate(['/']);
                console.log(response);})

    }
}
