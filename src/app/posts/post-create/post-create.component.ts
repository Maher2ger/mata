import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  imagePreview: any;


  postForm = new FormGroup({
    postTitle: new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
    postContent: new FormControl(null, {validators:[Validators.required]}),
      postImage: new FormControl(null, {validators:[Validators.required]})
  })




  constructor(public postService: PostService,
              public route: ActivatedRoute) {

  }

  ngOnInit() {


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postService.getPost(this.postId);
        this.isLoading = false;
        this.postForm.setValue(
            {
              postTitle: this.post.title,
              postContent: this.post.content,
              postImage: this.post.imgPath
            });


      } else {
        this.mode = 'create';
        this.postId = null;
      }
        }
    );
  }

  onSavePost() {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
          this.postForm.value.postTitle,
          this.postForm.value.postContent,
          this.postForm.value.postImage);
    } else {
      this.postService.updatePost(
          this.postId,
          this.postForm.value.postTitle,
          this.postForm.value.postContent,
          this.postForm.value.postImage);
    }
  }

  onFilePicked(event: Event) {
      // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({postImage: file});
    this.postForm.get('postImage')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

}
