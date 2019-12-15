import { Component, OnInit, ViewChild } from '@angular/core';
import { getRequestHeaders, RequestHeaders } from './auth';
import { Observable, from } from 'rxjs';
import { ReadFilesService } from './read-files.service';
import { GoogleFile } from './files.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dataSource: MatTableDataSource<GoogleFile>;
  displayedColumns: string[] = ['Title', 'Modification Date', 'Thumbnail', 'Checked', 'Download'];
  isLoading = true;
  token: RequestHeaders;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readFilesService: ReadFilesService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.listDriveFile().subscribe(token => {
      this.token = token;
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

  starFile(file: GoogleFile) {
    file.starred = !file.starred;
  }

  starAllFilesSelected() {
    this.dataSource.data.forEach(file => {
      if(file.checked) {
        file.starred = true;
      }
    });
  }

  listDriveFile(): Observable<RequestHeaders> {
    const headers = from(getRequestHeaders());
    return headers;
  }

  downloadSelectedFile(file: GoogleFile) {
    const zip = new JSZip();
    file.downloadLoading = true;
    this.readFilesService.getGoogleFileContent(this.token, file).subscribe(result => {
      zip.file(file.name + '.pdf', result, { binary: true });
      zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, file.name + '.zip');
        file.downloadLoading = false;
      });
    }, error => {
      console.error(error);
      this.snackBar.open('Je n\'arrive à ouvrir que des google docs !');
      file.downloadLoading = false;
    });

  }
}
