import {Component, Input, OnInit} from '@angular/core';
import { Post } from '../models/post.model'
import {PostService} from "../services/posts.service";

//paginator Imports
import {PageEvent} from '@angular/material/paginator';  //Object, that hold some infos about the page
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  public posts: Post[] = [];
  isLoading: boolean = false;

  //Paginator Vars
  postsPerPage = 10;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;
  public totalPosts: number = 0;

  constructor(public postService: PostService) {}   //the keyword public creates an instance of PostService as local var. => public = const postService = PostService

  ngOnInit() {
    this.isLoading = true

    this.postService.getPosts(this.postsPerPage, 1)
        .then(data => {
            this.posts = data.posts;
            this.totalPosts = data.numberOfPosts;
        });



    /*
    let data = this.postService.getPosts(this.postsPerPage, 1);
    this.totalPosts = data.numberOfPosts;
    this.posts = data.posts;

     */

  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  //pagination change methode
  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
      console.log('current page: '+ this.currentPage);
    this.postService.getPosts(this.postsPerPage, this.currentPage)
        .then(data => {
          this.posts = data.posts;
          this.totalPosts = data.numberOfPosts;
        });

  }
}
