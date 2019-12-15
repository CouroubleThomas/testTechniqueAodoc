export interface GoogleFile {
    id: string;
    mimeType: string;
    modifiedTime: Date;
    name: string;
    thumbnailLink: string;
    webContentLink: string;
    checked: boolean;
    starred: boolean;
}

export interface FilesResponse {
    files: GoogleFile[];
}
