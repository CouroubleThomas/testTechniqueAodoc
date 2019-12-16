import { Component, OnInit, ViewChild } from '@angular/core';
import { getRequestHeaders, RequestHeaders } from './auth';
import { Observable, from, of, combineLatest } from 'rxjs';
import { ReadFilesService } from './service/read-files.service';
import { GoogleFile } from './model/files.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { MatSnackBar } from '@angular/material';
import { switchMap, take } from 'rxjs/operators';


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
  isAllFileLoading = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readFilesService: ReadFilesService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const observables: Observable<void>[] = [];
    observables.push(this.listDriveFile().pipe(switchMap(token => {
      this.token = token;
      return this.readFilesService.readGoogleFiles(token).pipe(switchMap(response => {
        this.dataSource = new MatTableDataSource<GoogleFile>(response.files);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        return of(null);
      }));
    })));
    combineLatest(observables).pipe(take(1)).subscribe();
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
    return from(getRequestHeaders());
  }

  downloadSelectedFile(file: GoogleFile) {
    const zip = new JSZip();
    file.downloadLoading = true;
    this.readFilesService.getGoogleFileContent(this.token, file).pipe(take(1)).subscribe(result => {
      zip.file(file.name + '.pdf', result, { binary: true });
      zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, file.name + '.zip');
        file.downloadLoading = false;
      });
    }, error => {
      console.error(error);
      this.snackBar.open('Je n\'arrive à ouvrir que des google docs !', 'Fermer', {
        duration: 2000,
      });
      file.downloadLoading = false;
    });
  }

  downloadAllSelectedFiles() {
    this.isAllFileLoading = true;
    const zip = new JSZip();
    const observables: Observable<void>[] = [];
    this.dataSource.data.forEach(file => {
      if (file.checked) {
        observables.push(this.readFilesService.getGoogleFileContent(this.token, file).pipe(switchMap(result => {
          zip.file(file.name + '.pdf', result, { binary: true });
          return of(null);
        })));
      }
    });
    combineLatest(observables).pipe(take(1)).subscribe(() => {
      zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, 'files.zip');
        this.isAllFileLoading = false;
      });
    }, error => {
      console.error(error);
      this.snackBar.open('Je n\'arrive à ouvrir que des google docs !', 'Fermer', {
        duration: 2000,
      });
      this.isAllFileLoading = false;
    });
  }
}
