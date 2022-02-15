import {Component, Input, OnInit} from '@angular/core';
import { Post } from '../models/post.model'
import {PostService} from "../services/posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  isLoading: boolean = false;

  constructor(public postService: PostService) {}   //the keyword public creates an instance of PostService as local var. => public = const postService = PostService

  ngOnInit() {
    this.isLoading = true;
    this.posts = this.postService.getPosts();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

}
