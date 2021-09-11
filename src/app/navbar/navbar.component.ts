import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public router: Router,
    public snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onProfileClick(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    localStorage.clear()
    this.snackbar.open("Successfully logged out.", 'OK', {
      duration: 3000
   });
    this.router.navigate(['welcome'])
  }

  logoClick(): void {
    this.router.navigate(['movies'])
  }
}
