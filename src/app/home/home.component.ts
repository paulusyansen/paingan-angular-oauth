import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Users } from '../_models';
import { UserService } from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    users: Users;
    constructor(private userService: UserService) {}

    ngOnInit() {
        //alert('ngoninittt');
        this.userService.getAll().subscribe((data: Users) => {  this.users = data; console.log('call -- UserService.getAll()');});
    }
}