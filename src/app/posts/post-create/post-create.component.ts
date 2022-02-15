import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import { PostService } from '../services/posts.service'
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Post} from '../models/post.model'



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})


export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId:any;
  public post: any;
  isLoading = false;


  constructor(public postService: PostService,
              public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postService.getPost(this.postId);
        this.isLoading = false;


      } else {
        this.mode = 'create';
        this.postId = null;
      }
        }
    );
  }

  onSavePost(form: NgForm) {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(form.value.postTitle, form.value.postContent);
      form.resetForm();
    } else {
      this.postService.updatePost(this.postId, form.value.postTitle, form.value.postContent);
    }}
}
