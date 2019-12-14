export interface GoogleFile {
    id: string;
    mimeType: string;
    modifiedTime: Date;
    name: string;
    thumbnailLink: string;
}

export interface FilesResponse {
    files: GoogleFile[];
}
