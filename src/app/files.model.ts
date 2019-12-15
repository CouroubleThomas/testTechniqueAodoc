export interface GoogleFile {
    id: string;
    mimeType: string;
    modifiedTime: Date;
    name: string;
    thumbnailLink: string;
    checked: boolean;
    starred: boolean;
    downloadLoading: boolean;
}

export interface FilesResponse {
    files: GoogleFile[];
}
