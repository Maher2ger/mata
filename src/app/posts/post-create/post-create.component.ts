import { Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import { PostService } from '../services/posts.service'



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  constructor(public postService: PostService) {}

  onAddPost(form: NgForm) {
    this.postService.addPost(form.value.postTitle, form.value.postContent);
    form.resetForm();
    }
}
