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
import { MatSliderModule } from '@angular/material/slider';
import { ThemePalette } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

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
  msg:string = '';
  success:boolean = true;

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
  }

  onFileBrowse(event: Event) {
    const files = (event.target as HTMLInputElement)?.files;
    if (files) {
      this.addFiles(files);
    }
  }

  addFiles(files: FileList) {
    this.msg = '';
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i) as File; // Add type assertion
      this.files.push(file);
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  clearFiles() {
    this.msg = '';
    this.value = 0;
    this.changeDetectorRef.detectChanges();
    this.files = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async UploadTrack(fileId : any) {
    const tmpFiles = this.files;
    this.clearFiles();
    this.changeDetectorRef.detectChanges();
    this.progress$ = this.DataService.trackProgress(fileId);
    this.progress$.subscribe(progress => {
      this.value = Math.round(progress);
      if(this.value == 100) {
        this.value = 0;
      }
      this.changeDetectorRef.detectChanges();
    });

    this.DataService.uploadFiles(tmpFiles, fileId).subscribe({
      next: (response: any) => {
        console.log('Upload complete:', response);
        this.success = true;
        this.msg = 'Upload complete';
        this.changeDetectorRef.detectChanges();
      },
      error: (error: any) => {
        console.error('Error uploading file:', error);
        this.msg = 'Error uploading file';
        this.success = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  sendFiles() {
    if(this.files.length != 0 && this.value == 0) {
      this.DataService.getFileId().subscribe(
        (fileId: any) => {
          this.UploadTrack(fileId);
        },
        (error: any) => {
          console.error('Error getting fileId:', error);
          this.msg = 'Error uploading file';
          this.success = false;
          this.changeDetectorRef.detectChanges();
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
