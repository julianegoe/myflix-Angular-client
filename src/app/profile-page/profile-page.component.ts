import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { User } from '../types/User'



@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  hide = true;

  @Input() userInfo = { 
    Name: '',
    Username: '', 
    Password:'', 
    Email: '', 
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUserData()
  }

  formatBirthday(birthday: string): string {
    this.userInfo.Birthday = new Date(birthday).toISOString().split('T')[0]
    return this.userInfo.Birthday 
  }

  getUserData(): void {
    this.fetchApiData.getUser().subscribe((resp: User) => {
        this.userInfo = {
          Name: resp.Name,
          Username: resp.Username,
          Email: resp.Email,
          Password: '',
          Birthday: this.formatBirthday(resp.Birthday)
        }
        console.log(this.userInfo);
        return this.userInfo;
      });
    }

    openDeleteDialog(): void {
      this.dialog.open(DeleteModalComponent, {
        width: '280px'
      })
    }

    saveChanges(): void {
      this.fetchApiData.EditUserInfo(this.userInfo).subscribe((resp: User) => {
        this.userInfo = {
          Name: resp.Name,
          Username: resp.Username,
          Email: resp.Email,
          Password: '',
          Birthday: this.formatBirthday(resp.Birthday)
        };
        this.snackBar.open("Changes saved", 'OK', {
          duration: 5000
       });
        return this.userInfo
      })
    }

}
