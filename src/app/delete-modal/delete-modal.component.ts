import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router) { }

  ngOnInit(): void {
  }

  /**
   * removies logged in user from user database and routes to welcome page
   */
  deleteProfile(): void {
    this.fetchApiData.deleteUser().subscribe((resp) => {
      this.snackBar.open(resp, 'OK', {
        duration: 5000
     });
     localStorage.clear();
     this.router.navigate(['welcome']);      
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 5000
      });
    })
  }
}
