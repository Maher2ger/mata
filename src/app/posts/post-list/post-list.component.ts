import {Component, OnDestroy, OnInit} from '@angular/core';
import { Post } from '../models/post.model'
import {PostService} from "../services/posts.service";

//paginator Imports
import {PageEvent} from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import {Subscription} from "rxjs";
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  isLoading: boolean = false;

  //Auth Vars
  private authStatusSub!: Subscription;
  userIsAuthenticated:boolean = false;

  //Paginator Vars
  postsPerPage = 3;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;
  public totalPosts: number = 0;
  userId!:string|null;


  constructor(public postService: PostService,
              private authService: AuthService) {}   //the keyword public creates an instance of PostService as local var. => public = const postService = PostService

  ngOnInit() {
    this.isLoading = true
    this.refresh(this.postsPerPage, 1);
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService.getAuthStatusList().subscribe(
        isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        }
    );
    this.userId = this.authService.getUserId();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
    this.refresh(this.postsPerPage,1);


  }

  ngOnDestroy() {
      this.authStatusSub.unsubscribe();
  }

  //pagination change methode
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.refresh(this.postsPerPage, this.currentPage);


  }

  refresh(postsPerPage:number, currentPage:number) {
      this.postService.getPosts(postsPerPage, currentPage)
          .then(data => {
              this.posts.length = 0;
              for (let post of data.posts) {
                  this.posts.push(post);
              }
              this.totalPosts = data.numberOfPosts;
              this.isLoading = false;
          });
  }
}
