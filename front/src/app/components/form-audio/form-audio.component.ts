import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule}  from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { ThemePalette } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';

import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

// i need to imform myself on this
// import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-form-audio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    FormsModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ],
  providers: [DataService],
  templateUrl: './form-audio.component.html',
  styleUrl: './form-audio.component.scss'
})
export class FormAudioComponent {

  @ViewChild('fileInput') fileInput : ElementRef | undefined;

  color:ThemePalette = 'primary';
  mode:ProgressSpinnerMode = 'determinate';
  value:number = 0;

  progress$: Observable<number> | undefined;

  fileI:any;

  files: File[] = [];

  constructor(private DataService : DataService, private changeDetectorRef: ChangeDetectorRef) {}

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(files);
    }
    console.log(files)
  }

  onFileBrowse(event: Event) {
    const files = (event.target as HTMLInputElement)?.files;
    if (files) {
      this.addFiles(files);
    }
  }

  addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i) as File; // Add type assertion
      this.files.push(file);
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  clearFiles() {
    this.value = 0;
    this.changeDetectorRef.detectChanges();
    this.files = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async UploadTrack(fileId : any) {
    console.log('fileId:', fileId);
    console.log('files:', this.files);
    this.progress$ = this.DataService.trackProgress(fileId);
    this.progress$.subscribe(progress => {
      this.value = Math.round(progress);
      if(this.value == 0) {
        this.value = 1;
      }
      if(this.value == 100) {
        this.value = 0;
      }
      console.log('Progress:', progress);
      this.changeDetectorRef.detectChanges();
    });
    // Initiate file upload
    this.DataService.uploadFiles(this.files, fileId).subscribe({
      next: (response: any) => {
        console.log('Upload complete:', response);
        // // Optionally, perform any actions after upload completion
        this.clearFiles();
      },
      error: (error: any) => {
        console.error('Error uploading file:', error);
      }
    });
  }

  sendFiles() {
    console.log('files:', this.files);
    if(this.files.length != 0 && this.value == 0) {
      this.DataService.getFileId().subscribe(
        (fileId: any) => {
          console.log('fileId:', fileId);
          this.UploadTrack(fileId);
        },
        (error: any) => {
          console.error('Error getting fileId:', error);
        }
      );
    };
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  getFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return ' ' + parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
 
}
