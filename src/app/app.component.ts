import { Component, OnInit, ViewChild } from '@angular/core';
import { getRequestHeaders, RequestHeaders } from './auth';
import { Observable, from } from 'rxjs';
import { ReadFilesService } from './read-files.service';
import { GoogleFile } from './files.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dataSource: MatTableDataSource<GoogleFile>;
  displayedColumns: string[] = ['Title', 'Modification Date', 'Thumbnail', 'Checked'];
  isLoading = true;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readFilesService: ReadFilesService) {}

  ngOnInit() {
    this.listDriveFile().subscribe(token => {
      this.readFilesService.readGoogleFiles(token).subscribe( response => {
        this.dataSource = new MatTableDataSource<GoogleFile>(response.files);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
    });
  }

  openDoc(url: string) {
    window.open(url, '_blank');
  }

  listDriveFile(): Observable<RequestHeaders> {
    const headers = from(getRequestHeaders());
    return headers;
  }
}
