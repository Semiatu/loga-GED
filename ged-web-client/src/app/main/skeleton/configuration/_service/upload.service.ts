import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import * as firebase from 'firebase';
import {Document} from "../_model";
import {FirebaseListObservable} from "@angular/fire/database-deprecated";

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private basePath: string = '/documents';
    private documentTask: firebase.storage.UploadTask;
    docRef : AngularFireList<Document>;
    name: string;
    x = document.getElementById("demo");
    documents: FirebaseListObservable<any[]>;



    constructor(protected db: AngularFireDatabase) {
        this.docRef = db.list(this.basePath);
             this.docRef.valueChanges();

    }

    // put document in firebase
    pushDocument(document: Document) {
        let storageRef = firebase.storage().ref();
        return  storageRef.child(this.basePath + '/' + document.nom).put(document.file);

    }

    public downloadFile(document1: Document): void{
           const url = document1.url;
            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                const blob = xhr.response;
                console.log(blob);

                let binaryData = [];
                binaryData.push(blob);
                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: document1.typeDocument.nom}));
                downloadLink.setAttribute('download', document1.nom);
                document.body.appendChild(downloadLink);
                downloadLink.click();
            };
            xhr.open('GET', url);
            xhr.send();

    }



    // la reference du document
    documentRef(document: Document) {
        let storage = firebase.storage();
        let pathReference = storage.ref( this.basePath + '/' + document.nom);
        let gsReference = storage.refFromURL('gs://bucket' + this.basePath + '/' + document.nom);
    }

    private saveFileData(document: Document) {
        this.db.list(`${this.basePath}/`).push(document);
    }

    //supprimer le document uploade
    deleteFileUpload(document: Document) {
        /*this.deleteFileData(document.$key)
            .then(() => {
                this.deleteFileStorage(document.nom)
            })
            .catch(error =>
                console.log(error))*/
        this.deleteFileStorage(document.nom);

    }

    // supprimer le document dans Firedatabase
    private deleteFileData($key: string) {
        return this.db.list(this.basePath + '/').remove($key);
    }

    // Firebase files must have unique names in their respective storage dir
    // So the name serves as a unique key
    private deleteFileStorage(nom: string) {
        let storageRef = firebase.storage().ref();
        storageRef.child(this.basePath + '/' + nom).delete();
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

    // update the file details from the realtime db
    private updateFileData(key: string) {
        return this.db.list(`${this.basePath}/`).update(key,document);
    }

    /*listDocument(document: Document) {
        let storageRef = firebase.storage().ref();
        let listRef = storageRef.child('files/uid');
        listRef.listAll().then(function(res){
            res.prefixes.forEach(function(storageRef) {
            });
            res.items.forEach(function (itemRef) {
            })
        });
    }*/

}
