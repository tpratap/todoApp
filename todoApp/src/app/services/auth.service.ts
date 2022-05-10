import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo, TodoUser } from 'src/app/model/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { GoogleAuthProvider} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  todoUser!: TodoUser;
  
  constructor(private fireauth: AngularFireAuth,private afs: AngularFirestore, private router: Router) { }

  //Login Method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then( res => {
        localStorage.setItem('token','true');
        
        if(res.user?.emailVerified == true) {
          const mauth = getAuth();
          const muser = mauth.currentUser;
          if(muser) {
            console.log(muser.uid)
            localStorage.setItem('uid',muser.uid);
          }
          
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['verify-email']);
        }

    }, err => {
        alert(err.message);
        this.router.navigate(['/login']);
    })
  }

  //Register Method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      alert('Registration Successful');
      this.afs.collection('users').doc(res.user?.uid).set({
        emailId: email,
        passkey: password,
        todos: []
      });
      this.sendEmailForVerification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  //Logout Method
  logout() {
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }, err => {
      alert(err.message);
    })
  }

  //Forget Password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(()=> {
      this.router.navigate(['verify-email']);
    }, err=> {
      alert('Something went wrong');
    })
  }

  //Email Verification
  sendEmailForVerification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/verify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

  //sign in with Google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

      this.router.navigate(['/dashboard']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

      const mauth = getAuth();
      const muser = mauth.currentUser;
      if(muser) {
        console.log(muser.uid)
        localStorage.setItem('uid',muser.uid);
      }

    }, err => {
      alert(err.message);
    })
  }

  addTodos(todo: Todo, uid: string) {
    todo.id = this.afs.createId();
    return this.afs.collection(uid).add(todo);
  }

  getTodos(uid: string) {
    return this.afs.collection(uid).snapshotChanges();
  }

  deleteTodos(todo: Todo, uid: string) {
    return this.afs.doc(uid + '/' + todo.id).delete();
  }

  requireLogin() {
    this.router.navigate(['login']);
  }

  updateStatus(todo: Todo, uid: string) {
    return this.afs.doc(uid + '/' + todo.id).update(
      {
        status: 'Complete'
      }
    );
  }
}
