import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import * as firebase from 'firebase';
import {Document} from "../_model";

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private basePath: string = '/documents';
    private documentTask: firebase.storage.UploadTask;
     docRef : AngularFireList<Document>;
    name: string;


    constructor(protected db: AngularFireDatabase) {
        this.docRef = db.list(this.basePath);
             this.docRef.valueChanges();

    }

    // put document in firebase
    pushDocument(document: Document) {
        let storageRef = firebase.storage().ref();
        return  storageRef.child(this.basePath + '/' + document.nom).put(document.file);

    }
    private saveFileData(document: Document) {
        this.db.list(`${this.basePath}/`).push(document);
    }

    //delete file
    deleteDocument(document: Document) {
        this.deleteFileData(document.$key)
            .then(() => {
                this.deleteFileStorage(document.nom)
            })
            .catch(error =>
                console.log(error))
    }


    // Deletes the file details from the realtime db
    private deleteFileData(key: string) {
        return this.db.list(`${this.basePath}/`).remove(key);
    }
    // update the file details from the realtime db
    private updateFileData(key: string) {
        return this.db.list(`${this.basePath}/`).update(key,document);
    }

    // Firebase files must have unique names in their respective storage dir
    // So the name serves as a unique key
    private deleteFileStorage(name: string) {
        let storageRef = firebase.storage().ref();
        storageRef.child(`${this.basePath}/${name}`).delete()
    }

    /*public updateFileStorage(ancienNom: string, nouveauNom:  string ) {
        let storageRef = firebase.storage().ref();
        storageRef.child(this.basePath + '/' + ancienNom );
        const newStorageRef = {
            cacheControl: 'public,max-age=300',
            name: nouveauNom
        };
        return storageRef.updateMetadata(newStorageRef)
    }*/
}
