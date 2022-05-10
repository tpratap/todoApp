import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/model/user';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title: string = '';
  deadline: string = '';
  desc: string = '';
  todo: Todo = {
    id: '',
    title: '',
    status: 'uncompletd',
    desc: '',
    deadline: ''
  }
  todosList: Todo[] = [];
  uid: string = '';

  constructor(private auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token')
    if(token) {
      this.uid = localStorage.getItem('uid') as string;
      this.getTodos();
    } else {
      this.auth.requireLogin();
    }
  }


  getTodos() {
    this.auth.getTodos(this.uid).subscribe((res) => {
      this.todosList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        console.log(data);
        return data;
      })
    }, err=> {
      alert('Couldn\'t fetch todos list');
    })
  }

  addTodos() {
    if(this.title == '' || this.deadline == '' || this.desc == '') {
      alert("Add Todo");
      return;
    }
    this.todo.title = this.title;
    this.todo.desc = this.desc;
    this.todo.deadline = this.desc;
    this.auth.addTodos(this.todo, this.uid);
    
    this.title='';
    this.deadline='';
    this.desc='';
  }

  logout() {
    this.auth.logout();
  }

  deleteTodos(todo: Todo) {
    if(window.confirm('Are you sure you want to delete?')) {
      this.auth.deleteTodos(todo, this.uid);
    }
  }

  updateStatus(todo: Todo) {
    this.auth.updateStatus(todo, this.uid);
  }
}
