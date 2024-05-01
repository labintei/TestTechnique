import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './environnement';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, fileId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileId', fileId);
    return this.http.post<any>('/api/upload', formData);
  }

  getFileId(): any {
    return this.http.post<any>(this.apiUrl + '/getFileId', {}).pipe(
      map(response => {
        console.log(response);
        return response.fileId;
      }));
  }

  getProgress(fileId : any): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/api/progress' + fileId).pipe(
      map(response => {
        console.log(response);
        return response;
      }));
  }


  uploadFiles(files: File[], fileId: any) {
    const form = new FormData();
    for (const file of files) {
      form.append('files', file);
    }
    form.append('fileId', fileId);
    return this.http.post<any>(environment.apiUrl + '/upload?fileId=' + fileId, form, { responseType: 'text' as 'json' });
  }


  trackProgress(fileId:any): Observable<number> {
    return new Observable<number>(observer => {
      const evtSource = new EventSource(this.apiUrl + `/progress?fileId=` + fileId);
      evtSource.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        observer.next(data.progress);
        if (data.progress >= 100) {
          evtSource.close();
          console.log('Upload complete!');
          observer.complete();
        }
      };
      evtSource.onerror = (event: Event) => {
        console.error('EventSource failed.');
        evtSource.close();
        observer.error('EventSource failed');
      };
      return () => {
        evtSource.close();
      };
    });
  }
}
