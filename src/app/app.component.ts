import { Component, OnInit } from '@angular/core';
import { getRequestHeaders, RequestHeaders } from './auth';
import { Observable, from } from 'rxjs';
import { ReadFilesService } from './read-files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aodoc-test';

  constructor(private readFilesService: ReadFilesService) {}

  ngOnInit() {
    this.listDriveFile().subscribe(token => {
      this.readFilesService.readGoogleFiles(token).subscribe( result => {
        console.log(result);
      });
    });
  }

  listDriveFile(): Observable<RequestHeaders> {
    const headers = from(getRequestHeaders());
    return headers;
  }
}
