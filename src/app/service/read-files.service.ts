import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestHeaders } from '../auth';
import { FilesResponse, GoogleFile } from '../model/files.model';


@Injectable({
  providedIn: 'root'
})
export class ReadFilesService {

  constructor(private httpClient: HttpClient) { }

  public readGoogleFiles(token: RequestHeaders) {

    let data = new HttpParams();
    data = data.set('fields', 'files(id,mimeType,name,thumbnailLink,modifiedTime,webContentLink)');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  token['Content-Type'],
        Authorization: token.Authorization
      }),
      params: data
    };

    return this.httpClient.get<FilesResponse>('https://content.googleapis.com/drive/v3/files', httpOptions);
  }

  public getGoogleFileContent(token: RequestHeaders, file: GoogleFile) {
    let data = new HttpParams();
    data = data.set('mimeType', 'application/pdf');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  token['Content-Type'],
        Authorization: token.Authorization,
      }),
      params: data,
      responseType: 'blob' as 'json'
    };

    return this.httpClient.get<Blob>('https://content.googleapis.com/drive/v3/files/' + file.id + '/export', httpOptions);
  }
}
