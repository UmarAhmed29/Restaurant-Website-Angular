import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block',
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy: Feedback;
  errMess: string;
  contactType = ContactType;
  feedbackReturned: Feedback;
  show = false;
  visibility = 'shown';
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: ''
  };

  validationMessages = {
    firstname: {
      required: 'First name is required.',
      minlength: 'First name must be 2 characters long.',
      maxlength: 'First name cannot be more than 25 characters.',
    },
    lastname: {
      required: 'Last name is required.',
      minlength: 'Last name must be 2 characters long.',
      maxlength: 'Last name cannot be more than 25 characters.',
    },
    telnum: {
      required: 'Tel. number is required.',
      pattern: 'Tel. number must contain only numbers.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email is not in valid format.'
    }
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
    ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));


    this.onValueChanged();  // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return ; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackService.putFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedbackReturned = feedback; this.feedbackCopy = feedback;
      },
        errmess => { this.feedbackReturned = null; this.feedbackCopy = null; this.errMess = <any>errmess });
    console.log(this.feedbackReturned);
    this.show = true;
    setTimeout(function() {
      this.show = false;
      console.log(this.show);
    }, 5000);
    console.log('After change of show :: ' + this.show);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackFormDirective.resetForm();
  }
}
