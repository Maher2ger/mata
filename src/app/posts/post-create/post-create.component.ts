import { Component} from '@angular/core';
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  enteredValue = '';
  newPost = 'no content';
  onAddPost() {
    this.newPost = this.enteredValue;
  }
}
