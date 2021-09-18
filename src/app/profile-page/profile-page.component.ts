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
  favIds: string[] = [];
  favList: any[] = []

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
    this.getUserData();
    this.getFavorites()
  }

  /**
   * formats birthday data so it can be processed by date form
   * @param birthday date string
   * @returns formatted date string
   */
  formatBirthday(birthday: string): string {
    this.userInfo.Birthday = new Date(birthday).toISOString().split('T')[0]
    return this.userInfo.Birthday 
  }

  /**
   * fetches user data from API
   * @returns object of user data
   */
  getUserData(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
        this.userInfo = {
          Name: resp.Name,
          Username: resp.Username,
          Email: resp.Email,
          Password: '',
          Birthday: this.formatBirthday(resp.Birthday)
        }
        this.favIds = resp.FavoriteMovies;
        return this.userInfo;
      });
    }

    /**
   * opens modal to delete user account
   */
    openDeleteDialog(): void {
      this.dialog.open(DeleteModalComponent, {
        width: '280px'
      })
    }

/**
   * sends updated user data to API
   * @returns object of updated user data
   */
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

   /**
   * turns movie ids from favorite list into array of movie objetcs
   * @returns function that pushes movies to favorite list
   */
    getFavorites(): void {
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        const movies = resp;
        movies.forEach((movie: any) => {
          this.favIds.includes(movie._id) ? this.favList.push(movie) : null
      });
      })
    }


}
